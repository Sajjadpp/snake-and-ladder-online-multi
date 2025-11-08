const AuthService = require('../../business/service/authService');

const authController = {    

    
    async refreshUserData(req, res) {
        try {
            console.log(console.log(req.params))
            const accessId = req.params.accessId;
            
            if (accessId == null  || accessId === 'null') {
                return res.status(400).json({ error: 'User ID is required' });
            }
            const userData = await AuthService.refreshAccessToken(accessId);
            res.json(userData);

        } catch (error) {
            console.log(error)
            const httpError = mapBusinessErrorToHttpError(error);
            res.status(httpError.status).json({ error: httpError.message });
        }
    },

    async logoutUser(req, res) {
        const {refreshTokenId} = req.body; 

        try {
            await AuthService.logoutUser(refreshTokenId)
            return res.json({success: true, message: 'User logouted'})
        }
        catch(error) {
            console.log(error)
            const httpError = mapBusinessErrorToHttpError(error);
            res.status(httpError.status).json({ error: httpError.message });
        }
    }
};

// Pure HTTP error mapping (no business logic)
function mapBusinessErrorToHttpError(businessError) {
    console.log(businessError)
  const errorMap = {
    'USER_NOT_FOUND': { status: 404, message: 'User not found' },
    'INVALID_USER_ID': { status: 400, message: 'Invalid user ID' },
    };
    return errorMap[businessError.message] || { status: 500, message: 'Internal server error' };
} 

module.exports = authController;