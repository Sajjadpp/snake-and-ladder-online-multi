const roomHandlers = require("./roomHandlers");
const gameHandlers = require("./gameHandlers");
const FriendHandlers = require("./FriendHandlers");
const { addUser, removeUser } = require("./connectedUsers");
// const chatHandlers = require("./chatHandlers");
function registerSocketHandlers(io) {
    io.use((socket, next) => {
        const userId = socket.handshake.query.userId;
        if (!userId) {
            return next(new Error("Missing userId"));
        }
        socket.userId = userId;
        next();
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.userId);
        addUser(socket.id, socket.userId)
        // attach handlers
        socket.emit('sample_emit', "sample emit")
        roomHandlers(io, socket);
        FriendHandlers(io, socket)
        gameHandlers(io, socket);
        // chatHandlers(io, socket);

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id, socket.userId);
            removeUser(socket.userId)
        });
    });
}

module.exports = registerSocketHandlers;
