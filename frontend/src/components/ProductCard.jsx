import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    );
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/product/${product._id}`}>
        <div className="aspect-square overflow-hidden bg-zinc-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-500">
          {product.category}
        </p>

        <Link to={`/product/${product._id}`}>
          <h3 className="line-clamp-2 text-lg font-bold text-zinc-900 transition hover:text-orange-500">
            {product.name}
          </h3>
        </Link>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-orange-500">
            ৳{Number(product.price).toFixed(2)}
          </span>

          <span className="text-sm text-zinc-500">
            Stock: {product.stock}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="mt-5 w-full rounded-lg bg-orange-500 px-4 py-2.5 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;