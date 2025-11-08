import React from 'react';
import { motion } from 'framer-motion';

const AppLoading = () => {
  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 bg-orange-500 rounded-xl mx-auto mb-4"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <p className="text-white text-lg font-semibold">Loading...</p>
        <p className="text-white/60 text-sm mt-2">Preparing your game experience</p>
      </div>
    </div>
  );
};

export default AppLoading;