import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductImageGallery = ({ product, images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageZoom, setShowImageZoom] = useState(false);

  // ✅ Safety check - যদি product না থাকে
  if (!product) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-2xl p-4 md:p-6 flex items-center justify-center min-h-[400px] md:min-h-[550px]">
          <p className="text-slate-500">Product image not available</p>
        </div>
      </div>
    );
  }

  const productImages = images.length > 0 
    ? images 
    : [product?.image || "/api/placeholder/600/600"];

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const discountPercent = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const stockStatus = product?.stock > 10 ? "In Stock" : 
                     product?.stock > 0 ? "Low Stock" : "Out of Stock";

  return (
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
            alt={product?.name || "Product image"}
            className="w-full h-full object-contain max-h-[350px] md:max-h-[450px] transition-opacity duration-300 cursor-zoom-in"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            onClick={() => setShowImageZoom(true)}
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop";
            }}
          />
        </AnimatePresence>

        {/* ... বাকি code unchanged */}
      </motion.div>

      {/* ... বাকি code unchanged */}
    </div>
  );
};

export default ProductImageGallery;