import React, { useState, useEffect, useRef } from 'react';
import { useNotification } from '../../contexts/NotificationContext'; 
import FriendRequestPopup from '../../components/ui/Popups/invitationPopup';
import { useFriends } from '../../hooks/useFriend';

const FriendRequestHandler = () => {
  const { notifications, markAsRead } = useNotification();
  const [activeInvitation, setActiveInvitation] = useState(null);
  const { handleAcceptFriendRequest } = useFriends();
  const processedRequestsRef = useRef(new Set());

  // Auto-show friend request when it arrives
  useEffect(() => {
    // Find the first unread and pending friend request
    const newFriendRequest = notifications.find(
      (notification) =>
        notification.type === 'friend_request' &&
        !notification.read &&
        !processedRequestsRef.current.has(notification._id) // Use _id instead of id
    );

    if (newFriendRequest) {
      console.log('New friend request found:', newFriendRequest);
      
      // 🛠️ FIX: Create proper sender object from senderId
      const invitationData = {
        id: newFriendRequest.id, // Use _id from your data
        type: 'friend_request',
        sender: {
          _id: newFriendRequest.sender.id, // Use senderId from notification
          username: newFriendRequest.sender.username || 'Unknown User' // Fallback for username
        },
        message: newFriendRequest.message,
        createdAt: newFriendRequest.createdAt,
        mutualFriends: newFriendRequest.data?.mutualFriends || 0,
      };

      processedRequestsRef.current.add(newFriendRequest._id);
      setActiveInvitation(invitationData);
    }
  }, [notifications]);

  const handleAccept = async () => {
    if (activeInvitation) {
      try {
        console.log(activeInvitation,'active invitation')
        await handleAcceptFriendRequest(activeInvitation.sender.id ?? activeInvitation.sender._id, activeInvitation.id); // Pass sender ID
        await markAsRead(activeInvitation.id);
        console.log('Accepted friend request from:', activeInvitation.sender.username);
      } catch (error) {
        console.error('Error accepting friend request:', error);
      }
      setActiveInvitation(null);
    }
  };

  const handleDecline = async () => {
    if (activeInvitation) {
      try {
        await markAsRead(activeInvitation.id);
        console.log('Declined friend request from:', activeInvitation.sender.username);
      } catch (error) {
        console.error('Error declining friend request:', error);
      }
      setActiveInvitation(null);
    }
  };

  const handleClose = () => {
    setActiveInvitation(null);
  };

  // Debug log
  useEffect(() => {
    if (activeInvitation) {
      console.log('Active Invitation Data:', activeInvitation);
    }
  }, [activeInvitation]);

  return (
    <FriendRequestPopup
      request={activeInvitation}
      isOpen={!!activeInvitation}
      onClose={handleClose}
      invitation={activeInvitation}
      onAccept={handleAccept}
      onDecline={handleDecline}
    />
  );
};

export default FriendRequestHandler;