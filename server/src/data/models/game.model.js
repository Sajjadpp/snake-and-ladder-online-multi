const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameRoom",
      required: true,
      index: true  // Add index here
    },
    players: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
          index: true  // Add index here
        },
        position: {
          type: Number,
          default: 0,
        },
        order: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: ["playing", "finished", "left"],
          default: "playing",
        },
        color: {
          type: String,
          enum: ['green', 'yellow', 'red', 'blue']
        }
      },
    ],
    turn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true  // Add index here
    },
    status: {
      type: String,
      enum: ["in-progress", "finished"],
      default: "in-progress",
      index: true
    },
    board: {
      required: true,
      type: Number,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Clean up redundant indexes - keep only essential ones
gameSchema.index({ "_id": 1, "turn": 1 });
gameSchema.index({ "_id": 1, "status": 1 });
gameSchema.index({ "_id": 1, "players.user": 1 });
gameSchema.index({ "status": 1, "turn": 1 });
gameSchema.index({ "room": 1, "status": 1 });

// Create indexes on startup
gameSchema.on('index', function(err) {
  if (err) console.error('Indexing error', err);
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;