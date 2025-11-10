import {motion} from 'framer-motion'
import { getRankIcon } from '../../../utils/leaderboard';
import { Trophy } from 'lucide-react';
const PodiumCard = ({ player, rank, isWinner = false }) => {
  if (!player) return null;

  const heights = {
    1: 'h-48',
    2: 'h-40',
    3: 'h-36'
  };

  return (
    <div className="text-center">
      <motion.div
        animate={isWinner ? { y: [0, -10, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative mb-3 inline-block"
      >
        <div className={`w-16 h-16 md:w-20 md:h-20 ${
          isWinner 
            ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 ring-4 ring-yellow-400/30' 
            : 'bg-gradient-to-br from-orange-500 to-orange-600'
        } rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-2xl`}>
          {player.avatar}
        </div>
        <div className="absolute -top-2 -right-2">
          {getRankIcon(rank)}
        </div>
        {isWinner && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(250, 204, 21, 0.3), transparent)',
            }}
          />
        )}
      </motion.div>

      <div className={`${heights[rank]} ${
        isWinner 
          ? 'bg-gradient-to-b from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-400/50' 
          : rank === 2 
            ? 'bg-gradient-to-b from-gray-400/20 to-gray-500/20 border-2 border-gray-400/50'
            : 'bg-gradient-to-b from-orange-400/20 to-orange-500/20 border-2 border-orange-400/50'
      } rounded-t-2xl p-4 backdrop-blur-sm`}>
        <div className={`text-3xl md:text-4xl font-black mb-1 ${isWinner ? 'text-yellow-400' : 'text-white'}`}>
          #{rank}
        </div>
        <div className="text-white font-bold text-sm md:text-base mb-2 truncate">
          {player.username}
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-center gap-1">
            <Trophy className="w-3 h-3 text-orange-400" />
            <span className="text-orange-400 font-semibold">{player.score.toLocaleString()}</span>
          </div>
          <div className="text-gray-400">{player.wins} wins</div>
        </div>
      </div>
    </div>
  );
};

export default PodiumCard;