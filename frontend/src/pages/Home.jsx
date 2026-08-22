import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { api } from "../api/api";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get("/products/featured");

        console.log("Featured products:", response.data.data);

        setProducts(response.data.data || []);
      } catch (error) {
        console.error(
          "Failed to fetch featured products:",
          error.response?.data || error.message
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* Hero */}

      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">

        <div className="rounded-3xl border border-orange-500/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-orange-950/20 px-6 py-16 text-center shadow-2xl sm:px-10">

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
            Welcome to GoFlex
          </p>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Shop Smart.
            <span className="text-orange-500"> Shop GoFlex.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
            Discover quality products at great prices and enjoy a simple,
            secure shopping experience.
          </p>
        </div>
      </section>


      {/* Featured Products */}

      <section className="mx-auto max-w-6xl px-5 pb-16">

        <div className="mb-8 flex items-end justify-between gap-4">

          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-500">
              Our Selection
            </p>

            <h2 className="text-3xl font-bold text-white">
              Featured Products
            </h2>
          </div>

        </div>


        {loading ? (

          <div className="flex min-h-40 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-orange-500" />

              <p className="text-sm text-zinc-400">
                Loading products...
              </p>
            </div>
          </div>

        ) : products.length === 0 ? (

          <div className="flex min-h-40 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
            <p className="text-zinc-400">
              No products available right now.
            </p>
          </div>

        ) : (

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}

          </div>

        )}

      </section>

    </main>
  );
};

export default Home;