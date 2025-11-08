import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

// Avatar data - you can replace with your own avatar images/icons
const AVATARS = [
  { id: 1, emoji: '😀', color: 'bg-yellow-400', name: 'Smiley' },
  { id: 2, emoji: '😎', color: 'bg-blue-400', name: 'Cool' },
  { id: 3, emoji: '🤓', color: 'bg-green-400', name: 'Nerd' },
  { id: 4, emoji: '😇', color: 'bg-purple-400', name: 'Angel' },
  { id: 5, emoji: '🤠', color: 'bg-orange-400', name: 'Cowboy' },
  { id: 6, emoji: '🥳', color: 'bg-pink-400', name: 'Party' },
  { id: 7, emoji: '🤖', color: 'bg-gray-400', name: 'Robot' },
  { id: 8, emoji: '👽', color: 'bg-indigo-400', name: 'Alien' },
  { id: 9, emoji: '😺', color: 'bg-red-400', name: 'Cat Face' },
  { id: 10, emoji: '🧙‍♂️', color: 'bg-amber-400', name: 'Wizard' },
  { id: 11, emoji: '🧑‍🎤', color: 'bg-orange-500', name: 'Rockstar' },
  { id: 12, emoji: '🧑‍🚀', color: 'bg-slate-400', name: 'Astronaut' },
  { id: 13, emoji: '🧑‍💻', color: 'bg-yellow-500', name: 'Coder' },
  { id: 14, emoji: '🧑‍🍳', color: 'bg-orange-600', name: 'Chef' },
  { id: 15, emoji: '🧑‍🎓', color: 'bg-fuchsia-400', name: 'Student' },
  { id: 16, emoji: '🧑‍🚒', color: 'bg-emerald-500', name: 'Firefighter' },
  { id: 17, emoji: '🧑‍🚀', color: 'bg-cyan-400', name: 'Space Explorer' },
  { id: 18, emoji: '🧑‍⚖️', color: 'bg-yellow-300', name: 'Judge' },
  { id: 19, emoji: '🧑‍🏫', color: 'bg-red-500', name: 'Teacher' },
  { id: 20, emoji: '🧑‍💼', color: 'bg-purple-300', name: 'Professional' },
];


const AvatarSelectorModal = ({ isOpen, onClose, onSelect }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [hoveredAvatar, setHoveredAvatar] = useState(null);

  const handleConfirm = () => {
    if (selectedAvatar) {
      onSelect(selectedAvatar);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden border border-gray-700"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-white" />
                    <h2 className="text-xl font-bold text-white">
                      Choose Your Avatar
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1.5 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Selected Preview */}
              {selectedAvatar && (
                <motion.div
                  className="px-5 py-3 bg-gray-800 border-b border-gray-700"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      className={`w-12 h-12 rounded-xl ${selectedAvatar.color} flex items-center justify-center text-2xl shadow-lg`}
                      layoutId={`avatar-${selectedAvatar.id}`}
                    >
                      {selectedAvatar.emoji}
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-gray-400 text-xs">Selected</p>
                      <p className="text-white text-base font-semibold">{selectedAvatar.name}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Avatar Grid */}
              <div className="px-4 py-5 max-h-[55vh] overflow-y-auto">
                <div className="grid grid-cols-4 gap-3">
                  {AVATARS.map((avatar) => (
                    <motion.button
                      key={avatar.id}
                      className={`relative aspect-square rounded-xl ${avatar.color} flex flex-col items-center justify-center text-3xl shadow-md transition-all ${
                        selectedAvatar?.id === avatar.id
                          ? 'ring-3 ring-orange-500 ring-offset-2 ring-offset-gray-900'
                          : 'hover:scale-105'
                      }`}
                      onClick={() => setSelectedAvatar(avatar)}
                      onMouseEnter={() => setHoveredAvatar(avatar)}
                      onMouseLeave={() => setHoveredAvatar(null)}
                      whileHover={{ scale: selectedAvatar?.id === avatar.id ? 1 : 1.05 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div className="text-2xl">{avatar.emoji}</div>
                      
                      {/* Hover Label */}
                      <AnimatePresence>
                        {hoveredAvatar?.id === avatar.id && selectedAvatar?.id !== avatar.id && (
                          <motion.div
                            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-gray-900 px-2 py-0.5 rounded shadow-xl whitespace-nowrap z-10"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                          >
                            <p className="text-white text-xs font-medium">{avatar.name}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Selected Check Mark */}
                      {selectedAvatar?.id === avatar.id && (
                        <motion.div
                          className="absolute inset-0 bg-black bg-opacity-30 rounded-xl flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="bg-orange-500 rounded-full p-1.5 shadow-lg">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-4 bg-gray-800 border-t border-gray-700">
                <motion.button
                  onClick={handleConfirm}
                  disabled={!selectedAvatar}
                  className={`w-full py-3 rounded-xl font-semibold transition-all shadow-lg ${
                    selectedAvatar
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                  whileHover={selectedAvatar ? { scale: 1.02 } : {}}
                  whileTap={selectedAvatar ? { scale: 0.98 } : {}}
                >
                  {selectedAvatar ? 'Confirm Selection' : 'Select an Avatar'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};


export default AvatarSelectorModal;