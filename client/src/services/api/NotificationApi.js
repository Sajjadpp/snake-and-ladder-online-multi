import { axiosInstance } from "../../axios";

// services/mockNotificationService.js
export const notificationApi = {
  getUserNotifications: async (userId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = await axiosInstance.get('/user/notification');
    console.log(response.data, 'notification')
    return response.data;
  },

  markAsRead: async (notificationId, userId) => {
    try {
      await axiosInstance.put(`/user/notification/markAsRead/${notificationId}`)
      return { success: true };
    }
    catch(error) {
      console.log(error)
    }
  },

  markAllAsRead: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  deleteNotification: async (notificationId, userId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  deleteAllRead: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  clearAll: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};

export const  {
    clearAll,
    deleteAllRead,
    deleteNotification,
    getUserNotifications,
    markAllAsRead,
    markAsRead
} = notificationApi

// Use this in your context until backend is ready
// import { mockNotificationService as notificationService } from './mockNotificationService';