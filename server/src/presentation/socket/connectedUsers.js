const userMap = new Map();

function addUser(socketId, userId) {
  userMap.set(userId, socketId);
}

function removeUser(userId) {
  userMap.delete(userId);
}

function getOnlineUsers() {
  return Array.from(userMap.keys());
}

function getUserMap() {
  return userMap;
}

function isUserOnline(userId) {
    console.log(userId,"is user online", userMap)
    return userMap.has(userId.toString()) ? userMap.get(userId.toString()) : null;
}

module.exports = { addUser, removeUser, getOnlineUsers, getUserMap , isUserOnline};
