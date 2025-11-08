const roomService = require('../../business/service/roomService');
const { mapErrorToHttpResponse } = require('../utils/errorMapper');

const roomController = {

    async getFullRoom(req, res) {

        try {
            const fullRoom = await roomService.getFullRooms();
            res.json(fullRoom);
        }
        catch(error) {
            console.error('Error:', error);

            const httpError = mapErrorToHttpResponse(error);
            res.status(httpError.status).json({ error: httpError.message });
        }
    },

    async createRoom(req, res) {
        try {
            const { loungeId, playerId, roomType } = req.body;

            if (!loungeId || !playerId || !roomType) throw new Error('INSUFISIENT_DATA')

            const newRoom = await roomService.handleRoomCreation({
                loungeId, 
                playerId, 
                roomType
            });

            res.status(201).json({
                message: 'Room created successfully',
                roomId: newRoom.roomId,
                owner: newRoom.owner
            });

        } catch (error) {
            console.error('Error in createRoom:', error);

            const httpError = mapErrorToHttpResponse(error);
            res.status(httpError.status).json({ error: httpError.message });
        }
    },

    async getRoomDetails(req, res) {

        let {id} = req.params
        try {
            let roomData = await roomService.getRoomDetails(id);
            res.json(roomData);
        }
        catch(error) {
            const httpError = mapErrorToHttpResponse(error);
            res.status(httpError.status).json({ error: httpError.message });
        }
    },

    async joinRoom(req, res) {

        try {
            let roomId = req.params.roomId;

            if(!roomId) {
                throw new Error('ROOM_NOT_FOUND');
            }
            let room = await roomService.handleJoinRoom(roomId, req.user.id);
            console.log(room, roomId)
            res.json({roomId: room.roomId});
        }
        catch(error) {
            const httpError = mapErrorToHttpResponse(error);
            console.log(error)
            res.status(httpError.status).json({ error: httpError.message });
        }
    },

    async getRoomsByUser(req, res) {
        let user = req.user;
        try {
            let rooms = await roomService.getRoomsByUser(user.id);
            res.json(rooms ? rooms[0] : null)
        }
        catch(error) {
            console.error('Error:', error);
            const httpError = mapErrorToHttpResponse(error);
            res.status(httpError.status).json({ error: httpError.message });
        }
    },

    async playerLeaveRoom(req, res) {

        try {
            let {roomId} = req.params;
            let userId = req.user.id
            let newRoom = roomService.handleLeaveRoom(roomId, userId);
            res.json(newRoom)
        }
        catch(error) {
            console.error('Error:', error);
            const httpError = mapErrorToHttpResponse(error);
            res.status(httpError.status).json({ error: httpError.message });
        }
    },

    async quickPlay(req, res) {
        const userId = req.user.id;
        const {socketId} = req.query;
        console.log(socketId,'socket id in quick play controller')
        try {
            let newRoomStatus = await roomService.handleQuickPlayRoom(userId, socketId);
            console.log(newRoomStatus,'new roomStatus')
            res.json(newRoomStatus)
        }
        catch(error) {
            console.error("Error: ", error);
            const httpError = mapErrorToHttpResponse(error);
            res.status(httpError.status).json({error: httpError.message})
        }
    }
}

module.exports = roomController;
