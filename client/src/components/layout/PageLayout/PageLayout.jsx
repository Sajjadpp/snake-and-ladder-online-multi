import React from 'react';
import { motion } from 'framer-motion';
import { ANIMATION_VARIANTS } from '../../../utils/constants';

const PageLayout = ({ 
  children, 
  className = '',
  background = 'bg-gray-800',
  withAnimation = true 
}) => {
  return (
    <motion.div
      className={`min-h-screen ${background} font-sans ${className}`}
      variants={withAnimation ? ANIMATION_VARIANTS.page : {}}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
};

export default PageLayout;