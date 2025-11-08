import React from 'react';
import { motion } from 'framer-motion';
import { Users, Crown, Coins, CheckCircle, AlertCircle } from 'lucide-react';

const PlayerSlot = ({ player, isEmpty, index, currentUser }) => {
  if (isEmpty) {
    return (
      <motion.div 
        className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-orange-100 text-center"
      >
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
          <Users className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm font-medium mb-2">Waiting for player...</p>
        <div className="bg-gray-100 rounded-full px-3 py-1">
          <span className="text-xs text-gray-500">Empty Slot</span>
        </div>
      </motion.div>
    );
  }

  const isReady = player && player.status === 'ready';
  const isCurrentUser = currentUser && player && player.user._id === currentUser._id;
  const isOwner = player && player.isOwner;

  return (
    <motion.div 
      className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-orange-100 text-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 opacity-50 rounded-xl" />
      
      <div className="relative z-10">
        <div className="relative mx-auto w-16 h-16 mb-3">
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-2xl text-white shadow-lg">
            {player.user.avatar || '🎮'}
          </div>
          {isOwner && (
            <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1 shadow-lg">
              <Crown className="w-4 h-4 text-yellow-800" />
            </div>
          )}
          <StatusBadge isReady={isReady} />
        </div>
        
        <h3 className="text-gray-800 font-bold text-sm mb-2 truncate">
          {isCurrentUser ? 'You' : (player.user.username || 'Player')}
        </h3>
        
        <CoinsDisplay coins={player.user.coins} />
        
        <ReadyStatus isReady={isReady} />
      </div>
    </motion.div>
  );
};

const StatusBadge = ({ isReady }) => (
  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-lg ${
    isReady ? 'bg-green-500' : 'bg-yellow-500'
  }`}>
    {isReady ? (
      <CheckCircle className="w-4 h-4 text-white" />
    ) : (
      <AlertCircle className="w-4 h-4 text-white" />
    )}
  </div>
);

const CoinsDisplay = ({ coins }) => (
  <div className="flex items-center justify-center gap-1 bg-orange-50 rounded-full px-3 py-1 mb-2">
    <Coins className="w-4 h-4 text-orange-500" />
    <span className="text-orange-600 text-sm font-medium">{coins?.toLocaleString() || 0}</span>
  </div>
);

const ReadyStatus = ({ isReady }) => (
  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
    isReady 
      ? 'bg-green-100 text-green-700' 
      : 'bg-yellow-100 text-yellow-700'
  }`}>
    {isReady ? 'Ready to Play!' : 'Getting Ready...'}
  </div>
);

export default PlayerSlot;