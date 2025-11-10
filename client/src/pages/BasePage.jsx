import React from 'react';
import { motion } from 'framer-motion';

// Components
import PageLayout from '../components/layout/PageLayout';
import Header from '../components/layout/Header';
import GameLogo from '../assets/GameLogo';
import GameModeGrid from '../components/base/GameModeGrid';
import SecondaryActions from '../components/base/SeconddaryActions';

// Hooks
import { useNavigation } from '../hooks/useNavigation';

// Utils
import { ANIMATION_VARIANTS } from '../utils/constants';
import soundService from '../services/sound';
import { useNavigate } from 'react-router-dom';

const BasePage = () => {
  const { navigateToHome, navigateToLogin } = useNavigation();
  const navigate = useNavigate();

  const handleGameModeClick = (mode) => {
    soundService.buttonClick()
    navigate('/home')
  };

  const secondaryActions = [
    {
      label: 'Leaderboard',
      icon: 'Trophy',
      onClick: () => navigate('/leaderboard')
    },
    {
      label: 'Achievements',
      icon: 'Crown',
      onClick: () => console.log('Achievements clicked')
    }
  ];

  return (
    <PageLayout background="bg-gray-800">
      <Header />
      
      <motion.main 
        className="flex flex-col items-center justify-center px-6 py-8"
        variants={ANIMATION_VARIANTS.container}
        initial="hidden"
        animate="visible"
      >
        <GameLogo />
        
        <GameTitle />
        
        <GameModeGrid onGameModeClick={handleGameModeClick} />
        
        <SecondaryActions actions={secondaryActions} />
        
        <StatsInfo />
      </motion.main>
    </PageLayout>
  );
};

export default BasePage;

// Small extracted components for better organization
const GameTitle = () => (
  <motion.div
    className="text-center mb-8"
    variants={ANIMATION_VARIANTS.item}
  >
    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
      Snake & Ladder
    </h2>
    <p className="text-white/75 text-sm font-medium">
      Classic strategy board game
    </p>
  </motion.div>
);

const StatsInfo = () => (
  <motion.div
    className="mt-8 text-center"
    variants={ANIMATION_VARIANTS.item}
  >
    <p className="text-white/60 text-xs font-medium">
      Join 10,000+ players worldwide
    </p>
  </motion.div>
);