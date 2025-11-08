// components/MatchmakingSearch.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MatchmakingSearch = ({ 
  isSearching, 
  onCancel, 
  matchFound = null // { roomId, players: [], gameType, etc. }
}) => {
  const [searchTime, setSearchTime] = useState(0);
  const [dots, setDots] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    if (!isSearching) {
      setSearchTime(0);
      return;
    }

    const timeInterval = setInterval(() => {
      setSearchTime(prev => prev + 1);
    }, 1000);

    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => {
      clearInterval(timeInterval);
      clearInterval(dotsInterval);
    };
  }, [isSearching]);

    const handleConfirmation = () => {
        if (matchFound && matchFound.roomId) {
            navigate(`/room/${matchFound.roomId}`);
        }
    };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Searching State
  if (isSearching && !matchFound) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full mx-4 text-white shadow-2xl"
          >
            {/* Animated Game Piece */}
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg border border-gray-600"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-lg flex items-center justify-center"
                >
                  <span className="text-white font-bold text-lg">🎯</span>
                </motion.div>
              </motion.div>
            </div>

            {/* Searching Text */}
            <div className="text-center mb-6">
              <motion.h2 
                className="text-2xl font-bold text-white mb-3 tracking-tight"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Finding Players{dots}
              </motion.h2>
              
              <motion.p 
                className="text-white/75 mb-3 text-sm font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Searching for worthy opponents...
              </motion.p>

              {/* Time Counter */}
              <motion.div 
                className="text-white/90 text-base font-semibold bg-gray-700 inline-block px-4 py-2 rounded-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 }}
              >
                ⏱️ {formatTime(searchTime)}
              </motion.div>
            </div>

            {/* Pulsing Radar Animation */}
            <div className="relative h-28 mb-6 flex items-center justify-center">
              <motion.div
                className="absolute w-20 h-20 border-2 border-white/30 rounded-full"
                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute w-14 h-14 border-2 border-white/40 rounded-full"
                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              />
              <div className="absolute w-8 h-8 bg-white/10 rounded-full border border-white/20 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>

            {/* Cancel Button */}
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#4B5563" }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 border border-gray-600"
            >
              Cancel Search
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Match Found State
  if (matchFound) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, rotate: 180 }}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full mx-4 text-white shadow-2xl"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center border border-gray-600 shadow-lg">
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="w-12 h-12 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              </div>
            </motion.div>

            {/* Match Details */}
            <div className="text-center mb-6">
              <motion.h2 
                className="text-2xl font-bold text-white mb-4 tracking-tight"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Match Found! 🎉
              </motion.h2>

              <motion.div 
                className="bg-gray-700/50 border border-gray-600 rounded-xl p-4 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-lg font-semibold text-white mb-2">
                  Room: <span className="text-green-400">#{matchFound.roomId}</span>
                </div>
                <div className="text-white/75 text-sm font-medium">
                  {matchFound.players?.length || 0} players ready
                </div>
                <div className="text-white/60 text-xs mt-1">
                  Game: {matchFound.gameType || 'Quick Play'}
                </div>
              </motion.div>

              {/* Players List */}
              {matchFound.players && (
                <motion.div 
                  className="mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="font-semibold text-white mb-2 text-sm">Players:</h3>
                  <div className="space-y-2">
                    {matchFound.players.map((player, index) => (
                      <motion.div
                        key={player.id}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center justify-between bg-gray-700/30 border border-gray-600 rounded-lg p-2 text-sm"
                      >
                        <span className="text-white/90">👤 {player.name}</span>
                        <span className="text-green-400 text-xs font-medium">Ready</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#4B5563" }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 border border-gray-600"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#059669" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirmation}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 border border-green-500"
              >
                Join Game ✓
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
};

export default MatchmakingSearch;