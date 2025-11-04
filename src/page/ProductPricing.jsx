import React from "react";
import { motion } from "framer-motion";

const ProductPricing = ({ product }) => {
  const discountPercent = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
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
  );
};

export default ProductPricing;