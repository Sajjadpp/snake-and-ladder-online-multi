// components/game/PlayerPanel/PlayerPanel.jsx
import React, { memo, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dice from '../Dice/Dice';
import { Crown, WifiOff, LogOut } from 'lucide-react';

const PlayerPanel = ({ 
  player, 
  isCurrentTurn, 
  isMine,
  timer,
  timerMax = 15,
  position = "top",
  is1v1 = false
}) => {
  const [timeLeft, setTimeLeft] = useState(timerMax);
  const isOffline = player?.status === 'offline';
  const hasLeft = player?.status === 'left';

  const timerProgress = useMemo(() => {
    const max = Math.max(1, timerMax);
    return isCurrentTurn ? (timeLeft / max) * 100 : 100;
  }, [isCurrentTurn, timeLeft, timerMax]);

  useEffect(() => {
    if (isCurrentTurn && typeof timer === 'number' && timer >= 0) {
      setTimeLeft(timer);
    }
  }, [isCurrentTurn, timer]);

  useEffect(() => {
    if (!isCurrentTurn) {
      setTimeLeft(timerMax);
    }
  }, [isCurrentTurn, timerMax]);

  const getTimerColor = () => {
    const greenThreshold = Math.ceil(timerMax * 0.66);
    const yellowThreshold = Math.ceil(timerMax * 0.33);
    
    if (timeLeft > greenThreshold) return '#f97316';
    if (timeLeft > yellowThreshold) return '#fb923c';
    return '#ea580c';
  };

  const getPositionClasses = () => {
    if (is1v1) {
      return position === "top-right" 
        ? "flex-row-reverse" 
        : "flex-row";
    }
    return "flex-col items-center";
  };

  const playerUsername = player?.user?.username || 'Player';
  const playerAvatar = player?.user?.avatar;
  const playerColor = player?.color || 'gray';

  const getColorGradient = (color) => {
    const colors = {
      green: 'from-green-500 to-emerald-500',
      yellow: 'from-amber-500 to-yellow-500',
      red: 'from-red-500 to-rose-500',
      blue: 'from-blue-500 to-cyan-500',
      purple: 'from-purple-500 to-pink-500',
      orange: 'from-orange-500 to-amber-500',
      gray: 'from-gray-500 to-slate-500'
    };
    return colors[color] || colors.gray;
  };

  return (
    <motion.div 
      className={`relative px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl border transition-all duration-300 ${
        hasLeft
          ? 'bg-gray-600/40 border-gray-600 opacity-60 grayscale'
          : isCurrentTurn 
            ? 'bg-gray-700/60 border-orange-500 shadow-lg shadow-orange-500/20' 
            : 'bg-gray-800/40 border-gray-700 shadow-md'
      } ${isOffline && !hasLeft ? 'opacity-50 grayscale' : ''} backdrop-blur-sm`}
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Timer Bar */}
      <AnimatePresence>
        {isCurrentTurn && !isOffline && !hasLeft && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl overflow-hidden"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
          >
            <motion.div
              className="h-full"
              style={{ 
                backgroundColor: getTimerColor(),
                boxShadow: `0 0 8px ${getTimerColor()}60`
              }}
              initial={{ width: "100%" }}
              animate={{ width: `${100 - timerProgress}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex gap-2 sm:gap-3 ${getPositionClasses()}`}>
        {/* Profile Section */}
        <div className={`flex items-center gap-2 ${is1v1 ? '' : 'flex-col text-center'}`}>
          {/* Avatar */}
          <motion.div
            className="relative flex-shrink-0"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260 }}
          >
            <motion.div
              className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 ${
                hasLeft 
                  ? 'border-gray-600'
                  : isCurrentTurn 
                    ? 'border-orange-500' 
                    : 'border-gray-700'
              }`}
              animate={{
                boxShadow: hasLeft
                  ? '0 2px 8px rgba(0, 0, 0, 0.5)'
                  : isCurrentTurn 
                    ? '0 0 16px rgba(249, 115, 22, 0.3)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}
              transition={{ duration: 0.3 }}
            >
              {playerAvatar ? (
                <img 
                  src={playerAvatar}
                  alt={playerUsername}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              
              <div 
                className={`w-full h-full hidden items-center justify-center text-white font-bold text-lg sm:text-xl bg-gradient-to-br ${getColorGradient(playerColor)}`}
                style={{ display: !playerAvatar ? 'flex' : 'none' }}
              >
                {playerUsername.charAt(0).toUpperCase()}
              </div>

              {/* Online Status */}
              {!hasLeft && (
                <motion.div 
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-gray-800 ${
                    isOffline ? 'bg-gray-500' : 'bg-orange-500'
                  }`}
                  animate={{
                    scale: isOffline ? 1 : [1, 1.15, 1]
                  }}
                  transition={{ duration: 2, repeat: isOffline ? 0 : Infinity }}
                />
              )}

              {/* Left Badge */}
              {hasLeft && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <LogOut size={20} className="text-gray-400" />
                </div>
              )}
            </motion.div>

            {/* Crown Badge */}
            {isCurrentTurn && !hasLeft && (
              <motion.div
                className="absolute -top-1.5 -right-1.5"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Crown size={16} className="text-orange-500 fill-orange-500 drop-shadow-lg" />
              </motion.div>
            )}
          </motion.div>

          {/* Player Info */}
          <div>
            <div className="flex items-center gap-1 justify-center sm:justify-start">
              <span className={`font-semibold truncate text-xs sm:text-sm ${
                hasLeft 
                  ? 'text-gray-500 line-through'
                  : isMine 
                    ? 'text-orange-400' 
                    : 'text-gray-200'
              }`}>
                {hasLeft ? `${playerUsername} (Left)` : isMine ? '(You)' : playerUsername}
              </span>
              
              {isOffline && !hasLeft && <WifiOff size={12} className="text-gray-500 flex-shrink-0" />}
            </div>
            
            {/* Timer Display */}
            {isCurrentTurn && !isOffline && !hasLeft && (
              <motion.div 
                className="text-xs font-bold mt-0.5"
                style={{ color: getTimerColor() }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {Math.max(0, timeLeft)}s
              </motion.div>
            )}
          </div>
        </div>

        {/* Dice Section */}
        {!hasLeft && (
          <motion.div
            className={`flex items-center justify-center flex-shrink-0 ${is1v1 ? '' : 'mt-1'}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          >
            <Dice 
              isMine={isMine}
              disabled={!isMine || isOffline}
              player={player?.user?._id}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default memo(PlayerPanel);