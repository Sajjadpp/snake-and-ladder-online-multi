import React from 'react';
import { motion } from 'framer-motion';
import { Users, User } from 'lucide-react';

const RoomTabs = ({ activeTab, onTabChange, rooms = [] }) => {
  const tabs = [
    {
      id: '1vs1',
      label: '1 vs 1',
      icon: User,
      description: 'Player vs Player',
      playerCount: 2
    },
    {
      id: '2vs2',
      label: '2 vs 2', 
      icon: Users,
      description: 'Team Battle', 
      playerCount: 4
    }
  ];

  // Calculate room counts for each tab
  const getRoomCount = (tabId) => {
    const playerCount = tabId === '1vs1' ? 2 : 4;
    return rooms.filter(room => 
      room.allowedPlayers === playerCount &&
      room.progress === "in Room"
    ).length;
  };

  return (
    <motion.div 
      className="w-full mb-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: "easeOut" }
        }
      }}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-orange-100">
        <div className="grid grid-cols-2 gap-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            const roomCount = getRoomCount(tab.id);
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative py-3 px-4 rounded-lg font-semibold text-xs transition-all
                  flex flex-col items-center space-y-1
                  ${isActive 
                    ? 'bg-orange-400 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-2">
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div> 
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-orange-300"
                    layoutId="activeTab"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Tab Description */}
      <div className="mt-2 text-center">
        <p className="text-xs text-white/60">
          {tabs.find(tab => tab.id === activeTab)?.description}
        </p>
      </div>
    </motion.div>
  );
};

export default RoomTabs;