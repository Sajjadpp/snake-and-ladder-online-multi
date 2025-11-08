import React, { createContext, useEffect, useState } from 'react';
import { SocketService } from '../../services/socket';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, setQuickPlayData } = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
    if (user?._id) {
      const socketInstance = SocketService.connect(user._id);
      setSocket(socketInstance);

      // Listen for connection status changes
      const handleConnect = () => setIsConnected(true);
      const handleDisconnect = () => setIsConnected(false);
      const handleRoomFound = (data) => {
        console.log('Room found via socket:', data);
        setQuickPlayData(data)
        
      }

      socketInstance.on('connect', handleConnect);
      socketInstance.on('room-found', handleRoomFound)
      socketInstance.on('disconnect', handleDisconnect);

      return () => {
        socketInstance.off('connect', handleConnect);
        socketInstance.off('disconnect', handleDisconnect);
        SocketService.disconnect();
      };
    } else {
      // Clean up socket if user logs out
      SocketService.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [user?._id]);

  const value = {
    socket,
    isConnected,
    emit: SocketService.emit,
    on: SocketService.on,
    off: SocketService.off
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};