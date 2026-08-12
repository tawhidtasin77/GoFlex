import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
    {
        order: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: "BDT"
        },
        transactionId: {
            type: String,
            required: true,
            unique: true
        },
        paymentStatus: {
            type: String,
            enum: ["PENDING", "SUCCESS", "FAILED", "CANCELLED", "REFUNDED"],
            default: "PENDING"
        },
        gateway: {
            type: String,
            default: "SSLCOMMERZ"
        }
    },
    {
        timestamps: true
    }
);

export const Payment = mongoose.model("Payment", paymentSchema);