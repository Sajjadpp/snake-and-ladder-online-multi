const Game = require("../models/game.model");
const mongoose = require("mongoose");

class GameRepository {
    
    // Basic CRUD operations
    async findById(gameId) {
        return await Game.findById(gameId);
    }

    async findByIdWithPlayers(gameId) {
        return await Game.findById(gameId)
            .populate('players.user', "username coins mobile")
            .populate('turn', 'username mobile')
            .lean();
    }

    async create(gameData) {
        const game = new Game(gameData);
        await game.save();
        return game;
    }

    async update(gameId, updateData) {
        return await Game.findByIdAndUpdate(
            gameId, 
            updateData, 
            { new: false }  // Changed: don't return doc
        );
    }

    async delete(gameId) {
        return await Game.findByIdAndDelete(gameId);
    }

    // ========== CRITICAL FOR DICE ROLL ==========
    // This is the MAIN method used for dice roll - MUST BE FAST
    async getGameStateForDiceRoll(gameId) {
        const t = Date.now();
        
        const game = await Game.findById(gameId)
            .select('status turn players.user players.position players.order board')
            .lean()
            .exec();
        
        console.log(`getGameStateForDiceRoll: ${Date.now() - t}ms`);
        return game;
    }

    // ========== OPTIMIZED: Single update for dice roll ==========
    // NEW: Combined position + turn update (replaces 2 separate calls)
    async updateGameStateAfterDiceRoll(gameId, playerId, newPosition, nextPlayerId) {
        const t = Date.now();
        
        await Game.findOneAndUpdate(
            { _id: gameId, 'players.user': playerId },
            { 
                $set: { 
                'players.$.position': newPosition,
                turn: nextPlayerId
                }
            },
            { new: true, lean: true }
        );
        
        console.log(`updateGameStateAfterDiceRoll: ${Date.now() - t}ms`);
    }

    // Game-specific queries
    async findByRoomId(roomId) {
        return await Game.findOne({ room: roomId })
            .populate('players.user')
            .populate('turn')
            .populate('winner')
            .lean();
    }

    async findActiveGameByRoomId(roomId) {
        return await Game.findOne({ 
            room: roomId, 
            status: 'in-progress' 
        })
        .populate('players.user')
        .lean();
    }

    async findByPlayerId(playerId) {
        return await Game.find({
            'players.user': playerId,
            status: 'in-progress'
        })
        .populate('players.user')
        .lean();
    }

    async findPlayerInGame(gameId, playerId) {
        const playerInRoom = await Game.findOne({
            _id: gameId,
            "players.user": playerId 
        }).lean();
        
        return playerInRoom ? true : false;
    }


    async updatePlayerPosition(gameId, playerId, newPosition) {
        const t = Date.now();
        
        await Game.updateOne(
            { 
                _id: gameId, 
                'players.user': playerId 
            },
            { 
                $set: { 'players.$.position': newPosition } 
            }
        );
        
        console.log(`updatePlayerPosition: ${Date.now() - t}ms`);
    }

    async updatePlayerStatus(gameId, playerId, status) {
        await Game.updateOne(
            { 
                _id: gameId, 
                'players.user': playerId 
            },
            { 
                $set: { 'players.$.status': status } 
            }
        );
    }

    async updatePlayerColor(gameId, playerId, color) {
        await Game.updateOne(
            { 
                _id: gameId, 
                'players.user': playerId 
            },
            { 
                $set: { 'players.$.color': color } 
            }
        );
    }

    // ========== OPTIMIZED: Turn management ==========
    async updateGameTurn(gameId, nextPlayerId) {
        const t = Date.now();
        
        await Game.updateOne(
            { _id: gameId },
            { $set: { 'turn': nextPlayerId } }
        );
        
        console.log(`updateGameTurn: ${Date.now() - t}ms`);
    }

    // ========== Game state management ==========
    async startGame(gameId) {
        return await Game.findByIdAndUpdate(
            gameId,
            { 
                status: 'in-progress',
                startedAt: new Date()
            },
            { new: false }
        );
    }

    async finishGame(gameId, winnerId) {
        return await Game.findByIdAndUpdate(
            gameId,
            { 
                status: 'finished',
                winner: winnerId,
                finishedAt: new Date(),
                $set: { 'players.$[].status': 'finished' }
            },
            { new: false }
        );
    }

    async abandonGame(gameId) {
        return await Game.findByIdAndUpdate(
            gameId,
            { 
                status: 'finished',
                $set: { 'players.$[].status': 'left' }
            },
            { new: false }
        );
    }

    // Bulk operations
    async findActiveGames() {
        return await Game.find({ status: 'in-progress' })
            .populate('players.user')
            .populate('turn')
            .lean();
    }

    async findFinishedGames(limit = 10) {
        return await Game.find({ status: 'finished' })
            .sort({ finishedAt: -1 })
            .limit(limit)
            .populate('players.user')
            .populate('winner')
            .lean();
    }

    // Statistics and analytics
    async getPlayerStats(playerId) {
        const stats = await Game.aggregate([
            {
                $match: {
                    'players.user': new mongoose.Types.ObjectId(playerId)
                }
            },
            {
                $facet: {
                    totalGames: [
                        { $count: 'count' }
                    ],
                    wins: [
                        { 
                            $match: { 
                                winner: new mongoose.Types.ObjectId(playerId) 
                            } 
                        },
                        { $count: 'count' }
                    ],
                    activeGames: [
                        { 
                            $match: { 
                                status: 'in-progress' 
                            } 
                        },
                        { $count: 'count' }
                    ]
                }
            }
        ]);

        return {
            totalGames: stats[0]?.totalGames[0]?.count || 0,
            wins: stats[0]?.wins[0]?.count || 0,
            activeGames: stats[0]?.activeGames[0]?.count || 0
        };
    }

    // ========== Client queries ==========
    async getGameForClient(gameId) {
        return await Game.findById(gameId)
            .populate('players.user', 'username _id avatar')
            .populate('turn', 'username _id')
            .populate('winner', 'username _id')
            .select('-__v -createdAt -updatedAt')
            .lean();
    }

    async validatePlayerInRoom(gameId, playerId) {
        return await Game.findOne({
            'players.user': playerId,
            _id: gameId
        }).lean();
    }

    // DEPRECATED: This is slow - use getGameStateForDiceRoll instead
    async getGameWithPlayers(gameId) {
        return await Game.findById(gameId)
            .populate('room')
            .lean();
    }

    async getGameResult(gameId) {

        return await Game.findOne({_id:gameId, status: "finished"})
            .populate('room', "entryFee roomId")
            .populate('players.user', 'username _id coins')
            .lean()
        
    }
}

// Create singleton instance
const gameRepository = new GameRepository();

// Index check on startup
Game.on('index', (error) => {
    if (error) {
        console.error('Game index error:', error);
    } else {
        console.log('Game indexes are ready');
    }
});

module.exports = gameRepository;