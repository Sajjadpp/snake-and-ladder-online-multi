import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, User, Coins, Settings } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigation } from '../../../hooks/useNavigation';
import Button from '../../ui/button';

const Header = () => {
  const { user } = useAuth();
  const { goBack, navigateTo } = useNavigation();

  return (
    <motion.header 
      className="flex justify-between items-center p-4 bg-white/30 backdrop-blur-md border-b border-white/20"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center space-x-3">
        <button 
          className="text-white"
          onClick={goBack}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <UserInfo user={user} />
      </div>
      
      <Button
        variant="secondary"
        size="small"
        onClick={() => console.log('Settings clicked')}
      >
        <Settings className="w-5 h-5" onClick={()=> navigateTo('/settings')}/>
      </Button>
    </motion.header>
  );
};

const UserInfo = ({ user }) => (
  <div className="flex items-center space-x-3">
    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
      {user.avatar}
    </div>
    <div>
      <h2 className="text-sm font-medium text-white">{user?.username}</h2>
      <div className="flex items-center space-x-1">
        <Coins className="w-4 h-4 text-orange-400" />
        <span className="text-xs font-medium text-orange-400">
          {user?.coins?.toLocaleString()}
        </span>
      </div>
    </div>
  </div>
);

export default Header;