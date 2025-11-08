import React, { createContext, useReducer, useEffect } from 'react';
import { gameReducer, gameActions } from './GameReducer';

const GameContext = createContext();

const initialState = {
  players: [],
  turn: null,
  diceRoll: null,
  timer: 30,
  boardData: { name: null, board: [], id: null },
  gameStatus: 'waiting', // waiting, playing, finished
  winner: null
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Timer countdown effect
  useEffect(() => {
    if (!state.turn || state.gameStatus !== 'playing') return;

    const timerInterval = setInterval(() => {
      if (state.timer > 0) {
        dispatch({ type: gameActions.SET_TIMER, payload: state.timer - 1 });
      } else {
        endTurn(); // Auto end turn when timer reaches 0
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [state.turn, state.timer, state.gameStatus]);

  const endTurn = () => {
    if (state.players.length === 0) return;

    const currentIndex = state.players.findIndex((p) => p.user._id === state.turn);
    const nextIndex = (currentIndex + 1) % state.players.length;
    const nextPlayerId = state.players[nextIndex]?.user._id;

    dispatch({ type: gameActions.SET_TURN, payload: nextPlayerId });
    dispatch({ type: gameActions.SET_TIMER, payload: 30 });
    dispatch({ type: gameActions.SET_DICE_ROLL, payload: null });
  };

  const updatePlayerPosition = (userId, newPosition) => {
    dispatch({ 
      type: gameActions.UPDATE_PLAYER_POSITION, 
      payload: { userId, newPosition } 
    });

    // Check for winner
    if (newPosition >= 100) {
      const winner = state.players.find(player => player.user._id === userId);
      dispatch({ type: gameActions.SET_WINNER, payload: winner });
    }
  };

  const setPlayers = (players) => {
    dispatch({ type: gameActions.SET_PLAYERS, payload: players });
  };

  const setTurn = (turn) => {
    dispatch({ type: gameActions.SET_TURN, payload: turn });
  };

  const setDiceRoll = (diceRoll) => {
    dispatch({ type: gameActions.SET_DICE_ROLL, payload: diceRoll });
  };

  const setBoardData = (boardData) => {
    dispatch({ type: gameActions.SET_BOARD_DATA, payload: boardData });
  };

  const setGameStatus = (gameStatus) => {
    dispatch({ type: gameActions.SET_GAME_STATUS, payload: gameStatus });
  };

  const resetGame = () => {
    dispatch({ type: gameActions.RESET_GAME });
  };

  const value = {
    // State
    ...state,
    
    // Actions
    setPlayers,
    setTurn,
    setDiceRoll,
    setBoardData,
    setGameStatus,
    endTurn,
    updatePlayerPosition,
    resetGame
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = React.useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};