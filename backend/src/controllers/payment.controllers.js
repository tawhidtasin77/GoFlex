import { Order } from "../models/order.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { Payment } from "../models/payment.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { v4 as uuidv4 } from 'uuid';
import { createSSLCommerzSession } from "../services/payment.services.js";
// uuidv4();

const createPayment = asyncHandler(async(req, res) => {
    const { orderId } = req.body;

    if(!orderId){
        throw new ApiError(400, "order id is required");
    }

    const order = await Order.findById(orderId);

    if(!order){
        throw new ApiError(404, "order not found");
    }

    if(order.user.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not allowed to pay for this order");
    }

    if(order.paymentStatus === "PAID"){
        throw new ApiError(400, "the order is already paid");
    }

    const transactionId = `GoFlex_${order._id}_${uuidv4()}`

    const payment = await Payment.create(
        {
            order: order._id,
            user: req.user._id,
            amount: order.totalAmount,
            currency: "BDT",
            transactionId,
            paymentStatus: "PENDING",
            gateway: "SSLCOMMERZ"
        }
    )

    order.paymentId = transactionId;
    await order.save({validateBeforeSave: false});

    console.log("STORE ID:", process.env.SSLCOMMERZ_STORE_ID);
    console.log("STORE PASSWORD:", process.env.SSLCOMMERZ_STORE_PASSWORD ? "EXISTS" : "MISSING");
    
    const paymentData = {
        store_id: process.env.SSLCOMMERZ_STORE_ID,
        store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,

        total_amount: order.totalAmount,
        currency: "BDT",
        tran_id: transactionId,

        success_url: `${process.env.BACKEND_URL}/api/v1/payments/success`,
        fail_url: `${process.env.BACKEND_URL}/api/v1/payments/fail`,
        cancel_url: `${process.env.BACKEND_URL}/api/v1/payments/cancel`,
        ipn_url: `${process.env.BACKEND_URL}/api/v1/payments/ipn`,

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

    const sslResponse = await createSSLCommerzSession(paymentData);

    if (sslResponse.status !== "SUCCESS") {
        payment.paymentStatus = "FAILED";
        await payment.save();

        throw new ApiError(
            500,
            sslResponse.failedreason || "Failed to create payment session"
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
                gatewayPageURL: sslResponse.GatewayPageURL
            },
            "Payment session created successfully"
        )
    );
})

const paymentSuccess = asyncHandler(async (req, res) => {
    console.log("PAYMENT SUCCESS");
    console.log(req.body);

    return res.status(200).json(
        new ApiResponse(
            200,
            req.body,
            "Payment success callback received"
        )
    );
});

const paymentFail = asyncHandler(async (req, res) => {
    console.log("PAYMENT FAILED");
    console.log(req.body);

    return res.status(200).json(
        new ApiResponse(
            200,
            req.body,
            "Payment failed callback received"
        )
    );
});

const paymentCancel = asyncHandler(async (req, res) => {
    console.log("PAYMENT CANCELLED");
    console.log(req.body);

    return res.status(200).json(
        new ApiResponse(
            200,
            req.body,
            "Payment cancelled callback received"
        )
    );
});

const paymentIPN = asyncHandler(async (req, res) => {
    console.log("PAYMENT IPN");
    console.log(req.body);

    return res.status(200).json(
        new ApiResponse(
            200,
            req.body,
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