import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/api";

const EditProduct = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/products/${id}`);

        const product = response.data.data;

        if (!product) {
          alert("Product not found.");
          navigate("/admin/products");
          return;
        }

        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price ?? "",
          category: product.category || "",
          stock: product.stock ?? "",
        });

        setCurrentImage(product.image || "");
      } catch (error) {
        console.error("Failed to fetch product:", error);

        if (error.response?.status === 404) {
          alert("Product not found.");
        } else if (error.response?.status === 401) {
          navigate("/login");
          return;
        }

        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, user, authLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files?.[0];

    if (selectedImage) {
      setImage(selectedImage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("stock", formData.stock);

      if (image) {
        data.append("image", image);
      }

      await api.put(`/products/${id}`, data);

      alert("Product updated successfully!");

      navigate("/admin/products");
    } catch (error) {
      console.error("Failed to update product:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while updating the product."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-orange-500" />

          <p className="text-sm text-zinc-500">
            Loading product...
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
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="mb-5 text-sm font-medium text-zinc-400 transition hover:text-orange-500"
          >
            ← Back to Products
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-2xl ring-1 ring-orange-500/20">
              ✏️
            </div>

            <div>
              <p className="text-sm font-medium text-orange-500">
                GoFlex Admin
              </p>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Edit Product
              </h1>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-zinc-500">
            Update the product information, pricing, inventory, or
            replace its image.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl shadow-black/20 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Product Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-zinc-200"
              >
                Product Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-zinc-200"
              >
                Product Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product..."
                rows={5}
                required
                className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* Price + Stock */}
            <div className="grid gap-6 sm:grid-cols-2">

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-semibold text-zinc-200"
                >
                  Price
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-orange-500">
                    ৳
                  </span>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label
                  htmlFor="stock"
                  className="mb-2 block text-sm font-semibold text-zinc-200"
                >
                  Stock Quantity
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold text-zinc-200"
              >
                Category
              </label>

              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Electronics, Fashion, Accessories"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* Current Image */}
            {currentImage && (
              <div>
                <label className="mb-3 block text-sm font-semibold text-zinc-200">
                  Current Product Image
                </label>

                <div className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                    <img
                      src={currentImage}
                      alt={formData.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      Current image
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      Upload a new image below if you want to replace it.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Replace Image */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-semibold text-zinc-200"
              >
                Replace Image
                <span className="ml-2 font-normal text-zinc-600">
                  (Optional)
                </span>
              </label>

              <div className="rounded-xl border border-dashed border-orange-500/40 bg-orange-500/5 p-6 transition hover:border-orange-500/70">
                <div className="flex flex-col items-center justify-center text-center">

                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 text-2xl">
                    🖼️
                  </div>

                  <p className="text-sm font-medium text-zinc-300">
                    Upload a replacement image
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    PNG, JPG, JPEG or WEBP
                  </p>

                  <label
                    htmlFor="image"
                    className="mt-4 cursor-pointer rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Choose New Image
                  </label>

                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {image && (
                    <div className="mt-4 rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3">
                      <p className="max-w-xs truncate text-sm text-zinc-300">
                        {image.name}
                      </p>

                      <p className="mt-1 text-xs text-zinc-600">
                        {(image.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 pt-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                disabled={updating}
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-6 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updating}
                className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/10 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
              >
                {updating
                  ? "Updating Product..."
                  : "Update Product"}
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;