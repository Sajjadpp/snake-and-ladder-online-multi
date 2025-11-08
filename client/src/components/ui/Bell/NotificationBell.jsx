// components/NotificationBell.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useNotification } from '../../../contexts/NotificationContext'; 
import soundService from '../../../services/sound';

const NotificationBell = ({isNotification, setIsNotification}) => {
  const { unreadCount } = useNotification();

  return (
    <>
      <button
        onClick={() => {soundService.slideClick();setIsNotification(true)}}
        className="relative p-2 text-gray-300 hover:text-white transition-colors duration-200 rounded-lg hover:bg-gray-700/50"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-medium border-2 border-gray-800"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>
    </>
  );
};

export default NotificationBell;