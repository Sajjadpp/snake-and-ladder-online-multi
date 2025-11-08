class MemoryGameCache {
    constructor() {
        this.games = new Map();
        this.TTL = 300000; // 5 minutes
        
        // Auto-cleanup expired entries every minute
        setInterval(() => this.cleanup(), 60000);
    }

    set(gameId, gameData) {
        this.games.set(gameId, {
            data: gameData,
            expires: Date.now() + this.TTL,
            lastModified: Date.now()
        });
    }

    get(gameId) {
        const cached = this.games.get(gameId);
        if (!cached) return null;
        
        // Check if expired
        if (Date.now() > cached.expires) {
            this.games.delete(gameId);
            return null;
        }
        
        return cached.data;
    }

    updatePlayerPosition(gameId, playerId, newPosition, nextTurnId) {
        const cached = this.games.get(gameId);
        if (!cached) return false;

        const game = cached.data;
        
        // Update player position
        const player = game.players.find(
            p => (p.user._id || p.user).toString() === playerId
        );
        
        if (player) {
            player.position = newPosition;
        }
        
        // Update turn
        game.turn = game.players.find(
            p => (p.user._id || p.user).toString() === nextTurnId.toString()
        )?.user || game.turn;
        
        // Update timestamps
        cached.lastModified = Date.now();
        cached.expires = Date.now() + this.TTL;
        
        return true;
    }

    delete(gameId) {
        this.games.delete(gameId);
    }

    cleanup() {
        const now = Date.now();
        let cleaned = 0;
        
        for (const [gameId, cached] of this.games.entries()) {
            if (now > cached.expires) {
                this.games.delete(gameId);
                cleaned++;
            }
        }
        
        if (cleaned > 0) {
            console.log(`🧹 Cleaned ${cleaned} expired game(s) from memory cache`);
        }
    }

    size() {
        return this.games.size;
    }

    getStats() {
        return {
            totalGames: this.games.size,
            memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024
        };
    }
}

module.exports = new MemoryGameCache();