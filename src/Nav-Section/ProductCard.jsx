import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CartButton from "./../cartbutton/CartButton";
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

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); // 🔑 এখন user সবসময় পাওয়া যাবে

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!user) return alert("Please login to add to wishlist");
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = () => {
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
      whileHover={{ y: -5 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 overflow-hidden cursor-pointer"
      onClick={handleQuickView}
    >
      {/* Image & Labels */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/80 p-4 md:p-6 flex items-center justify-center">
        <img
          src={product.image || "https://via.placeholder.com/300x300?text=No+Image"}
          alt={product.name}
          className="w-full h-48 object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {/* Wishlist */}
        <div className="absolute top-4 right-4">
          <button
            onClick={handleWishlist}
            className={`rounded-full p-2 shadow-lg transition-colors duration-300 ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500"
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Discount */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
            -{discountPercent}%
          </div>
        )}

        {/* Out of Stock */}
        {!isInStock && (
          <div className="absolute top-3 left-3 bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 md:p-6 space-y-2">
        <h3 className="font-bold text-gray-900 text-base md:text-lg line-clamp-1">{product.name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-start space-x-2">
          <StarRating rating={product.rating || 0} />
          <span className="text-sm text-gray-500">({product.reviewCount || 0})</span>
        </div>

        {isInStock && stockQuantity > 0 && (
          <div className="text-xs text-green-600 font-medium">
            {stockQuantity < 10 ? `Only ${stockQuantity} left in stock` : "In Stock"}
          </div>
        )}

        {/* Price & Cart */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg md:text-xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
            )}
          </div>

          {/* CartButton */}
          <CartButton product={product} user={user} isInStock={product.stock > 0} />

        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
