import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Bath, 
  Heart, 
  Shirt, 
  Users, // Baby icon এর পরিবর্তে
  Coffee, // Bottle icon এর পরিবর্তে
  Car, 
  Shield, 
  Moon, 
  Gamepad2 
} from "lucide-react";

const categories = [
  { 
    id: 1, 
    name: "Bathing", 
    icon: Bath, 
    color: "from-blue-400 to-cyan-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    products: 124
  },
  { 
    id: 2, 
    name: "Care", 
    icon: Heart, 
    color: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-50",
    textColor: "text-pink-600",
    products: 89
  },
  { 
    id: 3, 
    name: "Clothing", 
    icon: Shirt, 
    color: "from-purple-400 to-indigo-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    products: 256
  },
  { 
    id: 4, 
    name: "Diapering", 
    icon: Users, // Baby icon এর পরিবর্তে
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    products: 167
  },
  { 
    id: 5, 
    name: "Feeding", 
    icon: Coffee, // Bottle icon এর পরিবর্তে
    color: "from-orange-400 to-amber-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
    products: 143
  },
  { 
    id: 6, 
    name: "Gear", 
    icon: Car, 
    color: "from-teal-400 to-cyan-500",
    bgColor: "bg-teal-50",
    textColor: "text-teal-600",
    products: 98
  },
  { 
    id: 7, 
    name: "Safety", 
    icon: Shield, 
    color: "from-red-400 to-orange-500",
    bgColor: "bg-red-50",
    textColor: "text-red-600",
    products: 76
  },
  { 
    id: 8, 
    name: "Sleeping", 
    icon: Moon, 
    color: "from-indigo-400 to-purple-500",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    products: 112
  },
  { 
    id: 9, 
    name: "Toys", 
    icon: Gamepad2, 
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-600",
    products: 201
  }
];

const Categories = () => {
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Category</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover everything your little one needs, carefully organized into categories for your convenience 👶✨
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  y: -8
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={`/products?category=${encodeURIComponent(category.name.toLowerCase())}`}
                  className="block group"
                >
                  <div className={`relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden ${category.bgColor} group-hover:shadow-xl`}>
                    
                    {/* Background Gradient Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    
                    {/* Icon Container */}
                    <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                      <div className={`relative p-4 rounded-2xl bg-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center shadow-md`}>
                          <IconComponent size={24} className="text-white" />
                        </div>
                      </div>

                      {/* Category Info */}
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg mb-2 ${category.textColor}`}>
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">
                          {category.products}+ Products
                        </p>
                      </div>

                      {/* Hover Arrow */}
                      <div className={`w-8 h-8 rounded-full ${category.bgColor} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                        <div className={`w-2 h-2 border-2 ${category.textColor} border-r-0 border-t-0 transform rotate-45 -translate-x-0.5`} />
                      </div>
                    </div>

                    {/* Shine Effect on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-2">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-pink-100 mb-6 text-lg">
              Explore our complete collection of baby products
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-pink-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              View All Products
              <span className="text-lg">→</span>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Categories;