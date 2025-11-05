import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../auth-layout/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";


const CartButton = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showMiniCart, setShowMiniCart] = useState(false);
   const axiosSecure = useAxiosSecure()
  // Fetch cart from backend when user is logged in
  useEffect(() => {
    if (!user) return;

    const fetchCart = async () => {
      try {
        const token = await user.getIdToken(); // Firebase access token
        const res = await axiosSecure.get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCartItems(res.data.items || []);
        setItemCount(res.data.items?.reduce((sum, i) => sum + i.quantity, 0) || 0);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };

    fetchCart();
  }, [user]);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="relative">
      {/* Cart Icon */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setShowMiniCart(!showMiniCart)}
        className="relative cursor-pointer"
      >
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-visible group">
          <ShoppingCart className="w-5 h-5 relative z-10" />

          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        {itemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
          >
            {itemCount}
          </motion.span>
        )}
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && !showMiniCart && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-2 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap z-50"
          >
            View Cart ({itemCount} items)
            <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini Cart */}
      <AnimatePresence>
        {showMiniCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setShowMiniCart(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Shopping Cart</h3>
                <button
                  onClick={() => setShowMiniCart(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {cartItems.length === 0 && (
                  <p className="p-4 text-gray-500 text-center">Your cart is empty</p>
                )}
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center space-x-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.quantity} × ${item.price}</p>
                      {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <Link
                  to="/cart"
                  className="block w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-center py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all"
                  onClick={() => setShowMiniCart(false)}
                >
                  View Full Cart
                </Link>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Free shipping on orders over $50
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartButton;
