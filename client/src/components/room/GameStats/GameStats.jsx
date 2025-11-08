import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Trophy, Users, Clock, Coins } from 'lucide-react';

const GameStats = ({ readyPlayers, currentPlayers, prizePool, timeWaiting }) => {
  const stats = [
    {
      icon: CheckCircle,
      label: "Ready Players",
      value: `${readyPlayers}/${currentPlayers}`,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: Trophy,
      label: "Prize Pool",
      value: `₹${prizePool}`,
      color: "text-yellow-600", 
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    {
      icon: Clock,
      label: "Time Waiting",
      value: formatTime(timeWaiting),
      color: "text-blue-600",
      bgColor: "bg-blue-50", 
      borderColor: "border-blue-200"
    },
    {
      icon: Users,
      label: "Player Progress",
      value: `${Math.round((currentPlayers / 4) * 100)}%`,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-2 gap-4 mb-6"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat, index) => (
        <StatCard 
          key={stat.label}
          stat={stat}
          index={index}
        />
      ))}
    </motion.div>
  );
};

const StatCard = ({ stat, index }) => {
  const IconComponent = stat.icon;

  return (
    <motion.div
      className={`${stat.bgColor} backdrop-blur-sm rounded-xl p-4 shadow-lg ${stat.borderColor} border text-center`}
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: { 
            duration: 0.4, 
            ease: "easeOut",
            delay: index * 0.1
          }
        }
      }}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <IconComponent className={`w-5 h-5 ${stat.color}`} />
        <span className="text-sm font-medium text-gray-700">{stat.label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
    </motion.div>
  );
};

// Helper function to format time
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default GameStats;