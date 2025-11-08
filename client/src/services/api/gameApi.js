import { axiosInstance } from "../../axios";
import { API_ROUTES } from "./apiConstants";

export const gameApi = {

    getGameResult: async (gameId) => {

        try {
            const response = await axiosInstance.get(
                `${API_ROUTES.GAME.RESULT}/${gameId}`
            );
            console.log('Game result fetched:', response.data);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching game result:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch game result');
        }
    }   


}