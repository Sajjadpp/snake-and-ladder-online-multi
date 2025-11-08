const mongoose = require( "mongoose" );

const gameRoomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true, // unique room identifier
    },
    players: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // reference to your User schema
          required: true,
        },
        status: {
          type: String,
          enum: ["waiting", "ready", "playing", "left"],
          default: "waiting",
        },
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // the creator/owner of the room
      required: true,
    },
    type: {
      type: String,
      enum: ["Public", "Private"],
      default: "Public",
    },
    progress: {
      type: String,
      enum: ["in Room", "in Game", 'Game Done'],
      default: "in Room",
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      default: null,
      index: true
    },
    allowedPlayers: {
      type: Number,
      enum: [2, 4],
      required: true,
    },
    entryFee: {
      type: Number,
      required: true,
      min: 0,
    },
    loungeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarromLounge", // reference to lounges schema
      required: true,
    },
  },
  { timestamps: true }
);

// Custom validation: players array length should not exceed allowedPlayers
gameRoomSchema.pre("save", function (next) {
    console.log(this.players.length , this.allowedPlayers)
  if (this.players.length > this.allowedPlayers) {
    return next(new Error("Number of players exceeds allowed players."));
  }
  next();
});


module.exports = mongoose.model("GameRoom", gameRoomSchema);
