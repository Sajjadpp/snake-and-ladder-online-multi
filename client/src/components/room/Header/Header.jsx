import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Coins, Settings, Clock, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../ui/button';

const Header = ({ onExit, timeWaiting, isConnected }) => {
  const { user } = useAuth();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.header 
      className="flex justify-between items-center p-4 bg-white/10 border-b border-white/20"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center space-x-3">
        <Button
          variant="secondary"
          size="small"
          onClick={onExit}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <UserInfo user={user} />
      </div>
      
      <div className="flex items-center gap-2">
        <ConnectionStatus 
          timeWaiting={timeWaiting} 
          isConnected={isConnected} 
          formatTime={formatTime}
        />
        <Button
          variant="secondary"
          size="small"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </motion.header>
  );
};

const UserInfo = ({ user }) => (
  <div className="hidden sm:flex items-center space-x-3">
    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
      <User className="w-5 h-5 text-white" />
    </div>
    <div>
      <h2 className="text-sm font-medium text-white">{user?.name || 'Player'}</h2>
      <div className="flex items-center space-x-1">
        <Coins className="w-4 h-4 text-orange-400" />
        <span className="text-xs font-medium text-orange-400">
          {user?.coins?.toLocaleString() || '0'}
        </span>
      </div>
    </div>
  </div>
);

const ConnectionStatus = ({ timeWaiting, isConnected, formatTime }) => (
  <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
    <Clock className="w-4 h-4 text-white" />
    <span className="text-white text-sm font-mono">{formatTime(timeWaiting)}</span>
    {isConnected ? (
      <Wifi className="w-4 h-4 text-green-500" />
    ) : (
      <WifiOff className="w-4 h-4 text-red-500" />
    )}
  </div>
);

export default Header;