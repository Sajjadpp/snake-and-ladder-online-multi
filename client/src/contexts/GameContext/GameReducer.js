export const gameActions = {
  SET_PLAYERS: 'SET_PLAYERS',
  SET_TURN: 'SET_TURN',
  SET_DICE_ROLL: 'SET_DICE_ROLL',
  SET_TIMER: 'SET_TIMER',
  SET_BOARD_DATA: 'SET_BOARD_DATA',
  SET_GAME_STATUS: 'SET_GAME_STATUS',
  SET_WINNER: 'SET_WINNER',
  UPDATE_PLAYER_POSITION: 'UPDATE_PLAYER_POSITION',
  RESET_GAME: 'RESET_GAME'
};

export const gameReducer = (state, action) => {
  switch (action.type) {
    case gameActions.SET_PLAYERS:
      return { ...state, players: action.payload };
    
    case gameActions.SET_TURN:
      return { ...state, turn: action.payload };
    
    case gameActions.SET_DICE_ROLL:
      return { ...state, diceRoll: action.payload };
    
    case gameActions.SET_TIMER:
      return { ...state, timer: action.payload };
    
    case gameActions.SET_BOARD_DATA:
      return { ...state, boardData: action.payload };
    
    case gameActions.SET_GAME_STATUS:
      return { ...state, gameStatus: action.payload };
    
    case gameActions.SET_WINNER:
      return { ...state, winner: action.payload, gameStatus: 'finished' };
    
    case gameActions.UPDATE_PLAYER_POSITION:
      const { userId, newPosition } = action.payload;
      return {
        ...state,
        players: state.players.map(player => 
          player.user._id === userId 
            ? { ...player, position: newPosition }
            : player
        )
      };
    
    case gameActions.RESET_GAME:
      return {
        players: [],
        turn: null,
        diceRoll: null,
        timer: 30,
        boardData: { name: null, board: [], id: null },
        gameStatus: 'waiting',
        winner: null
      };
    
    default:
      return state;
  }
};