const NotificationRepository = require("../../data/repositories/notificationRepositories.js");
const userService = require("./userService.js");




class NotificationService {
  constructor() {
    this.notificationRepo  = new NotificationRepository();
  }

  /**
   * Send a notification to a user
   */
  async sendNotification(notificationData) {
    try {
      // Validate required fields
      console.log(notificationData)
      if (!notificationData.userId || !notificationData.type || !notificationData.title || !notificationData.message) {
        throw new Error('Missing required notification fields');
      }

      // Add timestamp if not provided
      if (!notificationData.data) {
        notificationData.data = {};
      }
      notificationData.data.sentAt = new Date();

      const notification = await this.notificationRepo.create(notificationData);
      
      // Emit real-time event if needed (for WebSocket)
      const clientNotificationModal = this.formatNotificationForFrontend(notification)
      
      return clientNotificationModal;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  /**
   * Send friend request notification
   */
  async sendFriendRequest(senderId, recipientId) {
    try {
      const sender = await userService.validateUser(senderId);
      console.log(sender, 'sender')
      if (!sender) {
        throw new Error('SENDER_NOT_FOUND');
      }

      const reciever = await userService.validateUser(recipientId);
      if (!reciever) {
        throw new Error('RECIEVER_NOT_FOUND');
      }

      const notification = await this.sendNotification({
        userId: recipientId,
        senderId: senderId,
        type: 'friend_request',
        title: 'Friend Request',
        message: `${sender} sent you a friend request`,
      });

      return notification;
    } catch (error) {
      console.error('Error sending friend request notification:', error);
      throw error;
    }
  }

  
  async sendFriendAccept(acceptorId, requestorId) {
    try {
      const acceptor = await userService.getUserById(acceptorId);
      if (!acceptor) {
        throw new Error('User not found');
      }
      
      const notification = await this.sendNotification({
        userId: requestorId,
        senderId: acceptorId,
        type: 'friend_accept',
        title: 'Friend Request Accepted',
        message: `${acceptor.username} accepted your friend request`,
        data: {
          action: 'friend_accept',
          acceptorUsername: acceptor.username,
          acceptorAvatar: acceptor.avatar
        }
      });

      return notification;
    } catch (error) {
      console.error('Error sending friend accept notification:', error);
      throw error;
    }
  }

  /**
   * Send game invitation notification
   */
  async sendGameInvite(senderId, recipientId, gameType, gameId) {
    try {
      const sender = await userService.getUserById(senderId);
      if (!sender) {
        throw new Error('Sender not found');
      }

      const notification = await this.sendNotification({
        userId: recipientId,
        senderId: senderId,
        type: 'game_invite',
        title: 'Game Invitation',
        message: `${sender.username} invited you to play ${gameType}`,
        data: {
          action: 'game_invite',
          gameType,
          gameId,
          senderUsername: sender.username,
          senderAvatar: sender.avatar,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiry
        }
      });

      return notification;
    } catch (error) {
      console.error('Error sending game invite notification:', error);
      throw error;
    }
  }

  /**
   * Send tournament notification
   */
  async sendTournamentNotification(userId, tournamentName, message, type = 'tournament') {
    try {
      const notification = await this.sendNotification({
        userId,
        type,
        title: `Tournament: ${tournamentName}`,
        message,
        data: {
          tournamentName,
          type
        }
      });

      return notification;
    } catch (error) {
      console.error('Error sending tournament notification:', error);
      throw error;
    }
  }

  /**
   * Send achievement notification
   */
  async sendAchievement(userId, achievementName, reward = 0) {
    try {
      const notification = await this.sendNotification({
        userId,
        type: 'achievement',
        title: 'Achievement Unlocked! 🏆',
        message: `You unlocked "${achievementName}" achievement${reward ? ` and earned ${reward} coins!` : ''}`,
        data: {
          achievementName,
          reward,
          unlockedAt: new Date()
        }
      });

      return notification;
    } catch (error) {
      console.error('Error sending achievement notification:', error);
      throw error;
    }
  }

  /**
   * Send reward notification
   */
  async sendReward(userId, rewardType, amount, reason) {
    try {
      const notification = await this.sendNotification({
        userId,
        type: 'reward',
        title: 'Reward Received! 🎁',
        message: `You received ${amount} coins for ${reason}`,
        data: {
          rewardType,
          amount,
          reason,
          awardedAt: new Date()
        }
      });

      return notification;
    } catch (error) {
      console.error('Error sending reward notification:', error);
      throw error;
    }
  }

  /**
   * Send system notification to multiple users
   */
  async sendBulkNotification(userIds, title, message, data = {}) {
    try {
      const notificationsData = userIds.map(userId => ({
        userId,
        type: 'system',
        title,
        message,
        data: {
          ...data,
          bulk: true,
          sentAt: new Date()
        }
      }));

      const notifications = await this.notificationRepo.createMultiple(notificationsData);
      return notifications;
    } catch (error) {
      console.error('Error sending bulk notification:', error);
      throw error;
    }
  }

  /**
   * Get user notifications with formatted data
   */
  async getUserNotifications(userId, options = {}) {
    try {
      const { page = 1, limit = 20, unreadOnly = false } = options;
      const skip = (page - 1) * limit;

      const notifications = await this.notificationRepo.findByUserId(userId, {
        limit,
        skip,
        unreadOnly
      });

      // Format notifications for frontend
      const formattedNotifications = notifications.map(notification => 
        this.formatNotificationForFrontend(notification)
      );

      const unreadCount = await this.notificationRepo.getUnreadCount(userId);
      const totalCount = await this.notificationRepo.findByUserId(userId);

      return {
        notifications: formattedNotifications,
        pagination: {
          page,
          limit,
          total: totalCount.length,
          unreadCount,
          totalPages: Math.ceil(totalCount.length / limit),
          hasMore: totalCount.length > page * limit
        }
      };
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  /**
   * Format notification for frontend consumption
   */
  formatNotificationForFrontend(notification) {
    const relativeTime = this.getRelativeTime(notification.createdAt);
    
    // Get icon and color based on type
    const typeConfig = this.getNotificationTypeConfig(notification.type);
    
    return {
      id: notification._id,
      userId: notification.userId,
      sender: notification.senderId ? {
        id: notification.senderId._id,
        username: notification.senderId.username,
        avatar: notification.senderId.avatar
      } : null,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      read: notification.read,
      data: notification.data,
      time: relativeTime,
      icon: typeConfig.icon,
      color: typeConfig.color,
      createdAt: notification.createdAt
    };
  }

  /**
   * Calculate relative time (e.g., "2 mins ago")
   */
  getRelativeTime(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
  }

  /**
   * Get icon and color configuration for notification types
   */
  getNotificationTypeConfig(type) {
    const config = {
      friend_request: { icon: 'Users', color: 'text-blue-500' },
      friend_accept: { icon: 'UserCheck', color: 'text-green-500' },
      game_invite: { icon: 'Trophy', color: 'text-orange-500' },
      tournament: { icon: 'Swords', color: 'text-purple-500' },
      achievement: { icon: 'Award', color: 'text-yellow-500' },
      reward: { icon: 'Gift', color: 'text-green-500' },
      system: { icon: 'Info', color: 'text-gray-500' }
    };

    return config[type] || { icon: 'Bell', color: 'text-gray-500' };
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    try {
      const notification = await this.notificationRepo.markAsRead(notificationId, userId);
      return this.formatNotificationForFrontend(notification);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for user
   */
  async markAllAsRead(userId) {
    try {
      const count = await this.notificationRepo.markAllAsRead(userId);
      return count;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(sender, userId, type) {
    try {
      const deleted = await this.notificationRepo.delete(sender, userId, type);
      return deleted;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Clean up old read notifications (older than 30 days)
   */
  async cleanupOldNotifications(userId) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // This would need a custom repository method
      const result = await Notification.deleteMany({
        userId,
        read: true,
        createdAt: { $lt: thirtyDaysAgo }
      });

      return result.deletedCount;
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
      throw error;
    }
  }

  /**
   * Emit real-time notification event (for WebSocket integration)
   */
  emitNotificationEvent(notification) {
    // This would integrate with your WebSocket service
    // For example:
    // socketService.emitToUser(notification.userId, 'new_notification', 
    //   this.formatNotificationForFrontend(notification)
    // );
    
    console.log('Notification event emitted for user:', notification.userId);
  }

  /**
   * Get notification statistics for user
   */
  async getNotificationStats(userId) {
    try {
      const unreadCount = await this.notificationRepo.getUnreadCount(userId);
      const totalNotifications = await this.notificationRepo.findByUserId(userId);
      
      // Count by type
      const typeCounts = {};
      totalNotifications.forEach(notification => {
        typeCounts[notification.type] = (typeCounts[notification.type] || 0) + 1;
      });

      return {
        unreadCount,
        totalCount: totalNotifications.length,
        typeCounts
      };
    } catch (error) {
      console.error('Error getting notification stats:', error);
      throw error;
    }
  }
}

// Export a singleton instance
module.exports = new NotificationService();