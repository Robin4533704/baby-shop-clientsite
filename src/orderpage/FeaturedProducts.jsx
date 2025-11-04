// components/FeaturedProductsCarousel.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Eye } from "lucide-react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const FeaturedProductsCarousel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosSecure.get("/products");
        if (res.data.success) {
          
          const featuredProducts = res.data.data
            .filter(product => product.featured || product.inStock)
            .slice(0, 8);
          setProducts(featuredProducts);
        }
      } catch (err) {
        console.error("Products fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === products.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

 const handleAddToCart = (product, e) => {
  e.stopPropagation(); // prevent parent click (view product)
  

  const quantity = 1;

  // Navigate to checkout page with product ID and quantity
  navigate(`/checkout/${product._id}?quantity=${quantity}`);
};


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading featured products...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
          <p className="text-gray-600">No featured products available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-50 rounded-2xl">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Featured Products
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our handpicked selection of premium products with exceptional quality and value
        </p>
      </div>

      {/* Desktop Carousel */}
      <div className="hidden md:block relative">
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-8"
            animate={{ x: -currentIndex * 280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {products.map((product) => (
              <motion.div
                key={product._id}
                className="min-w-[260px] bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                whileHover={{ y: -8 }}
                onClick={() => handleProductClick(product._id)}
              >
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {!product.inStock && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Out of Stock
                      </span>
                    )}
                    {product.discount && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        -{product.discount}% OFF
                      </span>
                    )}
                    {product.featured && (
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={!product.inStock}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart size={18} className="text-gray-700" />
                    </button>
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                      <Eye size={18} className="text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description || "Premium quality product with excellent features"}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < Math.floor(product.rating || 4) 
                              ? "text-yellow-400 fill-current" 
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      ({product.rating || 4.0})
                    </span>
                  </div>

                  {/* Price & Stock */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        ${product.price?.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    <div className={`text-sm font-medium ${
                      product.inStock ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.inStock ? 
                        `In Stock (${product.stock})` : 
                        'Out of Stock'
                      }
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Arrows */}
        {products.length > 4 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              →
            </button>
          </>
        )}

        {/* Indicators */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: Math.ceil(products.length / 4) }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentIndex === i ? 'bg-blue-600 w-8' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Mobile Grid */}
      <div className="md:hidden grid grid-cols-2 gap-4">
        {products.slice(0, 4).map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleProductClick(product._id)}
          >
            <img
              src={product.image || "/placeholder.png"}
              alt={product.name}
              className="w-full h-40 object-cover rounded-t-xl"
            />
            <div className="p-3">
              <h3 className="font-medium text-sm mb-1 line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-800 font-semibold">
                  ${product.price?.toFixed(2)}
                </span>
                {product.discount && (
                  <span className="text-red-500 text-xs">
                    -{product.discount}%
                  </span>
                )}
              </div>
              <div className="flex items-center mt-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={`${
                      i < Math.floor(product.rating || 4) 
                        ? "text-yellow-400" 
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-8">
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          View All Products
        </button>
      </div>
    </div>
  );
};

export default FeaturedProductsCarousel;