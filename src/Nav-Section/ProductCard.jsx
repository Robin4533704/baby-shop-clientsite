import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Star, ShoppingCart, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const StarRating = ({ rating }) => (
  <div className="flex items-center space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-4 h-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))}
  </div>
);

// Enhanced CartButton Component
const CartButton = ({ product, user }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      alert("Please login to add items to cart");
      return;
    }

    if (product.stock <= 0) {
      alert("This product is out of stock");
      return;
    }

    setIsAdding(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add to cart logic here
      console.log("Adding to cart:", product);
      
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
      
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.button
      onClick={handleAddToCart}
      disabled={isAdding || product.stock <= 0}
      whileHover={{ scale: product.stock > 0 ? 1.05 : 1 }}
      whileTap={{ scale: product.stock > 0 ? 0.95 : 1 }}
      className={`
        relative flex items-center justify-center p-3 rounded-xl font-semibold text-sm transition-all duration-300
        ${isAdded 
          ? 'bg-green-500 text-white shadow-lg' 
          : product.stock > 0 
            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-xl hover:from-pink-600 hover:to-purple-700' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }
        ${isAdding ? 'opacity-75 cursor-wait' : ''}
      `}
    >
      {/* Loading Animation */}
      {isAdding && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}

      {/* Success Checkmark */}
      {isAdded && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        </motion.div>
      )}

      {/* Default Content */}
      <motion.div
        animate={{ 
          opacity: isAdding || isAdded ? 0 : 1,
          scale: isAdding || isAdded ? 0.8 : 1 
        }}
        className="flex items-center space-x-2"
      >
        <ShoppingCart className="w-4 h-4" />
        <span>
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </span>
      </motion.div>

      {/* Pulse Effect on Success */}
      {isAdded && (
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-green-500 rounded-xl"
        />
      )}
    </motion.button>
  );
};

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isQuickViewHover, setIsQuickViewHover] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please login to add to wishlist");
      return;
    }
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    navigate(`/products/${product._id}`);
  };

  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isInStock = product.stock > 0;
  const stockQuantity = product.stock || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image & Labels */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/80 p-4 md:p-6 flex items-center justify-center">
        <img
          src={product.image || "https://via.placeholder.com/300x300?text=No+Image"}
          alt={product.name}
          className="w-full h-48 object-contain transition-transform duration-500 group-hover:scale-110"
        />

        {/* Top Right Actions */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          {/* Wishlist Button */}
          <motion.button
            onClick={handleWishlist}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`
              rounded-full p-2.5 shadow-lg backdrop-blur-sm transition-all duration-300
              ${isWishlisted
                ? "bg-red-500 text-white shadow-red-200"
                : "bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500"
              }
            `}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
          </motion.button>

          {/* Quick View Button */}
          <motion.button
            onClick={handleQuickView}
            onMouseEnter={() => setIsQuickViewHover(true)}
            onMouseLeave={() => setIsQuickViewHover(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="rounded-full p-2.5 bg-white/90 text-gray-600 shadow-lg backdrop-blur-sm hover:bg-blue-50 hover:text-blue-500 transition-all duration-300"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg"
          >
            -{discountPercent}% OFF
          </motion.div>
        )}

        {/* Out of Stock Overlay */}
        {!isInStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white/90 text-gray-800 px-4 py-2 rounded-full font-bold text-sm backdrop-blur-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick View Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity duration-300"
        >
          <motion.button
            onClick={handleQuickView}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-gray-800 px-6 py-3 rounded-full font-semibold shadow-lg flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Quick View</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-4 md:p-6 space-y-3">
        <h3 className="font-bold text-gray-900 text-lg line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {product.description || "Premium quality product with excellent features"}
        </p>

        {/* Rating and Reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <StarRating rating={product.rating || 4} />
            <span className="text-sm text-gray-500">({product.reviewCount || 12})</span>
          </div>
          
          {isInStock && stockQuantity > 0 && (
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              stockQuantity < 10 
                ? 'bg-orange-100 text-orange-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {stockQuantity < 10 ? `Only ${stockQuantity} left` : "In Stock"}
            </div>
          )}
        </div>

        {/* Price & Cart Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>

          {/* Enhanced Cart Button */}
          <div className="flex-shrink-0">
            <CartButton product={product} user={user} />
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>⭐ {product.rating || 4.0} Rating</span>
          <span>🛒 {product.soldCount || 45} Sold</span>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-200 rounded-2xl transition-all duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default ProductCard;