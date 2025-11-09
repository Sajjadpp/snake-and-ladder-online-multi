import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Components
import PageLayout from '../components/layout/PageLayout';
import Header from '../components/room/Header';
import RoomInfoCard from '../components/room/RoomInfoCard';
import PlayerGrid from '../components/room/PlayerGrid';
import GameStats from '../components/room/GameStats';
import GameRules from '../components/room/GameRules';
import BottomActions from '../components/room/BottomActions';
import ExitConfirmModal from '../components/room/ExitConfirmModal';

// Hooks
import { useRoom } from '../hooks/useRoom';

// Utils
import { ANIMATION_VARIANTS } from '../utils/constants';
import FriendInviteSidebar from '../components/room/FriendList';
import { useAuth } from '../contexts';

const PlayerWaitingPage = () => {
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isFriendList, setIsFriendList] = useState(false)
  const {
    roomData,
    isLoading,
    currentPlayers,
    maxPlayers,
    readyPlayers,
    canStartGame,
    timeWaiting,
    isConnected,
    isHost,
    handleToggleReady,
    handleStartGame,
    handleLeaveRoom,
    handleCopyCode,
    handleShareGame,
    handleinviteFriend,
    copied
  } = useRoom();

  const {user} = useAuth() 

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <PageLayout background="bg-gray-600">
      <Header 
        onExit={() => setShowExitConfirm(true)}
        timeWaiting={timeWaiting}
        isConnected={isConnected}
      />
      
      <motion.main 
        className="flex flex-col px-6 py-8 max-w-sm md:max-w-2xl mx-auto pb-32"
        variants={ANIMATION_VARIANTS.container}
        initial="hidden"
        animate="visible"
      >
        <RoomInfoCard 
          roomData={roomData}
          roomId={roomData?.roomId}
          currentPlayers={currentPlayers}
          maxPlayers={maxPlayers}
          isConnected={isConnected}
          onCopyCode={handleCopyCode}
          copied={copied}
        />

        <PlayerGrid 
          players={roomData?.players || []}
          maxPlayers={maxPlayers}
          currentUser={roomData?.currentUser}
        />

        {/* <GameStats 
          readyPlayers={readyPlayers}
          currentPlayers={currentPlayers}
          prizePool={roomData?.loungeId?.prize || 0}
        /> */}
        <FriendInviteSidebar
          isOpen={isFriendList}
          onClose={()=> setIsFriendList(false)}
          onInvite={handleinviteFriend}
          user={user._id}
          roomId={roomData.id}
          currentPlayers={roomData.players}
        />
        <GameRules />
      </motion.main>

      <BottomActions 
        isHost={isHost}
        canStartGame={canStartGame}
        currentPlayers={currentPlayers}
        maxPlayers={maxPlayers}
        onInviteGame={()=> setIsFriendList(true)}
        onToggleReady={handleToggleReady}
        onStartGame={handleStartGame}
        playerStatus={roomData?.players?.find(p => p._id === roomData?.currentUser?._id)?.status}
      />

      <ExitConfirmModal 
        isOpen={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        onConfirm={handleLeaveRoom}
      />
    </PageLayout>
  );
};

const LoadingState = () => (
  <div className="min-h-screen bg-gray-600 flex items-center justify-center">
    <motion.div
      className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-orange-100 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading room...</p>
    </motion.div>
  </div>
);

export default PlayerWaitingPage;