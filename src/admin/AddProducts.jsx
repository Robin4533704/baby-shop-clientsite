// src/pages/Admin/AddProduct.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUpload,
  FaSpinner,
  FaCheck,
  FaExclamationTriangle,
  FaImage,
  FaDollarSign,
  FaBox,
  FaTag,
  FaUser,
  FaList,
  FaWarehouse,
  FaPercent
} from "react-icons/fa";
import { toast } from "react-toastify";
import useAxiosSecure from "../hooks/useAxiosSecure";

// Static baby categories data
const staticBabyCategories = [
  { _id: "1", name: "Bathing" },
  { _id: "2", name: "Care" },
  { _id: "3", name: "Clothing" },
  { _id: "4", name: "Diapering" },
  { _id: "5", name: "Feeding" },
  { _id: "6", name: "Gear" },
  { _id: "7", name: "Safety" },
  { _id: "8", name: "Sleeping" },
  { _id: "9", name: "Toys" }
];

const AddProduct = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState(staticBabyCategories); // Directly use static categories
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    ageRange: "",
    brand: "",
    description: "",
    stock: "",
    image: "",
    features: [],
    discount: "0",
    status: "active"
  });

  const ageRanges = [
    "0-3 Months",
    "3-6 Months", 
    "6-12 Months",
    "1-2 Years",
    "2-4 Years",
    "4+ Years"
  ];

  // ✅ Fetch products only
  const fetchProducts = async () => {
    try {
      const res = await axiosSecure.get("/products?limit=50");
      if (res.data.success) {
        setProducts(res.data.data);
        setFilteredProducts(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Filter by category
  useEffect(() => {
    if (selectedCategory) {
      const filtered = products.filter((p) => p.category === selectedCategory);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory, products]);

// ✅ Image Upload
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith("image/")) {
    toast.error("Please select a valid image file");
    return;
  }

  // Validate file size (<5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error("Image size should be less than 5MB");
    return;
  }

  // Preview image immediately
  const previewUrl = URL.createObjectURL(file);
  setFormData((prev) => ({ ...prev, image: previewUrl }));

  const formDataImg = new FormData();
  formDataImg.append("image", file);

  try {
    setUploading(true);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formDataImg,
      }
    );

    const data = await res.json();

    if (data.success) {
      // Save uploaded image URL
      setFormData((prev) => ({ ...prev, image: data.data.display_url }));
      toast.success("Image uploaded successfully!");
    } else {
      setFormData((prev) => ({ ...prev, image: "" }));
      toast.error("Image upload failed. Please try again.");
    }
  } catch (error) {
    console.error("❌ Error uploading image:", error);
    setFormData((prev) => ({ ...prev, image: "" }));
    toast.error("Image upload failed. Please try again.");
  } finally {
    setUploading(false);
  }
};



  // ✅ Input Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFeatureChange = (e) => {
    const features = e.target.value
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f);
    setFormData((prev) => ({ ...prev, features }));
  };

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.ageRange) newErrors.ageRange = "Age range is required";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.stock || formData.stock < 0) newErrors.stock = "Valid stock quantity is required";
    if (!formData.image.trim()) newErrors.image = "Image upload is required";
    if (formData.discount < 0 || formData.discount > 100) newErrors.discount = "Discount must be between 0-100%";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Calculate discounted price
  const calculateDiscountedPrice = () => {
    const price = parseFloat(formData.price) || 0;
    const discount = parseFloat(formData.discount) || 0;
    return price - (price * discount / 100);
  };

  // ✅ Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSuccess(false);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        discount: parseInt(formData.discount),
        features: formData.features,
        discountedPrice: calculateDiscountedPrice(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const res = await axiosSecure.post("/products", productData);

      if (res.data.success) {
        setSuccess(true);
        toast.success("Product added successfully! 🎉");
        setFormData({
          name: "",
          price: "",
          category: "",
          ageRange: "",
          brand: "",
          description: "",
          stock: "",
          image: "",
          features: [],
          discount: "0",
          status: "active"
        });
        fetchProducts();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        toast.error(res.data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ✅ Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600 mt-2">
          Add new products to your baby shop inventory
        </p>
      </div>

      {/* ✅ Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
          <FaCheck className="text-green-600 text-xl" />
          <div>
            <p className="text-green-800 font-medium">Product added successfully!</p>
            <p className="text-green-600 text-sm">The product has been added to your inventory.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ✅ Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    errors.brand ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter brand name"
                />
                {errors.brand && (
                  <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
                )}
              </div>

              {/* Category - FIXED */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              {/* Age Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Range *
                </label>
                <select
                  name="ageRange"
                  value={formData.ageRange}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    errors.ageRange ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Age Range</option>
                  {ageRanges.map((age) => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
                {errors.ageRange && (
                  <p className="mt-1 text-sm text-red-600">{errors.ageRange}</p>
                )}
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                      errors.stock ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.stock && (
                    <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                  )}
                </div>
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="0"
                />
                {formData.discount > 0 && formData.price > 0 && (
                  <p className="mt-2 text-sm text-green-600">
                    Discounted Price: ${calculateDiscountedPrice().toFixed(2)}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                {uploading && (
                  <p className="text-sm text-blue-500 mt-2 flex items-center gap-2">
                    <FaSpinner className="animate-spin" /> Uploading image...
                  </p>
                )}
                {formData.image && (
                  <div className="mt-3">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <p className="text-xs text-green-600 mt-1">
                      Image uploaded successfully!
                    </p>
                  </div>
                )}
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter product description..."
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features (comma separated)
                </label>
                <input
                  type="text"
                  onChange={handleFeatureChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Soft material, Machine washable, Hypoallergenic"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.features.map((feature, index) => (
                    <span key={index} className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/admin/manage-products")}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Adding Product...</span>
                    </>
                  ) : (
                    <>
                      <FaUpload />
                      <span>Add Product</span>
                    </>
                  )}
                </button>
              </div>

              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                  <FaExclamationTriangle className="text-red-600 text-xl" />
                  <p className="text-red-800">{errors.submit}</p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* ✅ Right Sidebar */}
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Products</h3>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-600 mt-2">
              Showing {filteredProducts.length} products
            </p>
          </div>

          {/* Product Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Products</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredProducts.slice(0, 10).map((product) => (
                <div
                  key={product._id}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-600">${product.price}</p>
                  </div>
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <p className="text-center text-gray-500 py-4">No products found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;