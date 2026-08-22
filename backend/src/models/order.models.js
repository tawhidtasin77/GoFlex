import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                price: {
                    type: Number,
                    required: true
                }
            }
        ],
        totalAmount: {
            type: Number,
            required: true
        },
        address: {
            fullName: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            },
            street: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            postalCode: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            }
        },
        paymentId: {
            type: String
        },
        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"],
            default: "PENDING"
        },

        status: {
            type: String,
            enum: [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled"
            ],
            default: "pending"
        },

        stockRestored: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

export const Order = mongoose.model("Order", orderSchema);