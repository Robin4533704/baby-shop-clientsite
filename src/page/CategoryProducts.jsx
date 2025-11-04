// src/pages/CategoryProducts.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Grid, List, Star, ShoppingCart } from 'lucide-react';

const CategoryProducts = () => {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  // Sample products data - আপনি backend থেকে fetch করতে পারেন
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const sampleProducts = [
          {
            id: 1,
            name: "Organic Cotton Baby Bodysuit",
            price: 24.99,
            originalPrice: 29.99,
            image: "https://images.unsplash.com/photo-1584839409338-41b7a2d15345?w=300&h=300&fit=crop",
            rating: 4.5,
            reviewCount: 128,
            inStock: true,
            sizes: ["Newborn", "0-3M", "3-6M"],
            colors: ["Pink", "Blue", "White"],
            featured: true
          },
          {
            id: 2,
            name: "Soft Teddy Bear",
            price: 19.99,
            image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop",
            rating: 4.8,
            reviewCount: 89,
            inStock: true,
            featured: false
          },
          // Add more sample products...
        ];
        setProducts(sampleProducts);
        setLoading(false);
      }, 1000);
    };

    fetchProducts();
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 capitalize mb-2">
            {categorySlug?.replace('-', ' ')}
          </h1>
          <p className="text-gray-600">
            {products.length} products found in this category
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
  >
    <div className="relative">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      {product.featured && (
        <div className="absolute top-2 left-2 bg-pink-500 text-white px-2 py-1 rounded text-xs font-semibold">
          Featured
        </div>
      )}
      <button className="absolute top-2 right-2 bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2 hover:bg-pink-500 hover:text-white transition">
        <ShoppingCart className="w-4 h-4" />
      </button>
    </div>

    <div className="p-4">
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {product.name}
      </h3>
      
      <div className="flex items-center mb-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(product.rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600 ml-1">
          ({product.reviewCount})
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
        <button className="bg-pink-500 text-white px-3 py-1 rounded-lg hover:bg-pink-600 transition text-sm font-semibold">
          Add to Cart
        </button>
      </div>
    </div>
  </motion.div>
);

export default CategoryProducts;