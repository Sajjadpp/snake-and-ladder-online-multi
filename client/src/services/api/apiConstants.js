export const API_ROUTES = {
  ROOM: {
    BASE: '/room',
    CREATE: '/room/create',
    QUICK_PLAY: '/room/quick-play',
    JOIN: '/room/join-room',
    USER_ROOM: '/room/user-room',
    LEAVE: '/room/leave-room'
  },

  LOUNGE: {
    BASE: '/lounge',
    GET_ALL: '/lounge'
  },

  GAME: {
    BASE: '/game',
    CREATE: '/game/create',
    RESULT: '/game/result'
  }


};

export const ROOM_TYPES = {
  PRIVATE: 'Private',
  PUBLIC: 'Public'
};


export const GAME_TYPES = {
  ONE_VS_ONE: '1v1',
  TWO_VS_TWO: '2v2'
};
