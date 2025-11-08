class SocketEmitter {
  constructor(io) {
    this.io = io;
  }

  // Emit to specific user by userId
  emitToUser(userId, event, data) {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  // Emit to multiple users
  emitToUsers(userIds, event, data) {
    userIds.forEach(userId => {
      this.io.to(`user:${userId}`).emit(event, data);
    });
  }

  // Emit to all clients in a room
  emitToRoom(roomId, event, data) {
    this.io.to(roomId).emit(event, data);
  }

  // Emit to all clients except those in the room
  emitToAllExceptRoom(roomId, event, data) {
    this.io.except(roomId).emit(event, data);
  }

  // Emit to all connected clients
  emitToAll(event, data) {
    this.io.emit(event, data);
  }

  // Emit to specific socket connection
  emitToSocket(socketId, event, data) {
    this.io.to(socketId).emit(event, data);
  }

  // Join user to their personal room (for user-specific events)
  joinUserRoom(socket, userId) {
    socket.join(`user:${userId}`);
  }

  // Join room
  joinRoom(socket, roomId) {
    socket.join(roomId);
  }

  // Leave room
  leaveRoom(socket, roomId) {
    socket.leave(roomId);
  }

  // Leave user's personal room
  leaveUserRoom(socket, userId) {
    socket.leave(`user:${userId}`);
  }

  // Get all rooms a socket is in
  getSocketRooms(socket) {
    return Array.from(socket.rooms);
  }

  // Get all sockets in a room
  getRoomSockets(roomId) {
    return this.io.sockets.adapter.rooms.get(roomId);
  }

  // Get room size (number of clients in room)
  getRoomSize(roomId) {
    const room = this.io.sockets.adapter.rooms.get(roomId);
    return room ? room.size : 0;
  }

  // Check if room exists
  roomExists(roomId) {
    return this.io.sockets.adapter.rooms.has(roomId);
  }

  // Check if user is in room
  isUserInRoom(socket, roomId) {
    return socket.rooms.has(roomId);
  }

  // Broadcast to all in room except sender
  broadcastToRoom(socket, roomId, event, data) {
    socket.to(roomId).emit(event, data);
  }

  // Broadcast to all except sender
  broadcast(socket, event, data) {
    socket.broadcast.emit(event, data);
  }
}

module.exports = SocketEmitter;