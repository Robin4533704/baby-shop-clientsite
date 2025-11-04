import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../hooks/useAxiosSecure';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]); // Cart items with quantity
  const [products, setProducts] = useState([]);   // Fetched products from backend
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure()
  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axiosSecure.get('/products'); // change URL if needed
        setProducts(data.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Example: Initialize cart with first 2 products (or use localStorage)
  useEffect(() => {
    if (!loading && products.length > 0) {
      setCartItems(products.slice(0, 2).map(p => ({ ...p, quantity: 1 })));
    }
  }, [loading, products]);

  // Quantity control
  const increaseQuantity = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item._id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  // Remove item
  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item._id !== id));
  };

  // Total price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Checkout
  const handleCheckout = () => {
    console.log('Checkout items:', cartItems);
    navigate('/checkout'); // অথবা API call
  };

  if (loading) return <div className="p-8 text-center">Loading products...</div>;
  if (cartItems.length === 0) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty 😢</h2>
        <button
          onClick={() => navigate('/products')}
          className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
        >
          Shop Now
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          {cartItems.map(item => (
            <div key={item._id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-500">${item.price}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => decreaseQuantity(item._id)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                >-</button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item._id)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                >+</button>
              </div>

              <div className="flex items-center space-x-4">
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Total Price */}
          <div className="flex justify-end items-center mt-4 pt-4 border-t">
            <span className="text-xl font-bold mr-4">Total: ${totalPrice.toFixed(2)}</span>
            <button
              onClick={handleCheckout}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
