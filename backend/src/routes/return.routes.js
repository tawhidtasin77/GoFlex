

import { Router } from "express";

import {
  createReturnRequest,
  getMyReturnRequests,
  getOrderForReturn,
} from "../controllers/return.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/order/:orderId").get(
  verifyJWT,
  getOrderForReturn
);

router.route("/request").post(
  verifyJWT,
  createReturnRequest
);

router.route("/my-returns").get(
  verifyJWT,
  getMyReturnRequests
);

export default router;