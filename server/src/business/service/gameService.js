const gameRepository = require('../../data/repositories/gameRepositories');
const roomRepository = require('../../data/repositories/roomRepositories');
const playerRepository = require('../../data/repositories/userRepositories');
const turnService = require('./turnService');
const boardService = require('./boardService');
const roomService = require('./roomService');
const userService = require('./userService');
const redisGameService = require('./redisGameService');
const memoryCache = require('./memoryGameChache');

class GameService {
    async createGame(roomId) {
        console.log('Creating game for room:', roomId);
        const board = boardService.getRandomBoard();
        const roomData = await roomService.getRoomDetails(roomId);
        const players = roomData.players;
        
        const gameData = {
            room: roomData._id,
            players: players.map((player, index) => ({
                user: player.user._id,
                position: 0,
                order: index + 1,
                status: 'playing',
                color: this.getPlayerColor(index)
            })),
            turn: players[0].user._id,
            status: 'in-progress',
            board: board.id
        };
        await userService.detectCoins(players, roomData.entryFee);

        const createdGame = await gameRepository.create(gameData);
        await roomService.setRoomGameId(roomId, createdGame._id);
        // Cache initial game state in Redis
        
        return createdGame;
    }

    async handleJoinGame(gameId, playerId) {
        const game = await gameRepository.findByPlayerId(gameId);
        if (!game) {
            throw new Error('GAME_NOT_FOUND');
        }
        console.log(`Player ${playerId} joined game ${gameId}`);

        return { gameId, playerId, gameStatus: game.status };
    }

    async validateUser(gameId, userId) {
        let game = await gameRepository.validatePlayerInRoom(gameId, userId);
        return game;
    }

    async getGameDetails(gameId, playerId) {
        let isPlayerInGame = await gameRepository.findByPlayerId(gameId, playerId);
        if(!isPlayerInGame) {
            throw new Error('PLAYER_NOT_IN_GAME');
        }
        let gameData = await gameRepository.findByIdWithPlayers(gameId);  
        // console.log(gameData);  
        let board = boardService.getBoardById(gameData.board);
        let arrangedPlayers = this.arrangePlayersForUser(gameData.players, playerId);
        await redisGameService.cacheGameFromDB({...gameData, players: arrangedPlayers}); // added code for redis
        await memoryCache.set(gameId.toString(), {...gameData, players: arrangedPlayers}); // added code for memory cache
        return {...gameData, board, players: arrangedPlayers};
    }

    
    async handleDiceRoll(gameId, playerId) {
        console.log('\n╔════════════════════════════════════╗');
        console.log('║   MEMORY-CACHED DICE ROLL          ║');
        console.log('╚════════════════════════════════════╝\n');
        
        const totalStart = Date.now();

        // STEP 1: Check memory cache first (< 1ms!)
        const t1 = Date.now();
        let game = memoryCache.get(gameId);
        let source = 'Memory';

        if (!game) {
            // Try Redis (backup)
            try {
                game = await redisGameService.getGameState(gameId);
                source = 'Redis';
            } catch (err) {
                console.log('  Redis failed, fetching from MongoDB...');
            }
        }

        if (!game) {
            // Final fallback: MongoDB
            game = await gameRepository.getGameStateForDiceRoll(gameId);
            source = 'MongoDB';
            
            if (game) {
                // Cache in memory for next time
                memoryCache.set(gameId, game);
                
                // Also cache to Redis in background (don't wait)
                redisGameService.cacheGameFromDB(game).catch(() => {});
            }
        } else if (source === 'Memory') {
            console.log('  ⚡ Memory cache hit!');
        } else if (source === 'Redis') {
            console.log('  ✅ Redis cache hit!');
            memoryCache.set(gameId, game); // Promote to memory
        }
        
        const step1 = Date.now() - t1;
        
        if (!game) throw new Error('GAME_NOT_FOUND');
        this.validateGameState(game, playerId);

        // STEP 2: Generate dice
        const t2 = Date.now();
        const diceValue = this.generateDiceValue();
        const step2 = Date.now() - t2;

        // STEP 3: Find player
        const t3 = Date.now();
        const player = game.players.find(
            p => (p.user._id || p.user).toString() === playerId
        );
        const step3 = Date.now() - t3;

        if (!player) throw new Error('PLAYER_NOT_FOUND');

        // STEP 4: Calculate new position
        const t4 = Date.now();
        const newPosition = boardService.calculateNewPositionFast(
            game.board,
            player.position,
            diceValue
        );
        const step4 = Date.now() - t4;

        // STEP 5: Determine next turn
        const t5 = Date.now();
        let nextPlayerId = player.user._id || player.user;
        
        if (diceValue !== 6 && newPosition !== 100) {
            const currentIndex = game.players.findIndex(
                p => (p.user._id || p.user).toString() === playerId
            );
            const nextIndex = (currentIndex + 1) % game.players.length;
            nextPlayerId = game.players[nextIndex].user._id || game.players[nextIndex].user;
        }
        const step5 = Date.now() - t5;

        // STEP 6: Update memory cache (instant!)
        const t6 = Date.now();
        memoryCache.updatePlayerPosition(gameId, playerId, newPosition, nextPlayerId);
        const step6 = Date.now() - t6;

        const totalMs = Date.now() - totalStart;

        // Performance logging
        console.log('PERFORMANCE BREAKDOWN:');
        console.log(`  1. Fetch Game (${source}):${' '.repeat(Math.max(1, 12 - source.length))}${step1}ms`);
        console.log(`  2. Generate Dice:        ${step2}ms`);
        console.log(`  3. Find Player:          ${step3}ms`);
        console.log(`  4. Calculate Position:   ${step4}ms`);
        console.log(`  5. Determine Turn:       ${step5}ms`);
        console.log(`  6. Update Memory:        ${step6}ms ⚡`);
        console.log('─'.repeat(40));
        console.log(`  TOTAL:                   ${totalMs}ms`);
        
        if (totalMs > 100) {
            console.log(`  ⚠️  Slow (target <50ms)`);
        } else if (totalMs > 50) {
            console.log(`  ✅ Good (target <50ms)`);
        } else if (totalMs > 10) {
            console.log(`  🚀 Excellent! (target <50ms)`);
        } else {
            console.log(`  ⚡ BLAZING FAST! (<10ms)`);
        }
        
        const stats = memoryCache.getStats();
        console.log(`  📊 Cache: ${stats.totalGames} games, ${stats.memoryUsage.toFixed(2)}MB`);
        console.log('╚════════════════════════════════════╝\n');

        // Get next player info
        const nextPlayer = game.players.find(
            p => (p.user._id || p.user).toString() === nextPlayerId.toString()
        );

        return {
            diceValue,
            newPosition,
            playerId,
            nextTurn: {
                userId: nextPlayerId,
                username: nextPlayer?.user?.username || 'Player',
                order: nextPlayer.order
            },
            boardId: game.board,
            serverMs: totalMs,
            cacheSource: source
        };
    }

    
    async syncGameToDB(gameId, playerId, newPosition, nextPlayerId) {
        const syncStart = Date.now();
        
        try {
            // Sync to both Redis and MongoDB in parallel
            await Promise.all([
                redisGameService.updatePlayerPositionFast(
                    gameId, playerId, newPosition, nextPlayerId
                ).catch(err => console.error('Redis sync failed:', err.message)),
                
                gameRepository.updateGameStateAfterDiceRoll(
                    gameId, playerId, newPosition, nextPlayerId
                )
            ]);
            
            console.log(`✅ Background sync completed in ${Date.now() - syncStart}ms`);
        } catch (error) {
            console.error(`❌ Background sync failed:`, error.message);
        }
    }

    async handleGameEnd(gameId) {
        const game = await gameRepository.getGameWithPlayers(gameId);
        if (!game) {
            throw new Error('GAME_NOT_FOUND');
        }

        let winner;
        let availablePlayers = game.players.filter(p => p.status === 'playing')
        console.log(availablePlayers,"game players")
        if(availablePlayers.length < 2) {

            winner = availablePlayers[0].user;
        }
        else {
            winner = await this.validateWinner(game);
        }


        if(!winner) throw new Error('GAME_IN_PROGRESS');
        
        await gameRepository.finishGame(gameId, winner._id);
        await roomRepository.updateProgress(game.room.roomId, "Game Done");
        const prize = await this.awardPrize(winner._id, game.room.entryFee, game.players.length);

        return {
            gameStatus: 'finished',
            winner: {
                userId: winner._id,
                username: winner.username
            },
            prize
        };
    }

    async handlePlayerLeaveGame(gameId, playerId) {
        await gameRepository.updatePlayerStatus(gameId, playerId, 'left');
        let room = await roomService.updatePlayerStatusWithGameId(gameId, playerId, 'left')
        return room.players.reduce((acc, p) => acc + p.status === 'playing' , 0);
    }

    validateGameState(game, playerId) {
        if (game.status === 'finished') {
            throw new Error('GAME_ALREADY_FINISHED');
        }
        if (game.turn._id.toString() !== playerId) {
            throw new Error('NOT_YOUR_TURN');
        }
    }

    generateDiceValue() {
        return Math.floor(Math.random() * 6) + 1;
    }

    async validateWinner(game) {
        const player = game.players.find(p => p.position === 100);
        return player?.user;
    }

    async awardPrize(winnerId, entryFee, playerCount) {
        const totalPrize = entryFee * playerCount;
        console.log(totalPrize, "total price")
        await playerRepository.awardCoins(winnerId, totalPrize);
        return totalPrize;
    }

    getPlayerColor(index) {
        const colors = ['green', 'yellow', 'red', 'blue'];
        return colors[index % colors.length];
    }

    arrangePlayersForUser(players, currentUserId) {
        if (!Array.isArray(players) || players.length === 0) return [];

        const currentUserIndex = players.findIndex(
            p => p?.user?._id?.toString() === currentUserId
        );

        if (currentUserIndex === -1) {
            console.warn("Current user not found in players");
            return players;
        }

        const rotated = [
            ...players.slice(currentUserIndex),
            ...players.slice(0, currentUserIndex),
        ];

        const emptySlot = { user: { _id: null, name: "Waiting..." } };

        if (players.length === 2) {
            return [
                rotated[1] || emptySlot,
                rotated[0],
            ];
        }

        if (players.length === 4) {
            return [
                rotated[1] || emptySlot,
                rotated[2] || emptySlot,
                rotated[0],
                rotated[3] || emptySlot
            ];
        }

        return rotated;
    }

    async getGameResult(gameId, playerId) {
        if(!gameId) {
            throw new Error("GAME_NOT_FOUND")
        }

        const validateUser = await this.validateUser(gameId, playerId)
        if(!validateUser) {
            throw new Error("PLAYER_NOT_IN_GAME");
        }

        const gameResult = await gameRepository.getGameResult(gameId);
        if(!gameResult) {
            throw Error("GAME_IN_PROGRESS")
        }

        return {
            entryFee: gameResult.entryFee,
            roomId: gameResult.room.roomId,
            players: gameResult.players,
            prize: gameResult.entryFee * gameResult.players.length
        }
    }

    async updateGameTurn(gameId, nextPlayerId) {
        return await gameRepository.updateGameTurn(gameId, nextPlayerId);
    }
}

module.exports = new GameService();