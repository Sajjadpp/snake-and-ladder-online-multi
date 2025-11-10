// components/MatchmakingSearch.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Zap, Trophy, Gamepad2 } from 'lucide-react';

const MatchmakingSearch = ({ 
  isSearching, 
  onCancel, 
  matchFound = null // { roomId, players: [], gameType, etc. }
}) => {
  const [searchTime, setSearchTime] = useState(0);
  const [dots, setDots] = useState('');
  const navigate = useNavigate();

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
          className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-opacity-95 flex items-center justify-center z-50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            className="bg-gray-800 border-2 border-orange-500/30 rounded-2xl p-8 max-w-md w-full mx-4 text-white shadow-2xl relative overflow-hidden"
          >
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
            
            {/* Animated Game Piece with Dice */}
            <div className="flex justify-center mb-6 relative">
              {/* Outer rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute w-24 h-24 border-2 border-orange-500/20 rounded-full"
              />
              
              {/* Main container */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 relative z-10"
              >
                {/* Dice dots animation */}
                <motion.div
                  animate={{ 
                    rotateY: [0, 180, 360],
                    rotateX: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <Gamepad2 className="w-10 h-10 text-white" strokeWidth={2.5} />
                </motion.div>
              </motion.div>
              
              {/* Orbiting particles */}
              {[0, 120, 240].map((angle, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    rotate: 360,
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.3
                  }}
                  className="absolute w-24 h-24"
                  style={{ transformOrigin: 'center' }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                    className="w-2 h-2 bg-orange-400 rounded-full absolute top-0 left-1/2 -translate-x-1/2"
                    style={{ 
                      transform: `rotate(${angle}deg) translateY(-48px)` 
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Searching Text */}
            <div className="text-center mb-6 relative z-10">
              <motion.h2 
                className="text-2xl font-bold text-white mb-3 tracking-tight"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Finding Players{dots}
              </motion.h2>
              
              <motion.p 
                className="text-gray-300 mb-4 text-sm font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Users className="w-4 h-4 inline mr-1" />
                Searching for worthy opponents...
              </motion.p>

              {/* Time Counter */}
              <motion.div 
                className="text-white text-base font-semibold bg-gray-700/50 inline-block px-5 py-2.5 rounded-lg border border-gray-600/50"
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
                className="absolute w-20 h-20 border-2 border-orange-500/30 rounded-full"
                animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute w-14 h-14 border-2 border-orange-400/40 rounded-full"
                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
              />
              <motion.div
                className="absolute w-10 h-10 border-2 border-orange-300/50 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
              />
              <div className="absolute w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full border-2 border-white/20 flex items-center justify-center shadow-lg">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 bg-white rounded-full"
                />
              </div>
            </div>

            {/* Cancel Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 border border-gray-600 relative overflow-hidden group"
            >
              <span className="relative z-10">Cancel Search</span>
              <motion.div
                className="absolute inset-0 bg-gray-600"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
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
          className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-opacity-95 flex items-center justify-center z-50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, rotate: 10 }}
            transition={{ type: "spring", damping: 15 }}
            className="bg-gray-800 border-2 border-green-500/50 rounded-2xl p-8 max-w-md w-full mx-4 text-white shadow-2xl relative overflow-hidden"
          >
            {/* Success Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent pointer-events-none" />
            
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 10 }}
              className="flex justify-center mb-6 relative"
            >
              {/* Celebration particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    x: Math.cos(i * Math.PI / 4) * 60,
                    y: Math.sin(i * Math.PI / 4) * 60,
                  }}
                  transition={{ 
                    duration: 0.8,
                    delay: 0.3 + i * 0.05,
                    ease: "easeOut"
                  }}
                  className="absolute w-2 h-2 bg-green-400 rounded-full"
                />
              ))}
              
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50 relative z-10">
                <motion.div
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>

            {/* Match Details */}
            <div className="text-center mb-6 relative z-10">
              <motion.h2 
                className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-500 mb-4 tracking-tight"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Match Found! 🎉
              </motion.h2>

              <motion.div 
                className="bg-gray-700/50 border border-green-500/30 rounded-xl p-4 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-green-400" />
                  <div className="text-lg font-semibold text-white">
                    Room: <span className="text-green-400">#{matchFound.roomId}</span>
                  </div>
                </div>
                <div className="text-gray-300 text-sm font-medium flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  {matchFound.players?.length || 0} players ready
                </div>
                <div className="text-gray-400 text-xs mt-2 flex items-center justify-center gap-2">
                  <Zap className="w-3 h-3" />
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
                  <h3 className="font-semibold text-white mb-3 text-sm flex items-center justify-center gap-2">
                    <Users className="w-4 h-4" />
                    Players:
                  </h3>
                  <div className="space-y-2">
                    {matchFound.players.map((player, index) => (
                      <motion.div
                        key={player.id}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                        className="flex items-center justify-between bg-gray-700/50 border border-gray-600/50 rounded-lg p-3 text-sm"
                      >
                        <span className="text-white font-medium flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-xs">
                            {player.name?.charAt(0)?.toUpperCase()}
                          </div>
                          {player.name}
                        </span>
                        <span className="text-green-400 text-xs font-semibold bg-green-500/10 px-2 py-1 rounded-full border border-green-500/30">
                          ✓ Ready
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 relative z-10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 border border-gray-600"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirmation}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-lg shadow-green-500/30 border border-green-400/50"
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