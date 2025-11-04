import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5 }
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto py-8 px-4 mt-16"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="text-center mb-12">
        <motion.h1 
          className="text-5xl md:text-6xl font-bold text-gray-800 mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Welcome to <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">BabyShop</span> 🎉
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 max-w-2xl mx-auto"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Discover the finest baby products for your little ones
        </motion.p>
      </motion.div>

      {/* Products Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {[
          { name: "Baby Diapers", desc: "Premium quality diapers", emoji: "🍼" },
          { name: "Baby Clothes", desc: "Soft & comfortable", emoji: "👕" },
          { name: "Toys", desc: "Educational toys", emoji: "🧸" }
        ].map((product, index) => (
          <motion.div
            key={product.name}
            variants={cardVariants}
            whileHover="hover"
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          >
            <motion.div 
              className="text-4xl mb-4"
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              {product.emoji}
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-4">{product.desc}</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
            >
             <Link to="/products"> Shop Now</Link>
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Home;