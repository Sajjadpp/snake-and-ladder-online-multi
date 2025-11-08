const gameService = require("./gameService");

class TurnService {
    async handleTurnChange(game, currentPlayer, diceValue) {
        let nextPlayer;
        
        if (this.shouldKeepTurn(diceValue, currentPlayer.position)) {
            // Same player continues
            nextPlayer = currentPlayer;
        } else {
            // Move to next player
            const nextOrder = (currentPlayer.order % game.players.length) + 1;
            nextPlayer = game.players.find(p => p.order === nextOrder);
        }
    
        return nextPlayer;
    }

    shouldKeepTurn(diceValue, currentPosition) {
        return diceValue === 6 || (diceValue === 1 && currentPosition !== 0);
    }
}

module.exports = new TurnService();