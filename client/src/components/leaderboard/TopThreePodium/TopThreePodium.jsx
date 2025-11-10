import {motion} from 'framer-motion'
import PodiumCard from '../PodiumCard';

const TopThreePodium = ({ players }) => (
  <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 0.3 }}
    className="mb-8"
  >
    <div className="grid grid-cols-3 gap-4 items-end">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="order-1"
      >
        <PodiumCard player={players[1]} rank={2} />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="order-2"
      >
        <PodiumCard player={players[0]} rank={1} isWinner />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="order-3"
      >
        <PodiumCard player={players[2]} rank={3} />
      </motion.div>
    </div>
  </motion.div>
);

export default TopThreePodium