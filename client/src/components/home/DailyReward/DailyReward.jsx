import React, { useState, useEffect } from 'react';
import { Coins, X, Check, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { axiosInstance } from '../../../axios';

export default function DailyRewardPopup({ isOpen, onClose, user, onClaimReward }) {
  const [rewardsData, setRewardsData] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch reward data from backend when popup opens
  useEffect(() => {
    if (isOpen && user) {
      fetchRewardData();
    }
  }, [isOpen, user]);

  const fetchRewardData = async () => {
    setLoading(true);
    try {
      // API call to get user's reward status
      const response = await axiosInstance.get('/user/rewards');
      const data = response.data
      setRewardsData(data);
    } catch (error) {
      console.error('Failed to fetch reward data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = async () => {
    if (claiming || !rewardsData?.canClaimToday) return;
    
    setClaiming(true);
    try {
      const result = await onClaimReward(user._id); 
      // Close popup after successful claim
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Failed to claim reward:', error);
    } finally {
      setClaiming(false);
    }
  };

  const getCurrentAvailableReward = () => {
    return rewardsData?.rewards?.find(reward => reward.status === 'available');
  };

  const currentReward = getCurrentAvailableReward();

  if (loading) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-gray-900 rounded-2xl p-8 text-white">
              Loading rewards...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && rewardsData && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-auto border border-gray-700 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-2xl p-6">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors z-10"
                >
                  <X size={24} />
                </button>
                <div className="text-center text-white">
                  <h2 className="text-2xl font-bold mb-1">Daily Rewards</h2>
                  <p className="text-orange-100 text-sm">
                    Streak: {rewardsData.currentStreak} days • Total: {rewardsData.totalClaimed} coins
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 bg-gray-900">
                {/* Scrollable Rewards Row */}
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-3 min-w-max px-1">
                    {rewardsData.rewards.map((reward) => (
                      <RewardCard
                        key={reward.day}
                        reward={reward}
                        status={reward.status}
                        claiming={claiming && reward.status === 'available'}
                      />
                    ))}
                  </div>
                </div>

                {/* Progress Text */}
                <div className="text-center mb-6">
                  <p className="text-gray-400 text-sm">
                    Cycle {rewardsData.currentCycle} • {rewardsData.rewards.filter(r => r.status === 'claimed').length}/15 days claimed
                  </p>
                </div>

                {/* Claim Button */}
                <div className="mt-4">
                  <motion.button
                    onClick={handleClaimReward}
                    disabled={claiming || !rewardsData.canClaimToday}
                    whileHover={{ scale: (claiming || !rewardsData.canClaimToday) ? 1 : 1.02 }}
                    whileTap={{ scale: (claiming || !rewardsData.canClaimToday) ? 1 : 0.98 }}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                      claiming || !rewardsData.canClaimToday
                        ? 'bg-gray-700 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                  >
                    {claiming ? (
                      'Claiming...'
                    ) : !rewardsData.canClaimToday ? (
                      'Already Claimed Today'
                    ) : (
                      `Claim ${currentReward?.coins || 0} Coins`
                    )}
                  </motion.button>
                </div>

                {/* Cycle Info */}
                <div className="text-center mt-4">
                  <p className="text-gray-500 text-xs">
                    {rewardsData.canClaimToday 
                      ? 'Claim your reward to continue the streak!'
                      : 'Come back tomorrow for your next reward!'
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function RewardCard({ reward, status, claiming }) {
  return (
    <motion.div
      initial={false}
      animate={
        claiming
          ? {
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }
          : {}
      }
      transition={{ duration: 0.5 }}
      className={`flex-shrink-0 w-20 rounded-lg p-3 text-center border-2 transition-all ${
        status === 'claimed'
          ? 'bg-green-500/10 border-green-500'
          : status === 'available'
          ? 'bg-orange-500/10 border-orange-500 shadow-lg shadow-orange-500/20'
          : status === 'missed'
          ? 'bg-red-500/10 border-red-500 opacity-60'
          : 'bg-gray-800 border-gray-700 opacity-60'
      }`}
    >
      <div className={`text-xs font-semibold mb-2 ${
        status === 'claimed' ? 'text-green-400' : 
        status === 'available' ? 'text-orange-400' : 
        status === 'missed' ? 'text-red-400' :
        'text-gray-500'
      }`}>
        Day {reward.day}
      </div>

      <div className="mb-2">
        {status === 'claimed' ? (
          <div className="w-8 h-8 mx-auto bg-green-500 rounded-full flex items-center justify-center">
            <Check size={16} className="text-white" />
          </div>
        ) : status === 'available' ? (
          <motion.div
            animate={claiming ? {} : { scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-8 h-8 mx-auto bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/50"
          >
            <Coins size={16} className="text-white" />
          </motion.div>
        ) : status === 'missed' ? (
          <div className="w-8 h-8 mx-auto bg-red-500 rounded-full flex items-center justify-center">
            <Lock size={14} className="text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 mx-auto bg-gray-700 rounded-full flex items-center justify-center">
            <Lock size={14} className="text-gray-500" />
          </div>
        )}
      </div>

      <div
        className={`text-sm font-bold ${
          status === 'claimed' ? 'text-green-400' :
          status === 'available' ? 'text-orange-400' :
          status === 'missed' ? 'text-red-400' :
          'text-gray-500'
        }`}
      >
        {reward.coins}
      </div>

      <div className={`text-xs mt-1 ${
        status === 'claimed' ? 'text-green-400' : 
        status === 'available' ? 'text-orange-400' : 
        status === 'missed' ? 'text-red-400' :
        'text-gray-500'
      }`}>
        {status === 'claimed' ? 'Claimed' : 
         status === 'available' ? 'Available' : 
         status === 'missed' ? 'Missed' : 'Locked'}
      </div>
    </motion.div>
  );
}