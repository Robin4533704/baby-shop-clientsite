// components/CategoriesShowcase.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Sparkles, Star, TrendingUp, Zap, Heart } from "lucide-react";
import useAxiosSecure from "../hooks/useAxiosSecure";

const CategoriesShowcase = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Baby-specific categories with relevant icons and colors
  const babyCategoriesData = [
    {
      title: "Bathing",
      icon: "🚿",
      description: "Bath essentials & hygiene",
      gradient: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
      popular: true
    },
    {
      title: "Care",
      icon: "❤️",
      description: "Health & wellness products",
      gradient: "from-pink-500 to-rose-500",
      bg: "bg-pink-50",
      text: "text-pink-600",
      popular: true
    },
    {
      title: "Clothing",
      icon: "👕",
      description: "Baby outfits & accessories",
      gradient: "from-purple-500 to-indigo-500",
      bg: "bg-purple-50",
      text: "text-purple-600",
      popular: true
    },
    {
      title: "Diapering",
      icon: "👶",
      description: "Diapers & changing essentials",
      gradient: "from-green-500 to-emerald-500",
      bg: "bg-green-50",
      text: "text-green-600"
    },
    {
      title: "Feeding",
      icon: "🍼",
      description: "Feeding bottles & accessories",
      gradient: "from-orange-500 to-amber-500",
      bg: "bg-orange-50",
      text: "text-orange-600"
    },
    {
      title: "Toys",
      icon: "🧸",
      description: "Educational & fun toys",
      gradient: "from-yellow-500 to-orange-500",
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      popular: true
    }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosSecure.get("/products");
        if (res.data.success) {
          const uniqueCategories = [
            ...new Set(res.data.data.map((prod) => prod.category).filter(Boolean))
          ];

          // Map API categories with our predefined baby categories
          const categoriesWithData = uniqueCategories.slice(0, 6).map((cat, index) => {
            const productsInCategory = res.data.data.filter(p => p.category === cat);
            const prodWithImage = productsInCategory.find(p => p.image) || productsInCategory[0];
            
            // Find matching category data or use default
            const categoryData = babyCategoriesData[index] || babyCategoriesData[0];
            
            return {
              title: cat,
              image: prodWithImage?.image || "/placeholder.png",
              productCount: productsInCategory.length,
              icon: categoryData.icon,
              description: categoryData.description,
              gradient: categoryData.gradient,
              bg: categoryData.bg,
              text: categoryData.text,
              popular: categoryData.popular,
              // Calculate average rating for this category
              avgRating: productsInCategory.length > 0 
                ? (productsInCategory.reduce((sum, p) => sum + (p.rating || 0), 0) / productsInCategory.length).toFixed(1)
                : "4.5"
            };
          });

          setCategories(categoriesWithData);
        }
      } catch (err) {
        console.error("Categories fetch error:", err);
        // Enhanced fallback with baby-specific data
        setCategories(babyCategoriesData.map((cat, index) => ({
          ...cat,
          image: `https://images.unsplash.com/photo-${1500000000000 + index}?w=400`,
          productCount: Math.floor(Math.random() * 50) + 20,
          avgRating: (4 + Math.random()).toFixed(1)
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [axiosSecure]);

  const handleCategoryClick = (categoryTitle) => {
    navigate(`/products?category=${encodeURIComponent(categoryTitle.toLowerCase())}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600 text-lg">Loading baby categories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-pink-50 py-20 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
      <div className="absolute top-40 right-10 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow"></div>
      <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slower"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-gray-100 mb-6"
          >
            <Sparkles className="text-yellow-500" size={20} />
            <span className="text-sm font-semibold text-gray-700">Popular Baby Categories</span>
            <TrendingUp className="text-green-500" size={18} />
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Baby Essentials</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Carefully curated categories to find everything your little one needs for happy, healthy growth and development
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((cat, index) => (
            <motion.div
              key={cat.title}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                y: -8
              }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setHoveredCategory(cat.title)}
              onHoverEnd={() => setHoveredCategory(null)}
              className="relative group cursor-pointer"
              onClick={() => handleCategoryClick(cat.title)}
            >
              <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100/50 backdrop-blur-sm">
                
                {/* Image Container */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {cat.popular && (
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm flex items-center gap-1">
                        <Zap size={12} />
                        Popular
                      </span>
                    )}
                    <span className={`${cat.bg} ${cat.text} px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm flex items-center gap-1`}>
                      {cat.productCount}+ items
                    </span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="text-yellow-400 fill-current" size={14} />
                    <span className="text-sm font-semibold text-gray-700">{cat.avgRating}</span>
                  </div>

                  {/* Icon Overlay */}
                  <div className="absolute bottom-4 left-4">
                    <div className={`w-12 h-12 rounded-2xl ${cat.bg} flex items-center justify-center text-2xl backdrop-blur-sm`}>
                      {cat.icon}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors line-clamp-1">
                        {cat.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                        {cat.description}
                      </p>
                      
                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Heart size={12} className="text-red-400" />
                          {Math.floor(cat.productCount * 0.8)}+ loves
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-400" />
                          {cat.avgRating} rating
                        </span>
                      </div>
                    </div>
                    
                    {/* Animated Arrow */}
                    <motion.div
                      animate={{ 
                        x: hoveredCategory === cat.title ? 8 : 0,
                        scale: hoveredCategory === cat.title ? 1.2 : 1
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={`w-12 h-12 rounded-2xl ${cat.bg} flex items-center justify-center group-hover:shadow-lg transition-all duration-300 flex-shrink-0`}
                    >
                      <ChevronRight 
                        size={20} 
                        className={cat.text} 
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>

              {/* Glow Effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${cat.gradient} opacity-0 group-hover:opacity-10 blur-xl -z-10 transition-opacity duration-500`} />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full"></div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Explore More?
              </h3>
              <p className="text-pink-100 mb-6 text-lg max-w-2xl mx-auto">
                Discover our complete collection of premium baby products, carefully selected for quality, safety, and comfort.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/products')}
                  className="bg-white text-pink-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
                >
                  <Sparkles size={20} />
                  View All Products
                  <ChevronRight size={20} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/categories')}
                  className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all duration-300 flex items-center gap-3"
                >
                  Browse Categories
                </motion.button>
              </div>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-6 mt-8 pt-6 border-t border-white/20">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>100% Safe Materials</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Free Shipping Over $50</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>30-Day Return Policy</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CategoriesShowcase;