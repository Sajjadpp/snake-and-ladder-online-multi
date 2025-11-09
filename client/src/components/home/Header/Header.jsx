import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Coins, User, Bell, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigation } from '../../../hooks/useNavigation';
import Button from '../../ui/button';
import { useState } from 'react';
import NotificationBell from '../../ui/Bell';

const Header = ({isNotification, setIsNotification}) => {
  const { user } = useAuth();
  const { navigateTo, goBack } = useNavigation();

  return (
    <motion.header 
      className="flex justify-between items-center p-4 bg-white/10 backdrop-blur-md border-b border-white/20"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className='flex gap-2'>
        <Button
          variant="secondary"
          size="small"
          onClick={()=> navigateTo('/')}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <UserInfo user={user} />
      </div>
      <div className='flex gap-5'>
        <NotificationBell isNotification={isNotification} setIsNotification={setIsNotification}/>
        <Button
          variant="secondary"
          size="small"
          onClick={() => navigateTo('/settings')}
        >
          <Settings className="w-4 md:w-5 h-4 md:h-5" />
        </Button>
      </div>
      
    </motion.header>
  );
};

const UserInfo = ({ user }) => (
  <div className="flex items-center space-x-3">
    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
      {user && user.avatar ? user.avatar : <User className="w-4 md:w-5 h-4 md:h-5 text-white" />}
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