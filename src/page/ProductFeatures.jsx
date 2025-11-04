import React from "react";
import { motion } from "framer-motion";
import { Check, Zap, Shield, Award, Clock, Star } from "lucide-react";

const FeatureIcon = ({ index }) => {
  const icons = [Check, Zap, Shield, Award, Clock, Star];
  const IconComponent = icons[index % icons.length];
  const colors = [
    "from-green-500 to-emerald-600",
    "from-blue-500 to-cyan-600",
    "from-purple-500 to-pink-600",
    "from-orange-500 to-red-600",
    "from-indigo-500 to-purple-600",
    "from-yellow-500 to-orange-600"
  ];
  
  return (
    <div className={`p-1.5 bg-gradient-to-r ${colors[index % colors.length]} rounded-lg shadow-sm`}>
      <IconComponent className="w-3 h-3 text-white" />
    </div>
  );
};

const ProductFeatures = ({ features, maxFeatures = 6, showHeader = true }) => {
  if (!features || features.length === 0) return null;

  const displayedFeatures = features.slice(0, maxFeatures);

  return (
    <motion.div 
      className="space-y-4 md:space-y-6 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6,
        ease: "easeOut"
      }}
    >
      {/* Header */}
      {showHeader && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center space-x-3"
        >
          <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-xl md:text-2xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Key Features
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Everything you need for your little one
            </p>
          </div>
        </motion.div>
      )}

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {displayedFeatures.map((feature, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: 0.3 + index * 0.1,
              duration: 0.5,
              ease: "easeOut"
            }}
            whileHover={{ 
              x: 5,
              transition: { duration: 0.2 }
            }}
            className="group flex items-start space-x-4 p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-pink-100 transition-all duration-300"
          >
            {/* Animated Check Indicator */}
            <motion.div 
              className="flex-shrink-0 mt-0.5"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <FeatureIcon index={index} />
            </motion.div>

            {/* Feature Text */}
            <div className="flex-1 min-w-0">
              <p className="text-gray-800 text-sm md:text-base leading-relaxed font-medium group-hover:text-gray-900 transition-colors duration-200">
                {feature}
              </p>
            </div>

            {/* Hover Effect Line */}
            <motion.div 
              className="h-full w-1 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100"
              initial={{ scaleY: 0 }}
              whileHover={{ scaleY: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Show More Indicator */}
      {features.length > maxFeatures && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center pt-2"
        >
          <span className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
            <span>+{features.length - maxFeatures} more features</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span>→</span>
            </motion.div>
          </span>
        </motion.div>
      )}

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-pink-100 to-purple-100 rounded-full -z-10 opacity-60"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default ProductFeatures;