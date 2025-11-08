const friendService = require("../../business/service/friendService");
const NotificationController = require("../socketController/notificationController");

const { isUserOnline } = require("./connectedUsers");

module.exports = (io, socket, userMap) => {
    
    const notificationController = new NotificationController(socket, io)
    socket.on('send_friend_request', notificationController.addFriend);
    socket.on('accept_friend_request', notificationController.acceptFriendRequest);
    
}