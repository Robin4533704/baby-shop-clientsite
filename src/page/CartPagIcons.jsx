// src/page/CartPage/CartPage.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ShoppingBag,
  CreditCard 
} from 'lucide-react';
import { useCart } from '../auth-layout/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CartPagIcons = () => {
  const { items, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId);
    toast.success(`Removed ${productName} from cart`);
  };

  const handleClearCart = () => {
    if (items.length === 0) return;
    
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast.success('Cart cleared successfully');
    }
  };

  const subtotal = getCartTotal();
  const shippingFee = subtotal > 1000 ? 0 : 60;
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <ShoppingCart className="w-12 h-12 text-slate-400" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Cart is Empty</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to find amazing products!
            </p>
            
            <div className="space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/products')}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                <ShoppingBag className="w-5 h-5 inline mr-2" />
                Start Shopping
              </motion.button>
              
              <button
                onClick={() => navigate(-1)}
                className="border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 inline mr-2" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Continue Shopping</span>
              </button>
              
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Shopping Cart</h1>
                <p className="text-slate-600 mt-1">
                  {getCartItemsCount()} {getCartItemsCount() === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearCart}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors duration-200"
            >
              <Trash2 className="w-5 h-5" />
              <span>Clear Cart</span>
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl border border-slate-200"
                    />

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-lg mb-1">
                        {item.name}
                      </h3>
                      
                      <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                        {item.brand && (
                          <span className="bg-slate-100 px-2 py-1 rounded">
                            {item.brand}
                          </span>
                        )}
                        {item.category && (
                          <span className="bg-slate-100 px-2 py-1 rounded">
                            {item.category}
                          </span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-2xl font-bold text-slate-900">
                        ৳{item.price.toLocaleString()}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 bg-slate-100 rounded-xl p-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg bg-white flex items-center justify-center transition-all duration-200 hover:bg-slate-200"
                        >
                          <Minus className="w-4 h-4 text-slate-700" />
                        </motion.button>

                        <span className="text-lg font-bold w-8 text-center text-slate-900">
                          {item.quantity}
                        </span>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-8 h-8 rounded-lg bg-white flex items-center justify-center transition-all duration-200 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4 text-slate-700" />
                        </motion.button>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
                    <span className="text-slate-600">Item Total:</span>
                    <span className="text-xl font-bold text-slate-900">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 sticky top-6"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({getCartItemsCount()} items)</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-slate-600">
                  <span>Shipping Fee</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      `৳${shippingFee}`
                    )}
                  </span>
                </div>

                {shippingFee === 0 && (
                  <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm text-center">
                    🎉 You saved ৳60 on shipping!
                  </div>
                )}

                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-slate-900">
                    <span>Total Amount</span>
                    <span className="text-xl">৳{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/checkout')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>Proceed to Checkout</span>
              </motion.button>

              {/* Continue Shopping */}
              <button
                onClick={() => navigate('/products')}
                className="w-full border border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors duration-200 mt-3"
              >
                Continue Shopping
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
            >
              <div className="text-center space-y-3">
                <div className="text-sm text-slate-600">
                  <div className="font-semibold mb-2">Shopping with confidence</div>
                  <div className="space-y-1 text-xs">
                    <div>🔒 Secure checkout</div>
                    <div>🚚 Free shipping over ৳1000</div>
                    <div>↩️ Easy returns</div>
                    <div>📞 24/7 Support</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPagIcons;