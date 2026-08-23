import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/api";
import { addToCart } from "../redux/cartSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);

        setProduct(response.data.data);
      } catch (error) {
        console.error(
          "Failed to fetch product:",
          error.response?.data || error.message
        );

        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
      })
    );

    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-orange-500" />

          <p className="text-gray-500">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Product not found
        </h1>

        <p className="mt-2 text-gray-500">
          The product you are looking for does not exist.
        </p>

        <button
          type="button"
          onClick={() => navigate("/shop")}
          className="mt-6 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 text-sm font-medium text-orange-500 hover:text-orange-600"
        >
          ← Back
        </button>

        <div className="grid overflow-hidden rounded-2xl bg-white shadow-lg md:grid-cols-2">

          <div className="flex items-center justify-center bg-gray-50 p-6">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[500px] w-full rounded-xl object-contain"
            />
          </div>

          <div className="p-6 sm:p-10">

            <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
              {product.category}
            </p>

            <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-5 text-3xl font-bold text-orange-500">
              ৳{Number(product.price).toFixed(2)}
            </p>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Description
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                {product.description}
              </p>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700">
                Available Stock:{" "}
                <span className="font-bold text-gray-900">
                  {product.stock}
                </span>
              </p>
            </div>

            {product.stock > 0 && (
              <div className="mt-6 flex items-center gap-4">

                <span className="font-medium text-gray-700">
                  Quantity
                </span>

                <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((prev) => Math.max(1, prev - 1))
                    }
                    className="px-4 py-2 text-lg font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    −
                  </button>

                  <span className="min-w-12 text-black border-x border-gray-300 px-4 py-2 text-center font-semibold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((prev) =>
                        Math.min(product.stock, prev + 1)
                      )
                    }
                    className="px-4 py-2 text-lg font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    +
                  </button>

                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="mt-8 w-full rounded-lg bg-orange-500 px-6 py-3.5 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {product.stock <= 0
                ? "Out of Stock"
                : "Add to Cart"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;