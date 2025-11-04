import React from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

// Import sub-components
import ProductHeader from "./ProductHeader";
import ProductPricing from "./ProductPricing";
import ProductFeatures from "./ProductFeatures";
import QuantitySelector from "./QuantitySelector";
import ProductActions from "./ProductActions";
import TrustBadges from "./TrustBadges";
import DeliveryEstimate from "./DeliveryEstimate";

const ProductInfo = ({
  product,
  quantity,
  isWishlisted,
  reviews,
  onIncrementQuantity,
  onDecrementQuantity,
  onAddToCart,
  onWishlistToggle,
  onOrderNow
}) => {
  const totalPrice = product?.price * quantity;

  const handleShare = async () => {
    try {
      const shareData = {
        title: product.name,
        text: product.shortDescription || product.description,
        url: window.location.href,
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success("📤 Shared successfully!");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("🔗 Link copied to clipboard!");
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("🔗 Link copied to clipboard!");
      }
    }
  };

  const handleWhatsAppOrder = () => {
    const phone = "+8801969453361";
    const message = `🛒 Order Inquiry from BabyShop

Product: ${product.name}
Quantity: ${quantity}
Unit Price: ৳${product.price?.toLocaleString()}
Total: ৳${totalPrice?.toLocaleString()}

Product URL: ${window.location.href}

Please confirm availability and delivery details.`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div 
      className="space-y-6 md:space-y-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Product Header */}
      <ProductHeader product={product} reviews={reviews} />

      {/* Pricing */}
      <ProductPricing product={product} />

      {/* Description */}
      <motion.p 
        className="text-base md:text-lg text-slate-600 leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {product.shortDescription || product.description}
      </motion.p>

      {/* Key Features */}
      <ProductFeatures features={product.features} />

      {/* Quantity Selector */}
      <QuantitySelector 
        quantity={quantity}
        stock={product.stock}
        totalPrice={totalPrice}
        onIncrement={onIncrementQuantity}
        onDecrement={onDecrementQuantity}
      />

      {/* Action Buttons */}
      <ProductActions 
        product={product}
        quantity={quantity}
        isWishlisted={isWishlisted}
        onAddToCart={onAddToCart}
        onWishlistToggle={onWishlistToggle}
        onOrderNow={onOrderNow}
        onShare={handleShare}
        onWhatsAppOrder={handleWhatsAppOrder}
      />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Delivery Estimate */}
      <DeliveryEstimate />
    </motion.div>
  );
};

export default ProductInfo;