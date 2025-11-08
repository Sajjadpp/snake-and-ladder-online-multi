// Custom event handlers for different socket events
export const GameEventHandlers = {
  onGameStart: (callback) => {
    // Handle game start events
  },

  onPlayerMove: (callback) => {
    // Handle player move events
  },

  onGameUpdate: (callback) => {
    // Handle game state updates
  }
};

export const RoomEventHandlers = {
  onRoomUpdate: (callback) => {
    // Handle room updates
  },

  onPlayerJoin: (callback) => {
    // Handle player join events
  },

  onPlayerLeave: (callback) => {
    
  }
};


export const handleRoomUpdatesGeneral = (setRooms, setUserExistingRoom) => (offer) => {
  console.log('Room update:', offer);

  switch (offer.type) {
    case "NEW_JOIN":
      setRooms(prev => prev.map(room => 
        room.roomId === offer.roomId.toString() 
          ? { ...room, players: offer.players }
          : room
      ));
      break;

    case "CREATE_ROOM":
      setRooms(prev => {
        const isDuplicate = prev.some(room => room.roomId === offer.roomId.toString());
        return isDuplicate ? prev : [...prev, offer.newRoom];
      });
      break;

    case "LEAVE_ROOM":
      if (!offer.isRoomExist) {
        setRooms(prev => prev.filter(room => room.roomId !== offer.roomId));
      } else {
        setRooms(prev => prev.map(room => 
          room.roomId === offer.roomId
            ? { 
                ...room, 
                players: room.players.filter(p => p._id !== offer.deletedUser.toString())
              }
            : room
        ));
      }
      break;

    default:
      console.warn('Unknown room update type:', offer.type);
  }
};