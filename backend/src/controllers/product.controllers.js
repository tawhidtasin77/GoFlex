import { Product } from "../models/product.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

const getProducts = asyncHandler(async(req, res) => {
    const products = await Product.find({});

    return res
    .status(200)
    .json(
        new ApiResponse(200, products, "products fetched successfully")
    )
});

const getProductById = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        throw new ApiError(404, "not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, product, "product fetched successfully")
    )
});

const createProduct = asyncHandler(async(req, res) => {
    const { name, price, category, description, stock } = req.body;

    if([name, price, category, description, stock].some((field) => field?.trim() === "")){
        throw new ApiError(400, "all fields are required");
    }

    const imageLocalPath = req.file?.path;
    // let imageLocalPath;
    // if(req.files && Array.isArray(req.files.image) && req.files.image.length > 0){
    //     imageLocalPath = req.files.image[0].path;
    // }

    if(!imageLocalPath){
        throw new ApiError(400, "image file is required");
    }

    const image = await uploadOnCloudinary(imageLocalPath);

    if(!image){
        throw new ApiError(500, "something went wrong while uploading image on cloudinary");
    }

    const product = await Product.create(
        {
            name,
            price,
            category,
            description,
            stock,
            image: image.url
        }
    )

    const createdProduct = await product.save();

    return res
    .status(201)
    .json(
        new ApiResponse(200, createdProduct, "product created successfully")
    )
});

const updateProduct = asyncHandler(async(req, res) => {
    const {name, price, category, description, stock} = req.body;

    const product = await Product.findById(req.params.id);
    
    if(!product){
        throw new ApiError(404, "product not found");
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;
    product.description = description || product.description;
    product.stock = stock || product.stock;

    let imageLocalPath;
    let image;
    if(req.file){
        imageLocalPath = req.file?.path;
        image = await uploadOnCloudinary(imageLocalPath);
    }

    product.image = image?.url || product.image;

    const updatedProduct = await product.save();

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedProduct, "product updated successfully")
    )
});

const deleteProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        throw new ApiError(404, "product not found");
    }

    await product.deleteOne();

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "product removed successfully")
    )
})

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}