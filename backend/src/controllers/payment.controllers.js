import { Order } from "../models/order.models.js";
import { Product } from "../models/product.models.js";
import { Payment } from "../models/payment.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { v4 as uuidv4 } from "uuid";
import {
    createSSLCommerzSession,
    validateSSLCommerzPayment
} from "../services/payment.services.js";

const restoreOrderStock = async (orderId) => {
    const order = await Order.findOne({
        _id: orderId,
        stockRestored: false
    });

    if (!order) {
        return;
    }

    for (const item of order.items) {
        await Product.findByIdAndUpdate(
            item.productId,
            {
                $inc: {
                    stock: item.quantity
                }
            }
        );
    }

    order.stockRestored = true;
    await order.save();
};

const createPayment = asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
        throw new ApiError(
            400,
            "Order ID is required"
        );
    }

    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    if (
        order.user.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not allowed to pay for this order"
        );
    }

    if (order.paymentStatus === "PAID") {
        throw new ApiError(
            400,
            "Order is already paid"
        );
    }

    if (
        order.status === "shipped" ||
        order.status === "delivered"
    ) {
        throw new ApiError(
            400,
            "This order cannot be paid"
        );
    }

    if (
        order.paymentStatus === "FAILED" ||
        order.paymentStatus === "CANCELLED"
    ) {
        if (order.stockRestored) {
            for (const item of order.items) {
                const updatedProduct =
                    await Product.findOneAndUpdate(
                        {
                            _id: item.productId,
                            stock: { $gte: item.quantity }
                        },
                        {
                            $inc: {
                                stock: -item.quantity
                            }
                        },
                        {
                            new: true
                        }
                    );

                if (!updatedProduct) {
                    throw new ApiError(
                        409,
                        "Product stock is no longer available"
                    );
                }
            }

            order.stockRestored = false;
        }
    }

    const transactionId =
        `GoFlex_${order._id}_${uuidv4()}`;

    const payment = await Payment.create({
        order: order._id,
        user: req.user._id,
        amount: order.totalAmount,
        currency: "BDT",
        transactionId,
        paymentStatus: "PENDING",
        gateway: "SSLCOMMERZ"
    });

    order.paymentId = transactionId;
    order.paymentStatus = "PENDING";

    await order.save({
        validateBeforeSave: false
    });

    const paymentData = {
        store_id: process.env.SSLCOMMERZ_STORE_ID,
        store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,

        total_amount: order.totalAmount,
        currency: "BDT",
        tran_id: transactionId,

        success_url:
            `${process.env.BACKEND_URL}/api/v1/payments/success`,

        fail_url:
            `${process.env.BACKEND_URL}/api/v1/payments/fail`,

        cancel_url:
            `${process.env.BACKEND_URL}/api/v1/payments/cancel`,

        ipn_url:
            `${process.env.BACKEND_URL}/api/v1/payments/ipn`,

        cus_name: order.address.fullName,
        cus_email: req.user.email,
        cus_add1: order.address.street,
        cus_city: order.address.city,
        cus_postcode: order.address.postalCode,
        cus_country: order.address.country,

        shipping_method: "YES",

        ship_name: order.address.fullName,
        ship_add1: order.address.street,
        ship_city: order.address.city,
        ship_postcode: order.address.postalCode,
        ship_country: order.address.country,

        product_name: "GoFlex Order",
        product_category: "E-commerce",
        product_profile: "general"
    };

    try {
        const sslResponse =
            await createSSLCommerzSession(paymentData);

        if (sslResponse.status !== "SUCCESS") {
            payment.paymentStatus = "FAILED";
            await payment.save();

            order.paymentStatus = "FAILED";
            await order.save({
                validateBeforeSave: false
            });

            await restoreOrderStock(order._id);

            throw new ApiError(
                500,
                sslResponse.failedreason ||
                "Failed to create payment session"
            );
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        paymentId: payment._id,
                        transactionId,
                        gatewayPageURL:
                            sslResponse.GatewayPageURL
                    },
                    "Payment session created successfully"
                )
            );
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        payment.paymentStatus = "FAILED";
        await payment.save();

        order.paymentStatus = "FAILED";

        await order.save({
            validateBeforeSave: false
        });

        await restoreOrderStock(order._id);

        throw new ApiError(
            500,
            "Unable to create payment session"
        );
    }
});

const verifyPayment = async (tran_id, val_id) => {
    const payment = await Payment.findOne({
        transactionId: tran_id
    });

    if (!payment) {
        throw new ApiError(
            404,
            "Payment not found"
        );
    }

    if (payment.paymentStatus === "SUCCESS") {
        return {
            payment,
            alreadyVerified: true
        };
    }

    const validationResponse =
        await validateSSLCommerzPayment(val_id);

    if (validationResponse.status !== "VALID") {
        payment.paymentStatus = "FAILED";
        await payment.save();

        const order = await Order.findById(
            payment.order
        );

        if (order) {
            order.paymentStatus = "FAILED";
            await order.save({
                validateBeforeSave: false
            });

            await restoreOrderStock(order._id);
        }

        throw new ApiError(
            400,
            "Payment validation failed"
        );
    }

    if (
        validationResponse.tran_id !==
        payment.transactionId
    ) {
        throw new ApiError(
            400,
            "Transaction ID mismatch"
        );
    }

    if (
        Number(validationResponse.amount) !==
        Number(payment.amount)
    ) {
        throw new ApiError(
            400,
            "Payment amount mismatch"
        );
    }

    if (
        validationResponse.currency !==
        payment.currency
    ) {
        throw new ApiError(
            400,
            "Payment currency mismatch"
        );
    }

    payment.paymentStatus = "SUCCESS";
    await payment.save();

    const order = await Order.findById(
        payment.order
    );

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    order.paymentStatus = "PAID";
    order.status = "processing";

    await order.save();

    return {
        payment,
        order,
        alreadyVerified: false
    };
};

const paymentSuccess = asyncHandler(async (req, res) => {
    const { tran_id, val_id } = req.body;

    if (!tran_id || !val_id) {
        throw new ApiError(
            400,
            "Transaction ID or validation ID is missing"
        );
    }

    const result = await verifyPayment(
        tran_id,
        val_id
    );

    if (result.alreadyVerified) {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    null,
                    "Payment already verified"
                )
            );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    transactionId:
                        result.payment.transactionId,
                    paymentStatus:
                        result.payment.paymentStatus,
                    orderPaymentStatus:
                        result.order.paymentStatus
                },
                "Payment verified successfully"
            )
        );
});

const paymentFail = asyncHandler(async (req, res) => {
    const { tran_id } = req.body;

    if (!tran_id) {
        throw new ApiError(
            400,
            "Transaction ID is required"
        );
    }

    const payment = await Payment.findOne({
        transactionId: tran_id
    });

    if (!payment) {
        throw new ApiError(
            404,
            "Payment not found"
        );
    }

    if (payment.paymentStatus === "SUCCESS") {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    null,
                    "Payment already successful"
                )
            );
    }

    payment.paymentStatus = "FAILED";
    await payment.save();

    const order = await Order.findById(
        payment.order
    );

    if (order) {
        order.paymentStatus = "FAILED";

        await order.save({
            validateBeforeSave: false
        });

        await restoreOrderStock(order._id);
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    transactionId:
                        payment.transactionId,
                    paymentStatus:
                        payment.paymentStatus
                },
                "Payment failed successfully"
            )
        );
});

const paymentCancel = asyncHandler(async (req, res) => {
    const { tran_id } = req.body;

    if (!tran_id) {
        throw new ApiError(
            400,
            "Transaction ID is required"
        );
    }

    const payment = await Payment.findOne({
        transactionId: tran_id
    });

    if (!payment) {
        throw new ApiError(
            404,
            "Payment not found"
        );
    }

    if (payment.paymentStatus === "SUCCESS") {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    null,
                    "Payment already successful"
                )
            );
    }

    payment.paymentStatus = "CANCELLED";
    await payment.save();

    const order = await Order.findById(
        payment.order
    );

    if (order) {
        order.paymentStatus = "CANCELLED";

        await order.save({
            validateBeforeSave: false
        });

        await restoreOrderStock(order._id);
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    transactionId:
                        payment.transactionId,
                    paymentStatus:
                        payment.paymentStatus
                },
                "Payment cancelled successfully"
            )
        );
});

const paymentIPN = asyncHandler(async (req, res) => {
    const {
        tran_id,
        val_id,
        status
    } = req.body;

    if (!tran_id) {
        throw new ApiError(
            400,
            "Transaction ID is required"
        );
    }

    const payment = await Payment.findOne({
        transactionId: tran_id
    });

    if (!payment) {
        throw new ApiError(
            404,
            "Payment not found"
        );
    }

    if (payment.paymentStatus === "SUCCESS") {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    null,
                    "Payment already verified"
                )
            );
    }

    if (status === "VALID" && val_id) {
        const result = await verifyPayment(
            tran_id,
            val_id
        );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        transactionId:
                            result.payment.transactionId,
                        paymentStatus:
                            result.payment.paymentStatus
                    },
                    "Payment IPN processed successfully"
                )
            );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    transactionId:
                        payment.transactionId,
                    paymentStatus:
                        payment.paymentStatus
                },
                "Payment IPN received"
            )
        );
});

export {
    createPayment,
    paymentSuccess,
    paymentFail,
    paymentCancel,
    paymentIPN
};