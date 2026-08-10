import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { admin } from "../middlewares/admin.middlewares.js";
import { createOrder, myOrders, getOrders, updateOrderStatus} from "../controllers/order.controllers.js"

const router = Router();

router.route("/").post(verifyJWT, createOrder).get(verifyJWT, admin, getOrders);
router.route("/my-orders").get(verifyJWT, myOrders);
router.route("/:id/status").put(verifyJWT, admin, updateOrderStatus);

export default router;