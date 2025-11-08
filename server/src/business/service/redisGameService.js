const { getRedisClient } = require('../../config/connection.redis');

class RedisGameService {
    constructor() {
        this.GAME_PREFIX = 'game:';
        this.TTL = 3600; // 1 hour
    }

    getGameKey(gameId) {
        return `${this.GAME_PREFIX}${gameId}`;
    }

    async getGameState(gameId) {
        try {
            const redis = getRedisClient();
            const key = this.getGameKey(gameId);
            const data = await redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Redis getGameState error:', error.message);
            return null;
        }
    }

    async setGameState(gameId, gameState) {
        try {
            const redis = getRedisClient();
            const key = this.getGameKey(gameId);
            await redis.set(key, JSON.stringify(gameState), { EX: this.TTL });
        } catch (error) {
            console.error('Redis setGameState error:', error.message);
        }
    }

    async updatePlayerPositionFast(gameId, playerId, newPosition, nextPlayerId) {
        try {
            const redis = getRedisClient();
            const key = this.getGameKey(gameId);
            
            // Use pipeline for atomic multi-command execution
            const pipeline = redis.multi();
            
            // Store player position as hash field
            pipeline.hSet(`${key}:player:${playerId}`, 'position', newPosition.toString());
            pipeline.hSet(`${key}:meta`, 'currentTurn', nextPlayerId.toString());
            pipeline.expire(key, this.TTL);
            
            await pipeline.exec();
        } catch (error) {
            console.error('Redis updatePlayerPositionFast error:', error.message);
            throw error;
        }
    }

    async cacheGameFromDB(game) {
        try {
            const redis = getRedisClient();
            const key = this.getGameKey(game._id.toString());
            const gameId = game._id.toString();
            
            const pipeline = redis.multi();
            
            // Cache main game state
            pipeline.set(key, JSON.stringify(game), { EX: this.TTL });
            
            // Cache player positions in hash (for fast updates)
            game.players.forEach(player => {
                const playerId = (player.user._id || player.user).toString();
                pipeline.hSet(`${key}:player:${playerId}`, {
                    position: player.position.toString(),
                    order: player.order.toString()
                });
            });
            
            // Cache metadata
            const currentTurnId = (game.turn._id || game.turn).toString();
            pipeline.hSet(`${key}:meta`, {
                currentTurn: currentTurnId,
                status: game.status,
                board: game.board.toString()
            });
            
            await pipeline.exec();
        } catch (error) {
            console.error('Redis cacheGameFromDB error:', error.message);
        }
    }

    async invalidateGame(gameId) {
        try {
            const redis = getRedisClient();
            const key = this.getGameKey(gameId);
            
            // Delete all related keys
            const keys = await redis.keys(`${key}*`);
            if (keys.length > 0) {
                await redis.del(keys);
            }
        } catch (error) {
            console.error('Redis invalidateGame error:', error.message);
        }
    }
}
module.exports = new RedisGameService();