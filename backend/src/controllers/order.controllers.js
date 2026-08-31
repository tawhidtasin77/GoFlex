import mongoose from "mongoose";
import { Order } from "../models/order.models.js";
import { Product } from "../models/product.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import { orderHTML } from "../templates/orderHTML.templates.js";

const createOrder = asyncHandler(async (req, res) => {
    const { items, address } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        throw new ApiError(400, "Order items are required");
    }

    if (!address) {
        throw new ApiError(400, "Shipping address is required");
    }

    const session = await mongoose.startSession();

    let createdOrder;

    try {
        session.startTransaction();

        const productIds = [
            ...new Set(
                items.map(
                    (item) => item.productId.toString()
                )
            )
        ];

        const products = await Product.find({
            _id: {
                $in: productIds
            }
        }).session(session);

        if (products.length !== productIds.length) {
            throw new ApiError(
                404,
                "One or more products were not found"
            );
        }

        const productMap = new Map();

        products.forEach((product) => {
            productMap.set(
                product._id.toString(),
                product
            );
        });

        let totalAmount = 0;

        const orderItems = [];

        for (const item of items) {
            const product = productMap.get(
                item.productId.toString()
            );

            if (!product) {
                throw new ApiError(
                    404,
                    "Product not found"
                );
            }

            const quantity = Number(item.quantity);

            if (
                !Number.isInteger(quantity) ||
                quantity < 1
            ) {
                throw new ApiError(
                    400,
                    `Invalid quantity for ${product.name}`
                );
            }

            if (product.stock < quantity) {
                throw new ApiError(
                    400,
                    `${product.name} does not have enough stock`
                );
            }

            const itemTotal =
                product.price * quantity;

            totalAmount += itemTotal;

            orderItems.push({
                productId: product._id,
                quantity,
                price: product.price
            });
        }


        for (const item of orderItems) {
            const updatedProduct =
                await Product.findOneAndUpdate(
                    {
                        _id: item.productId,
                        stock: {
                            $gte: item.quantity
                        }
                    },
                    {
                        $inc: {
                            stock: -item.quantity
                        }
                    },
                    {
                        returnDocument: "after",
                        session
                    }
                );

            if (!updatedProduct) {
                throw new ApiError(
                    409,
                    "Product stock changed. Please try again."
                );
            }
        }


        const order = await Order.create(
            [
                {
                    user: req.user._id,
                    items: orderItems,
                    totalAmount,
                    address,
                    paymentStatus: "PENDING",
                    status: "pending",
                    stockRestored: false
                }
            ],
            {
                session
            }
        );

        createdOrder = order[0];

        await session.commitTransaction();

    } catch (error) {
        await session.abortTransaction();
        throw error;

    } finally {
        await session.endSession();
    }


    try {
        const html = orderHTML(
            req.user,
            createdOrder
        );

        await sendEmail(
            req.user.email,
            "Order Created Successfully 🎉",
            html
        );

    } catch (error) {
        console.error(
            "Order email failed:",
            error.message
        );
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                createdOrder,
                "Order created successfully"
            )
        );
});


const myOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({
        user: req.user._id
    })
        .populate(
            "items.productId",
            "name price image"
        )
        .sort({
            createdAt: -1
        });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                orders,
                "Orders fetched successfully"
            )
        );
});


const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
        .populate(
            "user",
            "name email"
        )
        .populate(
            "items.productId",
            "name price image"
        )
        .sort({
            createdAt: -1
        });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                orders,
                "Orders fetched successfully"
            )
        );
});


const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    const allowedStatuses = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
    ];


    if (!allowedStatuses.includes(status)) {
        throw new ApiError(
            400,
            "Invalid order status"
        );
    }


    const order = await Order.findById(
        req.params.id
    );

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    if (
        status === "processing" &&
        order.paymentStatus !== "PAID"
    ) {
        throw new ApiError(
            400,
            "Only paid orders can be processed"
        );
    }


    if (
        status === "cancelled" &&
        order.status === "delivered"
    ) {
        throw new ApiError(
            400,
            "Delivered orders cannot be cancelled"
        );
    }


    order.status = status;

    await order.save();


    await order.populate(
        "user",
        "name email"
    );

    await order.populate(
        "items.productId",
        "name price image"
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                order,
                "Order status updated successfully"
            )
        );
});


export {
    createOrder,
    myOrders,
    getOrders,
    updateOrderStatus
};