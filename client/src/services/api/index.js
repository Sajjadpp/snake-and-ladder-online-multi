export { RoomApi } from './roomApi';
export { LoungeApi } from './loungeApi';
export { API_ROUTES, ROOM_TYPES } from './apiConstants';

// Backward compatibility exports
export {
  getRooms,
  createRoom,
  quickPlay,
  joinRoom,
  leaveRoom,
  checkUserInRoom
} from './roomApi';

export {
  getLounges
} from './loungeApi';

export {
  getAllFriends,
} from './friendApi'

export {
  clearAll,
  deleteAllRead,
  deleteNotification, 
  getUserNotifications,
  markAllAsRead, 
  markAsRead, 
} from './NotificationApi'

export {
  claimUserReward,
  getUserReward
} from './rewardApi'