import { Star, Zap } from "lucide-react";
import { getRankChange, getStatusColor } from "../../../utils/leaderboard";
import {motion} from 'framer-motion'
const PlayerRow = ({ player, index }) => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.5 + index * 0.03 }}
    className="px-6 py-4 hover:bg-gray-700/30 transition-all duration-200 group cursor-pointer"
  >
    <div className="grid grid-cols-12 gap-4 items-center">
      {/* Rank */}
      <div className="col-span-1 text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="text-white font-bold text-lg">#{player.rank}</span>
          {getRankChange(player.rank, player.previousRank)}
        </div>
      </div>

      {/* Player Info */}
      <div className="col-span-5 md:col-span-4 flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-lg md:text-xl">
            {player.avatar}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(player.status)} rounded-full border-2 border-gray-800`} />
          {player.isPremium && (
            <div className="absolute -top-1 -right-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold truncate text-sm md:text-base">
            {player.username}
          </p>
          <p className="text-gray-400 text-xs">{player.region}</p>
        </div>
      </div>

      {/* Level */}
      <div className="col-span-2 text-center hidden md:block">
        <div className="inline-flex items-center gap-1 bg-gray-700/50 px-3 py-1 rounded-lg">
          <Zap className="w-4 h-4 text-orange-400" />
          <span className="text-white font-semibold">{player.level}</span>
        </div>
      </div>

      {/* Score */}
      <div className="col-span-3 md:col-span-2 text-center">
        <div className="flex flex-col">
          <span className="text-orange-400 font-bold text-sm md:text-base">
            {player.score.toLocaleString()}
          </span>
          <span className="text-gray-500 text-xs">pts</span>
        </div>
      </div>

      {/* Wins */}
      <div className="col-span-3 md:col-span-2 text-center">
        <div className="flex flex-col">
          <span className="text-white font-semibold text-sm md:text-base">{player.wins}</span>
          <span className="text-gray-500 text-xs">wins</span>
        </div>
      </div>

      {/* Win Rate */}
      <div className="col-span-0 md:col-span-1 text-center hidden md:block">
        <span className="text-green-400 font-semibold">{player.winRate}%</span>
      </div>
    </div>
  </motion.div>
);

export default PlayerRow