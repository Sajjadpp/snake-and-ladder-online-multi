const DAILY_REWARDS_CONFIG = require("../config/dailyReward");


class DailyRewardService {

    getRewardCycle(cycle) {
        return DAILY_REWARDS_CONFIG.getDaysOfCycle(cycle)
    }
}

const dailyRewardService = new DailyRewardService;

module.exports = dailyRewardService;