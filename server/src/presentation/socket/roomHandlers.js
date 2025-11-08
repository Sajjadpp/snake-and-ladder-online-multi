const roomService = require('../../business/service/roomService');
const { isUserOnline } = require('./connectedUsers');

module.exports = (io, socket) => {
    
    socket.on("create_room", async (roomId) => {
        try {
            console.log("Room created:", roomId);
            socket.join(roomId);
            
            // Call business service
            let newRoom = await roomService.handleRoomCreation(roomId, socket.id);
            console.log(io.sockets.adapter.rooms);
        } catch (error) {
            console.error("Room creation error:", error);
            socket.emit('room_error', { error: 'Failed to create room' });
        }
    });

    socket.on('player_status_toogle', async({roomId, userId, status}) =>{

        try {
            let changePlayerStatus = await roomService.updatePlayerStatus(roomId, userId, status)

            if(changePlayerStatus) {
                io.in(roomId).emit("toogle_player_status",{roomId, userId, status})
            }
        }
        catch(error) {

        }
    })

    socket.on("join_room", async (roomId, userId) => {
        try {
            console.log(`${socket.id} joined room ${roomId}`);
            let room = await roomService.isUserInRoom(roomId, userId);
            if(!room) throw Error('ROOM_DENIDE_ACCESS');
            
            socket.join(roomId);
            io.in(roomId).emit('room-updates', room);
            console.log(io.sockets.adapter.rooms);
            // if only one player return this
            if(room.type === "Private") {
                return;
            }
            if(room.players.length === 1) {
                socket.broadcast.except(roomId).emit('room-updates-general', {
                    type: "CREATE_ROOM",
                    newRoom: {
                        loungeName: room.loungeId.name,
                        roomId: room.roomId,
                        allowedPlayers: room.allowedPlayers,
                        entryFee: room.entryFee,
                        prize: room.loungeId.prize,
                        players: room.players,
                        loungeLocation: room.loungeId.location,
                        border: room.loungeId.border,
                        color: room.loungeId.cardColor,
                        bg: room.loungeId.bgPattern,
                        progress: room.progress
                    },
                    roomId: roomId
                })
            }
            else {
                socket.broadcast.except(roomId).emit('room-updates-general', {
                    type: "NEW_JOIN",
                    players: room.players,
                    roomId: roomId
                })
            }
        } catch (error) {
            console.error("Join room error:", error);
            socket.emit('room_error', { error: 'Failed to join room' });
        }
    });

    socket.on('leave_room', async ({ roomId, userId }) => {
        try {
            socket.leave(roomId);
            
            console.log('user leaved from the room')
            const shouldFetchRoom = await roomService.handleLeaveRoom(roomId, userId);
            
            // Socket-specific emissions
            if (shouldFetchRoom) {
                socket.to(roomId).emit('fetch_room');
            }
            socket.broadcast.except(roomId).emit('room-updates-general', {
                type: "LEAVE_ROOM",
                deletedUser: userId,
                roomId: roomId,
                isRoomExist: shouldFetchRoom
            })
            let room = await roomService.getRoomDetails(roomId);
            socket.to(roomId).emit('room-updates', room);
            
        } catch (error) {
            console.error("Leave room error:", error);
        }
    });

    socket.on('start-game', ({ roomId, gameId }) => {
        // Pure socket forwarding - no business logic
        socket.to(roomId).emit('trigger-navigate', gameId);
    });

    socket.on('send_room_invitation', async({friendId, userId, roomId}) => {
        console.log(friendId, userId, roomId)
        try {
            let notification = await roomService.invitePlayer(friendId, userId, roomId);
            const socketId = isUserOnline(friendId.toString());
            console.log(notification)
            if(socketId) {
                
                sendNotification(socketId, notification)
                console.log('sending real time notification to user ', friendId)
            }
        }
        catch(error) {
            console.log(error);
        }
    })

    
    function sendNotification(to, notification) {
        socket.to(to.toString()).emit('new_notification', notification);
    }

};