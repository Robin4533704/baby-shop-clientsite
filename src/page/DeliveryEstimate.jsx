import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const DeliveryEstimate = () => (
  <motion.div 
    className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-blue-200"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 1.3 }}
  >
    <div className="flex items-center space-x-2 md:space-x-3">
      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" />
      <div>
        <div className="font-semibold text-slate-900 text-sm md:text-base">Delivery Estimate</div>
        <div className="text-xs md:text-sm text-slate-600">2-4 business days • Free shipping over ৳1000</div>
      </div>
    </div>
  </motion.div>
);

export default DeliveryEstimate;