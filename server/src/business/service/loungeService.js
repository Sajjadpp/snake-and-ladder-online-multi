const loungeRepository = require('../../data/repositories/loungeRepositories');

class LoungeService {

    async getAllLounges() {
        return await loungeRepository.getAllLounges();
    }

    async getLoungeDetails(loungeId) {
        const lounge = await this.validateLounge(loungeId);
        return {
            id: lounge._id,
            name: lounge.name,
            players: lounge.players,
            entryFee: lounge.entryFee,
        };
    }

    async validateLounge(loungeId) {

        let lounge = await loungeRepository.findById(loungeId)
        if(!lounge) {
            throw new Error('LOUNGE_NOT_FOUND');
        }
        return lounge
    }

    async getRandomLounge(players, smallestCoins) {
        console.log(smallestCoins, 'smallestCoins')
        let lounge = await loungeRepository.findRandomLounge(players, smallestCoins);
        if(!lounge) {
            throw new Error('NO_AVAILABLE_LOUNGE');
        }
        console.log(lounge, 'lounge')
        return lounge;
    }
}

module.exports = new LoungeService();