import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Plus, 
  Grid3X3, 
  Trophy, 
  UserPlus, 
  X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts';
import soundService from '../../../services/sound';

const GameOptionsModal = ({ isOpen, onClose, onQuickPlay, onCreateRoom }) => {
  const navigate = useNavigate()
  const {user} = useAuth()
  const withSound = (callback) => {
    return (...args) => {
      soundService.buttonClick();
      if (callback) callback(...args);
    };
  };

  const options = [
    {
      id: 'quick-play',
      label: 'Quick Play',
      icon: Zap,
      description: 'Join random game',
      onClick: withSound(onQuickPlay)
    },
    {
      id: 'create-room',
      label: 'Create Room',
      icon: Plus,
      description: 'Start new game',
      onClick: withSound(onCreateRoom)
    },
    {
      id: 'browse-lounges',
      label: 'Browse Lounges',
      icon: Grid3X3,
      description: 'Explore game rooms',
      onClick: withSound(() => console.log('Browse Lounges clicked'))
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: Trophy,
      description: 'See top players',
      onClick: withSound(() => console.log('Leaderboard clicked'))
    },
    {
      id: 'friends',
      label: 'Friends',
      icon: UserPlus,
      description: 'Play with friends',
      onClick: withSound(() => navigate(`/friend/${user?._id}`))
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 max-w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          
          {/* Modal - Bottom Center for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-40 p-6 max-w-md mx-auto'
          >
            <motion.div
                    className="
                        flex flex-col justify-between mb-6 w-full"
                    initial={{ opacity: 0, y: "100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: "100%" }}
                    transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 300
                }}
            >
                {/* Header with drag handle */}
                <div className="flex flex-col items-center mb-4">
                {/* Drag handle */}
                <div className="w-12 h-1 bg-gray-300 rounded-full mb-4"></div>
                
                <div className="flex justify-between items-center w-full">
                    <h3 className="text-xl font-bold text-gray-800">Game Options</h3>
                    <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                    <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                </div>

                {/* Options List */}
                <div className="space-y-3 max-h-[60vh] overflow-y-scroll overflow-scroll">
                {options.map((option, index) => {
                    const IconComponent = option.icon;
                    
                    return (
                    <motion.button
                        key={option.id}
                        className="w-full flex items-center justify-center space-x-4 p-4 rounded-xl 
                                bg-gray-50 hover:bg-gray-100 transition-colors text-left "
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={option.onClick}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                        <div className="font-semibold text-gray-800">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                    </motion.button>
                    );
                })}
                </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GameOptionsModal;