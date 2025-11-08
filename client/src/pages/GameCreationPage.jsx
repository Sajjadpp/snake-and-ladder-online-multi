import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Components
import PageLayout from '../components/layout/PageLayout';
import Header from '../components/game-creation/Header';
import LoungeTabs from '../components/game-creation/LoungeTabs';
import LoungeGrid from '../components/game-creation/LoungeGrid';
import CreateGameModal from '../components/game-creation/CreateGameModal';
import BackgroundAnimation from '../components/layout/BgAnimation';

// Hooks
import { useLounges } from '../hooks/useLounges';

// Utils
import { ANIMATION_VARIANTS } from '../utils/constants';

const GameCreationPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLounge, setSelectedLounge] = useState(null);
  const [gameType, setGameType] = useState('public');
  
  const { lounges, loading } = useLounges();

  const handleLoungeSelect = (lounge) => {
    setSelectedLounge(lounge);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setSelectedLounge(null);
  };

  return (
    <PageLayout background="bg-gray-800">
      <Header />
      
      <motion.main 
        className="flex flex-col items-center justify-start px-6 py-8 max-w-sm md:max-w-2xl lg:max-w-4xl mx-auto pb-32"
        variants={ANIMATION_VARIANTS.container}
        initial="hidden"
        animate="visible"
      >
        {/* Title Section */}
        <TitleSection />
        
        {/* Lounge Tabs */}
        <LoungeTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Lounge Grid */}
        <LoungeGrid 
          lounges={lounges}
          activeTab={activeTab}
          onLoungeSelect={handleLoungeSelect}
          loading={loading}
        />
      </motion.main>

      {/* Create Game Modal */}
      <CreateGameModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        selectedLounge={selectedLounge}
        gameType={gameType}
        onGameTypeChange={setGameType}
      />

      <BackgroundAnimation />
    </PageLayout>
  );
};

const TitleSection = () => (
  <motion.div 
    className="w-full mb-6"
    variants={ANIMATION_VARIANTS.item}
  >
    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight text-center">
      Create Game
    </h1>
    <p className="text-white/70 text-center mt-2">
      Select a lounge to start playing
    </p>
  </motion.div>
);

export default GameCreationPage;