// src/pages/EditProduct.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../hooks/useAxiosSecure";
import UseAuth from "../auth-layout/useAuth";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user, role } = UseAuth();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    stock: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  // রাউট প্রোটেকশন: নন-অ্যাডমিন কে ব্লক করা
  useEffect(() => {
    if (!user || role !== "admin") {
      toast.error("Access denied. শুধুমাত্র অ্যাডমিন প্রবেশ করতে পারবে।");
      navigate("/login");
    }
  }, [user, role, navigate]);

  // প্রোডাক্ট ডাটা লোড করা
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosSecure.get(`/products/${id}`);
        setProduct(res.data);
        setImagePreview(res.data.image || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, axiosSecure]);

  // ইনপুট চেইঞ্জ হ্যান্ডলার
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));

    if (name === "image") setImagePreview(value);
  };

  // ফাইল সিলেকশন হ্যান্ডলার
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      setProduct((prev) => ({ ...prev, image: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  // ইমেজ ক্লিয়ার করা
  const handleClearImage = () => {
    setImagePreview("");
    setProduct((prev) => ({ ...prev, image: "" }));
  };

  // ফর্ম সাবমিট
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosSecure.put(`/products/${id}`, {
        ...product,
        image: product.image || imagePreview,
      });
      toast.success("Product updated successfully!");
      navigate("/products");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading product...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block font-medium mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block font-medium mb-1">Stock</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            rows={4}
          />
        </div>

        {/* Image Section */}
        <div className="space-y-4">
          <label className="block font-medium mb-1">Product Image</label>

          {imagePreview && (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Product preview"
                className="w-32 h-32 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            Select an image file (JPEG, PNG, etc.)
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-700 transition-all duration-200 disabled:opacity-50"
        >
          {submitting ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
