import React, { useState } from "react";
import { motion } from "framer-motion";

const ApplicationSummary = ({ title, count, icon: Icon, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative flex flex-col items-center justify-center w-72 h-44 rounded-2xl 
        bg-gradient-to-br from-blue-200/30 to-purple-300/20 backdrop-blur-lg border border-white/20 shadow-lg 
        transition-all duration-300 ${
          isHovered
            ? "bg-gradient-to-br from-purple-600 to-blue-500 text-white"
            : "bg-gradient-to-br from-blue-200/30 to-purple-300/20 text-gray-900"
        }`}
      initial={{ scale: 1 }}
      animate={isHovered ? { y: -20, scale: 1.1 } : { y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 200, // Increases bounce speed
        damping: 5, // Reduces bounce resistance for a stronger effect
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Content */}
      <motion.div
        className="relative z-10 text-center"
        animate={isHovered ? { y: [-2, 5, -2] } : { y: 0 }}
        transition={{
          repeat: Infinity, // Infinite bounce effect
          repeatType: "reverse", // Bounces up and down
          duration: 0.6, // Speed of bounce
          ease: "easeInOut",
        }}
      >
        <div className="w-full flex justify-center items-center">
          <div className={`w-16 h-16 flex items-center justify-center rounded-full ${color}`}>
            <Icon className="text-3xl text-white" />
          </div>
        </div>
        <h3 className="text-lg font-semibold mt-4">{title}</h3>
        <div className="text-4xl font-extrabold mt-2">{count}</div>
      </motion.div>
    </motion.div>
  );
};

export default ApplicationSummary;