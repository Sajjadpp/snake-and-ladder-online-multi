import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react';
const CurrentUserCard = ({ currentUserRank }) => {
  if (currentUserRank.rank <= 20) return null;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="mt-6 bg-gradient-to-r from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl border-2 border-orange-500/50 p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-black text-orange-400">#{currentUserRank.rank}</div>
            <div className="text-xs text-gray-400">Your Rank</div>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
            {currentUserRank.avatar}
          </div>
          <div>
            <p className="text-white font-bold text-lg">{currentUserRank.username}</p>
            <div className="flex gap-4 text-sm">
              <span className="text-orange-400 font-semibold">{currentUserRank.score.toLocaleString()} pts</span>
              <span className="text-gray-400">{currentUserRank.wins} wins</span>
              <span className="text-green-400">{currentUserRank.winRate}% W/R</span>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/50 transition-all"
        >
          <TrendingUp className="w-5 h-5 inline mr-2" />
          Climb Ranks
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CurrentUserCard;