import { axiosInstance } from '../../axios';
import { getSocket } from '../socket';
import { API_ROUTES, ROOM_TYPES } from './apiConstants';

export const RoomApi = {
  // Get all available rooms
  getRooms: async () => {
    try {
      const response = await axiosInstance.get(API_ROUTES.ROOM.BASE);
      console.log('Rooms fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch rooms');
    }
  },

  // Create a new room
  createRoom: async (isPrivate, selectedGame, user) => {
    try {
      const roomType = isPrivate ? ROOM_TYPES.PRIVATE : ROOM_TYPES.PUBLIC;
      
      const response = await axiosInstance.post(API_ROUTES.ROOM.CREATE, {
        roomType,
        loungeId: selectedGame._id,
        playerId: user._id
      });
      
      console.log('Room created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating room 1:', error.response.data);
      throw new Error(error.response?.data?.error);
    }
  },

  // Quick play - join random room
  quickPlay: async (user) => {
    let socketId = getSocket().id;
    try {
      console.log(user._id, getSocket().id, 'user and socket id in quick play api')
      console.log('requesting ....', API_ROUTES.ROOM.QUICK_PLAY === "/room/quick-play", user._id)
      const response = await axiosInstance.post(`/room/quick-play?socketId=${socketId}`);
      
      console.log('Quick play success:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in quick play:', error);
      throw new Error(error.response?.data?.message || 'Failed to quick play');
    }
  },

  // Join specific room
  joinRoom: async (roomId, user) => {
    try {
      const response = await axiosInstance.post(
        `${API_ROUTES.ROOM.JOIN}/${roomId}`,
        { playerId: user._id }
      );
      
      console.log('Room joined:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error joining room:', error);
      throw new Error(error.response?.data?.message || 'Failed to join room');
    }
  },

  // Check if user is already in a room
  checkUserInRoom: async (userId) => {
    try {
      const response = await axiosInstance.get(
        `${API_ROUTES.ROOM.USER_ROOM}/${userId}`
      );
      
      console.log('User room check:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error checking user room:', error);
      // Return null instead of throwing for this specific case
      return null;
    }
  },

  // Leave room
  leaveRoom: async (roomId, userId) => {
    try {
      const response = await axiosInstance.post(
        `${API_ROUTES.ROOM.LEAVE}/${roomId}`,
        { playerId: userId }
      );
      
      console.log('Room left:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error leaving room:', error);
      throw new Error(error.response?.data?.message || 'Failed to leave room');
    }
  },


};

// For backward compatibility - keep your original function names
export const {
  getRooms,
  createRoom,
  quickPlay,
  joinRoom,
  leaveRoom
} = RoomApi;

// Fix the typo in the original function name
export const checkUserInRoom = RoomApi.checkUserInRoom;