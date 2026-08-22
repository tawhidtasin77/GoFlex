import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { api } from "../api/api";

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);

        setProduct(response.data.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;

    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    );

    alert("Product added to cart!");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-medium text-orange-500">
          Loading Product...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-red-500">
          Product Not Found
        </h2>

        <Link
          to="/shop"
          className="mt-5 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const isInStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Breadcrumb */}

        <div className="mb-8 text-sm text-gray-500">
          <Link
            to="/"
            className="text-orange-500 transition hover:text-orange-600"
          >
            Home
          </Link>

          <span className="mx-2">/</span>

          <Link
            to="/shop"
            className="text-orange-500 transition hover:text-orange-600"
          >
            Shop
          </Link>

          <span className="mx-2">/</span>

          <span>{product.category}</span>

          <span className="mx-2">/</span>

          <span className="font-medium text-gray-800">
            {product.name}
          </span>
        </div>


        {/* Product */}

        <div className="grid overflow-hidden rounded-2xl bg-white shadow-lg md:grid-cols-2">

          {/* Product Image */}

          <div className="flex items-center justify-center bg-gray-50 p-6 sm:p-10">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[500px] w-full max-w-lg object-contain"
            />
          </div>


          {/* Product Information */}

          <div className="flex flex-col p-6 sm:p-10">

            {/* Category */}

            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-500">
              {product.category}
            </p>


            {/* Name */}

            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {product.name}
            </h1>


            {/* Rating */}

            <div className="mt-4 flex items-center gap-2">
              <span className="text-yellow-500">
                ★
              </span>

              <span className="font-medium text-gray-700">
                {product.rating?.toFixed(1) || "0.0"}
              </span>

              <span className="text-sm text-gray-500">
                ({product.numReviews || 0} reviews)
              </span>
            </div>


            {/* Price */}

            <p className="mt-6 text-3xl font-bold text-orange-500">
              ৳{product.price.toFixed(2)}
            </p>


            {/* Description */}

            <div className="mt-8">
              <h2 className="mb-3 text-lg font-semibold text-gray-900">
                Product Description
              </h2>

              <p className="leading-7 text-gray-600">
                {product.description}
              </p>
            </div>


            {/* Stock */}

            <div className="mt-8">
              {isInStock ? (
                <p className="font-semibold text-green-600">
                  ● In Stock
                  <span className="ml-2 font-normal text-gray-500">
                    ({product.stock} units available)
                  </span>
                </p>
              ) : (
                <p className="font-semibold text-red-500">
                  ● Temporarily Out of Stock
                </p>
              )}
            </div>


            {/* Add to Cart */}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isInStock}
              className="mt-8 w-full rounded-lg bg-orange-500 px-6 py-4 text-lg font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isInStock ? "Add to Cart" : "Out of Stock"}
            </button>


            {/* Continue Shopping */}

            <Link
              to="/shop"
              className="mt-4 w-full rounded-lg border border-gray-300 px-6 py-4 text-center font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Continue Shopping
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;