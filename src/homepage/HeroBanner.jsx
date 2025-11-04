import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Shield, Truck, Heart } from 'lucide-react';

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      theme: 'pink',
      title: 'Welcome Little Ones',
      subtitle: 'Premium Baby Collection',
      description: 'Discover the finest baby products for your precious little ones. Safe, certified, and loved by thousands of parents.',
      image: '👶',
      badge: 'New Arrivals',
      features: ['100% Safe Materials', 'Free Delivery', 'Easy Returns'],
      cta: 'Shop New Collection',
      link: '/products?category=new',
      bgGradient: 'from-pink-50 to-purple-50',
      textColor: 'text-pink-600'
    },
    {
      id: 2,
      theme: 'blue',
      title: 'Smart Parenting',
      subtitle: 'Essential Gear & Gadgets',
      description: 'Make parenting easier with our smart baby monitors, strollers, and innovative care products.',
      image: '🚼',
      badge: 'Best Sellers',
      features: ['Smart Technology', 'Parent Recommended', 'Durable Quality'],
      cta: 'Explore Essentials',
      link: '/products?category=essentials',
      bgGradient: 'from-blue-50 to-cyan-50',
      textColor: 'text-blue-600'
    },
    {
      id: 3,
      theme: 'green',
      title: 'Play & Learn',
      subtitle: 'Educational Toys',
      description: 'Stimulate your child development with our educational toys and learning materials.',
      image: '🧸',
      badge: 'Educational',
      features: ['Brain Development', 'Safe for Kids', 'Learning Through Play'],
      cta: 'Discover Toys',
      link: '/products?category=toys',
      bgGradient: 'from-green-50 to-emerald-50',
      textColor: 'text-green-600'
    },
    {
      id: 4,
      theme: 'orange',
      title: 'Feeding Time',
      subtitle: 'Nutrition & Feeding',
      description: 'Everything you need for happy feeding times. From bottles to high chairs and nutritious food.',
      image: '🍼',
      badge: 'Feeding Essentials',
      features: ['BPA Free', 'Easy to Clean', 'Pediatric Recommended'],
      cta: 'View Feeding',
      link: '/products?category=feeding',
      bgGradient: 'from-orange-50 to-amber-50',
      textColor: 'text-orange-600'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = slides[currentSlide];

  return (
    <section className="relative bg-gradient-to-br via-white to-gray-50 overflow-hidden rounded-2xl mx-4 my-6 shadow-2xl">
      {/* Main Carousel Container */}
      <div className={`relative min-h-[500px] md:min-h-[600px] bg-gradient-to-br ${current.bgGradient} rounded-2xl`}>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-current rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-current rounded-full animate-bounce delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-current rounded-full animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Left Content */}
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left space-y-6"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg"
              >
                <div className="w-2 h-2 bg-current rounded-full animate-ping"></div>
                <span className={`text-sm font-semibold ${current.textColor}`}>
                  {current.badge}
                </span>
              </motion.div>

              {/* Title & Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {current.title}
                  <span className="block bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {current.subtitle}
                  </span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed"
              >
                {current.description}
              </motion.p>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4"
              >
                {current.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className={`w-2 h-2 rounded-full ${current.textColor} bg-current`}></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  to={current.link}
                  className="inline-flex items-center justify-center space-x-3 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group"
                >
                  <span>{current.cta}</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-6"
              >
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>4.9/5 (10K+ Reviews)</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Safety Certified</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Truck className="w-4 h-4 text-blue-500" />
                  <span>Free Delivery</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Image/Illustration */}
            <motion.div
              key={`image-${current.id}`}
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="relative flex justify-center items-center"
            >
              <div className="relative">
                {/* Main Image Container */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 2, 0, -2, 0]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-9xl md:text-[10rem] lg:text-[12rem] filter drop-shadow-2xl"
                >
                  {current.image}
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    x: [0, 10, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/20"
                >
                  <span className="text-2xl">⭐</span>
                </motion.div>

                <motion.div
                  animate={{ 
                    y: [0, 15, 0],
                    x: [0, -8, 0]
                  }}
                  transition={{ 
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/20"
                >
                  <span className="text-2xl">🎯</span>
                </motion.div>

                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute top-8 right-12"
                >
                  <Heart className="w-8 h-8 text-red-400 fill-current" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-gray-900 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <motion.div
          key={currentSlide}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, ease: "linear" }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-gray-900 to-transparent"
        />
      </div>
    </section>
  );
};

export default HeroBanner;