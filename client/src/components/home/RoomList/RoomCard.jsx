import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, Coins, Crown } from 'lucide-react';
import Button from '../../ui/button';

const RoomCard = ({ room, index, onJoinRoom }) => {
  const getRoomStatus = (room) => {
    const currentPlayers = room.players?.length || 0;
    const maxPlayers = room.allowedPlayers;
    
    if (currentPlayers === maxPlayers) {
      return { text: "Room Full", color: "text-red-500" };
    } else if (currentPlayers === maxPlayers - 1) {
      return { text: "1 Spot Left", color: "text-orange-500" };
    } else {
      return { text: `${currentPlayers}/${maxPlayers} Players`, color: "text-green-500" };
    }
  };

  const getRoomTheme = (room) => {
    // Default theme if room doesn't have specific colors
    return {
      bg: 'bg-gradient-to-br from-orange-400 to-orange-600',
      border: 'border-orange-200',
      color: 'bg-white'
    };
  };

  const status = getRoomStatus(room);
  const theme = getRoomTheme(room);

  const isRoomFull = (room.players?.length || 0) >= room.allowedPlayers;

  return (
    <motion.div
      className={`${theme.color} backdrop-blur-sm rounded-xl p-4 shadow-lg ${theme.border} border relative overflow-hidden`}
      variants={{
        hidden: { y: 15, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: { duration: 0.4, ease: "easeOut" }
        }
      }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Background Pattern */}
      <div className={`absolute inset-0 ${theme.bg} opacity-10 rounded-xl`} />
      
      <div className="relative z-10">
        {/* Room Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-gray-800">
                {room.loungeName || room.loungeId?.name || 'Game Room'}
              </h3>
              {room.loungeId && (
                <Crown className="w-4 h-4 text-orange-500" />
              )}
            </div>
            <p className="text-xs text-gray-600">
              {room.loungeLocation || room.loungeId?.location || 'Online'}
            </p>
            <p className="text-xs font-medium text-gray-500">
              Room: {room.roomId?.slice(-6) || 'N/A'}
            </p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center justify-end space-x-1 mb-1">
              <Coins className="w-3 h-3 text-orange-500" />
              <span className="text-xs font-bold text-orange-600">
                ₹{room.entryFee || 0}
              </span>
            </div>
            <p className="text-xs text-green-600 font-medium">
              Win: ₹{room.prize || room.loungeId?.prize || 0}
            </p>
          </div>
        </div>

        {/* Room Status */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-gray-500" />
              <span className={`text-xs font-medium ${status.color}`}>
                {status.text}
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">Waiting</span>
            </div>
          </div>

          <Button
            onClick={() => onJoinRoom(room.roomId)}
            disabled={isRoomFull}
            variant={isRoomFull ? "secondary" : "primary"}
            size="small"
          >
            {isRoomFull ? 'Full' : 'Join'}
          </Button>
        </div>

        {/* Players Preview (if available) */}
        {room.players && room.players.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-600">Players:</span>
              <div className="flex -space-x-2">
                {room.players.slice(0, 3).map((player, playerIndex) => (
                  <div
                    key={playerIndex}
                    className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs text-white border-2 border-white"
                    title={player.user?.username}
                  >
                    {player.user?.avatar || player.user?.username?.charAt(0) || 'P'}
                  </div>
                ))}
                {room.players.length > 3 && (
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600 border-2 border-white">
                    +{room.players.length - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RoomCard;