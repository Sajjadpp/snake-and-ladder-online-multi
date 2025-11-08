import React from 'react';
import { motion } from 'framer-motion';
import { Dice1, TrendingUp, TrendingDown, Zap, Target, Square } from 'lucide-react';

const GameRules = () => {
  const rules = [
    {
      icon: Target,
      label: "Win at 100",
      description: "Reach the final square",
      color: "text-green-500"
    },
    {
      icon: TrendingDown,
      label: "Snakes", 
      description: "Slide down",
      color: "text-red-500"
    },
    {
      icon: TrendingUp,
      label: "Ladders",
      description: "Climb up", 
      color: "text-blue-500"
    },
    {
      icon: Zap,
      label: "Roll 6",
      description: "Extra turn",
      color: "text-yellow-500"
    }
  ];

  return (
    <motion.div 
      className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-orange-100 mb-6"
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: { duration: 0.4, ease: "easeOut" }
        }
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Dice1 className="w-4 h-4 text-orange-500" />
        <h3 className="text-sm font-bold text-gray-800">How to Play</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {rules.map((rule, index) => {
          const IconComponent = rule.icon;
          
          return (
            <motion.div
              key={rule.label}
              className="flex flex-col items-center text-center p-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-2 border border-orange-200">
                <IconComponent className={`w-6 h-6 ${rule.color}`} />
              </div>
              <h4 className="text-xs font-semibold text-gray-800 mb-1">
                {rule.label}
              </h4>
              <p className="text-xs text-gray-600">
                {rule.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default GameRules;