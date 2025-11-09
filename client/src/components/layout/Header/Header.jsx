import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Home, ArrowLeft } from 'lucide-react';

// Components
import Button from '../../ui/button';

// Hooks
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigation } from '../../../hooks/useNavigation';

// Utils
import { ANIMATION_VARIANTS } from '../../../utils/constants';

const Header = () => {
  const { user } = useAuth();
  const { navigateToLogin , navigateTo, goBack} = useNavigation();

  return (
    <motion.header 
      className="flex justify-between items-center p-4 bg-white/10 backdrop-blur-md border-b border-white/20"
      variants={ANIMATION_VARIANTS.slideDown}
      initial="hidden"
      animate="visible"
    >
     
      <LogoSection />
      
      <UserSection 
        user={user} 
        onLoginClick={() => navigateToLogin('home')}
        onSettingsClick={()=> navigateTo('/settings')} 
      />
    </motion.header>
  );
};

const LogoSection = () => (
  <div className="flex items-center space-x-3">
    <motion.div
      className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm"
      whileHover={{ rotate: 180 }}
      transition={{ duration: 0.3 }}
    >
      <Home className="w-4 h-4 text-orange-500" />
    </motion.div>
  </div>
);

const UserSection = ({ user, onLoginClick , onSettingsClick}) => (
  <motion.div 
    className="flex items-center space-x-2"
    variants={ANIMATION_VARIANTS.slideLeft}
    initial="hidden"
    animate="visible"
  >
    {user ? (
      <div className="flex items-center space-x-2 bg-white/15 rounded-lg px-3 py-1.5">
        <span className="text-sm">{user.avatar}</span>
        <span className="text-white text-sm font-medium">{user.username}</span>
      </div>
    ) : (
      <Button
        onClick={onLoginClick}
        variant="primary"
        size="small"
      >
        Sign In
      </Button>
    )}
    
    <Button
      variant="secondary"
      size="small"
      onClick={onSettingsClick}
    >
      <Settings className="w-4 h-4" />
    </Button>
  </motion.div>
);

export default Header;