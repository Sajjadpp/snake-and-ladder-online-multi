// models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  // Recipient
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Sender (optional)
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Notification type
  type: {
    type: String,
    required: true,
    enum: [
      'friend_request',
      'friend_accept', 
      'game_invite',
      'tournament',
      'achievement',
      'reward',
      'system'
    ]
  },

  // Content
  title: {
    type: String,
    required: true,
    maxlength: 100
  },

  message: {
    type: String,
    required: true,
    maxlength: 200
  },

  // Read status
  read: {
    type: Boolean,
    default: false
  },

  // Additional data
  data: {
    type: Object,
    default: {}
  }

}, {
  timestamps: true
});

// Indexes for performance
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);