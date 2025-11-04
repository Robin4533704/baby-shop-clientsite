import React from "react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const QuantitySelector = ({ 
  quantity, 
  stock, 
  totalPrice, 
  onIncrement, 
  onDecrement 
}) => {
  return (
    <motion.div 
      className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6">
        <div className="flex items-center space-x-4 md:space-x-6">
          <span className="text-base md:text-lg font-semibold text-slate-900">Quantity:</span>
          <div className="flex items-center space-x-2 md:space-x-3 bg-slate-50 rounded-xl md:rounded-2xl p-1.5 md:p-2">
            <motion.button 
              onClick={onDecrement}
              whileHover={{ scale: 1.1 }}
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
              onClick={onIncrement}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={quantity >= stock}
              className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-slate-200"
            >
              <Plus className="w-3 h-3 md:w-4 md:h-4 text-slate-700" />
            </motion.button>
          </div>
          
          {stock > 0 && (
            <span className="text-xs md:text-sm text-slate-500">
              {stock} units available
            </span>
          )}
        </div>

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
  );
};

export default QuantitySelector;