const friendService = require("../../business/service/friendService");
const { isUserOnline } = require("../socket/connectedUsers");


class NotificationController {

    constructor(socket, io) {

        this.socket = socket;
        this.io = io;
    }

    addFriend = async({toUserId, fromUserId}) => {
        console.log(toUserId, fromUserId)
        try {
            const notification = await friendService.addFriend(fromUserId, toUserId);
            const socketId = isUserOnline(toUserId);
            console.log(fromUserId, toUserId)
            console.log(socketId, "user isnt online")
            if(!socketId) return;
            this.addNewNotification(socketId, notification);
        }
        catch(error) {
            console.log(error);
        }
    
    }

    acceptFriendRequest = async({acceptor, requester}) => {

            try {
            const notification = await friendService.acceptFriendRequest(acceptor, requester);
            const socketId = isUserOnline(requester);
            console.log(notification)
            if(socketId) {
                this.addNewNotification(socketId, notification)
                console.log('sending real time notification to user ', requester)
            }
        }
        catch(error) {
            console.log(error);
        }
    }

    rejectFriendRequest = async({rejecter, requester}) => {

        try {
            const response = await friendService.rejectFriendRequest(rejecter, requester);
            console.log(response);
            return;
        }
        catch(error) {
            console.log(error)
        }
    }



    addNewNotification=(to, notification) => {
        console.log('add new function working')
        console.log(this.socket)
        this.socket.to(to).emit('new_notification', notification);
    }


}


module.exports = NotificationController;