import { axiosInstance } from "../../axios"

export const RewardApi = {

    getUserReward: async() => {

    },

    claimUserReward: async(toast) => {
        try {
            const response = await axiosInstance.post('/user/rewards/claim');
            return response.data
        }
        catch(error) {
            console.log(error);
            if(toast) toast.error(error.message)
        }
    }    
}

export const {
    claimUserReward,
    getUserReward
}  = RewardApi