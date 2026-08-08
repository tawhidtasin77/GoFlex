import mongoose, {Schema} from "mongoose";

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        price: {
            type: Number,
            required: true
        },
        category: {
            type: String, 
            required: true
        },
        description: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            default: 0
        },
        numReviews: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

export const Product = mongoose.model("Product", productSchema);