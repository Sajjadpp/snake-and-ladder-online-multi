import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown } from 'lucide-react';

// Components
import Button from '../../ui/button';

// Utils
import { ANIMATION_VARIANTS } from '../../../utils/constants';

const SecondaryActions = ({ actions = [] }) => {
  const iconMap = {
    Trophy,
    Crown
  };

  if (actions.length === 0) return null;

  return (
    <motion.div 
      className="flex space-x-3 mt-8"
      variants={ANIMATION_VARIANTS.item}
    >
      {actions.map((action, index) => {
        const IconComponent = iconMap[action.icon];
        
        return (
          <Button
            key={action.label}
            variant="secondary"
            size="medium"
            icon={IconComponent}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        );
      })}
    </motion.div>
  );
};

export default SecondaryActions;