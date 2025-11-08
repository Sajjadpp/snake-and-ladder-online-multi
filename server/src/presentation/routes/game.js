const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { authenticateUser } = require('../middlewares/auth.middleware');


router.post('/start-game/:roomId', authenticateUser, gameController.createGame)
router.get('/:gameId/', authenticateUser, gameController.getGameDetails);
router.put('/:gameId/move', gameController.updateGameMoves);
router.get('/result/:gameId', authenticateUser, gameController.getGameResult);

module.exports = router;