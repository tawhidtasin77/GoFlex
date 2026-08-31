import { Router } from "express";

import {
  getAllReturnRequests,
  updateReturnStatus,
} from "../controllers/return.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/").get(
  verifyJWT,
  getAllReturnRequests
);

router.route("/:id/status").patch(
  verifyJWT,
  updateReturnStatus
);

export default router;