// components/CategoriesShowcase.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Sparkles } from "lucide-react";
import useAxiosSecure from "../hooks/useAxiosSecure";

const CategoriesShowcase = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosSecure.get("/products");
        if (res.data.success) {
          const uniqueCategories = [
            ...new Set(res.data.data.map((prod) => prod.category).filter(Boolean))
          ];

          // max 6 category দেখাব
          const topCategories = uniqueCategories.slice(0, 6);

          
          const categoriesWithImages = topCategories.map((cat, index) => {
            const productsInCategory = res.data.data.filter(p => p.category === cat);
            const prodWithImage = productsInCategory.find(p => p.image) || productsInCategory[0];
            
            // Color schemes for different categories
            const colorSchemes = [
              { gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-50", text: "text-blue-600" },
              { gradient: "from-pink-500 to-rose-500", bg: "bg-pink-50", text: "text-pink-600" },
              { gradient: "from-purple-500 to-indigo-500", bg: "bg-purple-50", text: "text-purple-600" },
              { gradient: "from-green-500 to-emerald-500", bg: "bg-green-50", text: "text-green-600" },
              { gradient: "from-orange-500 to-amber-500", bg: "bg-orange-50", text: "text-orange-600" },
              { gradient: "from-teal-500 to-cyan-500", bg: "bg-teal-50", text: "text-teal-600" }
            ];

            return {
              title: cat,
              image: prodWithImage?.image || "/placeholder.png",
              productCount: productsInCategory.length,
              colorScheme: colorSchemes[index % colorSchemes.length]
            };
          });

          setCategories(categoriesWithImages);
        }
      } catch (err) {
        console.error("Categories fetch error:", err);
        // Fallback sample data
        setCategories([
          {
            title: "Electronics",
            image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
            productCount: 45,
            colorScheme: { gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-50", text: "text-blue-600" }
          },
          {
            title: "Clothing",
            image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
            productCount: 32,
            colorScheme: { gradient: "from-pink-500 to-rose-500", bg: "bg-pink-50", text: "text-pink-600" }
          },
          {
            title: "Home & Garden",
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
            productCount: 28,
            colorScheme: { gradient: "from-green-500 to-emerald-500", bg: "bg-green-50", text: "text-green-600" }
          },
          {
            title: "Sports",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
            productCount: 19,
            colorScheme: { gradient: "from-orange-500 to-amber-500", bg: "bg-orange-50", text: "text-orange-600" }
          },
          {
            title: "Books",
            image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
            productCount: 56,
            colorScheme: { gradient: "from-purple-500 to-indigo-500", bg: "bg-purple-50", text: "text-purple-600" }
          },
          {
            title: "Beauty",
            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
            productCount: 23,
            colorScheme: { gradient: "from-teal-500 to-cyan-500", bg: "bg-teal-50", text: "text-teal-600" }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [axiosSecure]);

  const handleCategoryClick = (categoryTitle) => {
    navigate(`/products?category=${encodeURIComponent(categoryTitle)}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-yellow-500" size={28} />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Popular <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Categories</span>
            </h2>
            <Sparkles className="text-yellow-500" size={28} />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover our most loved collections curated just for you
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((cat, index) => (
            <motion.div
              key={cat.title}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                y: -5
              }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setHoveredCategory(cat.title)}
              onHoverEnd={() => setHoveredCategory(null)}
              className="relative group cursor-pointer"
              onClick={() => handleCategoryClick(cat.title)}
            >
              <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
                
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.colorScheme.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  {/* Product Count Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`${cat.colorScheme.bg} ${cat.colorScheme.text} px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm`}>
                      {cat.productCount}+ items
                    </span>
                  </div>

                  {/* Hover Effect Layer */}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Explore {cat.productCount} amazing products
                      </p>
                    </div>
                    
                    {/* Animated Arrow */}
                    <motion.div
                      animate={{ 
                        x: hoveredCategory === cat.title ? 5 : 0 
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={`w-10 h-10 rounded-full ${cat.colorScheme.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <ChevronRight 
                        size={20} 
                        className={cat.colorScheme.text} 
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>

              {/* Glow Effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${cat.colorScheme.gradient} opacity-0 group-hover:opacity-10 blur-xl -z-10 transition-opacity duration-500`} />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-4">
              Can't Find Your Favorite Category?
            </h3>
            <p className="text-blue-100 mb-6 text-lg">
              Explore our complete collection with thousands of products
            </p>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              View All Categories
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default CategoriesShowcase;