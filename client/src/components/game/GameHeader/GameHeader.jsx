import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, LogOut, Volume2, VolumeX, Clock, Users } from 'lucide-react';
import { useAuth, useGame } from '../../../contexts';

const ANIMATION_VARIANTS = {
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  }
};

export const GameHeader = ({ 
  onSettingClicked
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const {user} = useAuth();
  const {players, turn} = useGame();

  const is1v1 = players?.length === 2;

  

  return (
    <motion.header 
      className="flex justify-between items-center px-3 sm:px-4 py-2 sm:py-3 bg-white/95 rounded-xl sm:rounded-2xl shadow-lg border border-orange-200 backdrop-blur-sm z-10"
      variants={ANIMATION_VARIANTS.slideDown}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {/* Coins Section */}
        <motion.div 
          className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-orange-500 to-amber-500 px-2 sm:px-3 py-1 rounded-full shadow-md flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.span 
            className="text-lg sm:text-xl"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            🪙
          </motion.span>
          <span className="text-white font-bold text-xs sm:text-sm whitespace-nowrap">
            {user?.coins || 0}
          </span>
        </motion.div>

        {/* Game Status - Hidden on very small screens */}
        <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-gray-600 flex-shrink-0">
          <Users size={16} />
          <span>{players?.length || 0}</span>
          {is1v1 && (
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
              1v1
            </span>
          )}
        </div>
      </div>
      
      {/* Center Section - Turn Indicator */}
      <div className="flex-1 px-2 sm:px-4 min-w-0">
        {turn && (
          <motion.div 
            className="flex items-center justify-center gap-1 sm:gap-2 bg-white px-2 sm:px-3 py-1 rounded-full shadow-sm border border-orange-200"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Clock size={12} className="sm:w-[14px] sm:h-[14px] text-orange-500 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
              {turn.user?._id === user._id 
                ? 'Your Turn' 
                : `${turn.user?.username?.substring(0, 10)}'s Turn`
              }
            </span>
          </motion.div>
        )}
      </div>

      {/* Right Section - Settings */}
      <div className="relative flex-shrink-0">
        <motion.button 
          className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md hover:shadow-lg transition-all"
          onClick={onSettingClicked}
          whileHover={{ rotate: 90, scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Settings size={18} className="sm:w-5 sm:h-5" />
        </motion.button>
        
      </div>
    </motion.header>
  );
};

export default GameHeader;