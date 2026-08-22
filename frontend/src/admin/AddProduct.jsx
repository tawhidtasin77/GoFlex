import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

const AddProduct = () => {
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
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

    if (!image) {
      alert("Please select a product image.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("stock", formData.stock);
      data.append("image", image);

      const response = await api.post("/products", data);

      if (response.status >= 200 && response.status < 300) {
        alert("Product created successfully!");

        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          stock: "",
        });

        setImage(null);

        navigate("/admin");
      }
    } catch (error) {
      console.error("Failed to create product:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while creating the product."
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-zinc-950">
        <p className="text-orange-500">Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="mb-5 text-sm font-medium text-zinc-400 transition hover:text-orange-500"
          >
            ← Back to Dashboard
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-2xl ring-1 ring-orange-500/20">
              📦
            </div>

            <div>
              <p className="text-sm font-medium text-orange-500">
                GoFlex Admin
              </p>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Add New Product
              </h1>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-zinc-500">
            Add a new product to your GoFlex store. Fill in the product
            information and upload a high-quality image.
          </p>
        </div>

        {/* Form */}
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

            {/* Image Upload */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-semibold text-zinc-200"
              >
                Product Image
              </label>

              <div className="rounded-xl border border-dashed border-orange-500/40 bg-orange-500/5 p-6 transition hover:border-orange-500/70">

                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 text-2xl">
                    🖼️
                  </div>

                  <p className="text-sm font-medium text-zinc-300">
                    Upload product image
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    PNG, JPG, JPEG or WEBP
                  </p>

                  <label
                    htmlFor="image"
                    className="mt-4 cursor-pointer rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Choose Image
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
                onClick={() => navigate("/admin")}
                disabled={loading}
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-6 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/10 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
              >
                {loading ? "Uploading & Publishing..." : "Publish Product"}
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;