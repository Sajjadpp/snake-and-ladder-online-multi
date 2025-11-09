// pages/PlayPage/PlayPage.jsx
import React, { useMemo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../hooks/useGame';
import GameBoard from '../components/game/GameBoard';
import PlayerPanel from '../components/game/PlayersPanel';
import { Settings, Volume2, VolumeX, LogOut, Users, Clock } from 'lucide-react';
import { ANIMATION_VARIANTS } from '../utils/constants';
import BackgroundAnimation from '../components/layout/BgAnimation';
import GameHeader from '../components/game/GameHeader/GameHeader';
import SettingModal from '../components/game/SettingModal';

const PlayPage = () => {
  const { user } = useAuth();
  const { players, turn, boardData, gameStatus, timer, handleLeaveGame, diceRoll } = useGame();
  const [isMuted, setIsMuted] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false)
  // Enhanced player arrangement with 1v1 support
  const playerLayout = useMemo(() => {
    if (!players || players.length === 0) return { topPlayers: [], bottomPlayers: [] };
    
    const myPlayer = players.find(p => p.user?._id === user._id);
    const otherPlayers = players.filter(p => p.user?._id !== user._id);
    
    // 1v1 layout: opponent top-right, me bottom-left
    if (players.length === 2) {
      return {
        topPlayers: otherPlayers,
        bottomPlayers: [myPlayer].filter(Boolean)
      };
    }
    
    // Multiplayer: split evenly
    const half = Math.ceil(players.length / 2);
    return {
      topPlayers: players.slice(0, half),
      bottomPlayers: players.slice(half)
    };
  }, [players, user?._id]);

  const handleMuteToggle = useCallback(() => {
    setIsMuted(prev => !prev);
    // soundManager.toggleMute();
  }, []);

  const is1v1 = players?.length === 2;

  return (
    <motion.div 
      className="h-screen bg-gray-700 flex flex-col overflow-hidden relative w-full md:w-[60%] md:mx-auto"
      variants={ANIMATION_VARIANTS.page}
      initial="hidden"
      animate="visible"
    >
      {/* Header with Game Info - Compact */}
      <div className="shrink-0 px-2 py-1 relative">
        <GameHeader 
          onSettingClicked={()=> setIsSettingOpen(prev => !prev)}
        />
        <SettingModal 
          isOpen={isSettingOpen}
          onExit={()=> handleLeaveGame(user._id, "left")}
          onMuteToggle={()=> handleMuteToggle(prev => !prev)}
          isMuted={isMuted}
        />
      </div>

      {/* Top Players - Above board */}
      <motion.div 
        className={`shrink-0 flex gap-2 px-2 ${
          is1v1 ? 'justify-end' : 'justify-center'
        }`}
        variants={ANIMATION_VARIANTS.container}
      >
        {playerLayout.topPlayers.map((player, index) => (
          player && (
            <motion.div
              key={player._id}
              className="w-auto max-w-[180px]"
              variants={ANIMATION_VARIANTS.item}
              custom={index}
            >
              <PlayerPanel
                player={player}
                isCurrentTurn={turn?.user?._id === player?.user?._id}
                isMine={user._id === player?.user?._id}
                timer={turn?.user?._id === player?.user?._id ? timer : null}
                timerMax={30}
                position={is1v1 ? "top-right" : "top"}
                is1v1={is1v1}
              />
            </motion.div>
          )
        ))}
      </motion.div>

      {/* Game Board - Constrained size */}
      <motion.div 
        className="flex-1 flex items-center justify-center min-h-0 px-2 relative"
        variants={ANIMATION_VARIANTS.item}
      >
        {/* Timer Display */}
        {timer > 0 && (
          <div className="absolute top-2 right-2 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className={`font-bold text-sm ${timer <= 5 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {timer}s
            </span>
          </div>
        )}
        
        {/* Board wrapper with size constraint */}
        <div className="w-full h-full max-w-[min(70vh,80vw)] max-h-[min(70vh,80vw)] flex items-center justify-center">
          <GameBoard 
            boardData={boardData}
            players={players}
            gameStatus={gameStatus}
            diceRoll={diceRoll}
          />
        </div>
      </motion.div>

      {/* Bottom Players - Below board */}
      <motion.div 
        className={`shrink-0 flex gap-2 px-2 pb-2 ${
          is1v1 ? 'justify-start' : 'justify-center'
        }`}
        variants={ANIMATION_VARIANTS.container}
      >
        {playerLayout.bottomPlayers.map((player, index) => (
          player && ( 
            <motion.div
              key={player._id}
              className="w-auto max-w-[180px]"
              variants={ANIMATION_VARIANTS.item}
              custom={index}
            >
              <PlayerPanel
                player={player}
                isCurrentTurn={turn?.user?._id === player?.user?._id}
                isMine={user._id === player?.user?._id}
                timer={turn?.user?._id === player?.user?._id ? timer : null}
                timerMax={15}
                position={is1v1 ? "bottom-left" : "bottom"}
                is1v1={is1v1}
              />
            </motion.div>
          )
        ))}
      </motion.div>

      <BackgroundAnimation />
    </motion.div>
  );
};

export default PlayPage;