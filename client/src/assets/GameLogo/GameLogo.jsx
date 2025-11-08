import React from 'react';
import { motion } from 'framer-motion';
import { ANIMATION_VARIANTS } from '../../utils/constants';

const GameLogo = () => {
  return (
    <motion.div
      className="mb-8"
      variants={ANIMATION_VARIANTS.item}
    >
      <div className="w-24 h-24 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
        <motion.div
          className="text-4xl"
          animate={{ 
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🐍
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GameLogo;