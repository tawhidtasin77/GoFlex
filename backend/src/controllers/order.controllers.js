import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order.models.js";
import { Product } from "../models/product.models.js"
import { sendEmail } from "../utils/sendEmail.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { orderHTML } from "../templates/orderHTML.templates.js";

const createOrder = asyncHandler(async (req, res) => {
    const { items, address } = req.body;

    if (!items || items.length === 0 || !address) {
        throw new ApiError(400, "Invalid order credentials");
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const productIds = items.map((item) => item.productId);

        const products = await Product.find({
            _id: { $in: productIds }
        }).session(session);

        if (products.length !== productIds.length) {
            throw new ApiError(
                404,
                "One or more products were not found"
            );
        }

        const productMap = new Map();

        products.forEach((product) => {
            productMap.set(product._id.toString(), product);
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

            if (item.quantity < 1) {
                throw new ApiError(
                    400,
                    "Quantity must be at least 1"
                );
            }

            if (product.stock < item.quantity) {
                throw new ApiError(
                    400,
                    `${product.name} does not have enough stock`
                );
            }

            const itemTotal =
                product.price * item.quantity;

            totalAmount += itemTotal;

            orderItems.push({
                productId: product._id,
                quantity: item.quantity,
                price: product.price
            });
        }

        for (const item of items) {

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
                        new: true,
                        session
                    }
                );

            if (!updatedProduct) {
                throw new ApiError(
                    400,
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
                    address
                }
            ],
            { session }
        );

        await session.commitTransaction();

        const createdOrder = order[0];

        const html = orderHTML(
            req.user,
            createdOrder
        );

        await sendEmail(
            req.user.email,
            "Order Created Successfully 🎉",
            html
        );

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    createdOrder,
                    "Order created successfully"
                )
            );
    } catch (error) {
        await session.abortTransaction();
        throw error;

    } finally {
        await session.endSession();
    }
});

const myOrders = asyncHandler(async (req, res) => {
    const user = req.user;

    const orders = await Order.find({ user: user._id }).populate("items.productId", "name price");

    return res
        .status(200)
        .json(
            new ApiResponse(200, orders, "orders fetched successfully")
        )
})

const getOrders = asyncHandler(async (req, res) => {
    // const orders = await Order.find({}).populate("user", "name email").populate("items.product", "name price")
    const orders = await Order.find({}).populate("user", "name email");

    return res
        .status(200)
        .json(
            new ApiResponse(200, orders, "orders fetched successfully")
        )
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new ApiError(400, "invalid order request");
    }

    order.status = status;
    await order.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new ApiResponse(200, order, "status updated successfully")
        )
})

export {
    createOrder,
    myOrders,
    getOrders,
    updateOrderStatus
}