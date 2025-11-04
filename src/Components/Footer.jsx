import { Link } from 'react-router-dom';
import React, { useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from '../hooks/useAxiosSecure';

const Footer = () => {
  const axiosSecure = useAxiosSecure(); // ✅ Call the hook properly
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return toast.error("Please enter a valid email!");
    }

    setLoading(true);

    try {
      const response = await axiosSecure.post("/subscribe", { email });

      if (response.data.success) {
        toast.success(`Subscribed successfully with ${email}`);
        setEmail("");
      } else {
        toast.error(response.data.message || "Subscription failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">👶</span>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  BabyShop
                </span>
                <span className="block text-xs text-gray-400 -mt-1">Premium Baby Care</span>
              </div>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted partner for premium baby products. Safe & high-quality items for your little ones.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-300 transform hover:scale-110">📘</a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-sky-400 transition-all duration-300 transform hover:scale-110">🐦</a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all duration-300 transform hover:scale-110">📷</a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300 transform hover:scale-110">📺</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <div className="space-y-3">
              <Link to="/" className="block text-gray-300 hover:text-pink-400 flex items-center space-x-2">🏠 Home</Link>
              <Link to="/products" className="block text-gray-300 hover:text-pink-400 flex items-center space-x-2">🛍️ Products</Link>
              <Link to="/categories" className="block text-gray-300 hover:text-pink-400 flex items-center space-x-2">📦 Categories</Link>
              <Link to="/about" className="block text-gray-300 hover:text-pink-400 flex items-center space-x-2">ℹ️ About Us</Link>
              <Link to="/contact" className="block text-gray-300 hover:text-pink-400 flex items-center space-x-2">📞 Contact</Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Categories</h3>
            <div className="space-y-3">
              <a href="#" className="block text-gray-300 hover:text-pink-400 flex items-center space-x-2">🍼 Baby Feeding</a>
              <a href="#" className="block text-gray-300 hover:text-pink-400 flex items-center space-x-2">👕 Baby Clothes</a>
              <a href="#" className="block text-gray-300 hover:text-pink-400 flex items-center space-x-2">🧸 Toys & Games</a>
              <a href="#" className="block text-gray-300 hover:text-pink-400 flex items-center space-x-2">🛏️ Nursery</a>
              <a href="#" className="block text-gray-300 hover:text-pink-400 flex items-center space-x-2">🚼 Diapering</a>
            </div>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
            <p className="text-gray-300 mb-4">Subscribe for offers, giveaways, and baby care tips.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-3 mb-6">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                className={`bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg transform transition-all font-medium ${
                  loading ? "opacity-60 cursor-not-allowed" : "hover:shadow-lg hover:scale-105"
                }`}
                disabled={loading}
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-2">📧 <span>robinhossen8428@gmail.com</span></div>
              <div className="flex items-center space-x-2">📞 <span>+880 1969 -453361</span></div>
              <div className="flex items-center space-x-2">📍 <span>123 Baby Street, Kids City</span></div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            © 2024 BabyShop. All rights reserved. Made with ❤️ for your little ones.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
