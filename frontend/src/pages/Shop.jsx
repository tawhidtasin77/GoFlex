import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { api } from "../api/api";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");

        setProducts(response.data.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            All Products
          </h1>

          <p className="mt-2 text-gray-500">
            Explore our latest products.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none placeholder:text-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:max-w-md"
          />
        </div>

        {/* Products */}
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-orange-500">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-lg bg-white shadow">
            <p className="text-gray-500">
              {search
                ? "No products found."
                : "No products available."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;