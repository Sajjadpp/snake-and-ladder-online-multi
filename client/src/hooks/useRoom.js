// hooks/useRoom.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useSocket } from '../contexts/SocketContext';
import { axiosInstance } from '../axios';

export const useRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const { socket } = useSocket();

  const [roomData, setRoomData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeWaiting, setTimeWaiting] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isFresher, setIsFresher] = useState(true);

  // Derived state using useMemo for performance
  const derivedState = useMemo(() => {
    const currentPlayers = roomData?.players?.length || 0;
    const maxPlayers = roomData?.allowedPlayers || 2;
    const readyPlayers = roomData?.players?.filter(p => p.status === 'ready').length || 0;
    const canStartGame = readyPlayers === maxPlayers;
    const isHost = roomData && user && roomData.owner._id === user._id;

    return {
      currentPlayers,
      maxPlayers,
      readyPlayers,
      canStartGame,
      isHost
    };
  }, [roomData, user]);

  // Room data fetcher
  const fetchRoomData = useCallback((data) => {
    console.log('Fetching room data...', data);
    
    if (data.progress === 'in Game') {    
      navigate(`/game/${data.gameId}`);
      return; 
    }
    else if(data.progress === 'Game Done'){
      navigate('/home');
      toast.info('The game has ended. Returning to home.');
      return;
    }
    
    setRoomData(data);
    setIsLoading(false);
    console.log('Room data fetched successfully');
  }, [navigate]);

  // Room actions
  const handleToggleReady = useCallback(() => {
    console.log(socket, user, roomData,'new data...')
    if (!socket || !user || !roomData) return;
    
    const currentPlayer = roomData.players.find(p => p._id === user._id);
    const currentStatus = currentPlayer?.status;
    const newStatus = currentStatus === 'waiting' ? 'ready' : 'waiting';
    
    socket.emit('player_status_toogle', { 
      roomId, 
      userId: user._id, 
      status: newStatus 
    });
  }, [socket, roomId, user, roomData]);

  const handleStartGame = useCallback(async () => {
    if (!roomId || !derivedState.canStartGame) return;
    
    try {
      const response = await axiosInstance.post(`/game/start-game/${roomId}`);
      const gameId = response.data;
      socket.emit('start-game', { roomId, gameId });
      setIsStarted(true);
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error('Error starting game:', error);
      toast.error('Failed to start game');
    }
  }, [roomId, derivedState.canStartGame, socket, navigate, toast]);

  const handleLeaveRoom = useCallback(async () => {
    if (isStarted) return;
    if (isFresher) return setIsFresher(false);
    
    if (socket) {
      socket.emit('leave_room', { roomId, userId: user._id });
    }
    navigate('/home');
  }, [isStarted, isFresher, socket, roomId, user, navigate]);

  const handleCopyCode = useCallback(() => {
    if (!roomId) return;
    
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [roomId]);
  
  const handleinviteFriend = useCallback((friendId) => {
    socket.emit('send_room_invitation', {
      friendId,
      userId: user._id,
      roomId
    })
  }, [socket, user]);
  

  const handleShareGame = useCallback(() => {
    if (!roomId || !roomData) return;
    
    if (navigator.share) {
      navigator.share({
        title: `Join my ${roomData?.loungeId?.name || 'Snake & Ladder'} Game`,
        text: `Join my ${roomData?.loungeId?.name || 'Snake & Ladder'} game! Room code: ${roomId}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      handleCopyCode();
    }
  }, [roomId, roomData, handleCopyCode]);

  // Socket event handlers
  const setupSocketListeners = useCallback(() => {
    if (!socket || !roomId || !user) {
      console.log('Missing socket, roomId, or user');
      return () => {};
    }

    console.log('Setting up socket listeners for room:', roomId);
    
    const handleConnect = () => {
      console.log('Socket connected');
      setIsConnected(true);
      socket.emit('join_room', roomId);
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    };

    const handleRoomUpdate = (data) => {
      console.log('Room update event received');
      fetchRoomData(data);
    };

    const handlePlayerStatusToggle = ({ roomId: eventRoomId, userId, status }) => {
      if (eventRoomId !== roomId) return;
      
      setRoomData(prev => {
        if (!prev) return prev;
        
        return {
          ...prev, 
          players: prev.players.map(p => 
            p._id === userId ? { ...p, status } : p
          )
        };
      });
    };

    const handleTriggerNavigate = (gameId) => {
      console.log('Navigating to game:', gameId);
      navigate(`/game/${gameId}`);
    };

    // Event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('room-updates', handleRoomUpdate);
    socket.on('toogle_player_status', handlePlayerStatusToggle);
    socket.on('trigger-navigate', handleTriggerNavigate);

    // Join room if already connected
    if (socket.connected) {
      console.log('Socket already connected, joining room');
      socket.emit('join_room', roomId, user._id);
    }

    // Cleanup function
    return () => {
      console.log('Cleaning up socket listeners for room:', roomId);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('room-updates', handleRoomUpdate);
      socket.off('toogle_player_status', handlePlayerStatusToggle);
      socket.off('trigger-navigate', handleTriggerNavigate);
    };
  }, [socket, roomId, user, fetchRoomData, navigate]);

  // Effects
  useEffect(() => {
    const cleanup = setupSocketListeners();
    return cleanup;
  }, [setupSocketListeners]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeWaiting(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    console.log('game prgress', roomData?.progress, roomData?.gameId)
    if(roomData && roomData?.progress === 'in Game') {
      console.log('nvaigating to game')
      navigate(`/game/${roomData.gameId}`);
    }
  }, [navigate, roomData])

  return {
    // State
    roomData,
    isLoading,
    timeWaiting,
    isConnected,
    copied,
    isStarted,
    isFresher,
    
    // Derived state
    ...derivedState,
    
    // Actions
    handleToggleReady,
    handleStartGame,
    handleLeaveRoom,
    handleCopyCode,
    handleShareGame,
    handleinviteFriend,
    
    // Setters
    setRoomData,
    setIsLoading,
    setIsFresher
  };
};