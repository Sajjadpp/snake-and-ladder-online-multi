import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Lock, Dice1 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { createRoom } from '../../../services/api';
import Button from '../../ui/button';

const CreateGameModal = ({ isOpen, onClose, selectedLounge, gameType, onGameTypeChange }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [creationProgress, setCreationProgress] = useState(0);
  
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    if (!selectedLounge || !user) return;

    setIsCreating(true);
    setCreationProgress(0);

    const progressInterval = setInterval(() => {
      setCreationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const isPrivate = gameType === 'private';
      const data = await createRoom(isPrivate, selectedLounge, user);
      
      clearInterval(progressInterval);
      setCreationProgress(100);

      setTimeout(() => {
        setIsCreating(false);
        onClose();
        navigate(`/room/${data.roomId}`);
      }, 500);

    } catch (error) {
      console.error("Error creating room:", typeof error.message);
      toast.info(error.message);
      clearInterval(progressInterval);
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isCreating && onClose()}
          />
          
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-40 p-6 max-w-md mx-auto"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300
            }}
          >
            <ModalContent
              isCreating={isCreating}
              selectedLounge={selectedLounge}
              gameType={gameType}
              onGameTypeChange={onGameTypeChange}
              onClose={onClose}
              onCreateGame={handleCreateGame}
              creationProgress={creationProgress}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ModalContent = ({ isCreating, selectedLounge, gameType, onGameTypeChange, onClose, onCreateGame, creationProgress }) => {
  if (isCreating) {
    return <CreationProgress selectedLounge={selectedLounge} progress={creationProgress} />;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">Create Game</h3>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-800">{selectedLounge?.name}</h4>
            <p className="text-sm text-gray-600">
              Entry: ₹{selectedLounge?.entryFee} | Win: ₹{selectedLounge?.prize}
            </p>
          </div>
          <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-xs font-medium">
            {selectedLounge?.allowedPlayers === 2 ? '1v1' : '2v2'}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Game Type</h4>
        <div className="grid grid-cols-2 gap-3">
          <GameTypeButton
            type="public"
            icon={Globe}
            label="Public"
            description="Anyone can join"
            isSelected={gameType === 'public'}
            onSelect={() => onGameTypeChange('public')}
          />
          <GameTypeButton
            type="private"
            icon={Lock}
            label="Private"
            description="Invite only"
            isSelected={gameType === 'private'}
            onSelect={() => onGameTypeChange('private')}
          />
        </div>
      </div>

      <Button
        onClick={onCreateGame}
        className="w-full"
        size="large"
      >
        Create Game
      </Button>
    </>
  );
};

const GameTypeButton = ({ type, icon: Icon, label, description, isSelected, onSelect }) => (
  <motion.button
    className={`p-4 rounded-xl border-2 flex flex-col items-center ${
      isSelected 
        ? 'border-orange-400 bg-orange-50' 
        : 'border-gray-200 bg-white'
    }`}
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onSelect}
  >
    <Icon className="w-6 h-6 text-gray-600 mb-2" />
    <span className="text-sm font-medium">{label}</span>
    <span className="text-xs text-gray-500 mt-1">{description}</span>
  </motion.button>
);

const CreationProgress = ({ selectedLounge, progress }) => (
  <div className="py-8 text-center">
    <motion.div
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6"
    >
      <Dice1 className="w-8 h-8 text-orange-500" />
    </motion.div>
    
    <h4 className="text-lg font-medium text-gray-800 mb-2">Creating your game...</h4>
    <p className="text-sm text-gray-600 mb-6">
      Please wait while we set up your {selectedLounge?.allowedPlayers === 2 ? '1v1' : '2v2'} game
    </p>
    
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <motion.div
        className="bg-orange-500 h-2.5 rounded-full"
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
    <p className="text-xs text-gray-500">{progress}% Complete</p>
  </div>
);

export default CreateGameModal;