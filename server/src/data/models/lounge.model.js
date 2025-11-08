

const mongoose = require("mongoose");

const carromLoungeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    entryFee: {
      type: Number,
      required: true,
      min: 0
    },
    prize: {
      type: Number,
      required: true,
      min: 0
    },
    players: {
      type: Number,
      required: true,
      enum: [2, 4] // since your data only has 2 or 4
    },
    theme: {
      type: String,
      required: true
    },
    bgPattern: {
      type: String,
      required: true
    },
    popular: {
      type: Boolean,
      default: false
    },
    cardColor: {
      type: String,
      required: true
    },
    borderColor: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CarromLounge", carromLoungeSchema);
