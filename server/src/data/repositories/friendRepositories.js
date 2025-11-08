const Friend = require('../models/friend.model');

class FriendRepository {

  // Create a friend request (creates 2 documents - one for each user)
  async createFriendRequest(fromUserId, toUserId) {
    // Check if friendship already exists
    const existing = await Friend.findOne({
      userId: fromUserId,
      friendId: toUserId
    });
    const existingOpposition = await Friend.findOne({
        userId: toUserId,
        friendId: fromUserId
    });
    
    if (existing) {
      if(existingOpposition) {
        return await this.acceptFriendRequest(toUserId, fromUserId)
      }
      else {
        throw new Error('Friend request already exists');
      }
    }


    
    
    // Create both sides of the friendship
    const requester = await Friend.create({
      userId: fromUserId,
      friendId: toUserId,
      status: 'pending',
      role: 'requester'
    });
    
    const receiver = await Friend.create({
      userId: toUserId,
      friendId: fromUserId,
      status: 'pending',
      role: 'receiver'
    });
    
    return { requester, receiver };
  }

  // Accept a friend request (updates both documents)
  async acceptFriendRequest(userId, friendId) {
    // Update both sides
    console.log(userId, friendId,"user id and friend id")
    const acceptedAt = new Date();
    
    await Friend.updateMany(
      {
        $or: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId }
        ],
        status: 'pending'
      },
      {
        status: 'accepted',
        acceptedAt: acceptedAt
      }
    );
    
    return await Friend.findOne({ userId, friendId });
  }

  // Reject a friend request
  async rejectFriendRequest(userId, friendId) {
    await Friend.updateMany(
      {
        $or: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId }
        ],
        status: 'pending'
      },
      { status: 'rejected' }
    );
  }

  // Get all friends for a user - SUPER SIMPLE!
  async getAllFriends(userId, status = 'accepted') {
    return await Friend.find({ 
      userId, 
      status
    }).populate('friendId', 'username avatar email status id coins _id');
  }

  // Get sent friend requests - SIMPLE!
  async getSentRequests(userId) {
    return await Friend.find({
      userId,
      status: 'pending',
      role: 'requester'
    }).populate('friendId', 'username avatar email');
  }

  // Get received friend requests - SIMPLE!
  async getReceivedRequests(userId) {
    return await Friend.find({
      userId,
      status: 'pending',
      role: 'receiver'
    }).populate('friendId', 'username avatar email');
  }

  // Get friends by category - SIMPLE!
  async getFriendsByCategory(userId, category) {
    return await Friend.find({
      userId,
      status: 'accepted',
      category
    }).populate('friendId', 'username avatar email');
  }

  // Get favorite friends - SIMPLE!
  async getFavoriteFriends(userId) {
    return await Friend.find({
      userId,
      status: 'accepted',
      isFavorite: true
    }).populate('friendId', 'username avatar email');
  }

  // Remove a friend (deletes both documents)
  async removeFriend(userId, friendId) {
    await Friend.deleteMany({
      $or: [
        { userId: userId, friendId: friendId },
        { userId: friendId, friendId: userId }
      ]
    });
  }

  // Block a user (updates both documents)
  async blockUser(userId, targetUserId) {
    await Friend.updateMany(
      {
        $or: [
          { userId: userId, friendId: targetUserId },
          { userId: targetUserId, friendId: userId }
        ]
      },
      { status: 'blocked' }
    );
  }

  // Update user settings - SIMPLE! (only updates your own record)
  async updateSettings(userId, friendId, settings) {
    return await Friend.findOneAndUpdate(
      { userId, friendId },
      settings,
      { new: true }
    );
  }

  // Set nickname - SIMPLE!
  async setNickname(userId, friendId, nickname) {
    return await Friend.findOneAndUpdate(
      { userId, friendId },
      { nickname },
      { new: true }
    );
  }

  // Toggle favorite - SIMPLE!
  async toggleFavorite(userId, friendId) {
    const friendship = await Friend.findOne({ userId, friendId });
    if (!friendship) throw new Error('Friendship not found');
    
    friendship.isFavorite = !friendship.isFavorite;
    return await friendship.save();
  }

  // Update category - SIMPLE!
  async updateCategory(userId, friendId, category) {
    return await Friend.findOneAndUpdate(
      { userId, friendId },
      { category },
      { new: true }
    );
  }

  // Update last interaction
  async updateInteraction(userId, friendId) {
    const now = new Date();
    
    // Update both sides
    await Friend.updateMany(
      {
        $or: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId }
        ]
      },
      { lastInteraction: now }
    );
  }

  // Check if users are friends - SIMPLE!
  async areFriends(userId1, userId2) {
    const friendship = await Friend.findOne({
      userId: userId1,
      friendId: userId2,
      status: 'accepted'
    });
    return !!friendship;
  }

  // Get friendship details - SIMPLE!
  async getFriendship(userId, friendId) {
    return await Friend.findOne({ userId, friendId })
      .populate('friendId', 'username avatar email status');
  }

  // Count friends - SIMPLE!
  async countFriends(userId, status = 'accepted') {
    return await Friend.countDocuments({ userId, status });
  }
}

// Create and freeze the singleton instance
const friendRepository = new FriendRepository();

module.exports = friendRepository;
