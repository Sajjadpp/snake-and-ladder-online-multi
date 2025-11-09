// pages/FriendsPage.js
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, Filter, UserPlus, RefreshCw, ArrowLeft } from 'lucide-react';
import PlayerCard from '../components/friend/PlayerCard';
import { ProfileModal, SearchModal } from '../components/friend/Modals';
import { useFriends } from '../hooks/useFriend';
import { useNavigation } from '../hooks/useNavigation';

const FriendsPage = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [mounted, setMounted] = useState(false);
  const {navigateTo} = useNavigation()
  const {
    friends,
    filteredFriends,
    searchResults,
    isLoading,
    isRefreshing,
    activeFilter,
    searchQuery,
    onlineCount,
    nextPendingRequest,
    filters,
    handleRefresh,
    handleSearch,
    handleAddFriend,
    handleAcceptFriendRequest,
    handleDeclineFriendRequest,
    handleRemoveFriend,
    setSearchQuery,
    setActiveFilter,
    clearPendingRequest
  } = useFriends();

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Search effect
  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  }, [searchQuery, handleSearch]);

  const handleViewProfile = (user) => {
    setSelectedProfile(user);
    setIsProfileModalOpen(true);
  };


  const handleInviteToGame = (userId) => {
    console.log('Inviting to game:', userId);
  };

  // Handle friend request actions
  const handleAcceptRequest = async () => {
    if (nextPendingRequest) {
      await handleAcceptFriendRequest(
        nextPendingRequest._id, 
        nextPendingRequest.senderId
      );
    }
  };

  const handleDeclineRequest = async () => {
    if (nextPendingRequest) {
      await handleDeclineFriendRequest(
        nextPendingRequest._id, 
        nextPendingRequest.senderId
      );
    }
  };

  const handleCloseRequest = () => {
    if (nextPendingRequest) {
      clearPendingRequest(nextPendingRequest._id);
    }
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 text-white pb-20 safe-area-bottom">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white pb-20 safe-area-bottom">
      {/* Header - Enhanced with orange theme */}
      <div className="bg-gradient-to-br from-orange-500 to-amber-600 px-4 md:px-6 pt-6 pb-24 rounded-b-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center cursor-pointer justify-center" onClick={()=> navigateTo('/home')}>
                <ArrowLeft className="w-4 h-4 text-white" />
              </div>
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Friends</h1>
                <p className="text-sm text-white/80">
                  {onlineCount} online • {friends.length} total
                </p>
              </div>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 active:scale-95 touch-manipulation disabled:opacity-50"
            >
              <motion.div
                animate={{ rotate: isRefreshing ? 360 : 0 }}
                transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
              >
                <RefreshCw className="w-5 h-5" />
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-16 relative z-10">
        {/* Search Button - Fixed with stable layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
          key="search-section" // Added key for stable identity
        >
          <div
            onClick={() => setIsSearchModalOpen(true)}
            className="bg-slate-800/80 backdrop-blur-sm rounded-2xl px-5 py-4 flex items-center gap-3 cursor-pointer hover:bg-slate-700/80 active:scale-[0.98] transition-all duration-300 shadow-lg touch-manipulation border border-slate-700 min-h-[72px] w-full"
          >
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <span className="text-gray-400 flex-1 text-left">Search friends by username or ID...</span>
            <UserPlus className="w-5 h-5 text-orange-400 flex-shrink-0" />
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 touch-manipulation flex-shrink-0 ${
                  activeFilter === filter.key
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-slate-700/80 text-gray-300 hover:bg-slate-600/80 backdrop-blur-sm'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Friends Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="min-h-[400px]" // Ensure consistent height
        >
          {isLoading ? (
            // Loading State
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-gray-400">Loading friends...</p>
              </div>
            </div>
          ) : filteredFriends.length > 0 ? (
            // Friends Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredFriends.map((friend, index) => (
                  <motion.div
                    key={friend._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <PlayerCard
                      user={friend}
                      onViewProfile={handleViewProfile}
                      onRemoveFriend={handleRemoveFriend}
                      onInviteToGame={handleInviteToGame}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            // Empty State
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-slate-800/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No friends found</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {activeFilter !== 'all' 
                  ? `No friends are currently ${activeFilter.replace('-', ' ')}`
                  : "You haven't added any friends yet. Start by searching for players to add!"
                }
              </p>
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 mx-auto active:scale-95 touch-manipulation shadow-lg shadow-orange-500/25"
              >
                <UserPlus className="w-5 h-5" />
                Add Friends
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchResults={searchResults}
        onAddFriend={handleAddFriend}
        onViewProfile={handleViewProfile}
        isLoading={isLoading}
        currentFriends={friends}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={selectedProfile}
        onInviteToGame={handleInviteToGame}
      />

      {/* Pending Friend Request Notification */}
      <AnimatePresence>
        {nextPendingRequest && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-slate-800/90 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-slate-700 z-50"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-white">Friend Request</h4>
              <button
                onClick={handleCloseRequest}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              <span className="text-orange-400 font-medium">{nextPendingRequest.senderName}</span> wants to be your friend
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDeclineRequest}
                className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-medium transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleAcceptRequest}
                className="flex-1 py-2 px-4 bg-orange-500 hover:bg-orange-600 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-orange-500/25"
              >
                Accept
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FriendsPage;