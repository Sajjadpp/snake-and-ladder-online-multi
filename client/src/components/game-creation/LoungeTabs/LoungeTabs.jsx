import React from 'react';
import { motion } from 'framer-motion';

const LoungeTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'all', label: 'All Lounges' },
    { id: '1v1', label: '1 vs 1' },
    { id: '2v2', label: '2 vs 2' }
  ];

  return (
    <motion.div 
      className="w-full mb-6"
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
        <div className="grid grid-cols-3 gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  py-3 px-4 rounded-lg font-semibold text-xs transition-all
                  ${isActive 
                    ? 'bg-orange-400 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.label}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default LoungeTabs;