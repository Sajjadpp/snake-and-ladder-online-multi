const jwt = require('jsonwebtoken');
const tokenRepositories = require('../../data/repositories/tokenRepositories');

class TokenService {

    generateAccessToken =(userId)=>{

        try{
            
            return jwt.sign({userId}, process.env.JWT_SECRET, {
                expiresIn: "1d"
            })
            
        }
        catch(err){
            console.log(err)
            return 
        }
    }

    async generateRefreshToken(userId){
        try {
            let refreshToken = jwt.sign({userId}, process.env.JWT_SECRET, {
                expiresIn: '30d'
            });

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30);

            let tokenDoc = await tokenRepositories.create({expiresAt, token: refreshToken, userId});
            tokenDoc.save();
            
            return tokenDoc._id;
        }
        catch(error) {
            throw Error(error)
        }
    }

    verifyRefreshToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded)
            return decoded.userId || decoded.user; // Handle different payload formats
        } catch (error) {
            console.log(error)
            if (error.name === 'TokenExpiredError') {
                throw new Error('TOKEN_EXPIRED');
            }
            throw new Error('INVALID_REFRESH_TOKEN');
        }
    }

    verifyAccessToken(token) {

        try{
            console.log(token, 'token')
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded, 'decoded')
            return decoded.userId;
        }
        catch(error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('TOKEN_EXPIRED');
            }
            console.log(error, 'error i consoling')
            throw new Error('INVALID_TOKEN');
        }
    }
}

module.exports = new TokenService();
