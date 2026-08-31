// backend/src/app.js

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import orderRouter from "./routes/order.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";

import userReturnProduct from "./routes/return.routes.js";
import adminReturnRequest from "./routes/returnRequest.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("public"));


app.use(
  "/api/v1/users",
  userRouter
);

app.use(
  "/api/v1/products",
  productRouter
);

app.use(
  "/api/v1/orders",
  orderRouter
);

app.use(
  "/api/v1/payments",
  paymentRouter
);

app.use(
  "/api/v1/analytics",
  analyticsRouter
);


app.use(
  "/api/v1/returns",
  userReturnProduct
);


app.use(
  "/api/v1/return-request",
  adminReturnRequest
);

export { app };