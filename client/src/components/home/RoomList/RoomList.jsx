import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import RoomCard from './RoomCard';
import Button from '../../ui/button';

const RoomList = ({ rooms, activeTab, onJoinRoom, onShowGameOptions }) => {
  const filterRooms = () => {
    const playersCount = activeTab === '1vs1' ? 2 : 4;
    return rooms.filter(room => 
      room.allowedPlayers === playersCount &&
      room.progress === "in Room"
    );
  };

  const filteredRooms = filterRooms();

  if (filteredRooms.length === 0) {
    return (
      <motion.div 
        className="w-full space-y-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: 0.4 }
          }
        }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Available Rooms</h2>
          <span className="text-xs font-medium text-white/60">
            0 rooms found
          </span>
        </div>

        <EmptyState onShowGameOptions={onShowGameOptions} />
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="w-full space-y-3"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { 
            staggerChildren: 0.1,
            delayChildren: 0.2
          }
        }
      }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">Available Rooms</h2>
        <span className="text-xs font-medium text-white/60">
          {filteredRooms.length} rooms found
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room, index) => (
          <RoomCard
            key={room._id || room.roomId}
            room={room}
            index={index}
            onJoinRoom={onJoinRoom}
          />
        ))}
      </div>
    </motion.div>
  );
};

const EmptyState = ({ onShowGameOptions }) => (
  <motion.div
    className="bg-white/95 backdrop-blur-sm rounded-xl p-8 text-center shadow-lg border border-orange-100"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-sm font-medium text-gray-600 mb-2">No rooms available</h3>
    <p className="text-xs text-gray-400 mb-4">Be the first to create a room!</p>
    <Button
      onClick={onShowGameOptions}
      variant="primary"
      size="medium"
    >
      Create Room
    </Button>
  </motion.div>
);

export default RoomList;