// import React from "react";
// import { motion } from "framer-motion";
// import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../auth-layout/CartContext";
// import { toast } from "react-toastify";

// const AddCart = () => {
//   const navigate = useNavigate();
//   const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

//   const handleQuantityChange = (productId, newQuantity) => {
//     if (newQuantity < 1) return;
//     updateQuantity(productId, newQuantity);
//   };

//   const handleRemoveItem = (productId, productName) => {
//     removeFromCart(productId);
//     toast.success(`Removed ${productName} from cart`);
//   };

//   const handleClearCart = () => {
//     clearCart();
//     toast.info("Cart cleared");
//   };

//   const handleCheckout = () => {
//     if (items.length === 0) {
//       toast.error("Your cart is empty");
//       return;
//     }
//     navigate("/checkout");
//   };

//   if (items.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
//         <div className="max-w-4xl mx-auto px-4">
//           {/* Back Button */}
//           <motion.button 
//             onClick={() => navigate(-1)}
//             className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             <span>Back to Shopping</span>
//           </motion.button>

//           {/* Empty Cart */}
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center py-16"
//           >
//             <ShoppingBag className="w-24 h-24 text-slate-300 mx-auto mb-4" />
//             <h2 className="text-2xl font-bold text-slate-700 mb-2">Your cart is empty</h2>
//             <p className="text-slate-500 mb-6">Add some products to your cart to see them here</p>
//             <button 
//               onClick={() => navigate("/products")}
//               className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
//             >
//               Continue Shopping
//             </button>
//           </motion.div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
//       <div className="max-w-6xl mx-auto px-4">
        
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <motion.button 
//             onClick={() => navigate(-1)}
//             className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             <span>Continue Shopping</span>
//           </motion.button>
          
//           <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
          
//           <button 
//             onClick={handleClearCart}
//             className="text-red-500 hover:text-red-700 transition-colors"
//           >
//             Clear Cart
//           </button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Cart Items */}
//           <div className="lg:col-span-2 space-y-4">
//             {items.map((item, index) => (
//               <motion.div
//                 key={item.id}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
//               >
//                 <div className="flex items-center space-x-4">
//                   {/* Product Image */}
//                   <img 
//                     src={item.image} 
//                     alt={item.name}
//                     className="w-20 h-20 object-cover rounded-lg"
//                   />
                  
//                   {/* Product Info */}
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-slate-900 mb-1">{item.name}</h3>
//                     <p className="text-slate-600 text-sm mb-2">{item.category}</p>
//                     <p className="text-lg font-bold text-pink-600">৳{item.price.toLocaleString()}</p>
//                   </div>

//                   {/* Quantity Controls */}
//                   <div className="flex items-center space-x-3">
//                     <button 
//                       onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
//                       className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-colors"
//                     >
//                       <Minus className="w-4 h-4" />
//                     </button>
                    
//                     <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    
//                     <button 
//                       onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
//                       className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-colors"
//                     >
//                       <Plus className="w-4 h-4" />
//                     </button>
//                   </div>

//                   {/* Total Price & Remove */}
//                   <div className="text-right">
//                     <p className="text-lg font-bold text-slate-900 mb-2">
//                       ৳{(item.price * item.quantity).toLocaleString()}
//                     </p>
//                     <button 
//                       onClick={() => handleRemoveItem(item.id, item.name)}
//                       className="text-red-500 hover:text-red-700 transition-colors flex items-center space-x-1"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                       <span>Remove</span>
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <motion.div 
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 sticky top-8"
//             >
//               <h2 className="text-xl font-bold text-slate-900 mb-4">Order Summary</h2>
              
//               <div className="space-y-3 mb-6">
//                 <div className="flex justify-between">
//                   <span className="text-slate-600">Subtotal</span>
//                   <span className="font-semibold">৳{getCartTotal().toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-slate-600">Shipping</span>
//                   <span className="font-semibold">৳{getCartTotal() > 1000 ? '0' : '100'}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-slate-600">Tax</span>
//                   <span className="font-semibold">৳{(getCartTotal() * 0.05).toFixed(0)}</span>
//                 </div>
//                 <div className="border-t pt-3">
//                   <div className="flex justify-between text-lg font-bold">
//                     <span>Total</span>
//                     <span className="text-pink-600">
//                       ৳{(getCartTotal() + (getCartTotal() > 1000 ? 0 : 100) + (getCartTotal() * 0.05)).toFixed(0)}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <button 
//                 onClick={handleCheckout}
//                 className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors mb-4"
//               >
//                 Proceed to Checkout
//               </button>

//               <button 
//                 onClick={() => navigate("/products")}
//                 className="w-full border border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
//               >
//                 Continue Shopping
//               </button>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddCart;