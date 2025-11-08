import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, LogOut, Users, Clock, Coins, Crown } from 'lucide-react';
import { useNavigation } from '../../../hooks/useNavigation';
import { useToast } from '../../../contexts/ToastContext';
import { leaveRoom } from '../../../services/api';
import Button from '../../ui/button';

const ExistingGameModal = ({ isVisible, existingData, onClose, userId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { navigateTo } = useNavigation();
  const toast = useToast();

  const handleContinue = () => {
    if (!existingData) return;
    
    const path = existingData.status === "in Game" 
      ? `/game/${existingData._id}` 
      : `/room/${existingData.roomId}`;
    
    navigateTo(path);
    onClose();
  };

  const handleExit = async () => {
    if (!existingData?.roomId || !userId) return;
    
    setIsLoading(true);
    try {
      await leaveRoom(existingData.roomId, userId);
      toast.success('Left the room successfully');
      onClose();
    } catch (error) {
      toast.error('Error leaving the room');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible || !existingData) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal - Mobile Friendly */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-auto"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Active Session</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              You're already in a {existingData.status === "in Game" ? "game" : "room"}
            </p>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <RoomInfo room={existingData} userId={userId}/>
            <ActionButtons 
              onContinue={handleContinue}
              onExit={handleExit}
              isLoading={isLoading}
              status={existingData.status}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const RoomInfo = ({ room , userId}) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-700">{room.loungeId?.name}</span>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        room.status === "in Game" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
      }`}>
        {room.status}
      </span>
    </div>
    
    <div className="flex items-center justify-between text-sm text-gray-600">
      <div className="flex items-center space-x-1">
        <Users className="w-4 h-4" />
        <span>{room.players?.length || 0}/{room.allowedPlayers}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Coins className="w-4 h-4" />
        <span>₹{room.entryFee}</span>
      </div>
    </div>
      {console.log(room.owneruserId,"working .....")}
    {room.owner?._id?.toString() === userId?.toString() && (
      <div className="flex items-center justify-center space-x-1 bg-yellow-100 rounded-lg py-1">
        <Crown className="w-3 h-3 text-yellow-600" />
        <span className="text-xs font-medium text-yellow-800">You are host</span>
      </div>
    )}
  </div>
);

const ActionButtons = ({ onContinue, onExit, isLoading, status }) => (
  <div className="space-y-2">
    <Button
      onClick={onContinue}
      disabled={isLoading}
      className="w-full"
      size="large"
    >
      <Play className="w-4 h-4" />
      Continue {status === "in Game" ? "Game" : "in Room"}
    </Button>
    
    <Button
      onClick={onExit}
      disabled={isLoading}
      variant="secondary"
      className="w-full bg-red-500"
      size="large"
    >
      <LogOut className="w-4 h-4" />
      Exit & New Game
    </Button>
  </div>
);

export default ExistingGameModal;