export { SocketService } from './socketService';
export { GameEventHandlers, RoomEventHandlers , handleRoomUpdatesGeneral} from './eventHandlers';

// Backward compatibility exports
export { 
  connectSocket, 
  disconnectSocket, 
  getSocket 
} from './socketService';