import React from "react";
import { motion } from "framer-motion";
import { Truck, RotateCcw, Shield, Zap } from "lucide-react";

const TrustBadges = () => (
  <motion.div 
    className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 pt-4 md:pt-6 border-t border-slate-200"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.1 }}
  >
    {[
      { icon: Truck, text: "Free Shipping", color: "text-green-600", desc: "Over ৳1000" },
      { icon: RotateCcw, text: "Easy Returns", color: "text-blue-600", desc: "30 Days" },
      { icon: Shield, text: "2-Year Warranty", color: "text-purple-600", desc: "Guaranteed" },
      { icon: Zap, text: "Fast Delivery", color: "text-orange-600", desc: "2-4 Days" }
    ].map((item, index) => (
      <motion.div 
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 + index * 0.1 }}
        className="flex items-start space-x-2 md:space-x-3 p-2 md:p-3 rounded-lg md:rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors duration-200"
      >
        <item.icon className={`w-4 h-4 md:w-5 md:h-5 ${item.color} mt-0.5 flex-shrink-0`} />
        <div>
          <div className="font-semibold text-slate-900 text-xs md:text-sm">{item.text}</div>
          <div className="text-xs text-slate-500">{item.desc}</div>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

export default TrustBadges;