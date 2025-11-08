// components/game/SoundSettings.js
import React, { useState } from 'react';
import soundManager from '../../../services/sound';
import { Volume2, VolumeX, Settings } from 'lucide-react';

const SoundSettings = () => {
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    soundManager.setVolume(newVolume / 100);
    soundManager.diceClick();
  };

  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="sound-settings bg-white/5 rounded-lg overflow-hidden">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-white hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center space-x-2">
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span className="font-semibold text-sm">Sound Settings</span>
        </div>
        <Settings className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="p-4 pt-2 space-y-4">
          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className={`p-2 rounded-lg transition-colors ${
                isMuted 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            
            <div className="flex-1 flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 accent-green-500"
                disabled={isMuted}
              />
              <span className="text-white text-sm w-8">{volume}%</span>
            </div>
          </div>
          
          {/* Sound Test Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => soundManager.diceRoll()}
              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-xs transition-colors flex items-center justify-center space-x-1"
            >
              <span>🎲</span>
              <span>Dice</span>
            </button>
            <button
              onClick={() => soundManager.ladderClimb()}
              className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-xs transition-colors flex items-center justify-center space-x-1"
            >
              <span>🪜</span>
              <span>Ladder</span>
            </button>
            <button
              onClick={() => soundManager.snakeHit()}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs transition-colors flex items-center justify-center space-x-1"
            >
              <span>🐍</span>
              <span>Snake</span>
            </button>
            <button
              onClick={() => soundManager.gameWin()}
              className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded text-xs transition-colors flex items-center justify-center space-x-1"
            >
              <span>🎉</span>
              <span>Win</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoundSettings;