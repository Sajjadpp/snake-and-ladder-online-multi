const userRepository = require('../../data/repositories/userRepositories.js');
const refreshTokenRepository = require('../../data/repositories/tokenRepositories.js');
const tokenService = require('./tokenService.js');
const dailyRewardService = require('./dailyRewardService.js');

class AuthService {

    async refreshAccessToken(refreshTokenId) {
        // Get refresh token
        console.log('getting here')
        console.log(refreshTokenId)
        if(!refreshTokenId) {
            throw new Error('REFRESH_TOKEN_NOT_FOUND')
        }
        const refreshToken = await refreshTokenRepository.findById(refreshTokenId);
        if (!refreshToken) {
            throw new Error('REFRESH_TOKEN_NOT_FOUND');
        };
        console.log(refreshToken)
        // Verify token
        const decodedUserId = tokenService.verifyRefreshToken(refreshToken.token);
        if (!decodedUserId) {
            throw new Error('INVALID_REFRESH_TOKEN');
        };

        // Get user
        const user = await userRepository.findById(decodedUserId);
        console.log(user, 'user printing from the backedn');
        if (!user) {
            throw new Error('USER_NOT_FOUND');
        };

        // Generate new access token
        const newAccessToken = tokenService.generateAccessToken(user._id);

        return {
            accessToken: newAccessToken,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                coins: user.coins,
                avatar: user.avatar,
                dailyRewards: user.dailyRewards
            }
        };
    };

    async createAccessAndRefreshToken(userId) {
        let refreshTokenId = await tokenService.generateRefreshToken(userId);
        console.log(refreshTokenId, 'token id')
        let accessToken = tokenService.generateAccessToken(userId);
        
        return {accessToken, refreshTokenId}
    }

    async logoutUser(tokenId) {
        return await refreshTokenRepository.deleteByTokenId(tokenId);
    }
}

module.exports = new AuthService();