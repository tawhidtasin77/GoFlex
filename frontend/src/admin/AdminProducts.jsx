import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";
import { api } from "../api/api";
import Toast from "../components/Toast";

const AdminProducts = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const [toast, setToast] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await api.get("/products");

        const productData = response.data.data;

        setProducts(
          Array.isArray(productData) ? productData : []
        );
      } catch (error) {
        console.error("Failed to fetch products:", error);

        setToast({
          type: "error",
          message: "Failed to fetch products.",
        });

        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user, authLoading, navigate]);

  const handleDelete = (product) => {
    setProductToDelete(product);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    const id = productToDelete._id;

    try {
      setDeletingProduct(id);

      await api.delete(`/products/${id}`);

      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) => product._id !== id
        )
      );

      setToast({
        type: "success",
        message: "Product deleted successfully.",
      });

      setProductToDelete(null);
    } catch (error) {
      console.error("Failed to delete product:", error);

      setToast({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to delete product.",
      });
    } finally {
      setDeletingProduct(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-orange-500" />

          <p className="text-sm text-zinc-500">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-8">

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="mb-5 cursor-pointer text-sm font-medium text-zinc-400 transition hover:text-orange-500"
          >
            ← Back to Dashboard
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-2xl ring-1 ring-orange-500/20">
                📦
              </div>

              <div>
                <p className="text-sm font-medium text-orange-500">
                  GoFlex Admin
                </p>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Manage Products
                </h1>
              </div>

            </div>

            <Link
              to="/admin/add-product"
              className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/10 transition hover:bg-orange-600"
            >
              + Add Product
            </Link>

          </div>

          <p className="mt-4 text-sm leading-6 text-zinc-500">
            View, edit and manage all products available in your
            GoFlex store.
          </p>

        </div>

        {/* Products Card */}
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/20">

          {/* Card Header */}
          <div className="flex flex-col gap-3 border-b border-zinc-800 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="font-bold text-white">
                Product Inventory
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                {products.length}{" "}
                {products.length === 1
                  ? "product"
                  : "products"}{" "}
                available
              </p>
            </div>

            <div className="whitespace-nowrap rounded-lg bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-500 ring-1 ring-orange-500/20">
              {products.length} Products
            </div>

          </div>

          {/* Empty State */}
          {products.length === 0 ? (

            <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-3xl">
                📦
              </div>

              <h3 className="text-lg font-semibold text-white">
                No Products Found
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                You haven't added any products to GoFlex yet.
                Create your first product to start selling.
              </p>

              <Link
                to="/admin/add-product"
                className="mt-6 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                + Add Your First Product
              </Link>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px] table-fixed">

                <colgroup>
                  <col className="w-[360px]" />
                  <col className="w-[150px]" />
                  <col className="w-[190px]" />
                  <col className="w-[110px]" />
                  <col className="w-[170px]" />
                  <col className="w-[220px]" />
                </colgroup>

                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/50">

                    <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold tracking-wider text-zinc-500">
                      PRODUCT
                    </th>

                    <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold tracking-wider text-zinc-500">
                      PRICE
                    </th>

                    <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold tracking-wider text-zinc-500">
                      CATEGORY
                    </th>

                    <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold tracking-wider text-zinc-500">
                      STOCK
                    </th>

                    <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold tracking-wider text-zinc-500">
                      STATUS
                    </th>

                    <th className="whitespace-nowrap px-6 py-4 text-right text-xs font-semibold tracking-wider text-zinc-500">
                      ACTIONS
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {products.map((product) => {
                    const isInStock = product.stock > 0;

                    return (
                      <tr
                        key={product._id}
                        className="border-b border-zinc-800 transition hover:bg-zinc-800/30"
                      >

                        {/* Product */}
                        <td className="px-6 py-5">

                          <div className="flex items-center gap-4">

                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-800">

                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />

                            </div>

                            <div className="min-w-0">

                              <p className="truncate font-semibold text-white">
                                {product.name}
                              </p>

                              <p className="mt-1 font-mono text-xs text-zinc-600">
                                #{product._id.substring(0, 8)}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Price */}
                        <td className="whitespace-nowrap px-6 py-5">

                          <span className="font-semibold text-orange-500">
                            ৳
                            {Number(product.price || 0).toFixed(2)}
                          </span>

                        </td>

                        {/* Category */}
                        <td className="px-6 py-5">

                          <span className="inline-block max-w-full truncate whitespace-nowrap rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300">
                            {product.category}
                          </span>

                        </td>

                        {/* Stock */}
                        <td className="whitespace-nowrap px-6 py-5">

                          <span
                            className={
                              isInStock
                                ? "font-medium text-zinc-300"
                                : "font-medium text-red-400"
                            }
                          >
                            {product.stock}
                          </span>

                        </td>

                        {/* Status */}
                        <td className="whitespace-nowrap px-6 py-5">

                          {isInStock ? (

                            <span className="inline-flex whitespace-nowrap rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400 ring-1 ring-green-500/20">
                              In Stock
                            </span>

                          ) : (

                            <span className="inline-flex whitespace-nowrap rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400 ring-1 ring-red-500/20">
                              Out of Stock
                            </span>

                          )}

                        </td>

                        {/* Actions */}
                        <td className="whitespace-nowrap px-6 py-5">

                          <div className="flex justify-end gap-2">

                            <Link
                              to={`/admin/edit-product/${product._id}`}
                              className="inline-flex whitespace-nowrap rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-400 transition hover:bg-blue-500/20"
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleDelete(product)}
                              disabled={
                                deletingProduct === product._id
                              }
                              className="inline-flex whitespace-nowrap rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingProduct === product._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* Footer */}
        {products.length > 0 && (

          <div className="mt-5 flex items-center gap-2 text-xs text-zinc-600">

            <span className="h-2 w-2 rounded-full bg-orange-500" />

            Manage your GoFlex product inventory from this page.

          </div>

        )}

      </div>

      {/* Delete Modal */}
      {productToDelete && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-2xl">
              ⚠️
            </div>

            <h2 className="mt-4 text-xl font-bold text-white">
              Delete Product?
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">

              Are you sure you want to delete{" "}

              <span className="font-semibold text-white">
                {productToDelete.name}
              </span>

              ? This action cannot be undone.

            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={deletingProduct}
                className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={deletingProduct}
                className="rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingProduct
                  ? "Deleting..."
                  : "Delete Product"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminProducts;