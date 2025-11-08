// repositories/notificationRepository.js
const  {Notification} = require('../models/notification.model')

 class NotificationRepository {
  
  // Create a new notification
  async create(notificationData) {
    try {
      const notification = new Notification(notificationData);
      const savedNotification = await notification.save();
      
      const populatedNotification = await Notification.findById(savedNotification._id)
        .populate('senderId', 'username avatar _id id')
        .lean() // Returns plain JavaScript objects
        .exec();
      
      return populatedNotification;
    } catch (error) {
      throw new Error(`Failed to create notification: ${error.message}`);
    }
  }

  // Get user's notifications with pagination
  async findByUserId(userId, options = {}) {
    try {
      const { 
        limit = 20, 
        skip = 0, 
        unreadOnly = false 
      } = options;

      const query = { userId };
      if (unreadOnly) {
        query.read = false;
      }

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate('senderId', 'username avatar');

      return notifications;
    } catch (error) {
      throw new Error(`Failed to fetch notifications: ${error.message}`);
    }
  }

  // Mark notification as read
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { read: true },
        { new: true }
      );
      return notification;
    } catch (error) {
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  }

  // Mark all notifications as read
  async markAllAsRead(userId) {
    try {
      const result = await Notification.updateMany(
        { userId, read: false },
        { read: true }
      );
      return result.modifiedCount;
    } catch (error) {
      throw new Error(`Failed to mark all as read: ${error.message}`);
    }
  }

  // Delete a notification
  async delete(senderId, userId, type) {
    try {
      const result = await Notification.deleteOne({
        senderId,
        userId,
        type
      });
      console.log(result,'result.....')
      return result.deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete notification: ${error.message}`);
    }
  }

  // Delete all read notifications
  async deleteAllRead(userId) {
    try {
      const result = await Notification.deleteMany({
        userId,
        read: true
      });
      return result.deletedCount;
    } catch (error) {
      throw new Error(`Failed to delete read notifications: ${error.message}`);
    }
  }

  // Get unread count
  async getUnreadCount(userId) {
    try {
      return await Notification.countDocuments({
        userId,
        read: false
      });
    } catch (error) {
      throw new Error(`Failed to get unread count: ${error.message}`);
    }
  }

  // Create multiple notifications at once
  async createMultiple(notificationsData) {
    try {
      return await Notification.insertMany(notificationsData);
    } catch (error) {
      throw new Error(`Failed to create multiple notifications: ${error.message}`);
    }
  }
}

module.exports = NotificationRepository