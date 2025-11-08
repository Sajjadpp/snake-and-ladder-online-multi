import React from 'react';
import { motion } from 'framer-motion';
import PlayerSlot from '../PlayerSlot';

const PlayerGrid = ({ players, maxPlayers, currentUser }) => {
  return (
    <motion.div 
      className="mb-6"
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: { duration: 0.4, ease: "easeOut" }
        }
      }}
    >
      <h2 className="text-lg font-bold text-white mb-4">Players in Room</h2>
      <div className={`grid ${maxPlayers === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2'} gap-4`}>
        {Array(maxPlayers).fill(null).map((_, index) => {
          const player = index < players.length ? players[index] : null;
          const isEmpty = !player;
          
          return (
            <PlayerSlot 
              key={index}
              player={player} 
              isEmpty={isEmpty} 
              index={index}
              currentUser={currentUser}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

export default PlayerGrid;