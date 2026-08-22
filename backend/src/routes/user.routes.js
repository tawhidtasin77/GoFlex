import { Router } from "express";

import {
  registerUser,
  loginUser,
  verifyOTP,
  logoutUser,
  getUsers,
  getCurrentUser,
} from "../controllers/user.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { admin } from "../middlewares/admin.middlewares.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/verify-otp").post(verifyOTP);

// Secure routes

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/getUsers").get(verifyJWT, admin, getUsers);

export default router;