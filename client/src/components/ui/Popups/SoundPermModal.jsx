import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Music, X } from 'lucide-react';
import soundService from '../../../services/sound';

const MusicPermissionModal = ({ isOpen, onClose, onAllow, onDeny }) => {

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal - Fixed alignment */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-sm"
            >
              <div className="bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700 mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                      <Music className="w-5 h-5 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Background Music</h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Would you like to enable background music for a better gaming experience? 
                    You can always change this in settings.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onDeny}
                    className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-xl font-medium transition-all duration-200 active:scale-95"
                  >
                    No Thanks
                  </button>
                  <button
                    onClick={onAllow}
                    className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Volume2 className="w-4 h-4" />
                    Enable Music
                  </button>
                </div>

                {/* Footer note */}
                <p className="text-xs text-gray-500 text-center mt-4">
                  Music volume can be adjusted anytime
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MusicPermissionModal;