import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Home } from 'lucide-react';
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
  const soundServiceRef = useRef(null);
  const pageRef = useRef(null);
  const { gameId } = useParams();
  const navigate = useNavigate()
  const { user } = useAuth();
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
       setPlayers(data.players);
     })
     .catch(error => {
        toast.error(error)
        navigate('/home')
     })
   }, [])

  // Sort players and setup
  useEffect(() => {
    const sorted = [...players]?.sort((a, b) => b.position - a.position);
    setSortedPlayers(sorted);
    
    const winner = sorted[0];
    const userIsWinner = winner?.user._id === currentUserId;
    setIsWinner(userIsWinner);

    if (userIsWinner) {
      playWinnerSound();
      generateConfetti();
      generateCoinAnimation(winner.user.coins);
    } else {
      generateLoserCoinAnimation(winner, players.find(p => p.user._id === currentUserId));
    }
  }, [players, currentUserId]);

  // Cheerful winner sound sequence
  const playWinnerSound = () => {
    setTimeout(() => soundServiceRef.current?.generateTone(523.25, 0.2, 'sine'), 0); // C5
    setTimeout(() => soundServiceRef.current?.generateTone(659.25, 0.2, 'sine'), 200); // E5
    setTimeout(() => soundServiceRef.current?.generateTone(784, 0.2, 'sine'), 400); // G5
    setTimeout(() => soundServiceRef.current?.generateTone(1046.5, 0.4, 'sine'), 600); // C6
  };

  // Generate confetti pieces
  const generateConfetti = () => {
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1,
      rotation: Math.random() * 360,
      size: Math.random() * 8 + 4,
    }));
    setConfetti(pieces);
  };

  // Coin animation to header when user wins
  const generateCoinAnimation = (coins) => {
    const coinElements = Array.from({ length: Math.min(coins, 10) }, (_, i) => ({
      id: i,
      startX: Math.random() * 200 - 100,
      startY: Math.random() * 200 - 100,
      delay: i * 0.1,
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
    { position: 0, icon: Trophy, label: '1st Place', color: 'from-yellow-400 to-yellow-600' },
    { position: 1, icon: Medal, label: '2nd Place', color: 'from-gray-300 to-gray-500' },
    { position: 2, icon: Medal, label: '3rd Place', color: 'from-orange-400 to-orange-600' },
  ];

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-gray-900 overflow-hidden flex flex-col items-center justify-center p-4 relative"
    >
      {/* Confetti Animation */}
      <AnimatePresence>
        {isWinner && confetti.map((piece) => (
          <motion.div
            key={piece.id}
            className="fixed w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full pointer-events-none"
            style={{
              left: `${piece.left}%`,
              top: -10,
            }}
            initial={{ opacity: 1, y: 0 }}
            animate={{
              opacity: 0,
              y: window.innerHeight + 100,
              rotate: piece.rotation + 360,
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
          className="fixed pointer-events-none"
          initial={{
            x: coin.startX,
            y: coin.startY,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            x: 0,
            y: isWinner ? -120 : 50,
            opacity: 0,
            scale: 0.5,
          }}
          transition={{
            duration: 1.5,
            delay: coin.delay,
            ease: 'easeInOut',
          }}
        >
          <div className="text-3xl">💰</div>
        </motion.div>
      ))}

      {/* Main Content */}
      <motion.div
        className="w-full max-w-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Winner Popup */}
        <AnimatePresence>
          {isWinner && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900 rounded-3xl p-8 text-center max-w-sm shadow-2xl border border-purple-400"
                initial={{ scale: 0.5, y: -100 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.5, y: 100 }}
                transition={{ type: 'spring', damping: 15 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="mb-4"
                >
                  <Trophy className="w-20 h-20 mx-auto text-yellow-400" />
                </motion.div>

                <h1 className="text-4xl font-bold text-yellow-300 mb-2">🎉 VICTORY! 🎉</h1>
                <p className="text-white/90 text-lg mb-4">Congratulations!</p>
                <p className="text-yellow-200 text-2xl font-bold mb-6">
                  {sortedPlayers[0]?.user.username}
                </p>

                <motion.button
                  onClick={onBackToMenu}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back to Menu
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leaderboard */}
        <div className="space-y-4">
          <motion.h2
            className="text-3xl font-bold text-white text-center mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            🏆 Leaderboard
          </motion.h2>

          {sortedPlayers.slice(0, 3).map((player, index) => {
            const medal = medals[index];
            const MedalIcon = medal.icon;
            const isCurrentUser = player.user._id === currentUserId;

            return (
              <motion.div
                key={player.user._id}
                className={`relative overflow-hidden rounded-2xl p-6 backdrop-blur-sm border-2 ${
                  isCurrentUser
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400'
                    : 'bg-gray-800/50 border-gray-600'
                } ${isWinner && index === 0 ? 'ring-2 ring-yellow-400' : ''}`}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.15 + 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Shine effect */}
                {isCurrentUser && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ['100%', '-100%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <MedalIcon className={`w-12 h-12 text-transparent bg-clip-text bg-gradient-to-r ${medal.color}`} />
                    </motion.div>

                    <div className="text-left">
                      <p className="text-sm text-gray-400">{medal.label}</p>
                      <p className={`text-2xl font-bold ${isCurrentUser ? 'text-cyan-300' : 'text-white'}`}>
                        {player.user.username}
                        {isCurrentUser && ' (You)'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Position</p>
                    <p className="text-3xl font-bold text-yellow-400">{player.position}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Back Button */}
        {!isWinner && (
          <motion.button
            onClick={onBackToMenu}
            className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Home className="w-5 h-5" />
            Back to Menu
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default GameWinnerPage;