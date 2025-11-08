const gameService = require('../../business/service/gameService');

module.exports = (io, socket) => {
    
    socket.on('join_game', async ({ gameId, playerId }) => {
        try {
            console.log('User', playerId, 'joined the game:', gameId);
            
            // Call business service
            let isUserInGame = await gameService.validateUser(gameId, playerId);
            if(!isUserInGame) {
                throw new Error('USER_NOT_FOUND')
            }
            socket.join(gameId);
            console.log(io.sockets.adapter.rooms);
        } catch (error) {
            console.error('Join game error:', error);
            socket.emit('error', { message: 'Failed to join game' });
        }
    });

    // socket.on('request_dice_roll', async ({ gameId, playerId }) => {
    //     try {
    //         // Call business service for dice roll logic
    //         const diceResult = await gameService.handleDiceRoll(gameId, playerId);
    //         console.log(io.sockets.adapter.rooms);
    //         // Socket-specific emission
    //         io.in(gameId).emit('dice_rolled', {
    //             diceValue: diceResult.diceValue,
    //             newPosition: diceResult.newPosition,
    //             playerId: diceResult.playerId,
    //             nextTurn: diceResult.nextTurn
    //         });
            
    //     } catch (error) {
    //         console.error('Dice roll error:', error);
            
    //         // Map business errors to socket events
    //         if (error.message === 'GAME_NOT_FOUND') {
    //             socket.emit('error', { message: 'Game not available' });
    //         } else if (error.message === 'NOT_YOUR_TURN') {
    //             socket.emit('error', { message: 'Not your turn' });
    //         } else {
    //             socket.emit('error', { message: 'Error occurred in the server' });
    //         }
    //     }
    // });

    socket.on('request_dice_roll', async ({ gameId, playerId }) => {
        try {
            // STEP 1: Handle dice roll with Redis
            const diceResult = await gameService.handleDiceRoll(gameId, playerId);
            
            // STEP 2: Emit to clients IMMEDIATELY (Redis is already updated)
            io.in(gameId).emit('dice_rolled', {
                diceValue: diceResult.diceValue,
                newPosition: diceResult.newPosition,
                playerId: diceResult.playerId,
                nextTurn: diceResult.nextTurn,
                serverMs: diceResult.serverMs // Show client the speed!
            });
            
            // STEP 3: Sync to MongoDB in the background (don't await!)
            gameService.syncGameToDB(
                gameId,
                playerId,
                diceResult.newPosition,
                diceResult.nextTurn.userId
            ).catch(err => {
                console.error('DB sync error (non-blocking):', err);
            });
            
        } catch (error) {
            console.error('Dice roll error:', error);
            
            // Map business errors to socket events
            if (error.message === 'GAME_NOT_FOUND') {
                socket.emit('error', { message: 'Game not available' });
            } else if (error.message === 'NOT_YOUR_TURN') {
                socket.emit('error', { message: 'Not your turn' });
            } else if (error.message === 'GAME_NOT_ACTIVE') {
                socket.emit('error', { message: 'Game is not active' });
            } else {
                socket.emit('error', { message: 'Error occurred in the server' });
            }
        }
    });

    socket.on('request_game_end', async ({gameId}) => {
        try {
            console.log('End game requested for:', gameId);
            
            // Call business service for game end logic
            const gameResult = await gameService.handleGameEnd(gameId);
            
            if(gameResult.gameStatus !== 'finished') {
                throw new Error('GAME_IN_PROGRESS');
            }
            console.log('Game ended:', gameResult);
            // Socket-specific emission
            io.in(gameId).emit('game_over', {
                gameStatus: gameResult.gameStatus,
                winner: gameResult.winner,
                prize: gameResult.prize
            });
            socket.leave(gameId)
            
        } catch (error) {
            console.error('Game end error:', error);
            
            if (error.message === 'GAME_NOT_FOUND') {
                socket.emit('error', { message: 'Cannot find game with this id' });
            } else if (error.message === 'PLAYER_NOT_WINNER') {
                // Silent fail - player not actually at position 100
                console.log('Player not at winning position');
            } else {
                socket.emit('error', { message: 'Error ending game' });
            }
        }
    });

    // Graceful client exit
    socket.on('exit_game', async ({ playerId, gameId }) => {
        try {
            console.log('Player exiting game:', playerId, gameId);

            await gameService.handlePlayerLeaveGame(gameId, playerId)
            
            socket.leave(gameId);
            // Broadcast info to others so client UIs can update
            io.in(gameId).emit('player_left_game', { playerId , status: "left"});
        } catch (error) {
            console.error('Exit game error:', error);
        }
    });

  
};