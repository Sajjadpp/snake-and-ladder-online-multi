const roomRepository = require('../../data/repositories/roomRepositories');
const loungeService = require('./loungeService');
const notificationService = require('./notificationService');
const userService = require('./userService');

class RoomService {

    constructor() {
        this.quickPlaySet = new Set();
        this.quickPlayQueue = [];
    }

    async handleRoomCreation(roomData) {

        const { loungeId, playerId, roomType, players } = roomData;

        const lounge = await loungeService.validateLounge(loungeId);
        const player = await userService.getUserById(playerId);
        const isSufficientCoin = await userService.sufficientCoin(playerId, lounge.entryFee);
        
        
        if(!isSufficientCoin)  throw Error('INSUFFICIENT_COINS');
        if(!lounge)  throw Error('LOUNGE_NOT_FOUND');
        if(!player)  throw Error("PLAYER_NOT_FOUND")

        const roomId = await this.generateCustomRoomId();

        const roomCreationData = {
            allowedPlayers: lounge.players,
            entryFee: lounge.entryFee,
            loungeId: lounge._id,
            owner: player._id,
            progress: 'in Room',
            roomId,
            type: roomType,
            players: players ?? [{ user: player._id, status: "ready" }]
        };
        const newRoom = await roomRepository.create(roomCreationData);
        
        return {
            roomId: newRoom.roomId,
            owner: newRoom.owner,
            allowedPlayers: newRoom.allowedPlayers,
            entryFee: newRoom.entryFee,
            type: newRoom.type,
            loungeName: newRoom.loungeId.name,
            prize: newRoom.loungeId.prize,
            progress: newRoom.progress,
            players: newRoom.players
        };
    }

    async getRoomDetails(roomId) {

        let roomData = await roomRepository.findByRoomId(roomId);
        if(!roomData) {
            throw Error('ROOM_NOT_FOUND')
        }
        return roomData;
    }

    async generateCustomRoomId() {
        let roomId;
        let exists = true;

        while (exists) {
            const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digit number
            roomId = `ROOM_${randomNum}`;

            // check if already exists in DB
            const existingRoom = await roomRepository.findByCustomRoomId({ roomId });
            if (!existingRoom) {
                exists = false;
            }
        }

        return roomId;
    }

    async handleJoinRoom(roomId, userId) {
        
        let canPlayerJoin = await roomRepository.canPlayerJoin(roomId, userId);
        console.log(canPlayerJoin,"data")
        let isSufficientCoin = await userService.sufficientCoin(userId, canPlayerJoin.room.entryFee);
        if(!canPlayerJoin.canJoin) {
            throw new Error(canPlayerJoin.reason);
        }
        if(!isSufficientCoin) {
            throw new Error('INSUFFICIENT_COINS');
        }

        let room = await roomRepository.addPlayer(roomId, {user: userId, status: 'ready'});
        
        return {
            roomId,
            userId,
            roomData: room
        };
    }

    async tryQuickPlay() {
        console.log('entering to tryQuickPlay method')
        try {
            if(this.quickPlayQueue.length < 2) return null;

            let players = []    
            let iterations = this.quickPlayQueue.length > 4 ? 4 : 2;
            let smallestCoins = Infinity;
            for(let i = 0; i < iterations; i++) {
                let [player, socket, coins] = this.quickPlayQueue.shift();
                if(coins < smallestCoins) {
                    smallestCoins = coins;
                }
                this.quickPlaySet.delete(player);
                players.push({user: player, status: 'ready', socketId: socket});
            }
            
            let lounge = null;
            if(players.length === 2) {
                lounge = await loungeService.getRandomLounge(2, smallestCoins);
            }
            else {
                lounge = await loungeService.getRandomLounge(4);
            }

            if(!lounge) {
                throw new Error('NO_AVAILABLE_LOUNGE');
            }
            console.log(lounge, 'lounge found in tryQuickPlay')
            let room = await this.handleRoomCreation({
                loungeId: lounge._id,
                playerId: players[0].user,
                roomType: 'Public',
                players: players,
            });

            console.log(room, 'room created in tryQuickPlay')
            const obj = {...room, players}
            console.log(obj, 'return obj in tryQuickPlay')
            return obj;

        }
        catch(error) {
            console.log(error, 'error in tryQuickPlay')
        }
    } 

    async handleQuickPlayRoom(userId, socketId) {

        let isRoomExists = await roomRepository.findAvailableRooms();
        console.log(isRoomExists,' roomExist code .... 2')
        if(isRoomExists[0]) {
            let room = await this.handleJoinRoom(isRoomExists[0].roomId, userId);
            return room;
        }

        if(this.quickPlaySet.has(userId)) {
            return {type: 'queued'};
        }
        let user = await userService.getUserById(userId);
        this.quickPlayQueue.push([userId, socketId, user.coins]);
        this.quickPlaySet.add(userId);
        // console.log(this.quickPlayQueue,'queue length after push')
        return {type: 'queued'};
    }

    async handleLeaveRoom(roomId, userId) {
        // Business logic for leaving room
        if (userId) {
            // Update database if user ID provided
            const updatedRoom = await roomRepository.removePlayer(roomId, userId);
            console.log(updatedRoom,'updated room')
            // Check if room should be deleted
            if (updatedRoom && updatedRoom.players.length === 0) {
                await roomRepository.delete(roomId);
                return false; 
            }
            else {
                await roomRepository.changeOwnerShip(roomId, updatedRoom.players[0].user)
            }
            return true; 
        }
        return true; 
    }

    async getRoomPlayersCount(roomId) {
        // Could get from database or socket adapter
        const room = await roomRepository.getRoom(roomId);
        return room ? room.players.length : 0;
    }

    async getFullRooms() {
        let rooms = await roomRepository.getFullRoom('Public');
        return rooms.map(room => {
            return {
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
            }
        })
    }

    async isUserInRoom(roomId, userId) {
        console.log(roomId, 'roomId')
        const room = await roomRepository.findByRoomId(roomId);
        if (!room) {
            throw new Error('ROOM_NOT_FOUND');
        }

        let userInRoom = room.players.some(player => 
            player.user?._id.toString() === userId?.toString()
        );
        return userInRoom ? room : undefined;
    }

    async isRoomOwner(roomId, userId) {
        console.log(roomId, 'roomId')
        const room = await roomRepository.findByRoomId(roomId);
        if (!room) {
            throw new Error('ROOM_NOT_FOUND');
        }

        return room.owner.toString() === userId.toString();
    }

    async canJoinRoom(roomId, userId = null) {
        const room = await roomRepository.findByRoomId(roomId);
        if (!room) {
            return { canJoin: false, reason: 'Room not found' };
        }

        if (room.progress !== 'in Room') {
            return { canJoin: false, reason: 'Game has already started' };
        }

        if (room.players.length >= room.allowedPlayers) {
            return { canJoin: false, reason: 'Room is full' };
        }

        // Check if user is already in room
        if (userId) {
            const isInRoom = room.players.some(player => 
                player.user.toString() === userId.toString()
            );
            if (isInRoom) {
                return { canJoin: false, reason: 'You are already in this room' };
            }
        }

        return { canJoin: true, room };
    }

    async getRoomsByUser(userId) {
        return await roomRepository.findByPlayer(userId);
    }

    async updateRoomProgress(roomId, status) {

        return await roomRepository.updateProgress(roomId, status)
    }

    async setRoomGameId(roomId, gameId) {
        console.log(roomId,'roomid')
        return await roomRepository.setGameId(roomId, gameId)
    }

    async updatePlayerStatus(roomId, userId, status) {

        let isUserInRoom = await this.isUserInRoom(roomId, userId);

        if(!isUserInRoom) {
            throw new Error('ROOM_DENEID_ACCESS');
        }
        return await roomRepository.updatePlayerStatus(roomId, userId, status)
    }

    async updatePlayerStatusWithGameId(gameId, playerId, status) {
        
        return await roomRepository.updatePlayerStatusWithGameId(gameId, playerId, status)
    }

    async invitePlayer(friendId, userId, roomId) {

        let room = await this.getRoomDetails(roomId);
        if(room.allowedPlayers == room.players.length) return;
        let notification = await notificationService.sendGameInvite(userId, friendId, room.type, roomId)
        return notification;
    }
}

module.exports = new RoomService();