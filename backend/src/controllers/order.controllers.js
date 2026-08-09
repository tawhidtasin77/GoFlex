import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Order } from "../models/order.models.js";
import { sendEmail } from "../utils/sendEmail.js";
import { apiResponse } from "../utils/ApiResponse.js"
import { orderHTML } from "../templates/orderHTML.templates.js";

const createOrder = asyncHandler(async(req, res) => {
    const {items, totalAmount, address, paymentId} = req.body;

    if(!items || items.length === 0 || !totalAmount || !address || !paymentId){
        throw new ApiError(400, "invalid order credentials");
    }

    const order = await Order.create(
        {
            user: req.user._id,
            items,
            totalAmount,
            address,
            paymentId
        }
    );

    if(!order){
        throw new ApiError(500, "something went wrong while creating order.");
    }

    await order.save();

    const html = orderHTML(req.user, order);
    
    await sendEmail(req.user.email, "Order Created Successfully 🎉", html);
    
    return res
    .status(200)
    .json(
        new apiResponse(201, order, "order created successfully")
    )
});

const myOrders = asyncHandler(async(req, res) => {
    const user = req.user;

    const orders = await Order.find({user: user._id}).populate("items.productId", "name price");

    return res
    .status(200)
    .json(
        new apiResponse(200, orders, "orders fetched successfully")
    )
})

const getOrders = asyncHandler(async(req, res) => {
    // const orders = await Order.find({}).populate("user", "name email").populate("items.productId", "name price")
    const orders = await Order.find({}).populate("userId", "id name");

    return res
    .status(200)
    .json(
        new apiResponse(200, orders, "orders fetched successfully")
    )
});

export {
    createOrder,
    myOrders,
    getOrders
}