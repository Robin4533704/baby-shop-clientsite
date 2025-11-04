import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Heart, ShoppingCart, Share2, CreditCard, MessageCircle 
} from "lucide-react";

const ProductActions = ({
  product,
  quantity,
  isWishlisted,
  onAddToCart,
  onWishlistToggle,
  onOrderNow,
  onShare,
  onWhatsAppOrder
}) => {
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [orderingNow, setOrderingNow] = useState(false);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await onAddToCart();
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    setAddingToWishlist(true);
    try {
      await onWishlistToggle();
    } finally {
      setAddingToWishlist(false);
    }
  };

  const handleOrderNow = async () => {
    setOrderingNow(true);
    try {
      await onOrderNow();
    } finally {
      setOrderingNow(false);
    }
  };

  return (
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
        className={`flex-1 flex items-center justify-center gap-2 md:gap-2 px-4 md:px-6 py-3 md:py-4   rounded-xl md:rounded-2xl font-semibold text-base md:text-lg shadow-lg md:shadow-xl transition-all duration-300 ${
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
            ? "Out of Stock"
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
        onClick={onWhatsAppOrder}
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
          onClick={onShare}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 md:p-4 rounded-xl md:rounded-2xl border-2 border-slate-200 bg-white text-slate-600 hover:border-purple-200 hover:text-purple-600 hover:shadow-lg transition-all duration-300"
        >
          <Share2 className="w-5 h-5 md:w-6 md:h-6" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductActions;