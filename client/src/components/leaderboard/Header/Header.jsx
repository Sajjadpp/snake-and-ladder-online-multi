import { ArrowLeft, Trophy } from "lucide-react";
import {motion} from 'framer-motion'
import Button from "../../ui/button";
import { useNavigation } from "../../../hooks/useNavigation";
const LeaderboardHeader = () => {
    const {goBack} = useNavigation()
    return (
  <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="mb-8"
  >
    <div className="flex items-center gap-3 mb-2">
        <div>
            <Button onClick={goBack}>
                <ArrowLeft/>
            </Button>
        </div>
      <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
        <Trophy className="w-8 h-8 text-white" />
      </div>
      <div>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
          Leaderboard
        </h1>
        <p className="text-gray-400 text-sm">Compete with the best players worldwide</p>
      </div>
    </div>
  </motion.div>
)};

export default LeaderboardHeader