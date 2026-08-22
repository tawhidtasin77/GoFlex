import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                products,
                "Products fetched successfully"
            )
        );
});

const getFeaturedProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({
        stock: { $gt: 0 }
    })
    .sort({
        rating: -1,
        numReviews: -1,
        createdAt: -1
    })
    .limit(8);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                products,
                "Featured products fetched successfully"
            )
        );
});

const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                product,
                "Product fetched successfully"
            )
        );
});

const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        category,
        description,
        stock,
        rating,
        numReviews
    } = req.body;

    if (
        !name ||
        price === undefined ||
        !category ||
        !description ||
        stock === undefined
    ) {
        throw new ApiError(400, "All required product fields are required");
    }

    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
        throw new ApiError(409, "Product already exists");
    }

    if (!req.file?.path) {
        throw new ApiError(400, "Product image is required");
    }

    const uploadedImage = await uploadOnCloudinary(req.file.path);

    if (!uploadedImage?.url) {
        throw new ApiError(500, "Failed to upload product image");
    }

    const product = await Product.create({
        name,
        price: Number(price),
        category,
        description,
        stock: Number(stock),
        image: uploadedImage.url,
        rating: rating ? Number(rating) : 0,
        numReviews: numReviews ? Number(numReviews) : 0
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                product,
                "Product created successfully"
            )
        );
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const {
        name,
        price,
        category,
        description,
        stock,
        rating,
        numReviews
    } = req.body;

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;
    if (stock !== undefined) product.stock = Number(stock);
    if (rating !== undefined) product.rating = Number(rating);
    if (numReviews !== undefined) product.numReviews = Number(numReviews);

    if (req.file?.path) {
        const uploadedImage = await uploadOnCloudinary(req.file.path);

        if (!uploadedImage?.url) {
            throw new ApiError(500, "Failed to upload product image");
        }

        product.image = uploadedImage.url;
    }

    await product.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                product,
                "Product updated successfully"
            )
        );
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    await Product.findByIdAndDelete(id);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Product deleted successfully"
            )
        );
});

export {
    getProducts,
    getFeaturedProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};