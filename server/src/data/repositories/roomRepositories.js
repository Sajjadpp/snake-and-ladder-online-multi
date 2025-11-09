const { default: mongoose } = require("mongoose");
const GameRoom = require("../models/room.model");


class RoomRepository {
    
    // Basic CRUD operations
    async findById(roomId) {
        return await GameRoom.findById(roomId);
    }

    async findByRoomId(roomIdentifier) {
        return await GameRoom.findOne({roomId: roomIdentifier})
            .populate('players.user', 'username mobile avatar coins')
            .populate('owner')
            .populate('loungeId');
    }
    async findByMongoId(_id) {
        return await GameRoom.findOne({_id})
            .populate('players.user', 'username mobile avatar coins')
            .populate('owner')
            .populate('loungeId');
    }

    async create(roomData) {
        const room = new GameRoom(roomData);
        return await room.save();
    }

    async update(roomId, updateData) {
        return await GameRoom.findByIdAndUpdate(
            roomId, 
            updateData, 
            { new: true, runValidators: true }
        );
    }

    async delete(roomId) {
        return await GameRoom.deleteOne({roomId});
    }

    // Player management
    async addPlayer(roomIdentifier, playerData) {
        let room = await GameRoom.findOneAndUpdate(
            {roomId: roomIdentifier},
            { 
                $addToSet: { 
                    players: playerData 
                } 
            },
            { 
                new: true,
                runValidators: true 
            }
        ).populate('players.user');

        return room;
    }

    async removePlayer(roomIdentifier, userId) {
        return await GameRoom.findOneAndUpdate(
            {roomId: roomIdentifier},
            { 
                $pull: { 
                    players: { user: userId } 
                } 
            },
            { 
                new: true 
            }
        );
    }

    async updatePlayerStatus(roomIdentifier, userId, status) {
        return await GameRoom.findOneAndUpdate(
            { 
                roomId: roomIdentifier,
                'players.user': userId 
            },
            { 
                $set: { 'players.$.status': status } 
            },
            { 
                new: true 
            }
        );
    }

    async setAllPlayersStatus(roomIdentifier, status) {
        return await GameRoom.findOneAndUpdate(
            { roomId: roomIdentifier },
            { 
                $set: { 'players.$[].status': status } 
            },
            { 
                new: true 
            }
        );
    }

    // Room status management
    async updateProgress(roomIdentifier, progress) {
        let obj = {};
        if(this.valideObjectId(roomIdentifier)) {
            obj["_id"] = roomIdentifier
        }
        else {
            obj["roomId"] = roomIdentifier
        }
        return await GameRoom.findOneAndUpdate(
            {roomId: roomIdentifier},
            { 
                progress: progress 
            },
            { 
                new: true 
            }
        );
    }

    async setGameId(roomIdentifier, gameId) {

        return await GameRoom.findOneAndUpdate(
            {roomId: roomIdentifier},
            { 
                gameId: gameId,
                progress: 'in Game'
            },
            { 
                new: true 
            }
        );
    }

    async valideObjectId(id) {
        return mongoose.Types.ObjectId.isValid(id)
    }

    async startGame(roomIdentifier) {
        return await GameRoom.findOneAndUpdate(
            { roomId: roomIdentifier },
            { 
                progress: 'in Game',
                $set: { 'players.$[].status': 'playing' }
            },
            { 
                new: true 
            }
        );
    }

    async finishGame(roomIdentifier) {
        return await GameRoom.findOneAndUpdate(
            { roomId: roomIdentifier },
            { 
                progress: 'Game Done',
                $set: { 'players.$[].status': 'left' }
            },
            { 
                new: true 
            }
        );
    }

    // Query methods
    async findByLoungeId(loungeId) {
        return await GameRoom.find({ loungeId: loungeId })
            .populate('players.user')
            .populate('owner')
            .sort({ createdAt: -1 });
    }

    async findByOwner(ownerId) {
        return await GameRoom.find({ owner: ownerId })
            .populate('players.user')
            .populate('loungeId')
            .sort({ createdAt: -1 });
    }

    async findByPlayer(userId) {
        console.log(userId)
        return await GameRoom.find({
            'players.user': userId,
            'players.status': {$ne:'left'},
            progress: {$ne : "Game Done"}
        })
        .populate('players.user', 'username _id coins')
        .populate('owner', 'username _id')
        .populate('loungeId', 'name _id')
        .sort({ createdAt: -1 })
        .lean();
    }

    async findPublicRooms(loungeId = null) {
        const query = { type: 'Public', progress: 'in Room' };
        if (loungeId) {
            query.loungeId = loungeId;
        }
        
        return await GameRoom.find(query)
            .populate('players.user')
            .populate('owner')
            .populate('loungeId')
            .sort({ createdAt: -1 });
    }

    async findAvailableRooms(loungeId = null) {
        const query = { 
            progress: 'in Room',
            $expr: { $lt: [{ $size: '$players' }, '$allowedPlayers'] }
        };
        
        if (loungeId) {
            query.loungeId = loungeId;
        }
        
        return await GameRoom.find(query)
            .populate('players.user')
            .populate('owner')
            .populate('loungeId')
            .sort({ createdAt: -1 });
    }

    async findActiveGames() {
        return await GameRoom.find({ progress: 'in Game' })
            .populate('players.user')
            .populate('owner')
            .populate('loungeId')
            .sort({ createdAt: -1 });
    }

    // Room validation methods
    async canPlayerJoin(roomIdentifier, userId) {
        console.log(roomIdentifier,'roomidentifier')
        const room = await GameRoom.findOne({roomId: roomIdentifier})
            .select('players allowedPlayers type progress');
        
        if (!room) return { canJoin: false, reason: 'ROOM_NOT_FOUND' };
        if (room.progress !== 'in Room') return { canJoin: false, reason: 'GAME_ALREADY_STARTED' };
        
        const isPlayerInRoom = room.players.some(player => 
            player.user.toString() === userId.toString()
        );
        if (isPlayerInRoom) return { canJoin: false, reason: 'PLAYER_ALREADY_IN_ROOM' };
        
        if (room.players.length >= room.allowedPlayers) {
            return { canJoin: false, reason: 'ROOM_FULL' };
        }
        
        return { canJoin: true, room };
    }

    async isRoomOwner(roomIdentifier, userId) {
        const room = await GameRoom.findOne({ roomId: roomIdentifier })
            .select('owner');
        return room && room.owner.toString() === userId.toString();
    }

    async isPlayerInRoom(roomIdentifier, userId) {
        const room = await GameRoom.findOne({ 
            roomId: roomIdentifier,
            'players.user': userId 
        });
        return !!room;
    }

    // Statistics and analytics
    async getRoomStats(loungeId = null) {
        const matchStage = loungeId ? { loungeId: new mongoose.Types.ObjectId(loungeId) } : {};
        
        const stats = await GameRoom.aggregate([
            { $match: matchStage },
            {
                $facet: {
                    totalRooms: [{ $count: 'count' }],
                    activeRooms: [
                        { $match: { progress: 'in Room' } },
                        { $count: 'count' }
                    ],
                    activeGames: [
                        { $match: { progress: 'in Game' } },
                        { $count: 'count' }
                    ],
                    completedGames: [
                        { $match: { progress: 'Game Done' } },
                        { $count: 'count' }
                    ],
                    roomTypes: [
                        { $group: { _id: '$type', count: { $sum: 1 } } }
                    ],
                    playerCapacity: [
                        { 
                            $group: { 
                                _id: '$allowedPlayers', 
                                count: { $sum: 1 } 
                            } 
                        }
                    ]
                }
            }
        ]);

        return {
            totalRooms: stats[0]?.totalRooms[0]?.count || 0,
            activeRooms: stats[0]?.activeRooms[0]?.count || 0,
            activeGames: stats[0]?.activeGames[0]?.count || 0,
            completedGames: stats[0]?.completedGames[0]?.count || 0,
            roomTypes: stats[0]?.roomTypes || [],
            playerCapacity: stats[0]?.playerCapacity || []
        };
    }

    // Cleanup methods
    async cleanupEmptyRooms() {
        return await GameRoom.deleteMany({
            progress: 'in Room',
            $expr: { $eq: [{ $size: '$players' }, 0] },
            createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // 24 hours old
        });
    }

    async getRoomForClient(roomIdentifier) {
        return await GameRoom.findOne({ roomId: roomIdentifier })
            .populate('players.user', 'username _id avatar coins')
            .populate('owner', 'username _id avatar')
            .populate('loungeId', 'name _id')
            .select('-__v -updatedAt')
            .lean();
    }

    async getFullRoom(type) {
        return await GameRoom.find({type})
            .populate('players.user', 'username _id avatar coins')
            .populate('owner', 'username _id avatar')
            .populate('loungeId', 'name _id prize location bgPattern border cardColor')
            .select('-__v -updatedAt')
            .lean()
        ;
    }

    async findByCustomRoomId(roomId) {
        console.log(roomId)
        return await GameRoom.findOne(roomId);
    }

    async updatePlayerStatusWithGameId(gameId, userId, status){
        return await GameRoom.findOneAndUpdate(
            { 
                gameId: gameId,
                'players.user': userId 
            },
            { 
                $set: { 'players.$.status': status } 
            },
            { 
                new: true 
            }
        );
    }
}



module.exports =  new RoomRepository();