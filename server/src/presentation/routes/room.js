const express = require('express');
const room = express.Router();

const roomController = require('../controllers/roomController');
const { userInRoom } = require('../middlewares/room.middleware');
const { authenticateUser } = require('../middlewares/auth.middleware');


room.get('/', roomController.getFullRoom)
room.get('/:id', authenticateUser, userInRoom, roomController.getRoomDetails);
room.post('/create', authenticateUser, roomController.createRoom);
room.post('/join-room/:roomId', authenticateUser, roomController.joinRoom);
room.post('/quickPlay', authenticateUser, roomController.quickPlay);
room.post('/leave-room/:roomId', authenticateUser, roomController.playerLeaveRoom)
room.get('/user-room/:userId', authenticateUser, roomController.getRoomsByUser);
room.post('/quick-play', authenticateUser, roomController.quickPlay)



module.exports = room;