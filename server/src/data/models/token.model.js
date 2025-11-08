const mongoose = require('mongoose')

const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // reference to User
    ref: "User",
    required: true
  },
  token: {
    type: String,   // store the refresh token (or hashed version)
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Optional: automatically delete expired tokens
refreshTokenSchema.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

module.exports = RefreshToken
