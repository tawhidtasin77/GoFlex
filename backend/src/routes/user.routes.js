import { Router } from "express";

import {
    registerUser,
    loginUser,
    verifyOTP,
    resendOTP,
    logoutUser,
    getUsers,
    getCurrentUser,
    refreshAccessToken
} from "../controllers/user.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { admin } from "../middlewares/admin.middlewares.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/verify-otp").post(verifyOTP);

router.route("/resend-otp").post(resendOTP);

router
    .route("/refresh-token")
    .post(refreshAccessToken);

// Secure routes

router
    .route("/current-user")
    .get(
        verifyJWT,
        getCurrentUser
    );

router
    .route("/logout")
    .post(
        verifyJWT,
        logoutUser
    );

router
    .route("/getUsers")
    .get(
        verifyJWT,
        admin,
        getUsers
    );

export default router;