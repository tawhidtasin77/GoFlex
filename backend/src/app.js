import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import productRouter from "./routes/product.routes.js"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true,
}));
app.use(cookieParser());

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"))

//user
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/analytics", analyticsRouter); //admin

export { app }