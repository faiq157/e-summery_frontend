import React from "react";

const ApplicationSummary = ({ title, count }) => {
  return (
    <div className="relative flex flex-col items-center justify-center  w-80 h-40 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/30 shadow-lg hover:shadow-2xl transition-transform hover:scale-105 duration-300">
      {/* Gradient Overlay for a Glass Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/5 rounded-2xl"></div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="text-4xl font-extrabold text-gray-900 mt-2">{count}</div>
      </div>
    </div>
  );
};

export default ApplicationSummary;
