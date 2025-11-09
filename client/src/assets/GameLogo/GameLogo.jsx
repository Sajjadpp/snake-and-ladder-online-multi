import React from 'react';
import { motion } from 'framer-motion';
import { ANIMATION_VARIANTS } from '../../utils/constants';

const GameLogo = () => {
  return (
    <motion.div
      className="mb-0"
      variants={ANIMATION_VARIANTS.item}
    >
    <img src="/snake&ladder.png" height={200} width={200} alt="" />
    </motion.div>
  );
};

export default GameLogo;