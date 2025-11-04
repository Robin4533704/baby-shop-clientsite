// src/pages/CartPage.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Loading from "./Loading";

const PageCart = ({ user }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetch user's cart items
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/order/${user.uid}`);
        setCartItems(res.data.data || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
        toast.error("Failed to load cart items");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, axiosSecure]);

  // Calculate total price
  const total = cartItems.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );

  // Handle remove from cart
  const handleRemove = async (id) => {
    try {
      await axiosSecure.delete(`/order/${id}`);
      setCartItems(cartItems.filter((item) => item._id !== id));
      toast.success("Item removed from cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  };

  // Handle quantity change
  const handleQuantityChange = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      await axiosSecure.put(`/order/${id}`, { quantity });
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quantity");
    }
  };

  if (loading) return <Loading />;

  if (!cartItems.length)
    return <h2 className="text-center mt-10">Your cart is empty 😔</h2>;

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>
      <div className="grid gap-4">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between border p-4 rounded shadow"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.productImage}
                alt={item.productName}
                className="h-20 w-20 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{item.productName}</h3>
                <p className="text-gray-500">৳{item.productPrice}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(item._id, parseInt(e.target.value))
                }
                className="w-16 border rounded px-2 py-1 text-center"
              />
              <button
                onClick={() => handleRemove(item._id)}
                className="text-red-500 font-semibold"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total and Checkout */}
      <div className="flex justify-between items-center mt-6">
        <h3 className="text-xl font-bold">Total: ৳{total}</h3>
        <button
          onClick={() => navigate("/checkout")}
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default PageCart;
