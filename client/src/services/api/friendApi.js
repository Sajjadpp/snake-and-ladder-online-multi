import { axiosInstance } from "../../axios"

export const friendApi = {

    getAllFriends: async(userId) => {

        try {
            const response = await axiosInstance.get('/user/friends');
            return response.data
        }
        catch(error) {
            throw new Error(error.message)
        }
    },

    getSearchedPlayers: async(q) => {

        try {
            const response = await axiosInstance.get(`/user/search?q=${q}`);
            return response.data;
        }
        catch(error) {
            console.log(error);
            throw new Error(error.response.data)
        }
    }

    

}

export const {
    getAllFriends
} = friendApi

