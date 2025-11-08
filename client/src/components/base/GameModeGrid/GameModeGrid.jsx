import React from 'react';
import { motion } from 'framer-motion';
import { Crown, User, Users, Globe } from 'lucide-react';

// Utils
import { ANIMATION_VARIANTS, GAME_MODE_CONFIG, GAME_MODES } from '../../../utils/constants';

const GameModeGrid = ({ onGameModeClick }) => {
  const gameModes = [
    {
      id: GAME_MODES.SOLO,
      label: GAME_MODE_CONFIG[GAME_MODES.SOLO].label,
      icon: Crown,
      onClick: () => onGameModeClick(GAME_MODES.SOLO)
    },
    {
      id: GAME_MODES.ONE_VS_ONE,
      label: GAME_MODE_CONFIG[GAME_MODES.ONE_VS_ONE].label,
      icon: User,
      onClick: () => onGameModeClick(GAME_MODES.ONE_VS_ONE)
    },
    {
      id: GAME_MODES.TWO_VS_TWO,
      label: GAME_MODE_CONFIG[GAME_MODES.TWO_VS_TWO].label,
      icon: Users,
      onClick: () => onGameModeClick(GAME_MODES.TWO_VS_TWO)
    },
    {
      id: GAME_MODES.ONLINE,
      label: GAME_MODE_CONFIG[GAME_MODES.ONLINE].label,
      icon: Globe,
      hasBadge: true,
      onClick: () => onGameModeClick(GAME_MODES.ONLINE)
    }
  ];

  return (
    <motion.div 
      className="w-full max-w-sm px-2"
      variants={ANIMATION_VARIANTS.item}
    >
      <div className="grid grid-cols-2 gap-3">
        {gameModes.map((mode, index) => (
          <GameModeButton
            key={mode.id}
            mode={mode}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
};

const GameModeButton = ({ mode, index }) => (
  <motion.button
    className="bg-white text-orange-600 py-4 px-3 rounded-xl font-semibold text-xs shadow-lg border border-orange-100 hover:bg-orange-50 transition-colors relative"
    variants={ANIMATION_VARIANTS.button}
    whileHover="hover"
    whileTap="tap"
    onClick={mode.onClick}
    custom={index}
    initial="hidden"
    animate="visible"
    transition={{ delay: index * 0.1 }}
  >
    <div className="flex flex-col items-center space-y-2">
      <div className="relative">
        <mode.icon className="w-5 h-5" />
        {mode.hasBadge && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        )}
      </div>
      <span>{mode.label}</span>
    </div>
  </motion.button>
);

export default GameModeGrid;