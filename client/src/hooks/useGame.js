import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { SocketService } from '../services/socket';
import { axiosInstance } from '../axios';
import soundService from '../services/sound';

export const useGame = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [gameData, setGameData] = useState({});
  const [players, setPlayers] = useState([]);
  const [turn, setTurn] = useState(null);
  const [diceRoll, setDiceRoll] = useState(null);
  const [boardData, setBoardData] = useState({ name: null, board: [], id: null });
  const [gameStatus, setGameStatus] = useState('in-progress');
  const [winner, setWinner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timer, setTimer] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Refs
  const timerRef = useRef(null);
  const previousTurnRef = useRef(null);
  const listenersRegisteredRef = useRef(false);
  const playersRef = useRef(players);

  const socket = SocketService.getSocket();

  // Keep playersRef updated
  useEffect(() => {
    playersRef.current = players;
  }, [players]);

  const derivedState = useMemo(() => {
    const currentPlayer = players.find(p => p?.user?._id === user?._id);
    const isMyTurn = turn?.user?._id === user?._id;
    const currentPlayerIndex = players.findIndex(p => p?.user?._id === turn?.user?._id);

    return {
      currentPlayer,
      isMyTurn,
      currentPlayerIndex,
      totalPlayers: players.length
    };
  }, [players, turn, user]);

  const isGameActive = useMemo(() => 
    gameStatus === 'playing' || gameStatus === 'in-progress', 
    [gameStatus]
  );

  // Timer functions
  const startTimer = useCallback(() => {
    setIsTimerRunning(true);
    setTimer(30);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    setTimer(30);
  }, [stopTimer]);

  // Fetch game data
  const fetchGameData = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(`/game/${gameId}`);
      if(data.status === 'finished') {
        navigate(`/game-result/${gameId}`)
      }
      if (data?.winner) {
        setWinner(data.winner);
        setGameStatus('finished');
        stopTimer();
      }
      if (data?.status) {
        setGameStatus(data.status);
      }
      
      setPlayers(data.players || []);
      setGameData(data);
      setBoardData(data.board || { name: null, board: [], id: null });
      
      const currentTurnPlayer = data.players?.find(
        p => p?.user?._id === data.turn?._id
      ) || null;
      setTurn(currentTurnPlayer);
      
      if (currentTurnPlayer && (data.status === 'playing' || data.status === 'in-progress')) {
        resetTimer();
        startTimer();
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching game data:', error);
      toast.error(error.message);
      setIsLoading(false);
    }
  }, [gameId, toast, stopTimer, resetTimer, startTimer]);

  // Roll dice request
  const handleRollDice = useCallback(() => {
    if (!derivedState.isMyTurn || !isGameActive) return;
    soundService.diceClick();
    SocketService.emit('request_dice_roll', {
      playerId: user._id,
      gameId: gameId
    });
  }, [derivedState.isMyTurn, isGameActive, user, gameId]);

  const handleLeaveGame = useCallback(() => {
    stopTimer();
    SocketService.emit('exit_game', { playerId: user._id, gameId });
    navigate('/home');
  }, [navigate, stopTimer, user, gameId]);

  // Handle dice rolled - just update positions, animation happens in GameBoard
  const handleDiceRolled = useCallback(async ({ diceValue, nextTurn, newPosition, playerId }) => {
    soundService.diceRoll();
    stopTimer();
    setDiceRoll({ diceValue, playerId });
    
    // Add delay for originality (wait for animation to complete)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update player position - animation will be handled in GameBoard
    setPlayers(prev => prev.map(player => 
      player.user._id === playerId 
        ? { ...player, position: newPosition }
        : player
    ));
    
    // Update turn after animation delay
    const nextPlayer = playersRef.current.find(p => p?.user?._id === nextTurn.userId);
    if (nextPlayer) {
      setTurn(nextPlayer);
      if (isGameActive) {
        startTimer();
      }
    }
    
    if (newPosition === 100 && playerId === user._id) {
      SocketService.emit('request_game_end', { 
        playerId, 
        gameId, 
        gameStatus: "success" 
      });
    }
  }, [stopTimer, isGameActive, startTimer, user, gameId]);

  // Auto-roll dice when timer reaches 0 (only for current turn player)
  useEffect(() => {
    if (timer === 0 && derivedState.isMyTurn && isGameActive) {
      handleRollDice();
    }
  }, [timer, derivedState.isMyTurn, isGameActive, handleRollDice]);

  // Setup socket listeners
  useEffect(() => {
    if (!socket || !gameId || !user || listenersRegisteredRef.current) {
      return;
    }

    listenersRegisteredRef.current = true;

    const handleGameEnd = ({ gameStatus: endStatus, winner: winnerId }) => {
      console.log('Game ended with status:', endStatus);
      setGameStatus('finished');
      stopTimer();
      
      if (endStatus === 'finished') {
        navigate(`/game-result/${gameId}`);
      }
    };

    const updatePlayerStatus = ({ playerId, status }) => {
      setPlayers(prev => 
        prev.map(p => 
          p.user._id === playerId.toString() ? { ...p, status } : p
        )
      );
    };

    SocketService.on('dice_rolled', handleDiceRolled);
    SocketService.on('game_over', handleGameEnd);
    SocketService.on('error', (error) => {  
      console.error('Socket error:', error);
      toast.error(error.message || 'An error occurred');
    });
    SocketService.on('player_left_game', updatePlayerStatus);
    
    SocketService.emit('join_game', { playerId: user._id, gameId });

    return () => {
      SocketService.off('dice_rolled', handleDiceRolled);
      SocketService.off('game_over', handleGameEnd);
      SocketService.off('error');
      SocketService.off('player_left_game');
      listenersRegisteredRef.current = false;
    };
  }, [socket, gameId, user, handleDiceRolled, stopTimer, toast, navigate]);

  // Fetch game data on mount
  useEffect(() => {
    if (user && gameId) {
      fetchGameData();
    }
  }, [user, gameId, fetchGameData]);

  // Handle turn changes
  useEffect(() => {
    if (turn?.user?._id !== previousTurnRef.current) {
      stopTimer();
      
      if (turn && isGameActive) {
        startTimer();
      }
      
      previousTurnRef.current = turn?.user?._id;
    }
  }, [turn, isGameActive, startTimer, stopTimer]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return {
    gameData,
    players,
    turn,
    diceRoll,
    boardData,
    gameStatus,
    winner,
    isLoading,
    timer,
    isTimerRunning,
    ...derivedState,
    handleRollDice,
    handleLeaveGame,
    fetchGameData,
    startTimer,
    stopTimer,
    resetTimer,
    setPlayers,
    setTurn,
    setBoardData,
    setGameStatus,
    setWinner
  };
};