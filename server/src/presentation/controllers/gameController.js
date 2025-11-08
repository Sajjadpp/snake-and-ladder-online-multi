const gameService = require('../../business/service/gameService');
const roomService = require('../../business/service/roomService');
const { mapErrorToHttpResponse } = require('../utils/errorMapper');

const gameController = {
    
    async createGame(req, res) {

        try {
            const {roomId} = req.params;
            const userId = req.user;
            let newGame = await gameService.createGame(roomId, userId);
            res.json(newGame._id)
        }
        catch(error) {
            console.log(error);
            const httpError = mapGameErrorToHttpResponse(error);
            res.status(httpError.status).json({ 
                success: false,
                error: httpError.message 
            });
        }
    },
 
    async getGameDetails(req, res) {
        try {
            const { gameId } = req.params;
            const playerId = req.user.id;
            // console.log(gameId, playerId)
            // Call business service
            const gameDetails = await gameService.getGameDetails(gameId, playerId);
            // console.log(gameDetails, 'game details in controller')
            // HTTP: Format response
            res.json(gameDetails);

        } catch (error) {
            // Map business errors to HTTP responses
            console.log(error)
            const httpError = mapGameErrorToHttpResponse(error);
            res.status(httpError.status).json({ 
                success: false,
                error: httpError.message 
            });
        }
    },

    async getGameResult(req, res) {

        try {
            const { gameId } = req.params;
            const playerId = req.user.id;
            const gameResult = await gameService.getGameResult(gameId, playerId);
            return res.json(gameResult);
        }
        catch(error) {
            console.log(error);
            const httpError = mapErrorToHttpResponse(error);
            res.status(httpError.status).json(httpError.message)
        }
    },

    async updateGameMoves(req, res) {
        try {
            const { gameId } = req.params;
            const moveData = req.body;

            // HTTP: Basic validation
            if (!gameId) {
                return res.status(400).json({ 
                    error: 'Game ID is required' 
                });
            }

            if (!moveData || Object.keys(moveData).length === 0) {
                return res.status(400).json({ 
                    error: 'Move data is required' 
                });
            }

            // Call business service
            const updatedGame = await gameService.updateGameMoves(gameId, moveData);
            
            // HTTP: Format response
            res.json({
                success: true,
                message: 'Game move updated successfully',
                game: updatedGame
            });

        } catch (error) {
            // Map business errors to HTTP responses
            const httpError = mapGameErrorToHttpResponse(error);
            res.status(httpError.status).json({ 
                success: false,
                error: httpError.message 
            });
        }
    }

};

// Pure HTTP error mapping
function mapGameErrorToHttpResponse(error) {
    const errorMap = {
        'GAME_NOT_FOUND': { status: 404, message: 'Game not found' },
        'PLAYER_NOT_IN_GAME': { status: 403, message: 'Player not part of this game' },
        'INVALID_MOVE_DATA': { status: 400, message: 'Invalid move data' },
        'NOT_YOUR_TURN': { status: 400, message: 'Not your turn to move' },
        'GAME_ALREADY_FINISHED': { status: 400, message: 'Game has already finished' },
        'INVALID_POSITION': { status: 400, message: 'Invalid move position' },
        "GAME_IN_PROGRESS": { status: 409, message: 'game in progress' },
    };

    return errorMap[error.message] || { status: 500, message: 'Internal server error' };
}

module.exports = gameController;