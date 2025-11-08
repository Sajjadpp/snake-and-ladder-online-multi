// Centralized error mapping for the entire application
const errorMappings = {
  // Room-specific errors
  'LOUNGE_NOT_FOUND': { status: 404, message: 'The specified lounge was not found.' },
  'PLAYER_NOT_FOUND': { status: 404, message: 'The specified player was not found.' },
  'LOUNGE_INACTIVE': { status: 400, message: 'The specified lounge is not active.' },
  'INSUFFICIENT_COINS': { status: 400, message: 'Insufficient coins to create/join room.' },
  'ROOM_FULL': { status: 400, message: 'Room has reached maximum player capacity.' },
  'PLAYER_ALREADY_IN_ROOM': { status: 400, message: 'Player is already in this room.' },
  'NOT_ROOM_OWNER': { status: 403, message: 'Only room owner can perform this action.' },
  'DUPLICATE_ROOM_ID': { status: 409, message: 'A room with this ID already exists. Please try again.' },
  'GAME_ALREADY_STARTED': { status: 400, message: 'Cannot join room - game has already started.' },
  'ROOM_DENEID_ACCESS': { status: 404, message: 'Player not in this room' },
  'ROOM_NOT_FOUND': { status: 404, message: 'Room not found.' },
  'INSUFISIENT_DATA': { status: 400, message: 'missing some data from client' },



  // User/Auth errors
  'EMAIL_ALREADY_EXISTS': { status: 400, message: 'Email already registered' },
  'INVALID_CREDENTIALS': { status: 401, message: 'Invalid email or password' },
  'REFRESH_TOKEN_NOT_FOUND': { status: 401, message: 'Please login again' },
  'INVALID_REFRESH_TOKEN': { status: 403, message: 'Invalid refresh token' },

  // Game errors

  'GAME_NOT_FOUND': { status: 404, message: 'Game not found' },
  'PLAYER_NOT_IN_GAME': { status: 400, message: 'You are not a Player in this game!' },
  'NOT_YOUR_TURN': { status: 400, message: 'Not your turn to move' },
  'GAME_ALREADY_FINISHED': { status: 400, message: 'Game has already finished' },

  // Generic errors
  'VALIDATION_ERROR': { status: 400, message: 'Validation failed' },
  'DATABASE_ERROR': { status: 500, message: 'Database operation failed' },
  'NETWORK_ERROR': { status: 500, message: 'Network connectivity issue' }
};

function mapErrorToHttpResponse(error) {
  // Handle MongoDB specific errors
  if (error.code === 11000) {
    return { status: 409, message: 'Duplicate entry detected.' };
  }

  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(e => e.message);
    return { status: 400, message: `Validation failed: ${errors.join(', ')}` };
  }

  if (error.name === 'CastError') {
    return { status: 400, message: 'Invalid ID format provided.' };
  }

  // Handle custom business logic errors
  const mappedError = errorMappings[error.message];
  if (mappedError) {
    return mappedError;
  }

  // Default fallback
  return { 
    status: 500, 
    message: 'An internal server error occurred while processing your request.' 
  };
}

// Specific mappers for different domains (optional)
const roomErrorMapper = (error) => mapErrorToHttpResponse(error);
const userErrorMapper = (error) => mapErrorToHttpResponse(error);
const gameErrorMapper = (error) => mapErrorToHttpResponse(error);

module.exports = {
  mapErrorToHttpResponse,
  roomErrorMapper,
  userErrorMapper,
  gameErrorMapper,
  errorMappings // For testing
};