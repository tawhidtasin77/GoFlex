import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const isInStock = product.stock > 0;

  return (
    <div className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-orange-500/30 hover:shadow-orange-500/5">

      {/* Image */}

      <Link to={`/product/${product._id}`}>

        <div className="flex h-56 items-center justify-center overflow-hidden bg-zinc-800">

          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

        </div>

      </Link>


      {/* Information */}

      <div className="p-5">

        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-500">
          {product.category}
        </p>

        <Link to={`/product/${product._id}`}>

          <h3 className="truncate text-lg font-semibold text-white transition hover:text-orange-500">
            {product.name}
          </h3>

        </Link>


        <div className="mt-3 flex items-center justify-between">

          <p className="text-xl font-bold text-orange-500">
            ৳{Number(product.price).toFixed(2)}
          </p>

          <span
            className={
              isInStock
                ? "text-xs font-medium text-green-500"
                : "text-xs font-medium text-red-500"
            }
          >
            {isInStock ? "In Stock" : "Out of Stock"}
          </span>

        </div>


        <Link
          to={`/product/${product._id}`}
          className="mt-5 block w-full rounded-lg bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          View Details
        </Link>

      </div>

    </div>
  );
};

export default ProductCard;