import { io } from "socket.io-client";
import { baseUrl } from "../../axios";

let socket = null;

export const SocketService = {
  connect: (userId) => {
    // Disconnect existing socket if any
    if (socket) {
      socket.disconnect();
      socket = null;
    }

    socket = io(baseUrl, {
      query: { userId },
      transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    // Setup event handlers
    setupEventHandlers(socket);

    return socket;
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      console.log("Socket disconnected manually");
    }
  },

  getSocket: () => socket,

  isConnected: () => socket?.connected || false,

  // Helper methods for common operations
  emit: (event, data) => {
    if (socket?.connected) {
      socket.emit(event, data);
      return true;
    }
    console.warn(`Socket not connected. Cannot emit event: ${event}`);
    return false;
  },

  on: (event, callback) => {
    if (socket) {
      socket.on(event, callback);
    }
  },

  off: (event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  },

  removeAllListeners: (event) => {
    if (socket) {
      socket.removeAllListeners(event);
    }
  }
};

// Event handlers setup
const setupEventHandlers = (socket) => {
  // Connection events
  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("🔌 Socket disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error.message);
  });

  socket.on("reconnect_attempt", (attemptNumber) => {
    console.log(`🔄 Socket reconnection attempt: ${attemptNumber}`);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log(`✅ Socket reconnected after ${attemptNumber} attempts`);
  });

  socket.on("reconnect_failed", () => {
    console.error("❌ Socket reconnection failed");
  });

  // Your custom events
  socket.on("sample_emit", () => {
    console.log("📨 Sample event received - connection successful");
  });

  // Ping/Pong for connection health
  socket.on("pong", (latency) => {
    console.log(`🏓 Socket latency: ${latency}ms`);
  });
};

// For backward compatibility
export const connectSocket = (userId) => SocketService.connect(userId);
export const disconnectSocket = () => SocketService.disconnect();
export const getSocket = () => SocketService.getSocket();