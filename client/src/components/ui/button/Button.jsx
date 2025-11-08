import React from 'react';
import { motion } from 'framer-motion';
import { ANIMATION_VARIANTS, COLOR_THEME } from '../../../utils/constants';
import soundService from '../../../services/sound';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  className = '',
  disabled = false,
  icon: Icon,
  ...props 
}) => {
  const baseStyles = "rounded-lg font-medium transition-all flex items-center justify-center border";
  
  const variants = {
    primary: "bg-white text-orange-600 border-orange-200 hover:bg-orange-50",
    secondary: "bg-gray-500 backdrop-blur-sm text-white border-white/20 hover:bg-white/25",
    ghost: "bg-transparent text-white border-transparent hover:bg-white/10"
  };

  const sizes = {
    small: "px-3 py-1.5 text-sm gap-1",
    medium: "px-4 py-2 text-sm gap-2",
    large: "py-4 px-4 text-base gap-2"
  };

  const handleClick = async(e) => {
    soundService.buttonClick();
    onClick(e)
  }

  return (
    <motion.button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={handleClick}
      disabled={disabled}
      whileHover={!disabled ? ANIMATION_VARIANTS.button.hover : undefined}
      whileTap={!disabled ? ANIMATION_VARIANTS.button.tap : undefined}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </motion.button>
  );
};

export default Button;