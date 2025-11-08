const RefreshToken = require('../models/token.model');

class TokenRepository {
    async findById(id) {
        return await RefreshToken.findOne({ _id: id }, { token: 1 });
    }
    
    async create(tokenData) {
        return await RefreshToken.create(tokenData);
    }
    
    async deleteByUserId(userId) {
        return await RefreshToken.deleteMany({ user: userId });
    }

    async deleteByTokenId(tokenId) {
        let doc = await RefreshToken.deleteOne({_id: tokenId}, {new: true});
        return await this.deleteByUserId(doc.user);
    }
}

module.exports = new TokenRepository();