import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';

// Components
import PageLayout from '../components/layout/PageLayout';
import Header from '../components/home/Header';
import EventsBanner from '../components/home/EventsBanner';
import RoomTabs from '../components/home/RoomTabs';
import RoomList from '../components/home/RoomList';
import GameOptionsModal from '../components/home/GameOptionsModal';
import ExistingGameModal from '../components/home/ExistingGameModal';
import BackgroundAnimation from '../components/layout/BgAnimation';

// Hooks
import { useRooms } from '../hooks/useRooms';
import { useNavigation } from '../hooks/useNavigation';
import { useToast } from '../contexts/ToastContext';

// Services
import { claimUserReward, joinRoom, quickPlay } from '../services/api';

// Utils
import { ANIMATION_VARIANTS } from '../utils/constants';
import { useAuth } from '../contexts';
import PlayerSearchMotion from '../components/home/PlayerSearchComponent';
import { useEffect } from 'react';
import NotificationSidebar from '../components/layout/Notification/Notification';
import soundService from '../services/sound';
import AvatarSelectorModal from '../components/ui/Popups/AvatarSelectorPopup';
import { useAuthForm } from '../hooks/useAuthForm';
import DailyRewardBanner from '../components/home/DailyReward';
import DailyRewardPopup from '../components/home/DailyReward';

const Home = () => {
  const [isQuickPlayLoading, setIsQuickPlayLoading] = useState(false);
  const [showGameOptions, setShowGameOptions] = useState(false);
  const [activeTab, setActiveTab] = useState('1vs1');
  const [isJoining, setIsJoining] = useState(false);
  const [isNotOpen, setIsNotOpen] = useState(false);
  const [isDRewardPopupOpen, setIsDRewardPopupOpen] = useState(false)

  const toast = useToast();
  const { navigateTo, navigateToLogin } = useNavigation();
  const { user , quickPlayData, setQuickPlayData, loading, updateUser} = useAuth()
  const {handleAvatarSelect} = useAuthForm(toast);
  const { rooms, userExistingRoom, setUserExistingRoom } = useRooms();


  const handleJoinRoom = async (roomId) => {
    if (isJoining) return;
    
    setIsJoining(true);
    
    try {
      const data = await joinRoom(roomId, user);
      toast.success('Successfully joined the room!');
      navigateTo(`/room/${data.roomId}`);
    } catch (error) {
      console.error('Error joining room:', error);
      toast.error(error.message || 'Failed to join room');
    } finally {
      setIsJoining(false);
    }
  };

  const handleQuickPlay = async () => {
    if (isJoining) return;
    
    setIsJoining(true);
    setShowGameOptions(false);
    setIsQuickPlayLoading(true)
    try {
      const data = await quickPlay(user);
      console.log(data,'datas..... ')
      
      if(data.type === 'queued') {
        toast.info('No available rooms. You have been queued for the next available game.');
        return;
      }
      else {
        toast.success('Found a game! Joining room...');
        navigateTo(`/room/${data.roomId}`);
      }
    } catch (error) {
      console.error('Error in quick play:', error);
      toast.error(error.message || 'Failed to find a game');
    } finally {
      setIsJoining(false);
    }
  };

  const handleCreateRoom = () => {
    navigateTo('/create-room');
    setShowGameOptions(false);
  };

  const handleClaim = async() => {

    let data = await claimUserReward(toast);
    updateUser(data)
    toast.success('Reward added to wallet')
  }

  useEffect(() => {
    console.log(user, loading,'user and loading')
    if(!user && !loading) {
      console.log(user, 'times of looping')
      return navigateToLogin('/home')
    }
    else {
      let lastClaimed = new Date(user.dailyRewards.lastClaimed);
      setIsDRewardPopupOpen(lastClaimed.toDateString() !== new Date().toDateString());
    }
  }, [user])

  return (
    <PageLayout background="bg-gray-800">
      <PlayerSearchMotion 
        isSearching={isQuickPlayLoading} 
        onCancel={()=> {setIsQuickPlayLoading(false); setQuickPlayData(false)}} 
        matchFound={quickPlayData}
      />
      <Header isNotificationOpen={isNotOpen} setIsNotification={setIsNotOpen}/>
      
      <motion.main 
        className="flex flex-col items-center justify-start px-6 py-8 max-w-sm md:max-w-2xl lg:max-w-4xl mx-auto pb-32"
        variants={ANIMATION_VARIANTS.container}
        initial="hidden"
        animate="visible"
      >
        <EventsBanner />
        <RoomTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <RoomList 
          rooms={rooms} 
          activeTab={activeTab} 
          onJoinRoom={handleJoinRoom}
          isJoining={isJoining}
          onShowGameOptions={()=> setShowGameOptions(true)}
        />
      </motion.main>

      {/* Floating Action Button */}
      <FloatingActionButton 
        onClick={() => {setShowGameOptions(true); soundService.buttonClick();}}
        disabled={isJoining}
      />

      {/* Modals */}
      <GameOptionsModal 
        isOpen={showGameOptions}
        onClose={() => setShowGameOptions(false)}
        onQuickPlay={handleQuickPlay}
        onCreateRoom={handleCreateRoom}
        isJoining={isJoining}
      />

      <ExistingGameModal 
        isVisible={!!userExistingRoom}
        existingData={userExistingRoom}
        onClose={() => setUserExistingRoom(null)}
        userId={user?._id}
      />
      <NotificationSidebar isOpen={isNotOpen} onClose={() => setIsNotOpen(false)}/>
        
      <AvatarSelectorModal
        isOpen={user && !user.avatar ? true : false}
        onSelect={handleAvatarSelect}
      />
      <DailyRewardPopup 
        isOpen={isDRewardPopupOpen} 
        user={user} 
        onClaimReward={handleClaim}
        onClose={() => setIsDRewardPopupOpen(false)}
      />
      <BackgroundAnimation />
    </PageLayout>
  );
};

const FloatingActionButton = ({ onClick, disabled }) => (
  <motion.button
    className={`fixed bottom-6 right-6 p-4 rounded-full shadow-xl z-40 ${
      disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
    } text-white transition-colors`}
    whileHover={!disabled ? { scale: 1.05 } : {}}
    whileTap={!disabled ? { scale: 0.95 } : {}}
    onClick={!disabled ? onClick : undefined}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 1, type: "spring", stiffness: 200 }}
  >
    <Menu className="w-6 h-6" />
  </motion.button>
);

export default Home;