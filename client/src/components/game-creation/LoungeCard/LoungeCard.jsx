import React from 'react';
import { motion } from 'framer-motion';
import { Users, Coins, Crown } from 'lucide-react';
import Button from '../../ui/button';

const LoungeCard = ({ lounge, index, onSelect }) => {
  const getLoungeTheme = (lounge) => {
    // Default theme based on lounge properties
    const themes = {
      royal: { bg: 'from-purple-600 to-blue-600', card: 'bg-purple-50', border: 'border-purple-300' },
      dragon: { bg: 'from-red-600 to-orange-600', card: 'bg-red-50', border: 'border-red-300' },
      ocean: { bg: 'from-cyan-600 to-blue-600', card: 'bg-cyan-50', border: 'border-cyan-300' },
      jungle: { bg: 'from-green-600 to-emerald-600', card: 'bg-green-50', border: 'border-green-300' },
      space: { bg: 'from-indigo-600 to-purple-600', card: 'bg-indigo-50', border: 'border-indigo-300' },
      desert: { bg: 'from-yellow-600 to-amber-600', card: 'bg-yellow-50', border: 'border-yellow-300' }
    };

    return themes[lounge.theme] || themes.royal;
  };

  const theme = getLoungeTheme(lounge);

  return (
    <motion.div
      className={`${theme.card} backdrop-blur-sm rounded-xl p-4 shadow-lg ${theme.border} border relative overflow-hidden cursor-pointer`}
      variants={{
        hidden: { y: 15, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: { duration: 0.4, ease: "easeOut" }
        }
      }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={() => onSelect(lounge)}
    >
      {/* Background Pattern */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-10 rounded-xl`} />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-gray-800">{lounge.name}</h3>
              {lounge.popular && (
                <Crown className="w-4 h-4 text-orange-500" />
              )}
            </div>
            <p className="text-xs text-gray-600">{lounge.location}</p>
            <div className="flex items-center mt-1">
              <Users className="w-3 h-3 text-gray-500 mr-1" />
              <span className="text-xs text-gray-500">{lounge.online || 0} online</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center justify-end space-x-1 mb-1">
              <Coins className="w-3 h-3 text-orange-500" />
              <span className="text-xs font-bold text-orange-600">₹{lounge.entryFee}</span>
            </div>
            <p className="text-xs text-green-600 font-medium">Win: ₹{lounge.prize}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="bg-white px-2 py-1 rounded-md">
            <span className="text-xs font-medium text-gray-700">
              {lounge.allowedPlayers === 2 ? '1v1' : '2v2'}
            </span>
          </div>

          <Button
            variant="primary"
            size="small"
          >
            Play
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default LoungeCard;