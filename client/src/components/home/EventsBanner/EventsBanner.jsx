import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Gift, Star } from 'lucide-react';

const EventsBanner = () => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const gameEvents = [
    {
      id: 1,
      title: "Weekend Tournament!",
      subtitle: "Win up to ₹10,000",
      icon: Trophy,
      bgColor: "bg-gradient-to-r from-yellow-400 to-orange-500"
    },
    {
      id: 2,
      title: "Daily Login Bonus",
      subtitle: "Get 100 free coins",
      icon: Gift,
      bgColor: "bg-gradient-to-r from-pink-400 to-purple-500"
    },
    {
      id: 3,
      title: "New Season Started!",
      subtitle: "Climb the leaderboard",
      icon: Star,
      bgColor: "bg-gradient-to-r from-blue-400 to-cyan-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % gameEvents.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full mb-8">
      <div className="relative overflow-hidden rounded-xl shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentEventIndex}
            className={`${gameEvents[currentEventIndex].bgColor} p-6 text-white relative`}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5 }}
          >
            <EventContent event={gameEvents[currentEventIndex]} />
            <EventIndicators 
              events={gameEvents} 
              currentIndex={currentEventIndex} 
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const EventContent = ({ event }) => {
  const IconComponent = event.icon;
  
  return (
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
        <IconComponent className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold">{event.title}</h3>
        <p className="text-white/90 text-sm">{event.subtitle}</p>
      </div>
    </div>
  );
};

const EventIndicators = ({ events, currentIndex }) => (
  <div className="flex space-x-2 mt-4 justify-center">
    {events.map((_, index) => (
      <div
        key={index}
        className={`w-2 h-2 rounded-full transition-all duration-300 ${
          index === currentIndex ? 'bg-white' : 'bg-white/40'
        }`}
      />
    ))}
  </div>
);

export default EventsBanner;