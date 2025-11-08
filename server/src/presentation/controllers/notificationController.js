const  notificationService = require("../../business/service/notificationService");
const { mapErrorToHttpResponse } = require("../utils/errorMapper");

const notificationController = {

    async getNotification(req, res) {
        
        try {
            let { id } = req.user;
    
            const userNotifications = await notificationService.getUserNotifications(id);
            
            return res.json(userNotifications);
        }
        catch(error) {
            console.log(error)
            const httpError = mapErrorToHttpResponse(error);
            res.status(error.status).json(error.message);
        }
    },   

    async markAsRead(req, res) {
        try {
            let {notificationId} = req.params;
            let {id} = req.user;
            let response = await notificationService.markAsRead(notificationId, id)
            res.json(response)
        }
        catch(error) {
            console.log(error);
            const httpError = mapErrorToHttpResponse(error);
            res.status(error.status).json(error.message);
        }
    }
}

module.exports = notificationController