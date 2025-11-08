const userService = require('../../business/service/userService');
const { errorMappings, mapErrorToHttpResponse } = require('../utils/errorMapper');

const userController = {
    async loginOrRegister(req, res) {
        try {
            console.log(req.body)
            const result = await userService.loginOrRegister(req.body);
            res.status(201).json(result);

        } catch (error) {
            // Map business errors to HTTP responses
            const httpError = mapBusinessErrorToHttpError(error);
            console.log(error)
            res.status(httpError.status).json({ error: httpError.message });
        }
    },

    async getUserById(req, res) {
        try {
            const user = await userService.getUserById(req.params.id);
            res.json({ user });
        } catch (error) {
            const httpError = mapBusinessErrorToHttpError(error);
            res.status(httpError.status).json({ error: httpError.message });
        }
    },

    async updateUser(req, res) {
        try {
            const id = req.user.id
            console.log(id, req.body, "hey this is the data")
            const updatedUser = await userService.updateUser(id, req.body);
            res.json({ user: updatedUser });
        } catch (error) {
            const httpError = mapBusinessErrorToHttpError(error);
            res.status(httpError.status).json({ error: httpError.message });
        }
    },

    async searchUser(req, res) {

        try {
            let {q} = req.query;
            const userId = req.user.id
            console.log(q,'getting here')
            const users = await userService.searchUser(q, userId);
            console.log(users,'users')
            res.json(users ?? []);
        }
        catch(error) {
            console.log(error);
            const httpError = mapBusinessErrorToHttpError(error);
            res.status(httpError.status).json({ error: httpError.message });
        }
    },

    async getUserReward(req, res) {
        try {

            const userId = req.user.id;
            const rewardsOfCycle = await userService.rewardDetails(userId);
            console.log(rewardsOfCycle, 'rewards of cycle')
            res.json(rewardsOfCycle)
        }
        catch(error) {
            console.log(error);
            let httpError = mapErrorToHttpResponse(error);
            res.status(httpError.status).json(httpError.message);
        }
    },
    
   
    async claimDailyReward(req, res) {

        try {
            const userId = req.user.id;
            let response = await userService.claimDailyReward(userId);
            res.json(response);
        }
        catch(error) {
            console.log(error);
            let httpError = mapErrorToHttpResponse(error);
            res.status(httpError.status).json(httpError.message);
        }
    }
    
};

// Pure HTTP error mapping (no business logic)
function mapBusinessErrorToHttpError(businessError) {
  const errorMap = {
    'EMAIL_ALREADY_EXISTS': { status: 400, message: 'Email already registered' },
    'PASSWORD_TOO_WEAK': { status: 400, message: 'Password is too weak' },
    'USER_NOT_FOUND': { status: 404, message: 'User not found' },
    'INVALID_USER_DATA': { status: 400, message: 'Invalid user data' },
    'INVALID_PASSWORD': { status: 400, message: 'Password is incorrect' },
    'PASSWORD_NOT_MATCH': { status: 400, message: 'Password doesnt match' },
  };

  return errorMap[businessError.message] || { status: 500, message: 'Internal server error' };
}

module.exports = userController;