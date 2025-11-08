const userRepository = require('../../data/repositories/userRepositories');
const bcrypt = require('bcrypt');
const authService = require('./authService');
const { getUserMap, isUserOnline } = require('../../presentation/socket/connectedUsers');
const dailyRewardService = require('./dailyRewardService');
const DAILY_REWARDS_CONFIG = require('../config/dailyReward');
class UserService {

    async registerUser({username, mobile, email, password, confirmPassword}) {

        const isExist = await userRepository.findByMobile(mobile);
        if(isExist) {
            return this.loginUser(mobile, password)
        }
        // Validate password and cPass
        if(password && confirmPassword & password === confirmPassword) {
            throwError("PASSWORD_NOT_MATCH");
        }
        let hashedPass = await bcrypt.hash(password, 10);
        let user = await userRepository.create({username, mobile, email, password: hashedPass});

        let {accessToken, refreshTokenId} = await authService.createAccessAndRefreshToken(user._id);
        return {
            user: {
                _id: user._id,
                id: user.id,
                coins: user.coins,
                username: user.username,
                mobile: user.mobile,
                avatar: user.avatar,
                dailyRewards: user.dailyRewards
            }, 
            accessToken,
            refreshTokenId
        };
    }

    async loginUser({mobile, password}) {
        const user = await userRepository.findUserForLogin(mobile);
        if(!user) {
            throw Error("USER_NOT_FOUND");
        }
        let isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            throw Error("INVALID_PASSWORD");
        }
        let {accessToken, refreshTokenId} = await authService.createAccessAndRefreshToken(user._id);
        return {
            user: {
                _id: user._id,
                id: user.id,
                coins: user.coins,
                username: user.username,
                mobile: user.mobile,
                avatar: user.avatar,
                dailyRewards: user.dailyRewards
            }, 
            accessToken,
            refreshTokenId
        };
    }

    async getUserById(userId) {
        const user = await userRepository.findById(userId);
        if(!user) {
            throw Error("USER_NOT_FOUND");
        }
        return user;
    }

    async updateUser(userId, updateData) {
        // Business logic to update user data
        const user = await userRepository.updateUser(userId, updateData);
        if(!user) {
            throw Error("USER_NOT_FOUND");
        }
        return user;
    }

    async loginOrRegister(userData) {

        if(!userData.mobile || !userData.password) {
            throw Error("CREDENCIAL_NOT_FOUND");
        }
        if(!userData.email?.length && !userData.username?.length) {
            return this.loginUser({mobile: userData.mobile, password:userData.password});
        }
        else {
            return this.registerUser(userData);
        }
    }; 

    async detectCoins(players = [], fee) {
        console.log(players, fee, 'fee and players')
        players.forEach(async p =>{
            await userRepository.detectCoins(p.user._id, fee);
        })
        return true;
    }

    async sufficientCoin(userId, fee) {
        let user = await userRepository.findById(userId);   
        if(user.coins < fee) {
            return false
        }
        return true;
    }

    async addCoin(userId, coin) {
        return await userRepository.awardCoins(userId, coin)
    }

    async searchUser(q, userId) {
        if(!q) return [];
        let searchedUsers = await userRepository.searchUser(q, userId);
        return searchedUsers.map(u => ({...u._doc, status: isUserOnline(u._doc._id) ? 'online': 'offline'}));
    }

    async validateUser(userId) {

        return await userRepository.validateUser(userId)

    }

    async getDailyRewardDetails(userId) {
        return await userRepository.getDailyRewardDetails(userId);
    }

    async rewardDetails(userId) {
        let {dailyRewards} = await this.getDailyRewardDetails(userId);

        let rewards = DAILY_REWARDS_CONFIG
            .getCycles(dailyRewards.currentCycle)
            .rewards.map((val, i) => ({
                day: i+1,
                coins: val, 
                status: dailyRewards.currentStreak > i + 1 
                ? 'claimed': dailyRewards.currentStreak === i + 1 ? "available" 
                : 'locked'
            })
        );
        let nextClaimDay;
        let canClaimToday = false;

        if (dailyRewards.lastClaimed) {
            // user has already claimed before
            nextClaimDay = new Date(dailyRewards.lastClaimed);
            nextClaimDay.setDate(nextClaimDay.getDate() + 1);
            canClaimToday = new Date().toDateString() === nextClaimDay.toDateString();
        } else {
            // first time claim
            nextClaimDay = new Date(); // today
            canClaimToday = true; // allow immediate claim
        }

        return {
            rewards,
            currentStreak: dailyRewards.currentStreak || 0,
            totalClaimed: dailyRewards.totalClaimed || 0,
            currentCycle: dailyRewards.currentCycle || 1,
            nextClaimDay,
            canClaimToday
        };
    }

    async claimDailyReward(userId) {
        let userData = await this.getUserById(userId);
        console.log(userData, 'claim daly')
        let cycle = userData.dailyRewards.currentCycle;
        let streak = userData.dailyRewards.currentStreak;
        let rewardOfDay = DAILY_REWARDS_CONFIG.getReward(cycle, streak)
        let newDate = new Date();

        if( streak === 14) {
            streak = 1;
            cycle++
        }
        else {
            streak++;
        }

        await this.addCoin(userId, Number(rewardOfDay))
        await userRepository.updateUser(userId, {
            dailyRewards: {
                currentStreak: streak, 
                currentCycle: cycle, 
                lastClaimed: newDate
            }   
        });

        return {
            coins: Number(userData.coins + rewardOfDay),
            dailyRewards: {
                currentStreak: streak, 
                currentCycle: cycle, 
                lastClaimed: newDate
            }  
        }
    }

}


module.exports = new UserService;