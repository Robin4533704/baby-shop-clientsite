// components/ProductDetails/ProductDetails.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  ArrowLeft, 
  Plus, 
  Minus, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  Zap,
  Check,
  Clock,
  MapPin,
  MessageCircle,
  CreditCard
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../Nav-Section/ProductCard";
import { toast } from "react-toastify";
import useAxiosSecure from "../hooks/useAxiosSecure";


const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    userName: "",
    rating: 5,
    comment: ""
  });
  const [imageLoading, setImageLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [orderingNow, setOrderingNow] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);

  
useEffect(() => {
  const fetchProduct = async () => {
    console.log("✅ Fetching product for ID:", id);
    setLoading(true);

    try {
      const res = await axiosSecure.get(`/products/${id}`);
      console.log("API Response >>", res);

      if (res.data.success && res.data.product) {
        const productData = res.data.product;
        setProduct(productData);
        setSelectedImage(0);

        console.log("📝 Fetching reviews for:", productData._id);
        await fetchReviews(productData._id);

        console.log("❤️ Checking wishlist status:", productData._id);
        await checkWishlistStatus(productData._id);
      } else {
        console.warn("⚠️ Product not found in DB");
        toast.error("Product not found");
      }
    } catch (error) {
      console.error("❌ Product Fetch Error:", error);
      toast.error("Unable to load product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    console.log("🎯 Product ID exists, calling fetch..");
    fetchProduct();
  }
}, [id]);
  // Check if product is in wishlist
  const checkWishlistStatus = async (productId) => {
    try {
      // Replace with your actual wishlist API
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setIsWishlisted(wishlist.includes(productId));
    } catch (error) {
      console.error("Wishlist check error:", error);
    }
  };

  // Enhanced reviews fetching
  const fetchReviews = async (productId) => {
    try {
      const res = await axiosSecure.get(`/reviews/product/${productId}`);
      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (error) {
      console.error("❌ Reviews Fetch Error:", error);
    }
  };

  // Enhanced related products fetching
  useEffect(() => {
    if (!product?.category) return;
    
    const fetchRelated = async () => {
      try {
        const res = await axiosSecure.get(`/products/category/${product.category}?limit=4`);
        if (res.data.success) {
          const filtered = res.data.data
            .filter(p => p._id !== product._id)
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error("Related Products Error:", error);
      }
    };
    fetchRelated();
  }, [product, axiosSecure]);

  // Enhanced quantity handlers
  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, product.stock));
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  // Enhanced add to cart with proper API integration
  const handleAddToCart = async () => {
    if (product.stock === 0) {
      toast.error("🚫 This product is currently out of stock!");
      return;
    }

    setAddingToCart(true);
    try {
      // Replace with your actual cart API
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = cart.findIndex(item => item.id === product._id);
      
      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
      } else {
        cart.push({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || product.image,
          quantity: quantity,
          stock: product.stock
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      
      toast.success(
        <div className="flex items-center space-x-2">
          <ShoppingCart className="w-5 h-5" />
          <span>Added {quantity} × {product.name} to cart!</span>
        </div>,
        { icon: "🛒" }
      );
    } catch (error) {
      toast.error("❌ Failed to add item to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

const handleOrderNow = async () => {
  // Check if product exists
  if (!product) {
    toast.error("❌ Product data not available!");
    return;
  }

  const currentQuantity = quantity || 1; // Default quantity 1

  // Check stock
  if (product.stock === 0) {
    toast.error("🚫 Sorry, this product is out of stock!");
    return;
  }

  if (currentQuantity > product.stock) {
    toast.error(`🚫 Only ${product.stock} units available!`);
    return;
  }

  setOrderingNow(true); // Show loading state

  try {
    // Optional delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Navigate to checkout page with product ID and quantity
    navigate(`/checkout/${product._id}?quantity=${currentQuantity}`);
  } catch (error) {
    console.error("Order Error:", error);
    toast.error("❌ Failed to process order. Please try again.");
  } finally {
    setOrderingNow(false); // Remove loading state
  }
};



  // Enhanced wishlist functionality
  const handleWishlist = async () => {
    setAddingToWishlist(true);
    try {
      // Replace with your actual wishlist API
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      
      if (isWishlisted) {
        const updatedWishlist = wishlist.filter(item => item !== product._id);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      } else {
        wishlist.push(product._id);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
      }
      
      setIsWishlisted(!isWishlisted);
      
      toast.success(
        !isWishlisted ? 
        "❤️ Added to your wishlist!" : 
        "💔 Removed from wishlist",
        { icon: !isWishlisted ? "❤️" : "💔" }
      );
    } catch (error) {
      toast.error("❌ Failed to update wishlist");
    } finally {
      setAddingToWishlist(false);
    }
  };

  // Enhanced share functionality
  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: product.shortDescription || product.description,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success("📤 Shared successfully!");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("🔗 Product link copied to clipboard!");
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("🔗 Link copied to clipboard!");
      }
    }
  };

  // Image navigation
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  // Enhanced review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!newReview.userName.trim() || !newReview.comment.trim()) {
      toast.error("📝 Please fill in all required fields!");
      return;
    }

    try {
      const reviewData = {
        productId: product._id,
        userName: newReview.userName.trim(),
        rating: newReview.rating,
        comment: newReview.comment.trim(),
      };

      const res = await axiosSecure.post("/reviews", reviewData);
      
      if (res.data.success) {
        toast.success(
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span>Thank you for your review!</span>
          </div>
        );
        
        setReviews(prev => [res.data.data, ...prev]);
        setNewReview({ userName: "", rating: 5, comment: "" });
      } else {
        toast.error(res.data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Review Submit Error:", error);
      toast.error("❌ Unable to submit review. Please try again.");
    }
  };

  // Enhanced WhatsApp order with better message formatting
  const handleWhatsAppOrder = () => {
    const phone = "+8801969453361";
    const message = `🛒 Order Inquiry from BabyShop

Product: ${product.name}
Quantity: ${quantity}
Unit Price: ৳${product.price?.toLocaleString()}
Total: ৳${(product.price * quantity)?.toLocaleString()}

Product URL: ${window.location.href}

Please confirm availability and delivery details.`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (loading || !product) {
    return <ProductDetailsLoading />;
  }

  // Calculate derived values
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || "/api/placeholder/600/600"];

  const stockStatus = product.stock > 10 ? "In Stock" : 
                     product.stock > 0 ? "Low Stock" : "Out of Stock";
  
  const stockColor = product.stock > 10 ? "text-green-600" : 
                    product.stock > 0 ? "text-yellow-600" : "text-red-600";

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const totalPrice = product.price * quantity;

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4 md:py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        
        {/* Enhanced Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 md:mb-8"
        >
          <motion.button 
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.02, x: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center space-x-2 md:space-x-3 text-slate-600 hover:text-slate-900 transition-colors duration-200 bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 md:px-4 py-2 md:py-3 shadow-sm border border-slate-200 text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-semibold">Back to Products</span>
          </motion.button>
        </motion.div>

        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mb-12 md:mb-16">
          
          {/* Enhanced Image Gallery */}
          <div className="space-y-4 md:space-y-6">
            {/* Main Image Container */}
            <motion.div 
              className="bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-2xl p-4 md:p-6 flex items-center justify-center min-h-[400px] md:min-h-[550px] relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain max-h-[350px] md:max-h-[450px] transition-opacity duration-300 cursor-zoom-in"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  onLoad={() => setImageLoading(false)}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop";
                  }}
                  onClick={() => setShowImageZoom(true)}
                />
              </AnimatePresence>

              {/* Image Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.95)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevImage}
                    className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg md:shadow-2xl border border-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-slate-700" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.95)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextImage}
                    className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg md:shadow-2xl border border-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-slate-700" />
                  </motion.button>
                </>
              )}

              {/* Enhanced Discount Badge */}
              {discountPercent > 0 && (
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="absolute top-3 md:top-4 left-3 md:left-4 bg-gradient-to-r from-red-500 to-pink-600 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-bold shadow-lg z-10"
                >
                  🔥 {discountPercent}% OFF
                </motion.div>
              )}

              {/* Stock Status Badge */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`absolute top-3 md:top-4 right-3 md:right-4 px-2 md:px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${
                  product.stock > 10 ? "bg-green-500/20 text-green-700 border-green-500/30" :
                  product.stock > 0 ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" :
                  "bg-red-500/20 text-red-700 border-red-500/30"
                }`}
              >
                {stockStatus}
              </motion.div>

              {/* Image Counter */}
              {productImages.length > 1 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm backdrop-blur-sm"
                >
                  {selectedImage + 1} / {productImages.length}
                </motion.div>
              )}
            </motion.div>

            {/* Enhanced Thumbnail Gallery */}
            {productImages.length > 1 && (
              <motion.div 
                className="flex space-x-2 md:space-x-3 overflow-x-auto pb-2 md:pb-4 scrollbar-hide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {productImages.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                      selectedImage === index 
                        ? 'border-pink-500 shadow-lg shadow-pink-500/20 ring-2 ring-pink-500/30' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=150&h=150&fit=crop";
                      }}
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Enhanced Product Information */}
          <motion.div 
            className="space-y-6 md:space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Category & Brand */}
            <div className="flex items-center space-x-3 text-sm">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-200 text-slate-700 px-2 md:px-3 py-1 rounded-full font-medium text-xs md:text-sm"
              >
                {product.category || "Uncategorized"}
              </motion.span>
              {product.brand && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-slate-500 font-medium text-xs md:text-sm"
                >
                  by {product.brand}
                </motion.span>
              )}
            </div>

            {/* Product Name */}
            <motion.h1 
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {product.name}
            </motion.h1>

            {/* Enhanced Rating & Reviews */}
            <motion.div 
              className="flex items-center space-x-4 flex-wrap gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[1,2,3,4,5].map(star => (
                    <Star 
                      key={star}
                      className={`w-4 h-4 md:w-5 md:h-5 ${
                        star <= averageRating 
                          ? "text-yellow-400 fill-current" 
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-base md:text-lg font-semibold text-slate-700">{averageRating}</span>
              </div>
              <span className="text-slate-500 hidden md:block">•</span>
              <button 
                onClick={() => setActiveTab("reviews")}
                className="text-slate-600 hover:text-pink-600 transition-colors duration-200 text-sm md:text-base"
              >
                {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </button>
              <span className="text-slate-500 hidden md:block">•</span>
              <span className={`font-semibold ${stockColor} text-sm md:text-base`}>
                {stockStatus} {product.stock > 0 && `(${product.stock} available)`}
              </span>
            </motion.div>

            {/* Enhanced Price Section */}
            <motion.div 
              className="flex items-center space-x-3 md:space-x-4 flex-wrap gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900">
                ৳{product.price?.toLocaleString()}
              </span>

              {discountPercent > 0 && product.originalPrice && (
                <>
                  <span className="text-xl md:text-2xl text-slate-500 line-through">
                    ৳{product.originalPrice?.toLocaleString()}
                  </span>
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold"
                  >
                    Save ৳{(product.originalPrice - product.price)?.toLocaleString()}
                  </motion.span>
                </>
              )}
            </motion.div>

            {/* Enhanced Short Description */}
            <motion.p 
              className="text-base md:text-lg text-slate-600 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {product.shortDescription || product.description}
            </motion.p>

            {/* Enhanced Key Features */}
            {product.features && product.features.length > 0 && (
              <motion.div 
                className="space-y-3 md:space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h3 className="font-semibold text-slate-900 text-lg md:text-xl">Key Features:</h3>
                <div className="grid grid-cols-1 gap-2 md:gap-3">
                  {product.features.slice(0, 6).map((feature, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-center space-x-2 md:space-x-3 text-slate-700 text-sm md:text-base"
                    >
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex-shrink-0"></div>
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Enhanced Quantity Selector */}
            <motion.div 
              className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6">
                {/* Quantity Section */}
                <div className="flex items-center space-x-4 md:space-x-6">
                  <span className="text-base md:text-lg font-semibold text-slate-900">Quantity:</span>
                  <div className="flex items-center space-x-2 md:space-x-3 bg-slate-50 rounded-xl md:rounded-2xl p-1.5 md:p-2">
                    <motion.button 
                      onClick={decrementQuantity}
                      whileHover={{ scale: 1.1, backgroundColor: "rgb(241 245 249)" }}
                      whileTap={{ scale: 0.9 }}
                      disabled={quantity <= 1}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-slate-200"
                    >
                      <Minus className="w-3 h-3 md:w-4 md:h-4 text-slate-700" />
                    </motion.button>

                    <motion.span 
                      key={quantity}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-lg md:text-xl font-bold w-8 md:w-12 text-center text-slate-900"
                    >
                      {quantity}
                    </motion.span>

                    <motion.button 
                      onClick={incrementQuantity}
                      whileHover={{ scale: 1.1, backgroundColor: "rgb(241 245 249)" }}
                      whileTap={{ scale: 0.9 }}
                      disabled={quantity >= product.stock}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-slate-200"
                    >
                      <Plus className="w-3 h-3 md:w-4 md:h-4 text-slate-700" />
                    </motion.button>
                  </div>
                  
                  {product.stock > 0 && (
                    <span className="text-xs md:text-sm text-slate-500">
                      {product.stock} units available
                    </span>
                  )}
                </div>

                {/* Total Price */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                  <div className="text-center sm:text-right">
                    <div className="text-xs md:text-sm text-slate-500">Total Price</div>
                    <div className="text-xl md:text-2xl font-bold text-slate-900">
                      ৳{totalPrice.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Action Buttons */}
            <motion.div
              className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              {/* Add to Cart Button */}
              <motion.button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                whileHover={{ scale: product.stock === 0 ? 1 : 1.02 }}
                whileTap={{ scale: product.stock === 0 ? 1 : 0.98 }}
                className={`flex-1 flex items-center justify-center gap-2 md:gap-3 py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl font-semibold text-base md:text-lg shadow-lg md:shadow-xl transition-all duration-300 ${
                  product.stock === 0
                    ? "bg-slate-400 text-slate-200 cursor-not-allowed"
                    : addingToCart
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                    : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {addingToCart ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 md:w-6 md:h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                )}
                <span>
                  {product.stock === 0
                    ? "In a Stock"
                    : addingToCart
                    ? "Adding..."
                    : `Add Cart`}
                </span>
              </motion.button>

              {/* Order Now Button */}
              <motion.button
                onClick={handleOrderNow}
                disabled={orderingNow || product.stock === 0}
                whileHover={{ scale: product.stock === 0 ? 1 : 1.05 }}
                whileTap={{ scale: product.stock === 0 ? 1 : 0.95 }}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 shadow-lg transition-all duration-300 min-w-[120px] md:min-w-[140px]"
              >
                {orderingNow ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
                )}
                <span className="text-sm md:text-base">
                  {product.stock === 0 
                    ? "Out of Stock" 
                    : orderingNow 
                    ? "Processing..." 
                    : "Order Now"}
                </span>
              </motion.button>

              {/* WhatsApp Order Button */}
              <motion.button
                onClick={handleWhatsAppOrder}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl font-semibold text-base md:text-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 md:gap-3"
              >
                <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
                <span>WhatsApp</span>
              </motion.button>

              {/* Wishlist & Share Buttons */}
              <div className="flex gap-3 md:gap-4 md:flex-col">
                <motion.button
                  onClick={handleWishlist}
                  disabled={addingToWishlist}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all duration-300 ${
                    isWishlisted
                      ? "bg-red-50 border-red-200 text-red-600 shadow-lg shadow-red-500/20"
                      : "bg-white border-slate-200 text-slate-600 hover:border-red-200 hover:text-red-600 hover:shadow-lg"
                  } ${addingToWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {addingToWishlist ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 md:w-6 md:h-6 border-2 border-current border-t-transparent rounded-full"
                    />
                  ) : (
                    <Heart className={`w-5 h-5 md:w-6 md:h-6 ${isWishlisted ? "fill-current" : ""}`} />
                  )}
                </motion.button>

                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 md:p-4 rounded-xl md:rounded-2xl border-2 border-slate-200 bg-white text-slate-600 hover:border-purple-200 hover:text-purple-600 hover:shadow-lg transition-all duration-300"
                >
                  <Share2 className="w-5 h-5 md:w-6 md:h-6" />
                </motion.button>
              </div>
            </motion.div>

            {/* Enhanced Trust Badges */}
            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 pt-4 md:pt-6 border-t border-slate-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              {[
                { icon: Truck, text: "Free Shipping", color: "text-green-600", desc: "Over ৳1000" },
                { icon: RotateCcw, text: "Easy Returns", color: "text-blue-600", desc: "30 Days" },
                { icon: Shield, text: "2-Year Warranty", color: "text-purple-600", desc: "Guaranteed" },
                { icon: Zap, text: "Fast Delivery", color: "text-orange-600", desc: "2-4 Days" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="flex items-start space-x-2 md:space-x-3 p-2 md:p-3 rounded-lg md:rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors duration-200"
                >
                  <item.icon className={`w-4 h-4 md:w-5 md:h-5 ${item.color} mt-0.5 flex-shrink-0`} />
                  <div>
                    <div className="font-semibold text-slate-900 text-xs md:text-sm">{item.text}</div>
                    <div className="text-xs text-slate-500">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Delivery Estimate */}
            <motion.div 
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-blue-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 }}
            >
              <div className="flex items-center space-x-2 md:space-x-3">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900 text-sm md:text-base">Delivery Estimate</div>
                  <div className="text-xs md:text-sm text-slate-600">2-4 business days • Free shipping over ৳1000</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Tabs Section */}
        <motion.div 
          className="mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="border-b border-slate-200 overflow-x-auto scrollbar-hide">
            <nav className="flex space-x-4 md:space-x-8 min-w-max">
              {[
                { id: "description", label: "Description", icon: null },
                { id: "specifications", label: "Specifications", icon: null },
                { id: "reviews", label: `Reviews (${reviews.length})`, icon: null }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`py-3 md:py-4 px-2 md:px-1 font-medium text-sm border-b-2 transition-all duration-300 flex items-center space-x-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-pink-500 text-pink-600 bg-pink-50/50 rounded-t-lg px-3"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50 rounded-t-lg px-3"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </nav>
          </div>

          <div className="py-6 md:py-8">
            <AnimatePresence mode="wait">
              {activeTab === "description" && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="prose max-w-none"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6">Product Description</h3>
                  <p className="text-slate-600 leading-relaxed text-base md:text-lg">{product.description}</p>
                  
                  {product.features && product.features.length > 0 && (
                    <div className="mt-6 md:mt-8">
                      <h4 className="text-lg md:text-xl font-semibold text-slate-900 mb-3 md:mb-4">Key Features</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                        {product.features.map((feature, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center space-x-2 md:space-x-3 bg-slate-50 rounded-lg md:rounded-xl p-3 md:p-4 hover:bg-slate-100 transition-colors duration-200"
                          >
                            <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
                            <span className="text-slate-700 text-sm md:text-base">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "specifications" && (
                <motion.div
                  key="specifications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6">Specifications</h3>
                  <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-3 md:space-y-4">
                        <div className="flex justify-between border-b border-slate-100 pb-2 md:pb-3">
                          <span className="text-slate-600 font-medium text-sm md:text-base">Category</span>
                          <span className="font-semibold text-slate-900 text-sm md:text-base">{product.category || "N/A"}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-2 md:pb-3">
                          <span className="text-slate-600 font-medium text-sm md:text-base">Brand</span>
                          <span className="font-semibold text-slate-900 text-sm md:text-base">{product.brand || "N/A"}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-2 md:pb-3">
                          <span className="text-slate-600 font-medium text-sm md:text-base">SKU</span>
                          <span className="font-semibold text-slate-900 text-sm md:text-base">{product.sku || "N/A"}</span>
                        </div>
                      </div>
                      <div className="space-y-3 md:space-y-4">
                        <div className="flex justify-between border-b border-slate-100 pb-2 md:pb-3">
                          <span className="text-slate-600 font-medium text-sm md:text-base">Weight</span>
                          <span className="font-semibold text-slate-900 text-sm md:text-base">{product.weight || "N/A"}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-2 md:pb-3">
                          <span className="text-slate-600 font-medium text-sm md:text-base">Warranty</span>
                          <span className="font-semibold text-slate-900 text-sm md:text-base">{product.warranty || "1 Year"}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-2 md:pb-3">
                          <span className="text-slate-600 font-medium text-sm md:text-base">In Stock</span>
                          <span className="font-semibold text-slate-900 text-sm md:text-base">{product.stock} units</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 md:space-y-8"
                >
                  {/* Enhanced Review Summary */}
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-200">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                      <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-slate-900">{averageRating}</div>
                        <StarRating rating={parseFloat(averageRating)} />
                        <div className="text-slate-600 mt-2 text-sm md:text-base">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
                      </div>
                      <div className="flex-1 max-w-md">
                        {[5,4,3,2,1].map(rating => {
                          const count = reviews.filter(r => r.rating === rating).length;
                          const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                          return (
                            <div key={rating} className="flex items-center space-x-2 md:space-x-3 mb-1 md:mb-2">
                              <span className="text-xs md:text-sm text-slate-600 w-6 md:w-8">{rating}★</span>
                              <div className="flex-1 bg-slate-200 rounded-full h-1.5 md:h-2">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 1, delay: rating * 0.1 }}
                                  className="bg-yellow-400 h-1.5 md:h-2 rounded-full"
                                />
                              </div>
                              <span className="text-xs md:text-sm text-slate-600 w-8 md:w-12">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Review Form */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200"
                  >
                    <h4 className="text-lg md:text-xl font-semibold text-slate-900 mb-3 md:mb-4">Share Your Experience</h4>
                    <form onSubmit={handleSubmitReview} className="space-y-3 md:space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1 md:mb-2">
                            Your Name *
                          </label>
                          <input 
                            type="text" 
                            placeholder="Enter your name" 
                            value={newReview.userName}
                            onChange={(e) => setNewReview({...newReview, userName: e.target.value})}
                            className="w-full border border-slate-200 rounded-lg md:rounded-xl p-2 md:p-3 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1 md:mb-2">
                            Your Rating *
                          </label>
                          <select 
                            value={newReview.rating}
                            onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                            className="w-full border border-slate-200 rounded-lg md:rounded-xl p-2 md:p-3 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                            required
                          >
                            {[5,4,3,2,1].map(n => (
                              <option key={n} value={n}>
                                {n} ★ {n === 5 ? "Excellent" : n === 4 ? "Good" : n === 3 ? "Average" : n === 2 ? "Poor" : "Terrible"}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 md:mb-2">
                          Your Review *
                        </label>
                        <textarea 
                          placeholder="Share your thoughts about this product..." 
                          value={newReview.comment}
                          onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                          className="w-full border border-slate-200 rounded-lg md:rounded-xl p-2 md:p-3 h-20 md:h-24 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 resize-none text-sm md:text-base"
                          required 
                        />
                      </div>
                      <motion.button 
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-sm md:text-base"
                      >
                        Submit Review
                      </motion.button>
                    </form>
                  </motion.div>

                  {/* Enhanced Reviews List */}
                  <div className="space-y-4 md:space-y-6">
                    {reviews.length > 0 ? (
                      reviews.map((review, index) => (
                        <motion.div 
                          key={review._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-start space-x-3 md:space-x-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-base md:text-lg flex-shrink-0">
                              {review.userName?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 md:mb-2 gap-1 md:gap-2">
                                <div>
                                  <div className="font-semibold text-slate-900 text-base md:text-lg truncate">
                                    {review.userName || "Anonymous"}
                                  </div>
                                  <StarRating rating={review.rating} />
                                </div>
                                <div className="text-xs md:text-sm text-slate-400 flex items-center space-x-1">
                                  <Clock className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                                  <span>{new Date(review.createdAt).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}</span>
                                </div>
                              </div>
                              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm md:text-base">{review.comment}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 md:py-12 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-200"
                      >
                        <div className="text-4xl md:text-6xl mb-3 md:mb-4">💬</div>
                        <div className="text-slate-500 text-base md:text-lg font-semibold mb-1 md:mb-2">No reviews yet</div>
                        <div className="text-slate-400 text-sm md:text-base">Be the first to share your experience with this product!</div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Enhanced Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div 
            className="mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 md:mb-8 text-center">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <ProductCard product={relatedProduct} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Image Zoom Modal */}
        <AnimatePresence>
          {showImageZoom && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowImageZoom(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-4xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />
                <button
                  onClick={() => setShowImageZoom(false)}
                  className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Enhanced Star Rating Component
const StarRating = ({ rating }) => (
  <div className="flex items-center space-x-1">
    {[1,2,3,4,5].map(star => (
      <Star 
        key={star} 
        className={`w-4 h-4 md:w-5 md:h-5 ${
          star <= rating 
            ? "text-yellow-400 fill-current" 
            : "text-slate-300"
        }`} 
      />
    ))}
    <span className="ml-1 md:ml-2 text-xs md:text-sm font-medium text-slate-600">({rating.toFixed(1)})</span>
  </div>
);

// Enhanced Skeleton Loader
const ProductDetailsLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4 md:py-8">
    <div className="max-w-7xl mx-auto px-3 space-y-6 md:space-y-8">
      {/* Back Button Skeleton */}
      <div className="h-10 md:h-12 bg-slate-200 rounded-xl md:rounded-2xl w-28 md:w-32 animate-pulse"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-slate-200 rounded-2xl md:rounded-3xl h-[400px] md:h-[550px] animate-pulse"></div>
          <div className="flex space-x-2 md:space-x-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-16 h-16 md:w-20 md:h-20 bg-slate-200 rounded-xl md:rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
        
        {/* Product Info Skeleton */}
        <div className="space-y-4 md:space-y-6">
          <div className="space-y-3 md:space-y-4">
            <div className="h-3 md:h-4 bg-slate-200 rounded w-32 md:w-48 animate-pulse"></div>
            <div className="h-8 md:h-12 bg-slate-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 md:h-6 bg-slate-200 rounded w-24 md:w-32 animate-pulse"></div>
            <div className="h-6 md:h-8 bg-slate-200 rounded w-20 md:w-24 animate-pulse"></div>
          </div>
          <div className="space-y-2 md:space-y-3">
            <div className="h-3 md:h-4 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-3 md:h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
            <div className="h-3 md:h-4 bg-slate-200 rounded w-4/6 animate-pulse"></div>
          </div>
          <div className="h-10 md:h-12 bg-slate-200 rounded w-28 md:w-32 animate-pulse"></div>
          <div className="flex space-x-3 md:space-x-4">
            <div className="h-12 md:h-14 bg-slate-200 rounded flex-1 animate-pulse"></div>
            <div className="h-12 md:h-14 bg-slate-200 rounded w-12 md:w-14 animate-pulse"></div>
            <div className="h-12 md:h-14 bg-slate-200 rounded w-12 md:w-14 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetails;