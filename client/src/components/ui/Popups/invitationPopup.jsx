import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, UserCheck, UserX, Clock } from 'lucide-react';

const FriendRequestPopup = ({ 
  isOpen, 
  onClose, 
  request,
  onAccept,
  onDecline 
}) => {

  if(!request) return null;
    
  const getTimeAgo = (createdAt) => {
    if (!createdAt) return 'Now';
    
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return `${Math.floor(diffMins / 1440)}d`;
  };    
  console.log(isOpen && true,'null', request)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />
          
          {/* Popup - Small and compact */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="fixed top-4 right-4 w-80 z-50"
          >
            <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-600 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-white" />
                    <span className="text-white font-semibold text-sm">Friend Request</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-white/80" />
                    <span className="text-white/80 text-xs">
                      {getTimeAgo(request.createdAt)}
                    </span>
                    <button
                      onClick={onClose}
                      className="p-1 text-white/80 hover:text-white transition-colors rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content - Compact */}
              <div className="p-3">
                {/* User Info Row */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {request.sender?.avatar || request.sender?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      <h3 className="text-white font-semibold text-sm truncate">
                        {request.sender?.username || 'Unknown User'}
                      </h3>
                      <span className="text-gray-400 text-xs">
                        Lv.{request.sender?.level || '1'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs truncate">
                      Wants to be your friend
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3 px-1">
                  <div className="flex items-center gap-1">
                    <span>🏆</span>
                    <span>{request.sender?.winRate || '0'}% WR</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🎮</span>
                    <span>{(request.sender?.gamesPlayed || 0).toLocaleString()} games</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>👥</span>
                    <span>{request.sender?.friendsCount || '0'}</span>
                  </div>
                </div>

                {/* Action Buttons - Side by side */}
                <div className="flex gap-2">
                  <button
                    onClick={onDecline}
                    className="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-1"
                  >
                    <UserX className="w-3 h-3" />
                    Decline
                  </button>
                  <button
                    onClick={onAccept}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-1 shadow-lg shadow-orange-500/25"
                  >
                    <UserCheck className="w-3 h-3" />
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FriendRequestPopup;