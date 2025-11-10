// components/room/FriendInviteSidebar.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, UserPlus, Users, User } from 'lucide-react';
import { useEffect } from 'react';
import { getAllFriends } from '../../../services/api/friendApi';
import { useToast } from '../../../contexts/ToastContext';


const FriendInviteSidebar = ({ 
  isOpen = false, 
  onClose = () => {}, 
  onInvite = (friendId) => console.log('Inviting:', friendId),
  user = null,
  roomId = null,
  currentPlayers = []
}) => {
    const [invitedIds, setInvitedIds] = useState(new Set());
    const [friends, setFriends] = useState([])
    const toast = useToast()

    const handleInvite = (friendId) => {
        setInvitedIds(prev => new Set([...prev, friendId]));
        onInvite(friendId, user, roomId);
        // Reset after animation
        setTimeout(() => {
            setInvitedIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(friendId);
                return newSet;
            });
        }, 2000);
    };
    useEffect(() => {
        if(!user && !isOpen) return;
        getAllFriends()
        .then(data => setFriends(data))
        .catch(error => toast.success(error.messages))
    }, [User, isOpen])

    const onlineFriends = friends;

    const getStatusColor = (status) => {
        switch(status) {
        case 'online': return 'bg-green-500';
        case 'in-room': return 'bg-orange-500';
        case 'offline': return 'bg-gray-400';
        default: return 'bg-gray-400';
        }
    };

    return (
        <AnimatePresence>
        {isOpen && (
            <>
            {/* Mobile Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/50 z-40 lg:bg-transparent"
            />

            {/* Sidebar - Fixed positioning to not affect layout */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-full sm:w-96 bg-gray-800 shadow-2xl z-50 flex flex-col"
                style={{ 
                // Ensure it doesn't affect the layout
                position: 'fixed',
                // Make sure it's above everything
                zIndex: 50
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-500" />
                    <h2 className="text-lg font-semibold text-white">Invite Friends</h2>
                    <span className="text-xs text-gray-400">({onlineFriends.length} online)</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>
                </div>

                {/* Friends List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {onlineFriends.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <UserPlus className="w-12 h-12 mb-2 opacity-50" />
                    <p className="text-sm">No online friends to invite</p>
                    </div>
                ) : (
                    onlineFriends.filter(friend => 
                        !currentPlayers.some(p => p.user._id.toString() === friend._id.toString())
                        ).map((friend, index) => (
                        <motion.div
                            key={friend._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-3 p-3 bg-gray-750 hover:bg-gray-700 rounded-xl transition-colors group"
                        >
                            {/* Avatar with Status */}
                            <div className="relative flex-shrink-0">
                            <div className='w-12 h-12 rounded-full ring-2 ring-gray-600 grid place-items-center'>
                                {friend.avatar}
                            </div>
                            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${getStatusColor(friend.status)} rounded-full ring-2 ring-gray-800`} />
                            </div>

                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{friend.username}</p>
                            <p className="text-xs text-gray-400 capitalize">{friend.status.replace('-', ' ')}</p>
                            </div>

                            {/* Invite Button */}
                            <motion.button
                            onClick={() => handleInvite(friend._id)}
                            disabled={invitedIds.has(friend._id)}
                            whileTap={{ scale: 0.9 }}
                            className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                                invitedIds.has(friend._id)
                                ? 'bg-green-500 text-white'
                                : 'bg-orange-500 hover:bg-orange-600 text-white'
                            }`}
                            >
                            <AnimatePresence mode="wait">
                                {invitedIds.has(friend._id) ? (
                                <motion.svg
                                    key="check"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0 }}
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </motion.svg>
                                ) : (
                                <motion.div
                                    key="plus"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0 }}
                                >
                                    <Plus className="w-5 h-5" />
                                </motion.div>
                                )}
                            </AnimatePresence>
                            </motion.button>
                        </motion.div>
                    ))
                )}
                </div>

                {/* Footer Info */}
                <div className="p-4 border-t border-gray-700 bg-gray-750">
                <p className="text-xs text-gray-400 text-center">
                    Friends will receive an instant room invite
                </p>
                </div>
            </motion.div>
            </>
        )}
        </AnimatePresence>
    );
};

export default FriendInviteSidebar;