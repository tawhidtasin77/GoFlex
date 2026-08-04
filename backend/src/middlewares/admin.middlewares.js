import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const admin = asyncHandler(async(req, res, next) => {
    if(!(req.user && req.user.role === "admin")){
        throw new ApiError(401, "access denied, admin only");
    }

    next();
})

export { admin }