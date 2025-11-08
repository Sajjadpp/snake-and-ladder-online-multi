import React from 'react';
import { motion } from 'framer-motion';
import { Grid3X3 } from 'lucide-react';
import LoungeCard from '../LoungeCard';
import Button from '../../ui/button';

const LoungeGrid = ({ lounges, activeTab, onLoungeSelect, loading }) => {
  const filterLounges = () => {
    if (activeTab === 'all') return lounges ?? [];
    if (!lounges) return [];
    
    return lounges.filter(lounge => {
      const playerCount = activeTab === '1v1' ? 2 : 4;
      return lounge.allowedPlayers === playerCount;
    });
  };

  const filteredLounges = filterLounges();

  if (loading) {
    return <LoadingState />;
  }

  if (filteredLounges.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div 
      className="w-full space-y-3"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { 
            staggerChildren: 0.1,
            delayChildren: 0.2
          }
        }
      }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">Available Lounges</h2>
        <span className="text-xs font-medium text-white/60">
          {filteredLounges.length} lounges found
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLounges.map((lounge, index) => (
          <LoungeCard
            key={lounge._id}
            lounge={lounge}
            index={index}
            onSelect={onLoungeSelect}
          />
        ))}
      </div>
    </motion.div>
  );
};

const LoadingState = () => (
  <div className="w-full space-y-3">
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-bold text-white">Available Lounges</h2>
      <span className="text-xs font-medium text-white/60">Loading...</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-gray-600 animate-pulse rounded-xl p-4 h-32" />
      ))}
    </div>
  </div>
);

const EmptyState = () => (
  <motion.div
    className="bg-white/95 backdrop-blur-sm rounded-xl p-8 text-center shadow-lg border border-orange-100"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Grid3X3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-sm font-medium text-gray-600 mb-2">No lounges available</h3>
    <p className="text-xs text-gray-400">Try selecting a different game type</p>
  </motion.div>
);

export default LoungeGrid;