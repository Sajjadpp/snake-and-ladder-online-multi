// hooks/useFriends.js
import { useState, useEffect, useCallback } from 'react';
import { friendApi } from '../services/api/friendApi';
import { useAuth, useSocket } from '../contexts';

export const useFriends = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket(); // Socket hook
  const [state, setState] = useState({
    friends: [],
    searchResults: [],
    isLoading: false,
    isRefreshing: false,
    activeFilter: 'all',
    searchQuery: '',
    debounceQuery: '',
    pendingRequests: [] // Track pending friend requests
  });

  // Filter options
  const filters = [
    { key: 'all', label: 'All Friends' },
    { key: 'online', label: 'Online' },
    { key: 'in-game', label: 'In Game' },
    { key: 'offline', label: 'Offline' }
  ];

  // Debouncing effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      setState(prev => ({ ...prev, debounceQuery: prev.searchQuery }));
    }, 500);
    return () => clearTimeout(timeout);
  }, [state.searchQuery]);

  // Load friends on mount
  useEffect(() => {
    if (!user) return;
    loadFriends();
    setupSocketListeners();
  }, [user]);

  const loadFriends = useCallback(async () => {
        try {
        setState(prev => ({ ...prev, isLoading: true }));
        const data = await friendApi.getAllFriends(user._id);
        setState(prev => ({ 
            ...prev, 
            friends: data || getMockFriends(),
            isLoading: false 
        }));
        } catch (error) {
        console.error('Failed to load friends:', error);
        setState(prev => ({ 
            ...prev, 
            friends: getMockFriends(),
            isLoading: false 
        }));
        }
    }, [user]);

  // Setup socket listeners for real-time friend updates
  const setupSocketListeners = useCallback(() => {
    if (!socket) return;

    // Listen for incoming friend requests
    socket.on('friend_request_received', (data) => {
      console.log('Friend request received:', data);
      setState(prev => ({
        ...prev,
        pendingRequests: [...prev.pendingRequests, data]
      }));
    });

    // Listen for friend request accepted
    socket.on('friend_request_accepted', (data) => {
      console.log('Friend request accepted:', data);
      // Refresh friends list when someone accepts our request
      loadFriends();
    });

    // Listen for friend removed
    socket.on('friend_removed', (data) => {
      console.log('Friend removed:', data);
      setState(prev => ({
        ...prev,
        friends: prev.friends.filter(friend => friend._id !== data.friendId)
      }));
    });

    // Listen for friend status updates
    socket.on('friend_status_updated', (data) => {
      console.log('Friend status updated:', data);
      setState(prev => ({
        ...prev,
        friends: prev.friends.map(friend =>
          friend._id === data.userId
            ? { ...friend, status: data.status, lastActive: data.lastActive }
            : friend
        )
      }));
    });

    // Cleanup socket listeners
    return () => {
      socket.off('friend_request_received');
      socket.off('friend_request_accepted');
      socket.off('friend_removed');
      socket.off('friend_status_updated');
    };
  }, [socket, loadFriends]);

  

  const handleRefresh = useCallback(async () => {
    setState(prev => ({ ...prev, isRefreshing: true }));
    await loadFriends();
    setTimeout(() => {
      setState(prev => ({ ...prev, isRefreshing: false }));
    }, 1000);
  }, [loadFriends]);

  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setState(prev => ({ ...prev, searchResults: [] }));
      return;
    }

    try {
      const data = await friendApi.getSearchedPlayers(query);
      setState(prev => ({ ...prev, searchResults: data || [] }));
    } catch (error) {
      console.error('Search failed:', error);
      setState(prev => ({ ...prev, searchResults: [] }));
    }
  }, []);

  // Send friend request via socket
  const handleAddFriend = useCallback(async (userId) => {
    try {
      console.log(socket, isConnected)

      console.log('Sending friend request to:', userId);
      
      // Emit socket event for friend request
      socket.emit('send_friend_request', {
        toUserId: userId,
        fromUserId: user._id,
        timestamp: new Date().toISOString()
      });

      // Optional: Show immediate feedback in UI
      setState(prev => ({
        ...prev,
        searchResults: prev.searchResults.map(result =>
          result._id === userId
            ? { ...result, requestSent: true, isPending: true }
            : result
        )
      }));

    } catch (error) {
      console.error('Failed to send friend request:', error);
      throw error; // Re-throw to handle in component
    }
  }, [socket, isConnected, user]);

  // Accept friend request via socket
  const handleAcceptFriendRequest = useCallback(async (requester, notificationId) => {
    console.log(requester,'requester')
    try {
      if (!socket || !isConnected) {
        console.warn('Socket not connected, falling back to API');
        // await friendApi.acceptFriendRequest(requestId);
        return;
      }

      console.log('Accepting friend request:');
      
      socket.emit('accept_friend_request', {
        requester: requester,
        acceptor: user._id,
        notificationId: notificationId
      });

      // Remove from pending requests
      setState(prev => ({
        ...prev,
        pendingRequests: prev.pendingRequests.filter(req => req._id !== requester)
      }));

      // Refresh friends list
      await loadFriends();

    } catch (error) {
      console.error('Failed to accept friend request:', error);
      throw error;
    }
  }, [socket, isConnected, user, loadFriends]);

  // Decline friend request via socket
  const handleDeclineFriendRequest = useCallback(async (requestId, fromUserId) => {
    try {
      if (!socket || !isConnected) {
        console.warn('Socket not connected, falling back to API');
        await friendApi.declineFriendRequest(requestId);
        return;
      }

      console.log('Declining friend request:', requestId);
      
      socket.emit('decline_friend_request', {
        requestId,
        fromUserId,
        toUserId: user._id
      });

      // Remove from pending requests
      setState(prev => ({
        ...prev,
        pendingRequests: prev.pendingRequests.filter(req => req._id !== requestId)
      }));

    } catch (error) {
      console.error('Failed to decline friend request:', error);
      throw error;
    }
  }, [socket, isConnected, user]);

  const handleRemoveFriend = useCallback(async (friendId) => {
    try {
      if (!socket || !isConnected) {
        console.warn('Socket not connected, falling back to API');
        await friendApi.removeFriend(friendId);
        setState(prev => ({
          ...prev,
          friends: prev.friends.filter(friend => friend._id !== friendId)
        }));
        return;
      }

      console.log('Removing friend:', friendId);
      
      socket.emit('remove_friend', {
        friendId,
        userId: user._id
      });

      // Optimistic update
      setState(prev => ({
        ...prev,
        friends: prev.friends.filter(friend => friend._id !== friendId)
      }));

    } catch (error) {
      console.error('Failed to remove friend:', error);
      throw error;
    }
  }, [socket, isConnected, user]);

  const setSearchQuery = useCallback((query) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const setActiveFilter = useCallback((filter) => {
    setState(prev => ({ ...prev, activeFilter: filter }));
  }, []);

  // Clear pending request (when popup is closed without action)
  const clearPendingRequest = useCallback((requestId) => {
    setState(prev => ({
      ...prev,
      pendingRequests: prev.pendingRequests.filter(req => req._id !== requestId)
    }));
  }, []);

  // Computed values
  const filteredFriends = state.friends.filter(friend => {
    if (state.activeFilter === 'all') return true;
    return friend.status === state.activeFilter;
  });

  const onlineCount = state.friends.filter(
    friend => friend.status === 'online' || friend.status === 'in-game'
  ).length;

  // Get next pending friend request for popup
  const nextPendingRequest = state.pendingRequests[0] || null;

  return {
    // State
    ...state,
    filteredFriends,
    onlineCount,
    nextPendingRequest,
    filters,
    isSocketConnected: isConnected,
    
    // Actions
    loadFriends,
    handleRefresh,
    handleSearch,
    handleAddFriend,
    handleAcceptFriendRequest,
    handleDeclineFriendRequest,
    handleRemoveFriend,
    setSearchQuery,
    setActiveFilter,
    clearPendingRequest
  };
};

// Mock data function
const getMockFriends = () => [
  {
    _id: '1',
    id: 'GM99',
    username: 'GameMaster99',
    userId: 'GM99',
    avatar: '🎮',
    status: 'online',
    lastActive: 'Now',
    coins: 12500,
    isOnline: true
  },
  {
    _id: '2',
    id: 'ProGamer',
    username: 'ProGamer2024',
    userId: 'ProGamer',
    avatar: '🏆',
    status: 'in-game',
    lastActive: '2 mins ago',
    coins: 8900,
    isOnline: true
  },
  {
    _id: '3',
    id: 'SnakeMaster',
    username: 'SnakeMaster',
    userId: 'SnakeMaster',
    avatar: '🐍',
    status: 'online',
    lastActive: 'Now',
    coins: 15600,
    isOnline: true
  },
  {
    _id: '4',
    id: 'ChessKing',
    username: 'ChessKing',
    userId: 'ChessKing',
    avatar: '♟️',
    status: 'offline',
    lastActive: '1 hour ago',
    coins: 6700,
    isOnline: false
  },
];