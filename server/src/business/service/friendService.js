const friendRepository = require("../../data/repositories/friendRepositories");
const notificationService = require("./notificationService");
const {isUserOnline} = require('../../presentation/socket/connectedUsers')
class FriendService {

    async getAllFriendsOfUser(userId) {
        console.log('gettign here.....')
        let friendData = await friendRepository.getAllFriends(userId)
        console.log(friendData, "friendData")
        return friendData.map(friend => ({
            id: friend.friendId.id,
            username: friend.friendId.username,
            coins: friend.friendId.coins,
            status: isUserOnline(friend.friendId._id) ? "online" : 'offline',
            _id: friend.friendId._id,
            avatar: friend.friendId.avatar
        }))
    }

    async addFriend(playerId, friendId) {

        const friendObj = await friendRepository.createFriendRequest(playerId, friendId)
        const newNotification = await notificationService.sendFriendRequest(playerId, friendId)
        return newNotification
    }

    async acceptFriendRequest(playerId, friendId) {
        console.log(friendId, playerId,'friendId and playerId')
        await friendRepository.acceptFriendRequest(playerId, friendId);
        await notificationService.deleteNotification(friendId, playerId, 'friend_request')
        const newNotification = await notificationService.sendFriendAccept(playerId, friendId);
        return newNotification;
    }

    async rejectFriendRequest(rejector, requestor) {

        await friendRepository.rejectFriendRequest(rejector, requestor);
        return true
    }
}

const friendService = new FriendService()
module.exports  = friendService