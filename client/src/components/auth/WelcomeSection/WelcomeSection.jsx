import React from 'react';
import GameLogo from '../../../assets/GameLogo';

const WelcomeSection = ({ isUserFresh }) => {
  return (
    <div className="text-center mb-6">
      <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20">
        <GameLogo/>
      </div>
      <h2 className="text-xl font-bold text-white mb-1">
        {isUserFresh ? 'Create Account' : 'Welcome Back'}
      </h2>
      <p className="text-white/75 text-xs">
        {isUserFresh ? 'Join the fun and start playing!' : 'Sign in to continue playing'}
      </p>
    </div>
  );
};

export default WelcomeSection;