const roomService = require('../../business/service/roomService');

// Middleware to check if user is in the room
exports.userInRoom = async (req, res, next) => {
  try {
    const { id:roomId } = req.params;
    const userId = req.user.id;
    
    if (!roomId) {
      return res.status(400).json({ error: 'Room ID is required' });
    }
    console.log(roomId, userId,"user and room")
    // Check if user is in the room
    const isInRoom = await roomService.isUserInRoom(roomId, userId);
    if (!isInRoom) {
      return res.status(403).json({ 
        error: 'You are not a member of this room' 
      });
    }

    next();
  } catch (error) {
    console.error('Room middleware error:', error);
    
    if (error.message === 'ROOM_NOT_FOUND') {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.status(500).json({ error: 'Failed to verify room membership' });
  }
};

// Middleware to check if user is room owner
exports.isRoomOwner = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    const isOwner = await roomService.isRoomOwner(roomId, userId);
    if (!isOwner) {
      return res.status(403).json({ 
        error: 'Only room owner can perform this action' 
      });
    }

    next();
  } catch (error) {
    console.error('Room owner middleware error:', error);
    res.status(500).json({ error: 'Failed to verify room ownership' });
  }
};

// Middleware to check if room is joinable
exports.roomIsJoinable = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const canJoin = await roomService.canJoinRoom(roomId);
    if (!canJoin.canJoin) {
      return res.status(400).json({ error: canJoin.reason });
    }

    next();
  } catch (error) {
    console.error('Room joinable middleware error:', error);
    res.status(500).json({ error: 'Failed to check room status' });
  }
};