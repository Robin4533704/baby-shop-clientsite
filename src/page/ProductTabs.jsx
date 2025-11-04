import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProductTabs = ({ 
  activeTab, 
  onTabChange, 
  product, 
  reviews, 
  onSubmitReview 
}) => {
  // Temporary implementation - আপনি আপনার existing tabs code এখানে add করুন
  return (
    <div className="mb-12 md:mb-16">
      <div className="border-b border-slate-200">
        <nav className="flex space-x-4 md:space-x-8">
          {['description', 'specifications', 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`py-3 px-1 font-medium border-b-2 ${
                activeTab === tab
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-slate-500"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'description' && (
            <motion.div
              key="description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <p className="text-slate-600">{product.description}</p>
            </motion.div>
          )}
          
          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <p>{reviews.length} reviews</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductTabs;