// components/ProductDetails/AddToCart.jsx
import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";

const AddToCart = ({ product, onBack }) => {
  const [quantity, setQuantity] = useState(1);
  
  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error("🚫 This product is currently out of stock!");
      return;
    }

    // Logic to add product to cart (localStorage or API)
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex(item => item.id === product._id);
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image,
        quantity: quantity,
        stock: product.stock
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    toast.success(
      <div className="flex items-center space-x-2">
        <ShoppingCart className="w-5 h-5" />
        <span>Added {quantity} × {product.name} to cart!</span>
      </div>,
      { icon: "🛒" }
    );
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <h3 className="text-lg font-semibold mb-2">Add to Cart</h3>
      <div className="flex items-center space-x-2">
        <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))} className="px-2 py-1 border">-</button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity(prev => Math.min(prev + 1, product.stock))} className="px-2 py-1 border">+</button>
      </div>
      <button onClick={handleAddToCart} className="mt-4 bg-pink-600 text-white py-2 px-4 rounded">Add to Cart</button>
      <button onClick={onBack} className="mt-2 text-gray-600 underline">Back</button>
    </div>
  );
};

export default AddToCart;