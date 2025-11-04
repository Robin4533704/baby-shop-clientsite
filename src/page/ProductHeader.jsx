import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const ProductHeader = ({ product, reviews = [] }) => {
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const stockColor = product?.stock > 10 ? "text-green-600" : 
                    product?.stock > 0 ? "text-yellow-600" : "text-red-600";

  return (
    <>
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

      {/* Rating & Reviews */}
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
        <span className="text-slate-600 text-sm md:text-base">
          {reviews.length} review{reviews.length !== 1 ? 's' : ''}
        </span>
        <span className="text-slate-500 hidden md:block">•</span>
        <span className={`font-semibold ${stockColor} text-sm md:text-base`}>
          {product.stock > 0 ? `${product.stock} available` : "Out of Stock"}
        </span>
      </motion.div>
    </>
  );
};

export default ProductHeader;