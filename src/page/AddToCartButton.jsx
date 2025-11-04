// components/Product/AddToCartButton.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';

const AddToCartButton = ({ product, quantity = 1, size = 'md', showIcon = true }) => {
  const { addToCart, items } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Check if product is already in cart
  const isInCart = items.some(item => item.id === product._id);

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      toast.error('🚫 This product is out of stock!');
      return;
    }

    setAdding(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      addToCart(product, quantity);
      
      setAdded(true);
      toast.success(
        <div className="flex items-center space-x-2">
          <ShoppingCart className="w-5 h-5" />
          <span>Added to cart! {quantity > 1 && `(${quantity} items)`}</span>
        </div>
      );

      // Reset added state after 2 seconds
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      toast.error('❌ Failed to add item to cart');
    } finally {
      setAdding(false);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };

  return (
    <motion.button
      onClick={handleAddToCart}
      disabled={adding || product.stock === 0 || added}
      whileHover={{ scale: product.stock === 0 ? 1 : 1.02 }}
      whileTap={{ scale: product.stock === 0 ? 1 : 0.98 }}
      className={`
        flex items-center justify-center space-x-2 font-semibold rounded-xl transition-all duration-300
        ${sizeClasses[size]}
        ${
          product.stock === 0
            ? 'bg-slate-400 text-slate-200 cursor-not-allowed'
            : added
            ? 'bg-green-600 text-white cursor-not-allowed'
            : adding
            ? 'bg-purple-600 text-white cursor-wait'
            : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
        }
      `}
    >
      {adding ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
        />
      ) : added ? (
        <Check className="w-5 h-5" />
      ) : (
        showIcon && <ShoppingCart className="w-5 h-5" />
      )}
      
      <span>
        {product.stock === 0
          ? 'Out of Stock'
          : adding
          ? 'Adding...'
          : added
          ? 'Added!'
          : isInCart
          ? 'Add More'
          : 'Add to Cart'}
      </span>
    </motion.button>
  );
};

export default AddToCartButton;