import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js"

import {
    createPayment,
    paymentSuccess,
    paymentFail,
    paymentCancel,
    paymentIPN
} from "../controllers/payment.controllers.js";

const router = Router();

router.post("/create", verifyJWT, createPayment);

router.post("/success", paymentSuccess);
router.post("/fail", paymentFail);
router.post("/cancel", paymentCancel);
router.post("/ipn", paymentIPN);

export default router;