import { AnimatePresence, motion } from "framer-motion"
import { LogOut, Volume2, VolumeX } from 'lucide-react';
import soundService from "../../../services/sound";

const SettingModal = ({isOpen, onExit, onMuteToggle, isMuted}) => {
    const handleMuteToggle = () => {
        soundService.toggleMute();
        onMuteToggle?.();
    };

    const handleExit = () => {
        onExit?.();
    };
    if(!isOpen) {
      return;
    }
    return (
        <AnimatePresence>
            <motion.div 
              className="absolute top-full right-0 mt-2 bg-white rounded-lg sm:rounded-xl shadow-xl p-2 min-w-[140px] sm:min-w-[160px] z-30 border border-orange-200"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button 
                className="flex items-center gap-2 sm:gap-3 w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-orange-50 transition-colors text-xs sm:text-sm font-medium text-gray-700"
                onClick={handleMuteToggle}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                {isMuted 
                  ? <VolumeX size={16} className="sm:w-[18px]" /> 
                  : <Volume2 size={16} className="sm:w-[18px]" />
                }
                <span>{isMuted ? 'Unmute' : 'Mute'}</span>
              </motion.button>
              
              <motion.button 
                className="flex items-center gap-2 sm:gap-3 w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-red-50 transition-colors text-xs sm:text-sm font-medium text-red-500 mt-1"
                onClick={handleExit}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut size={16} className="sm:w-[18px]" />
                <span>Exit</span>
              </motion.button>
            </motion.div>
        </AnimatePresence>
    )
}

export default SettingModal