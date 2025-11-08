const DAILY_REWARDS_CONFIG = {
    cycles: {
        1: {
            name: "Starter Cycle",
            rewards: [
                50,   // Day 1
                100,  // Day 2  
                150,  // Day 3
                200,  // Day 4
                250,  // Day 5
                300,  // Day 6
                350,  // Day 7
                400,  // Day 8
                450,  // Day 9
                500,  // Day 10
                550,  // Day 11
                600,  // Day 12
                650,  // Day 13
                700,  // Day 14
                800   // Day 15
            ],
            bonusDays: [7, 15] 
        }
    },
    
    getReward(cycle, day) {
        const rewards = this.cycles[cycle]?.rewards;
        return rewards ? rewards[day - 1] : 0;
    },


    getBonus(cycle, day) {
        const bonus = this.cycles[cycle]?.rewards[day-1] || 0;
        return bonus;
    },

    getCycles(cycle) {
        return this.cycles[cycle]
    },

    getDaysOfCycle(cycle) {
        return this.cycles[cycle].rewards.map((coin, i) => ({day: i+1, coins: coin}))
    }
}; 

module.exports = DAILY_REWARDS_CONFIG