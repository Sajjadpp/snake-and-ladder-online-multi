import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Wifi, WifiOff } from 'lucide-react';
import Button from '../../ui/button';
import FriendInviteSidebar from '../FriendList';

const RoomInfoCard = ({ roomData, roomId, currentPlayers, maxPlayers, isConnected, onCopyCode, copied }) => {
  return (
    <motion.div 
      className="bg-white/95 backdrop-blur-sm w-full rounded-xl p-4 shadow-lg border border-orange-100 mb-6"
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: { duration: 0.4, ease: "easeOut" }
        }
      }}
    >
      
      <div className="flex justify-between items-center mb-3">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Room: {roomId}</h1>
          <p className="text-sm text-orange-600 font-medium">{roomData?.loungeId?.name || 'Snake & Ladder'}</p>
          <p className="text-xs text-gray-500">{roomData?.loungeId?.location || 'Online'}</p>
        </div>
        <Button
          variant="secondary"
          size="small"
          onClick={onCopyCode}
          className="relative"
        >
          <Copy className="w-4 h-4" />
          {copied && (
            <motion.span 
              className="absolute -top-8 -right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Copied!
            </motion.span>
          )}
        </Button>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-600">Players: {currentPlayers}/{maxPlayers}</span>
        <ConnectionBadge isConnected={isConnected} />
      </div>
      
      <ProgressBar current={currentPlayers} max={maxPlayers} />
      
      <PrizeInfo 
        entryFee={roomData?.entryFee || 0}
        prizePool={roomData?.loungeId?.prize || 0}
      />
      
    </motion.div>
  );
};

const ConnectionBadge = ({ isConnected }) => (
  <div className="flex items-center gap-1">
    {isConnected ? (
      <>
        <Wifi className="w-4 h-4 text-green-500" />
        <span className="text-xs text-green-600 font-medium">Connected</span>
      </>
    ) : (
      <>
        <WifiOff className="w-4 h-4 text-red-500" />
        <span className="text-xs text-red-600 font-medium">Offline</span>
      </>
    )}
  </div>
);

const ProgressBar = ({ current, max }) => (
  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
    <motion.div 
      className="bg-orange-400 h-2 rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${(current / max) * 100}%` }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    />
  </div>
);

const PrizeInfo = ({ entryFee, prizePool }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-600">
      Entry Fee: <span className="font-bold text-red-600">₹{entryFee}</span>
    </span>
    <span className="text-gray-600">
      Prize Pool: <span className="font-bold text-green-600">₹{prizePool}</span>
    </span>
  </div>
);

export default RoomInfoCard;