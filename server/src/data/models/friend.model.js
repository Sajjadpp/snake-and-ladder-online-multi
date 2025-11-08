// Mongoose Schema for Friends - Simplified for Easy Queries
const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  // The user who owns this friendship record
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // The friend's user ID
  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Friendship status
  status: {
    type: String,
    enum: ['pending', 'accepted', 'blocked', 'rejected'],
    default: 'pending',
    index: true
  },
  
  // Role in the friendship
  role: {
    type: String,
    enum: ['requester', 'receiver'],
    required: true
  },
  
  // When the friend request was sent/received
  requestedAt: {
    type: Date,
    default: Date.now
  },
  
  // When the friend request was accepted
  acceptedAt: {
    type: Date
  },
  
  // Last interaction timestamp
  lastInteraction: {
    type: Date,
    default: Date.now
  },
  
  // User-specific settings
  nickname: { 
    type: String, 
    trim: true,
    maxlength: 50 
  },
  
  isFavorite: { 
    type: Boolean, 
    default: false 
  },
  
  category: { 
    type: String, 
    default: 'General' 
  },
  
  notes: { 
    type: String, 
    maxlength: 500 
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
friendSchema.index({ userId: 1, friendId: 1 }, { unique: true });
friendSchema.index({ userId: 1, status: 1 });
friendSchema.index({ friendId: 1, status: 1 });

const Friend = mongoose.model('Friend', friendSchema);

module.exports = Friend;
