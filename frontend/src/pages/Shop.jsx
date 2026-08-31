import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { api } from "../api/api";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");

        setProducts(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    "All",
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            All Products
          </h1>

          <p className="mt-2 text-gray-500">
            Explore our latest products.
          </p>
        </div>

        <div className="mb-8 flex justify-between flex-col gap-4 sm:flex-row">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none placeholder:text-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:max-w-md"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:w-56"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

        </div>

        {!loading && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-800">
                {filteredProducts.length}
              </span>{" "}
              product
              {filteredProducts.length !== 1 ? "s" : ""}
            </p>

            {selectedCategory !== "All" && (
              <p className="text-sm text-orange-500">
                Category:{" "}
                <span className="font-semibold">
                  {selectedCategory}
                </span>
              </p>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-orange-500">
              Loading products...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-lg bg-white shadow">
            <p className="text-gray-500">
              {search || selectedCategory !== "All"
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