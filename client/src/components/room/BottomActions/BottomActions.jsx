import React from 'react';
import { motion } from 'framer-motion';
import { Share, Play, Zap, CheckCircle, Users, Crown, Plus } from 'lucide-react';
import Button from '../../ui/button';

const BottomActions = ({ 
  isHost, 
  canStartGame, 
  currentPlayers, 
  maxPlayers, 
  onInviteGame, 
  onToggleReady, 
  onStartGame, 
  playerStatus 
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-20 border-t border-orange-100 p-4">
      <div className="max-w-sm md:max-w-2xl mx-auto space-y-3">
        {/* Status Bar */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              {currentPlayers}/{maxPlayers} players
            </span>
            {isHost && (
              <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                <Crown className="w-3 h-3" />
                Host
              </div>
            )}
          </div>
          
          <div className={`text-xs font-medium ${
            canStartGame ? 'text-green-600' : 'text-orange-600'
          }`}>
            {canStartGame ? 'Ready to start!' : 'Waiting for players...'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={onInviteGame}
              variant="secondary"
              className="w-full h-12"
              size="large"
            >
              <Plus/>
              Invite
            </Button>
          </motion.div>

          <motion.div 
            className="flex-1" 
            whileHover={{ scale: canStartGame ? 1.02 : 1 }} 
            whileTap={{ scale: canStartGame ? 0.98 : 1 }}
          >
            {isHost ? (
              <Button
                onClick={onStartGame}
                disabled={!canStartGame}
                variant={canStartGame ? "primary" : "secondary"}
                className={`w-full h-12 ${
                  canStartGame 
                    ? 'bg-orange-500 hover:bg-orange-600' 
                    : 'bg-gray-300 text-gray-800 cursor-not-allowed'
                }`}
                size="large"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Game
              </Button>
            ) : (
              <Button
                onClick={onToggleReady}
                variant={playerStatus === 'ready' ? "primary" : "secondary"}
                className={`w-full h-12 ${
                  playerStatus === 'ready' 
                    ? 'bg-green-500 hover:bg-green-600 border-green-500' 
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
                size="large"
              >
                {playerStatus === 'ready' ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Ready!
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Ready Up
                  </>
                )}
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BottomActions;