import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { admin } from "../middlewares/admin.middlewares.js";
import { getAdminStats } from "../controllers/analytics.controllers.js";

const router = Router();

router.route("/").get(verifyJWT, admin, getAdminStats);

export default router;