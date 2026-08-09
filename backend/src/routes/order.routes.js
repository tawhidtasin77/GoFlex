import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares";
import { admin } from "../middlewares/admin.middlewares";

const router = Router();

// router.route("/").post(verifyJWT, createOrder).get(verifyJWT, admin, getOrders);
// router.route("/my-orders").get(verifyJWT, getMyOrders);
// router.route("/:id/status").put(verifyJWT, admin, updateOrderStatus);

export default router;