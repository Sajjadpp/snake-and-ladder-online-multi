import { AnimatePresence, motion } from "framer-motion";
import { Coins, Eye, Search, UserPlus, X, Shield, Crown } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useToast } from "../../../contexts";

// SearchModal Component
export const SearchModal = ({ 
  isOpen, 
  onClose, 
  searchQuery, 
  onSearchChange, 
  searchResults, 
  onAddFriend, 
  onViewProfile,
  isLoading = false,
  currentFriends = []
}) => {

  const toast = useToast();

  // Filter out users who are already friends
  const filteredResults = useMemo(() => {
    if (!searchResults || searchResults.length === 0) return [];
    
    return searchResults.filter(result => 
      !currentFriends.some(friend => friend._id.toString() === result._id.toString())
    );
  }, [searchResults, currentFriends]);

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

  const getRankBadge = (rank) => {
    switch (rank) {
      case 'premium':
        return <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500" />;
      case 'vip':
        return <Shield className="w-4 h-4 text-purple-500 fill-purple-500" />;
      default:
        return null;
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleResultClick = (result) => {
    onViewProfile(result);
    onClose(); // Close modal after viewing profile
  };

  const handleAddFriendClick = (e, userId) => {
    e.stopPropagation();
    onAddFriend(userId);
    onClose();  
    toast.success('Friend request sent');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with better touch handling */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-end justify-center md:items-center z-50 p-2 md:p-4 touch-none">
            <motion.div
              initial={{ opacity: 0, y: '100%', scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: '100%', scale: 0.95 }}
              transition={{ 
                duration: 0.3, 
                type: 'spring', 
                damping: 25,
                stiffness: 300 
              }}
              className="w-full max-w-md bg-slate-800/95 backdrop-blur-md rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col max-h-[90vh] md:max-h-[80vh] border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with swipe indicator */}
              <div className="pt-4 px-4 pb-2">
                <div className="w-12 h-1.5 bg-slate-600 rounded-full mx-auto mb-2" />
              </div>
              
              {/* Header with title and close button */}
              <div className="px-5 py-3 border-b border-slate-700/80 flex items-center justify-between bg-slate-900/50">
                <h2 className="text-xl font-bold text-white">Search Players</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-all duration-200 p-2 rounded-xl hover:bg-slate-700 active:scale-95 touch-manipulation"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Input */}
              <div className="px-5 py-4 bg-slate-900/30 sticky top-0 z-10 border-b border-slate-700/50">
                <div className="bg-slate-700/80 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3 border border-slate-600/50 focus-within:border-orange-500/50 transition-all duration-200">
                  <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search username or ID..."
                    className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-500 text-base md:text-sm"
                    autoFocus
                    enterKeyHint="search"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => onSearchChange('')}
                      className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-slate-600 active:scale-95 touch-manipulation transition-all duration-200"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Results */}
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  // Loading state
                  <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full mx-auto mb-3"
                      />
                      <p className="text-gray-400 text-sm">Searching players...</p>
                    </div>
                  </div>
                ) : filteredResults.length > 0 ? (
                  // Results list (only non-friends)
                  <div className="p-4 space-y-3">
                    {filteredResults.map((result, index) => {
                      const statusConfig = getStatusConfig(result.status);
                      
                      return (
                        <motion.div
                          key={result._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: 0.02 * index }}
                          className="bg-slate-700/60 backdrop-blur-sm rounded-xl p-4 hover:bg-slate-600/60 active:scale-[0.98] transition-all duration-200 touch-manipulation border border-slate-600/30 cursor-pointer"
                          onClick={() => handleResultClick(result)}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="relative flex-shrink-0">
                              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-lg">
                                {result.avatar || result.username?.charAt(0)?.toUpperCase()}
                              </div>
                              <div 
                                className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusConfig.color} rounded-full border-2 border-slate-800`}
                                title={statusConfig.text}
                              />
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-white truncate text-base">
                                  {result.username}
                                </h4>
                                {getRankBadge(result.rank)}
                              </div>
                              <p className="text-gray-400 text-sm truncate">ID: {result.id}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                <Coins className="w-3 h-3 text-amber-400 flex-shrink-0" />
                                <span>{(result.coins || 0).toLocaleString()} coins</span>
                                <span className="text-gray-500">•</span>
                                <span className={`${statusConfig.color.replace('bg-', 'text-')} font-medium`}>
                                  {statusConfig.text}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResultClick(result);
                              }}
                              className="flex-1 bg-slate-600 hover:bg-slate-500 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 touch-manipulation border border-slate-500/50"
                            >
                              <Eye className="w-4 h-4" />
                              View Profile
                            </button>
                            <button
                              onClick={(e) => handleAddFriendClick(e, result._id)}
                              className="flex-1 bg-orange-500 hover:bg-orange-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 touch-manipulation shadow-lg shadow-orange-500/25 border border-orange-400/50"
                            >
                              <UserPlus className="w-4 h-4" />
                              Add Friend
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : searchQuery && searchResults.length > 0 ? (
                  // All results are already friends
                  <div className="text-center py-12 px-6">
                    <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-600/50">
                      <UserPlus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">Already Friends</h3>
                    <p className="text-gray-400 text-sm mb-6">
                      All players matching "{searchQuery}" are already in your friends list.
                    </p>
                    <button
                      onClick={() => onSearchChange('')}
                      className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-xl text-white font-medium transition-all duration-200 active:scale-95 touch-manipulation shadow-lg shadow-orange-500/25"
                    >
                      Clear Search
                    </button>
                  </div>
                ) : searchQuery ? (
                  // No results state
                  <div className="text-center py-12 px-6">
                    <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-600/50">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">No players found</h3>
                    <p className="text-gray-400 text-sm mb-6">
                      No players found for "{searchQuery}". Try searching with a different username or ID.
                    </p>
                    <button
                      onClick={() => onSearchChange('')}
                      className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-xl text-white font-medium transition-all duration-200 active:scale-95 touch-manipulation shadow-lg shadow-orange-500/25"
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  // Empty state
                  <div className="text-center py-12 px-6">
                    <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-600/50">
                      <UserPlus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">Find Players</h3>
                    <p className="text-gray-400 text-sm mb-2">
                      Search for players by their username or unique ID
                    </p>
                    <p className="text-gray-500 text-xs">
                      You can add them as friends to play together
                    </p>
                  </div>
                )}
              </div>

              {/* Footer with search tips */}
              {(filteredResults.length > 0 || searchQuery) && !isLoading && (
                <div className="px-5 py-3 border-t border-slate-700/50 bg-slate-900/30">
                  <p className="text-gray-500 text-xs text-center">
                    {filteredResults.length > 0 
                      ? `${filteredResults.length} player${filteredResults.length > 1 ? 's' : ''} found` 
                      : searchResults.length > 0 
                        ? 'All results are already your friends'
                        : 'Tip: Use exact username for better results'
                    }
                  </p>
                </div>
              )}

              {/* Safe area for mobile */}
              <div className="h-4 md:h-0 bg-slate-800" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};