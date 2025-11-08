const friendService = require("../../business/service/friendService")

let friendController = {

    async getAllFriends(req, res) {
        try {
            let userId = req.user.id
            console.log('getting here')
            const allFriends = await friendService.getAllFriendsOfUser(userId)
            console.log(allFriends, 'friends')
            res.json(allFriends);
        }
        catch(error) {
            console.log(error)
        }
    },
}

module.exports = friendController