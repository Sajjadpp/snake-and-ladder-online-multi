const loungeService = require('../../business/service/loungeService')

const loungeController = {

    async getAllLounges(req, res) {
        try{
            let lounges = await loungeService.getAllLounges();
            console.log(lounges)
            res.json(lounges);
        }
        catch(error) {
            console.log(error);
        }
    }
}

module.exports = loungeController