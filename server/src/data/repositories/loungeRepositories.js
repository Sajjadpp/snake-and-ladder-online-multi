const Lounges = require('../models/lounge.model')
class loungeRepository {

    async getAllLounges() {
        return await Lounges.find();
    }
    
    async findById(loungeId) {

        return Lounges.findById(loungeId);
    }

    async findRandomLounge(players, atmostCoins) {
        let lounges = await Lounges.aggregate([
            { $match: { players: players , entryFee: { $lte: atmostCoins }} },
            { $sample: { size: 1 } }
        ]);
        return lounges.length ? lounges[0] : null;
    }
}

module.exports = new loungeRepository