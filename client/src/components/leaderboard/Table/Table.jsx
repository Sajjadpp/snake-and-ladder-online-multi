import PlayerRow from "../PlayerRow";
import TableHeader from "../TableHeader";
import {motion} from 'framer-motion'
const LeaderboardTable = ({ players }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.5 }}
    className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden"
  >
    <TableHeader />
    <div className="divide-y divide-gray-700/30">
      {players.slice(3, 20).map((player, index) => (
        <PlayerRow key={player.id} player={player} index={index} />
      ))}
    </div>
  </motion.div>
);

export default LeaderboardTable