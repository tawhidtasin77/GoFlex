import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// const admin = asyncHandler(async(req, res, next) => {
//     if(!(req.user && req.user.role === "admin")){
//         throw new ApiError(401, "access denied, admin only");
//     }

//     next();
// })


const admin = asyncHandler(async (req, res, next) => {
    console.log("ADMIN MIDDLEWARE:", {
        userId: req.user?._id,
        role: req.user?.role,
    });

    if (!req.user) {
        throw new ApiError(401, "user not authenticated");
    }

    if (req.user.role !== "admin") {
        throw new ApiError(403, "access denied, admin only");
    }

    next();
});

export { admin }