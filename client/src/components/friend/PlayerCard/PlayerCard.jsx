import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Gamepad2, Eye, UserMinus,  } from 'lucide-react';

// PlayerCard Component
const PlayerCard = ({ 
  user, 
  onViewProfile, 
  onRemoveFriend
}) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'online':
        return { color: 'bg-green-500', text: 'Online', icon: null };
      case 'in-game':
        return { color: 'bg-orange-500', text: 'In Game', icon: <Gamepad2 className="w-3 h-3" /> };
      case 'offline':
        return { color: 'bg-gray-500', text: 'Offline', icon: null };
      default:
        return { color: 'bg-gray-500', text: 'Unknown', icon: null };
    }
  };

  const statusConfig = getStatusConfig(user.status);
  console.log(user, 'user')
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 rounded-xl p-4 hover:bg-slate-700 transition-all duration-300"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 bg-slate-700 rounded-full flex items-center justify-center text-2xl">
            {user.avatar}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${statusConfig.color} rounded-full border-2 border-slate-800 flex items-center justify-center`}>
            {statusConfig.icon}
          </div>
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="font-bold text-white text-base leading-tight truncate">{user.username}</h3>
          <p className="text-gray-400 text-xs">@{user.id}</p>
        </div>
      </div>

      <div className="mb-3 space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-300">{statusConfig.text}</span>
          <span className="text-gray-400">• {user.lastActive}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <Coins className="w-3 h-3 text-orange-500" />
          <span>{user.coins?.toLocaleString() || 0} coins</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onViewProfile(user)}
          className="flex-1 bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        
        <button
          onClick={() => onRemoveFriend(user.userId)}
          className="bg-slate-700 hover:bg-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
        >
          <UserMinus className="w-4 h-4" />
          Remove
        </button>
      </div>
    </motion.div>
  );
};

export default PlayerCard