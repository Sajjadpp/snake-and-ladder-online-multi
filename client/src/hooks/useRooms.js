// hooks/useRooms.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useSocket } from '../contexts/SocketContext';
import { getRooms, checkUserInRoom } from '../services/api';
import { handleRoomUpdatesGeneral } from '../services/socket';

export const useRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [userExistingRoom, setUserExistingRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const toast = useToast();
  const { socket } = useSocket();

  // Fetch all rooms
  const fetchRooms = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const roomsData = await getRooms();
      setRooms(roomsData);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Check if user is already in a room
  const checkExistingRoom = useCallback(async () => {
    if (!user?._id) return;

    try {
      const existingRoom = await checkUserInRoom(user._id);
      setUserExistingRoom(existingRoom);
    } catch (error) {
      console.error('Error checking existing room:', error);
    }
  }, [user]);

  // Socket room updates
  useEffect(() => {
    if (!socket || !user) return;

    const handleRoomUpdates = handleRoomUpdatesGeneral(setRooms, setUserExistingRoom);
    socket.on('room-updates-general', handleRoomUpdates);

    return () => {
      socket.off('room-updates-general', handleRoomUpdates);
    };
  }, [socket, user]);

  // Initial data fetching
  useEffect(() => {
    fetchRooms();
    checkExistingRoom();
  }, []);

  return {
    // State
    rooms,
    userExistingRoom,
    loading,
    
    // Actions
    refetchRooms: fetchRooms,
    refetchExistingRoom: checkExistingRoom,
    
    // Setters
    setRooms,
    setUserExistingRoom
  };
};