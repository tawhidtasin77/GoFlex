import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";

// export const verifyJWT = asyncHandler(async(req, res, next) => {
//     try {
//         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

//         if(!token){
//             throw new ApiError(401, "unauthorized request")
//         }

//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//         const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        
//         if(!user){
//             throw new ApiError(401, "invalid access token");
//         }

//         req.user = user;
//         next();
        
//     } catch (error) {
//         throw new ApiError(401, error?.message || "invalid access token")
//     }
// })


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        console.log("VERIFY JWT:", {
            hasToken: !!token,
            hasCookie: !!req.cookies?.accessToken,
            hasAuthorization: !!req.header("Authorization"),
            path: req.originalUrl,
        });

        if (!token) {
            throw new ApiError(401, "unauthorized request");
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id)
            .select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "invalid access token");
        }

        console.log("VERIFY JWT USER:", {
            id: user._id,
            role: user.role,
        });

        req.user = user;

        next();

    } catch (error) {
        console.error("VERIFY JWT FAILED:", error.message);

        throw new ApiError(
            401,
            error?.message || "invalid access token"
        );
    }
});