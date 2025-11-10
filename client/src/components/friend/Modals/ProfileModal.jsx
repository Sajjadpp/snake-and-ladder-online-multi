import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, X, Eye, Gamepad2, UserMinus, UserPlus, Coins, Phone, Mail } from 'lucide-react';

// ProfileModal Component
export const ProfileModal = ({ isOpen, onClose, profile }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'online':
        return { color: 'bg-green-500', text: 'Online' };
      case 'in-game':
        return { color: 'bg-orange-500', text: 'In Game' };
      case 'offline':
        return { color: 'bg-gray-500', text: 'Offline' };
      default:
        return { color: 'bg-gray-500', text: 'Unknown' };
    }
  };

  if (!profile) return null;

  const statusConfig = getStatusConfig(profile.status);

  return (
    <AnimatePresence>
      {isOpen && profile && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
            >
              <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Player Profile</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block mb-3">
                    <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center text-4xl">
                      {profile.avatar}
                    </div>
                    {profile.status && (
                      <div className={`absolute bottom-0 right-0 w-6 h-6 ${statusConfig.color} rounded-full border-3 border-slate-800`} />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{profile.username}</h3>
                  <p className="text-gray-400 text-sm">@{profile.id}</p>
                </div>

                <div className="space-y-3">
                  {profile.phone && (
                    <div className="bg-slate-700 rounded-lg p-4 flex items-center gap-3">
                      <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <div className="flex-grow min-w-0">
                        <p className="text-gray-400 text-xs mb-1">Phone Number</p>
                        <p className="text-white text-sm">{profile.phone}</p>
                      </div>
                    </div>
                  )}

                  {profile.email && (
                    <div className="bg-slate-700 rounded-lg p-4 flex items-center gap-3">
                      <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <div className="flex-grow min-w-0">
                        <p className="text-gray-400 text-xs mb-1">Email Address</p>
                        <p className="text-white text-sm truncate">{profile.email}</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-700 rounded-lg p-4 flex items-center gap-3">
                    <Coins className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <div className="flex-grow">
                      <p className="text-gray-400 text-xs mb-1">Total Coins</p>
                      <p className="text-white text-lg font-bold">{profile.coins?.toLocaleString() || 0}</p>
                    </div>
                  </div>

                  {profile.status && (
                    <div className="bg-slate-700 rounded-lg p-4 flex items-center gap-3">
                      <div className={`w-4 h-4 ${statusConfig.color} rounded-full flex-shrink-0`} />
                      <div className="flex-grow">
                        <p className="text-gray-400 text-xs mb-1">Status</p>
                        <p className="text-white text-sm">{statusConfig.text}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

