const User  = require('../models/user.model');
class userRepository {

    async findById(userId) {
        return await User.findOne({_id: userId}, {password: 0, createdAt: 0, updatedAt: 0});
    }

    async create(userData) {
        return await User.create(userData);
    }

    async findByMobile(mobile) {
        return await User.findOne({ mobile },{password: 0, createdAt: 0, updatedAt: 0});
    }

    async awardCoins(playerId, coins) {
        return await User.findByIdAndUpdate(
            playerId,
            { $inc: { coins: coins } },
            { new: true }
        );
    }

    async detectCoins(player, fee) {
        let deduction = -Math.abs(fee);
        let updatedUser = await User.updateOne({_id: player}, {$inc: {coins: deduction}});
        return updatedUser;
    }

    async searchUser(q, userId) {
        console.log(q, 'kkkk');

        const response = await User.find(
            {
            _id: { $ne: userId }, // exclude current user
            $or: [
                { username: { $regex: q, $options: 'i' } },
                { mobile: { $regex: q, $options: 'i' } },
                { id: { $regex: q, $options: 'i' } } // only if you actually have 'id' field in schema
            ]
            },
            { password: 0 }
        );

        console.log(response);
        return response;
    }

    async validateUser(userId) {
        const user = await User.findOne({_id: userId}, {_id: 1, username: 1});
        return user ? user.username : false
    }

    async updateUser(userId, updateData) {
        console.log(updateData,'updataing data in repo')
        let res = await User.updateOne({_id: userId}, updateData);
        console.log(res,
            'response of database'
        )
        return res
    }

    async getDailyRewardDetails(userId) {
        return await User.findOne({_id: userId}, {dailyRewards: 1});
    }

    async findUserForLogin(mobile) {
        return await User.findOne({mobile}, {createdAt: 0, updatedAt: 0});
    }


}

module.exports = new userRepository()