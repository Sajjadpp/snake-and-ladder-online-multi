import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Home, Crown, Star, Sparkles } from 'lucide-react';
import { gameApi } from '../services/api/gameApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth, useToast } from '../contexts';
import { useMemo } from 'react';

const GameWinnerPage = () => {
  const [sortedPlayers, setSortedPlayers] = useState([]);
  const [isWinner, setIsWinner] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [animatingCoins, setAnimatingCoins] = useState([]);
  const [players, setPlayers] = useState([]);
  const [gameData, setGameData] = useState(null);
  const soundServiceRef = useRef(null);
  const pageRef = useRef(null);
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const currentUserId = useMemo(() => user?._id, [user]);

  const onBackToMenu = () => {
    navigate('/home');
  };

  // Initialize sound service
  useEffect(() => {
    soundServiceRef.current = {
      generateTone: (frequency, duration, type = 'sine', volume = 1.0) => {
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = frequency;
          oscillator.type = type;
          
          const finalVolume = volume * 0.1;
          gainNode.gain.setValueAtTime(finalVolume, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        } catch (error) {
          console.warn('Tone generation failed:', error);
        }
      }
    };
  }, []);

  useEffect(() => {
    gameApi.getGameResult(gameId)
      .then((data) => {
        console.log(data, "game result");
        
        setPlayers(data.players);
        setGameData(data);
        
        // Check if current user is the winner
        const winnerPlayer = data.winner;
        const userIsWinner = winnerPlayer?.user?._id === currentUserId;
        setIsWinner(userIsWinner);
        
        if (userIsWinner) {
          playWinnerSound();
          generateConfetti();
          generateCoinAnimation(winnerPlayer.user.coins);
          updateUser({coins: winnerPlayer.user.coins});
        } else {
          const currentPlayer = data.players.find(p => p.user._id === currentUserId);
          generateLoserCoinAnimation(winnerPlayer, currentPlayer);
        }
      })
      .catch(error => {
        toast.error(error);
        navigate('/home');
      });
  }, [currentUserId]);

  // Sort players by position
  useEffect(() => {
    if (players.length > 0) {
      const sorted = [...players].sort((a, b) => a.position - b.position);
      setSortedPlayers(sorted);
    }
  }, [players]);

  // Cheerful winner sound sequence
  const playWinnerSound = () => {
    setTimeout(() => soundServiceRef.current?.generateTone(523.25, 0.2, 'sine'), 0);
    setTimeout(() => soundServiceRef.current?.generateTone(659.25, 0.2, 'sine'), 200);
    setTimeout(() => soundServiceRef.current?.generateTone(784, 0.2, 'sine'), 400);
    setTimeout(() => soundServiceRef.current?.generateTone(1046.5, 0.4, 'sine'), 600);
  };

  // Generate confetti pieces
  const generateConfetti = () => {
    const pieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1.5,
      rotation: Math.random() * 360,
      size: Math.random() * 10 + 6,
      color: ['bg-orange-400', 'bg-orange-500', 'bg-gray-300', 'bg-white'][Math.floor(Math.random() * 4)]
    }));
    setConfetti(pieces);
  };

  // Coin animation to header when user wins
  const generateCoinAnimation = (coins) => {
    const coinElements = Array.from({ length: Math.min(coins, 12) }, (_, i) => ({
      id: i,
      startX: Math.random() * 300 - 150,
      startY: Math.random() * 200 - 100,
      delay: i * 0.08,
    }));
    setAnimatingCoins(coinElements);
  };

  // Coin animation from loser to winner when user loses
  const generateLoserCoinAnimation = (winner, loser) => {
    const userCoins = loser?.user.coins || 0;
    const coinElements = Array.from({ length: Math.min(userCoins, 8) }, (_, i) => ({
      id: i,
      startX: -50 + Math.random() * 100,
      startY: 100 + Math.random() * 100,
      delay: i * 0.15,
    }));
    setAnimatingCoins(coinElements);
  };

  const medals = [
    { 
      position: 0, 
      icon: Crown, 
      label: 'Champion', 
      color: 'text-orange-500',
      bgGradient: 'from-orange-500/20 via-orange-400/10 to-transparent',
      borderColor: 'border-orange-500/50',
      ringColor: 'ring-orange-400'
    },
    { 
      position: 1, 
      icon: Medal, 
      label: 'Runner Up', 
      color: 'text-gray-400',
      bgGradient: 'from-gray-400/20 via-gray-300/10 to-transparent',
      borderColor: 'border-gray-400/50',
      ringColor: 'ring-gray-400'
    },
    { 
      position: 2, 
      icon: Star, 
      label: 'Third Place', 
      color: 'text-orange-300',
      bgGradient: 'from-orange-300/20 via-orange-200/10 to-transparent',
      borderColor: 'border-orange-300/50',
      ringColor: 'ring-orange-300'
    },
  ];

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Confetti Animation */}
      <AnimatePresence>
        {isWinner && confetti.map((piece) => (
          <motion.div
            key={piece.id}
            className={`fixed w-3 h-3 ${piece.color} rounded-full pointer-events-none shadow-lg`}
            style={{
              left: `${piece.left}%`,
              top: -10,
              width: piece.size,
              height: piece.size,
            }}
            initial={{ opacity: 1, y: 0, rotate: 0 }}
            animate={{
              opacity: 0,
              y: window.innerHeight + 100,
              rotate: piece.rotation + 720,
            }}
            transition={{
              duration: piece.duration,
              delay: piece.delay,
              ease: 'easeIn',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Coin Animation Overlay */}
      {animatingCoins.map((coin) => (
        <motion.div
          key={coin.id}
          className="fixed pointer-events-none z-50"
          initial={{
            x: coin.startX,
            y: coin.startY,
            opacity: 1,
            scale: 1,
            rotate: 0,
          }}
          animate={{
            x: 0,
            y: isWinner ? -120 : 50,
            opacity: 0,
            scale: 0.3,
            rotate: 360,
          }}
          transition={{
            duration: 1.5,
            delay: coin.delay,
            ease: 'easeInOut',
          }}
        >
          <div className="text-4xl drop-shadow-lg">💰</div>
        </motion.div>
      ))}

      {/* Main Content */}
      <motion.div
        className="w-full max-w-4xl relative z-10"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Winner Popup Modal */}
        <AnimatePresence>
          {isWinner && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl p-8 sm:p-12 text-center max-w-lg w-full shadow-2xl border-2 border-orange-500/50 relative overflow-hidden"
                initial={{ scale: 0.5, y: -100, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.5, y: 100, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-transparent to-orange-500/20 animate-pulse"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 10, 0],
                      scale: [1, 1.1, 1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="mb-6"
                  >
                    <Crown className="w-24 h-24 mx-auto text-orange-500 drop-shadow-2xl" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 mb-3">
                      VICTORY!
                    </h1>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Sparkles className="w-6 h-6 text-orange-400" />
                      <p className="text-white/90 text-xl font-medium">Congratulations Champion!</p>
                      <Sparkles className="w-6 h-6 text-orange-400" />
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 border border-orange-500/30">
                      <p className="text-gray-400 text-sm mb-2">Winner</p>
                      <p className="text-orange-400 text-3xl font-bold mb-4">
                        {sortedPlayers[0]?.user.username}
                      </p>
                      
                      {gameData && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-gray-900/50 rounded-lg p-3">
                            <p className="text-gray-400 mb-1">Prize Pool</p>
                            <p className="text-orange-400 font-bold text-lg">{gameData.prize} 💰</p>
                          </div>
                          <div className="bg-gray-900/50 rounded-lg p-3">
                            <p className="text-gray-400 mb-1">Position</p>
                            <p className="text-white font-bold text-lg">#1</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <motion.button
                      onClick={onBackToMenu}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-orange-500/50"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Home className="w-5 h-5" />
                        Return to Menu
                      </span>
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-3 rounded-full border border-orange-500/30 mb-4">
            <Trophy className="w-6 h-6 text-orange-500" />
            <span className="text-orange-400 font-bold text-lg">Game Results</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white mb-3">
            Final Rankings
          </h2>
          
          {gameData && (
            <div className="flex items-center justify-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>Players: {players.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>Prize: {gameData.prize} 💰</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Leaderboard */}
        <div className="space-y-4 sm:space-y-5 mb-8">
          {sortedPlayers.slice(0, 3).map((player, index) => {
            const medal = medals[index];
            const MedalIcon = medal.icon;
            const isCurrentUser = player.user._id === currentUserId;

            return (
              <motion.div
                key={player.user._id}
                className={`relative overflow-hidden rounded-2xl backdrop-blur-sm border-2 transition-all duration-300 ${
                  isCurrentUser
                    ? 'bg-gradient-to-r from-orange-500/10 via-gray-800/50 to-gray-800/50 border-orange-500/70 shadow-lg shadow-orange-500/20'
                    : 'bg-gray-800/40 border-gray-700/50 hover:border-gray-600/50'
                }`}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.15 + 0.4, duration: 0.5 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                {/* Shine effect for current user */}
                {isCurrentUser && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                )}

                {/* Top rank highlight */}
                {index === 0 && (
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${medal.bgGradient}`}></div>
                )}

                <div className="flex items-center justify-between p-5 sm:p-6 relative z-10">
                  <div className="flex items-center gap-4 sm:gap-6">
                    {/* Medal Icon */}
                    <motion.div
                      animate={index === 0 ? { 
                        rotate: [0, -5, 5, -5, 0],
                        scale: [1, 1.05, 1, 1.05, 1]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full ${
                        index === 0 ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/20' : 'bg-gray-700/30'
                      } flex items-center justify-center`}
                    >
                      <MedalIcon className={`w-8 h-8 sm:w-10 sm:h-10 ${medal.color}`} />
                    </motion.div>

                    {/* Player Info */}
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs sm:text-sm text-gray-400 font-medium">{medal.label}</p>
                        {index === 0 && <Sparkles className="w-3 h-3 text-orange-400" />}
                      </div>
                      <p className={`text-xl sm:text-2xl font-bold ${
                        isCurrentUser ? 'text-orange-400' : 'text-white'
                      }`}>
                        {player.user.username}
                      </p>
                      {isCurrentUser && (
                        <span className="inline-block mt-1 text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30">
                          You
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Position Badge */}
                  <div className="text-right flex-shrink-0">
                    <div className={`inline-flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-xl ${
                      index === 0 
                        ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-2 border-orange-500/50' 
                        : 'bg-gray-700/30 border border-gray-600/50'
                    }`}>
                      <p className="text-xs text-gray-400 font-medium">Rank</p>
                      <p className={`text-2xl sm:text-3xl font-black ${
                        index === 0 ? 'text-orange-500' : 'text-white'
                      }`}>
                        #{player.position}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Remaining Players */}
        {sortedPlayers.length > 3 && (
          <motion.div
            className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 sm:p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h3 className="text-gray-400 text-sm font-semibold mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
              Other Players
            </h3>
            <div className="space-y-2">
              {sortedPlayers.slice(3).map((player, index) => {
                const isCurrentUser = player.user._id === currentUserId;
                return (
                  <div
                    key={player.user._id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isCurrentUser ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-gray-700/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 font-bold w-6">#{player.position}</span>
                      <span className={`font-medium ${isCurrentUser ? 'text-orange-400' : 'text-gray-300'}`}>
                        {player.user.username}
                        {isCurrentUser && ' (You)'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Back Button - Only show for non-winners */}
        {!isWinner && (
          <motion.button
            onClick={onBackToMenu}
            className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl border border-gray-600/50"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Home className="w-5 h-5" />
            <span>Back to Menu</span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default GameWinnerPage;