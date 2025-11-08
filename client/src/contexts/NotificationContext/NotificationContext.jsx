import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { notificationApi } from '../../services/api/NotificationApi';
import { useAuth } from '../AuthContext'; 
import { useSocket } from '../SocketContext'; // Assuming you have a SocketContext
import { notificationReducer } from './NotificationReducer';
import { NOTIFICATION_ACTIONS } from './NotificationActions';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { user } = useAuth();
  const { socket, isConnected } = useSocket(); // Socket context

  // Load notifications and setup socket listeners
  useEffect(() => {
    if (user) {
      loadNotifications();
      setupSocketListeners();
    } else {
      dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ALL });
      cleanupSocketListeners();
    }

    return () => {
      cleanupSocketListeners();
    };
  }, [user, socket]);

  // Setup socket listeners for real-time notifications
  const setupSocketListeners = () => {
    if (!socket || !user) return;

    // Listen for new notifications
    socket.on('new_notification', (notification) => {
      console.log('New notification received:', notification);
      
      handleNewNotification(notification);
    });

    // Listen for notification updates (mark as read from other devices)
    socket.on('notification_updated', (data) => {
      console.log('Notification updated:', data);
      if (data.action === 'mark_as_read') {
        dispatch({ 
          type: NOTIFICATION_ACTIONS.MARK_AS_READ, 
          payload: data.notificationId 
        });
      }
    });

    // Listen for notification deletions
    socket.on('notification_deleted', (data) => {
      console.log('Notification deleted:', data);
      dispatch({ 
        type: NOTIFICATION_ACTIONS.DELETE_NOTIFICATION, 
        payload: data.notificationId 
      });
    });

    // Listen for friend request notifications specifically
    socket.on('friend_request_received', (data) => {
      console.log('Friend request notification:', data);
      const friendRequestNotification = {
        _id: data._id || `friend-request-${Date.now()}`,
        type: 'friend_request',
        title: 'Friend Request',
        message: `${data.senderUsername} sent you a friend request`,
        read: false,
        createdAt: new Date().toISOString(),
        data: {
          senderId: data.senderId,
          senderUsername: data.senderUsername,
          senderAvatar: data.senderAvatar,
          requestId: data.requestId
        },
        sender: {
          _id: data.senderId,
          username: data.senderUsername,
          avatar: data.senderAvatar
        }
      };
      handleNewNotification(friendRequestNotification);
    });

    // Listen for friend request accepted notifications
    socket.on('friend_request_accepted', (data) => {
      console.log('Friend request accepted notification:', data);
      const acceptedNotification = {
        _id: `friend-accepted-${Date.now()}`,
        type: 'friend_accept',
        title: 'Friend Request Accepted',
        message: `${data.acceptorUsername} accepted your friend request`,
        read: false,
        createdAt: new Date().toISOString(),
        data: {
          acceptorId: data.acceptorId,
          acceptorUsername: data.acceptorUsername
        }
      };
      handleNewNotification(acceptedNotification);
    });

    // Listen for game invitations
    socket.on('game_invitation_received', (data) => {
      console.log('Game invitation notification:', data);
      const gameInviteNotification = {
        _id: data._id || `game-invite-${Date.now()}`,
        type: 'game_invite',
        title: 'Game Invitation',
        message: `${data.senderUsername} invited you to play ${data.gameType}`,
        read: false,
        createdAt: new Date().toISOString(),
        data: {
          senderId: data.senderId,
          senderUsername: data.senderUsername,
          gameType: data.gameType,
          gameId: data.gameId,
          expiresAt: data.expiresAt
        },
        sender: {
          _id: data.senderId,
          username: data.senderUsername,
          avatar: data.senderAvatar
        }
      };
      handleNewNotification(gameInviteNotification);
    });
  };

  // Cleanup socket listeners
  const cleanupSocketListeners = () => {
    if (!socket) return;

    socket.off('new_notification');
    socket.off('notification_updated');
    socket.off('notification_deleted');
    socket.off('friend_request_received');
    socket.off('friend_request_accepted');
    socket.off('game_invitation_received');
  };

  // Handle new notification from socket
  const handleNewNotification = (notification) => {
    // Add visual/audio notification if needed
    showBrowserNotification(notification);
    
    // Dispatch to state
    dispatch({ 
      type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION, 
      payload: notification 
    });
  };

  // Browser notification (optional)
  const showBrowserNotification = (notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico', // Your app icon
        tag: notification._id
      });
    }
  };

  // Request browser notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
      }
    }
    return Notification.permission === 'granted';
  };

  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: true });
      const result = await notificationApi.getUserNotifications(user._id);
        console.log(result.notifications, 'notification data')
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS,
        payload: {
          notifications: result.notifications,
          unreadCount: result.pagination.unreadCount
        }
      });
    } catch (error) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // Optimistic update
      dispatch({ type: NOTIFICATION_ACTIONS.MARK_AS_READ, payload: notificationId });

      // API call as fallback
      await notificationApi.markAsRead(notificationId, user._id);
    } catch (error) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const markAllAsRead = async () => {
    try {
      dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_AS_READ });
      
      // Emit socket event if connected
      if (socket && isConnected) {
        socket.emit('mark_all_notifications_read', {
          userId: user._id
        });
      }
      
      await notificationApi.markAllAsRead(user._id);
    } catch (error) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      dispatch({ type: NOTIFICATION_ACTIONS.DELETE_NOTIFICATION, payload: notificationId });
      
      // Emit socket event if connected
      if (socket && isConnected) {
        socket.emit('delete_notification', {
          notificationId,
          userId: user._id
        });
      }
      
      await notificationApi.deleteNotification(notificationId, user._id);
    } catch (error) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const deleteAllRead = async () => {
    try {
      dispatch({ type: NOTIFICATION_ACTIONS.DELETE_ALL_READ });
      
      // Emit socket event if connected
      if (socket && isConnected) {
        socket.emit('delete_all_read_notifications', {
          userId: user._id
        });
      }
      
      await notificationApi.deleteAllRead(user._id);
    } catch (error) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const clearAll = async () => {
    try {
      dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ALL });
      
      // Emit socket event if connected
      if (socket && isConnected) {
        socket.emit('clear_all_notifications', {
          userId: user._id
        });
      }
      
      await notificationApi.clearAll(user._id);
    } catch (error) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const addNotification = (notification) => {
    dispatch({ type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION, payload: notification });
  };

  const refreshNotifications = () => {
    loadNotifications();
  };

  const clearError = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    isSocketConnected: isConnected,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    clearAll,
    addNotification,
    refreshNotifications,
    clearError,
    requestNotificationPermission
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};