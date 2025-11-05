// src/pages/Admin/AddProduct.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Plus,
  Image as ImageIcon,
  DollarSign,
  Package,
  Tag,
  User,
  Layers,
  Warehouse,
  Percent,
  CheckCircle,
  AlertCircle,
  X,
  Eye,
  ShoppingCart
} from "lucide-react";
import { toast } from "react-toastify";
import useAxiosSecure from "../hooks/useAxiosSecure";


// Static baby categories data
const staticBabyCategories = [
  { _id: "1", name: "Bathing", icon: "🚿", color: "from-blue-500 to-cyan-500" },
  { _id: "2", name: "Bath & Body", icon: "❤️", color: "from-pink-500 to-rose-500" },
  { _id: "3", name: "Clothing", icon: "👕", color: "from-purple-500 to-indigo-500" },
  { _id: "4", name: "Diapering", icon: "👶", color: "from-green-500 to-emerald-500" },
  { _id: "5", name: "Feeding", icon: "🍼", color: "from-orange-500 to-amber-500" },
  { _id: "6", name: "Baby Oil", icon: "🚗", color: "from-teal-500 to-cyan-500" },
  { _id: "7", name: "Baby Loson", icon: "🛡️", color: "from-red-500 to-orange-500" },
  { _id: "8", name: "Strollers", icon: "🌙", color: "from-indigo-500 to-purple-500" },
  { _id: "9", name: "Toys", icon: "🧸", color: "from-yellow-500 to-orange-500" }
];

const AddProduct = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories] = useState(staticBabyCategories);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

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
    status: "active",
    featured: false
  });

  const ageRanges = [
    "0-3 Months",
    "3-6 Months", 
    "6-12 Months",
    "1-2 Years",
    "2-4 Years",
    "4+ Years"
  ];

  // Fetch products
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

  // Filter by category
  useEffect(() => {
    if (selectedCategory) {
      const filtered = products.filter((p) => p.category === selectedCategory);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory, products]);

  // Image Upload Handler
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
    setPreviewImage(previewUrl);

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
        setFormData((prev) => ({ ...prev, image: data.data.display_url }));
        toast.success("🖼️ Image uploaded successfully!");
      } else {
        setFormData((prev) => ({ ...prev, image: "" }));
        setPreviewImage("");
        toast.error("❌ Image upload failed");
      }
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      setFormData((prev) => ({ ...prev, image: "" }));
      setPreviewImage("");
      toast.error("❌ Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Input Handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
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

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Validation
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

  // Calculate discounted price
  const calculateDiscountedPrice = () => {
    const price = parseFloat(formData.price) || 0;
    const discount = parseFloat(formData.discount) || 0;
    return price - (price * discount / 100);
  };

  // Submit Handler
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
        updatedAt: new Date(),
        rating: 0,
        reviewCount: 0,
        soldCount: 0
      };

      const res = await axiosSecure.post("/products", productData);

      if (res.data.success) {
        setSuccess(true);
        toast.success("🎉 Product added successfully!");
        
        // Reset form
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
          status: "active",
          featured: false
        });
        setPreviewImage("");
        
        fetchProducts();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        toast.error(res.data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("❌ Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Add New Product
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Add premium baby products to your inventory with detailed information and high-quality images
          </p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl flex items-center space-x-4 shadow-lg"
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="text-white text-xl" />
              </div>
              <div>
                <p className="text-green-800 font-semibold text-lg">Product Added Successfully!</p>
                <p className="text-green-600">The product has been added to your inventory.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Basic Information Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <Package className="text-pink-500" />
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                          errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-pink-500'
                        }`}
                        placeholder="e.g., Baby Onesie Set"
                      />
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                          <AlertCircle size={16} />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Brand */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Brand *
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                          errors.brand ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-pink-500'
                        }`}
                        placeholder="e.g., BabyCare Pro"
                      />
                      {errors.brand && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                          <AlertCircle size={16} />
                          {errors.brand}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                          errors.category ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-pink-500'
                        }`}
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category.name}>
                            {category.icon} {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                          <AlertCircle size={16} />
                          {errors.category}
                        </p>
                      )}
                    </div>

                    {/* Age Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Age Range *
                      </label>
                      <select
                        name="ageRange"
                        value={formData.ageRange}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                          errors.ageRange ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-pink-500'
                        }`}
                      >
                        <option value="">Select Age Range</option>
                        {ageRanges.map((age) => (
                          <option key={age} value={age}>{age}</option>
                        ))}
                      </select>
                      {errors.ageRange && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                          <AlertCircle size={16} />
                          {errors.ageRange}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing & Stock Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <DollarSign className="text-green-500" />
                    Pricing & Stock
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                          errors.price ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-pink-500'
                        }`}
                        placeholder="0.00"
                      />
                      {errors.price && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                          <AlertCircle size={16} />
                          {errors.price}
                        </p>
                      )}
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        min="0"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                          errors.stock ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-pink-500'
                        }`}
                        placeholder="0"
                      />
                      {errors.stock && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                          <AlertCircle size={16} />
                          {errors.stock}
                        </p>
                      )}
                    </div>

                    {/* Discount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                        placeholder="0"
                      />
                      {formData.discount > 0 && formData.price > 0 && (
                        <p className="mt-2 text-sm text-green-600 font-medium">
                          Discounted: ${calculateDiscountedPrice().toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Featured Product */}
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Mark as Featured Product
                    </label>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <ImageIcon className="text-purple-500" />
                    Product Image
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upload Area */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Upload Image *
                      </label>
                      <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                        errors.image ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-pink-500 hover:bg-pink-50'
                      }`}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          {uploading ? (
                            <div className="flex flex-col items-center space-y-3">
                              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                              <p className="text-pink-600 font-medium">Uploading...</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center space-y-3">
                              <Upload className="text-gray-400 text-2xl" />
                              <div>
                                <p className="text-gray-600 font-medium">Click to upload</p>
                                <p className="text-gray-500 text-sm">PNG, JPG, WEBP up to 5MB</p>
                              </div>
                            </div>
                          )}
                        </label>
                      </div>
                      {errors.image && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                          <AlertCircle size={16} />
                          {errors.image}
                        </p>
                      )}
                    </div>

                    {/* Preview Area */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Image Preview
                      </label>
                      <div className="border-2 border-gray-200 rounded-2xl p-4 h-full flex items-center justify-center">
                        {previewImage || formData.image ? (
                          <div className="relative">
                            <img
                              src={formData.image || previewImage}
                              alt="Preview"
                              className="w-48 h-48 object-cover rounded-xl shadow-lg"
                            />
                            {formData.image && (
                              <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full">
                                <CheckCircle size={16} />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center text-gray-400">
                            <ImageIcon size={48} className="mx-auto mb-2" />
                            <p>No image selected</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description & Features */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <Tag className="text-orange-500" />
                    Description & Features
                  </h3>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                        errors.description ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-pink-500'
                      }`}
                      placeholder="Describe the product features, benefits, and specifications..."
                    ></textarea>
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                        <AlertCircle size={16} />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Product Features
                    </label>
                    <input
                      type="text"
                      onChange={handleFeatureChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                      placeholder="Enter features separated by commas (e.g., Soft material, Machine washable)"
                    />
                    
                    {/* Features Tags */}
                    {formData.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.features.map((feature, index) => (
                          <motion.span
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-sm flex items-center space-x-2"
                          >
                            <span>{feature}</span>
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
                              className="hover:text-pink-200 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                  <motion.button
                    type="button"
                    onClick={() => navigate("/admin/manage-products")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium flex items-center space-x-2"
                  >
                    <X size={20} />
                    <span>Cancel</span>
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center space-x-3 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Adding Product...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={20} />
                        <span>Add Product</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Layers className="text-blue-500" />
                Filter Products
              </h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-600 mt-3 flex items-center gap-2">
                <Package size={16} />
                Showing {filteredProducts.length} products
              </p>
            </motion.div>

            {/* Recent Products */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingCart className="text-green-500" />
                Recent Products
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredProducts.slice(0, 8).map((product) => (
                  <motion.div
                    key={product._id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:border-pink-300 transition-all cursor-pointer"
                    onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600">${product.price}</p>
                    </div>
                    <Eye size={16} className="text-gray-400" />
                  </motion.div>
                ))}

                {filteredProducts.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <Package size={48} className="mx-auto mb-3 text-gray-300" />
                    <p>No products found</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-xl p-6 text-white"
            >
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Total Products</span>
                  <span className="font-bold">{products.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Categories</span>
                  <span className="font-bold">{categories.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>In Stock</span>
                  <span className="font-bold">
                    {products.filter(p => p.stock > 0).length}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;