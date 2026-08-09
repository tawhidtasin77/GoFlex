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
                    ref: "Product"
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
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "shipping", "delivered"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
)

export const Order = mongoose.model("Oder", orderSchema);