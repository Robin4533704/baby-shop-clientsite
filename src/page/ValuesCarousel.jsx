// components/ValuesCarousel.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ValuesCarousel = ({ values }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % values.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + values.length) % values.length);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="text-center p-8"
        >
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${values[currentIndex].color}`}>
            <values[currentIndex].icon className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {values[currentIndex].title}
          </h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {values[currentIndex].description}
          </p>
        </motion.div>
      </div>
      
      <button onClick={prev} className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <ChevronLeft className="w-6 h-6 text-gray-400 hover:text-gray-600" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <ChevronRight className="w-6 h-6 text-gray-400 hover:text-gray-600" />
      </button>
      
      <div className="flex justify-center space-x-2 mt-4">
        {values.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ValuesCarousel;