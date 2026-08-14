import { Order } from "../models/order.models.js";
import { Product } from "../models/product.models.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAdminStats = asyncHandler(async(req, res) => {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalOrders = await Order.countDocuments({});
    const totalProducts = await Product.countDocuments({});

    const orders = await Order.find({});

    const totalRevenueData = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                totalUsers,
                totalOrders,
                totalProducts,
                totalRevenue: totalRevenueData
            },
            "admin stats fetched successfully"
        )
    )
});

export { getAdminStats };