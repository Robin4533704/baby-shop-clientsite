import React, { useState } from "react";
import { toast } from "react-hot-toast";

import useAxiosSecure from "../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const CartButton = ({ product, user, isInStock }) => {
  const [loading, setLoading] = useState(false);
 const axiosSecure = useAxiosSecure()
 const navigate = useNavigate()
 // CartButton.jsx
const handleAddToCart = async () => {
  if (!user?.uid) return toast.error("Login first");

  const payload = {
    userId: user.uid,
    productId: product._id,
    productName: product.name,
    productPrice: product.price,
    quantity: 1,
    addedAt: new Date(),
  };
 navigate(`/checkout/${product._id}?quantity=${quantity}`);
  await axiosSecure.post("/orders", payload); // POST /cart
  toast.success(`${product.name} added to cart`);
};



  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || !isInStock}
      className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
        loading || !isInStock
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:scale-105"
      }`}
    >
      {loading ? "Adding..." : isInStock ? "Add to Cart" : "Out of Stock"}
    </button>
  );
};

export default CartButton;
