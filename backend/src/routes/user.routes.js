import { Router } from "express";
import { registerUser, loginUser, logoutUser, getUsers } from "../controllers/user.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { admin } from "../middlewares/admin.middlewares.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secure routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/getUsers").get(verifyJWT, admin, getUsers);

export default router;