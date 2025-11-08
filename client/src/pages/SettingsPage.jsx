import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Volume2, Bell, Lock, CreditCard, HelpCircle, LogOut, Crown, Mail, Shield, History, FileText, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSwipeable } from 'react-swipeable';
import soundService from '../services/sound';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout , loading} = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(70);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Initialize sound settings
  useEffect(() => {
    if (soundService) {
      // Set initial mute state
      setIsMuted(soundService.isMuted?.() ?? false);
      // Set initial volume if available
      const savedVolume = localStorage.getItem('musicVolume');
      if (savedVolume) {
        setMusicVolume(parseInt(savedVolume));
      }
    }
  }, []);

  useEffect(() => {
    if(!user && !loading) {
      navigate('/login');
    }
  }, [user, loading])

  const handleBack = () => {
    navigate(-1);
  };

  // Safe sound service toggle function
  const toggleSound = () => {
    if (soundService && soundService.toggleMute) {
      soundService.toggleMute();
      setIsMuted(soundService.isMuted());
    } else {
      // Fallback if sound service is not available
      setIsMuted(!isMuted);
      console.warn('Sound service not available');
    }
  };

  // Safe volume change function
  const handleVolumeChange = (volume) => {
    setMusicVolume(volume);
    
    // Save to localStorage
    localStorage.setItem('musicVolume', volume.toString());
    
    // Update sound service if available
    if (soundService && soundService.setVolume) {
      soundService.setVolume(volume / 100);
    }
  };

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (window.innerWidth < 768) {
        const tabs = ['account', 'audio', 'notifications', 'privacy', 'payment', 'help'];
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex < tabs.length - 1) {
          setActiveTab(tabs[currentIndex + 1]);
        }
      }
    },
    onSwipedRight: () => {
      if (window.innerWidth < 768) {
        const tabs = ['account', 'audio', 'notifications', 'privacy', 'payment', 'help'];
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex > 0) {
          setActiveTab(tabs[currentIndex - 1]);
        }
      }
    },
    trackMouse: true
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User, shortLabel: 'Profile' },
    { id: 'audio', label: 'Audio', icon: Volume2, shortLabel: 'Audio' },
    { id: 'notifications', label: 'Notifications', icon: Bell, shortLabel: 'Notify' },
    { id: 'privacy', label: 'Privacy', icon: Lock, shortLabel: 'Privacy' },
    { id: 'payment', label: 'Payment', icon: CreditCard, shortLabel: 'Payment' },
    { id: 'help', label: 'Help', icon: HelpCircle, shortLabel: 'Help' },
  ];

  // Mobile Bottom Navigation
  const MobileBottomNav = () => (
    <motion.div 
      className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 backdrop-blur-lg border-t border-white/20 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 25 }}
    >
      <div className="flex justify-around items-center p-2">
        {tabs.slice(0, 4).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center p-2 rounded-xl transition-all flex-1 mx-1 ${
                isActive 
                  ? 'bg-orange-500 text-white' 
                  : 'text-white/70 hover:text-white'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{tab.shortLabel}</span>
            </motion.button>
          );
        })}
        
        <motion.button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center p-2 rounded-xl text-white/70 hover:text-white transition-all flex-1 mx-1"
          whileTap={{ scale: 0.9 }}
        >
          <Menu size={20} />
          <span className="text-xs mt-1 font-medium">More</span>
        </motion.button>
      </div>
    </motion.div>
  );

  // Mobile Menu Modal
  const MobileMenuModal = () => (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gray-800 rounded-t-3xl border-t border-white/20"
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold text-lg">More Options</h3>
                <motion.button
                  onClick={() => setMobileMenuOpen(false)}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-white/70"
                >
                  <X size={24} />
                </motion.button>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                {tabs.slice(4).map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        isActive 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{tab.shortLabel}</span>
                    </motion.button>
                  );
                })}
              </div>
              
              <motion.button
                className="w-full flex items-center justify-center gap-2 p-3 bg-red-500/20 text-red-400 rounded-xl border border-red-400/20 font-medium"
                whileTap={{ scale: 0.95 }}
                onClick={logout}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Mobile Header with Tab Indicator
  const MobileHeader = () => (
    <motion.div 
      className="md:hidden bg-white/10 backdrop-blur-md border-b border-white/20"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/15 p-2 rounded-lg border border-white/20"
          >
            <ArrowLeft className="text-white w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-lg font-semibold text-white">Settings</h1>
            <p className="text-white/60 text-sm">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </p>
          </div>
        </div>
        
        {/* Swipe Indicator */}
        <div className="flex items-center gap-1">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                activeTab === tab.id ? 'bg-orange-400' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );

  // Render content function with corrected sound handling
  const renderContent = () => {
    switch(activeTab) {
      case 'account':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-white/75 text-sm mb-1.5 block font-medium">Username</label>
                  <input 
                    type="text" 
                    defaultValue={user?.username || "Player"}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-orange-400 focus:bg-white/15 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="text-white/75 text-sm mb-1.5 block font-medium">Email</label>
                  <input 
                    type="email" 
                    defaultValue={user?.email || "player@example.com"}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-orange-400 focus:bg-white/15 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="text-white/75 text-sm mb-1.5 block font-medium">Coins Balance</label>
                  <div className="flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 rounded-lg px-4 py-2.5">
                    <Crown className="text-orange-400 w-5 h-5" />
                    <span className="text-white font-bold text-lg">{user?.coins || 500}</span>
                  </div>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-orange-600 font-semibold py-2.5 rounded-lg hover:bg-white/95 transition-all text-sm shadow-lg"
            >
              Save Changes
            </motion.button>
          </motion.div>
        );
      
      case 'audio':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Audio Settings
              </h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white/90 font-medium text-sm block">Sound Effects</span>
                    <span className="text-white/60 text-xs">
                      {isMuted ? 'Muted' : 'Enabled'}
                    </span>
                  </div>
                  <motion.button
                    onClick={toggleSound}
                    className={`w-12 h-6 flex rounded-full transition-colors ${
                      isMuted ? 'bg-white/20' : 'bg-orange-500'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full shadow-md"
                      animate={{ x: isMuted ? 2 : 26 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-white/90 font-medium text-sm block">Music Volume</span>
                      <span className="text-white/60 text-xs">
                        {musicVolume === 0 ? 'Muted' : `${musicVolume}%`}
                      </span>
                    </div>
                    <span className="text-white font-semibold text-sm">{musicVolume}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={musicVolume}
                    onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    style={{
                      background: `linear-gradient(to right, rgb(249, 115, 22) 0%, rgb(249, 115, 22) ${musicVolume}%, rgba(255,255,255,0.2) ${musicVolume}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );
      
      case 'notifications':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-start justify-between py-3 border-b border-white/10">
                  <div className="flex-1 pr-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Bell className="w-4 h-4 text-orange-400" />
                      <p className="text-white font-medium text-sm">Push Notifications</p>
                    </div>
                    <p className="text-white/60 text-xs">Get notified about game invites</p>
                  </div>
                  <motion.button
                    onClick={() => setNotifications(!notifications)}
                    className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${notifications ? 'bg-orange-500' : 'bg-white/20'}`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full shadow-md"
                      animate={{ x: notifications ? 26 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>
                <div className="flex items-start justify-between py-3 border-b border-white/10">
                  <div className="flex-1 pr-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4 text-orange-400" />
                      <p className="text-white font-medium text-sm">Email Notifications</p>
                    </div>
                    <p className="text-white/60 text-xs">Receive updates via email</p>
                  </div>
                  <motion.button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${emailNotifications ? 'bg-orange-500' : 'bg-white/20'}`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full shadow-md"
                      animate={{ x: emailNotifications ? 26 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      
      default:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h3>
              <p className="text-white/60 text-sm">Settings for this section coming soon...</p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 font-sans pb-20 md:pb-0">
      {/* Desktop Header */}
      <motion.header 
        className="hidden md:flex justify-between items-center p-4 bg-white/10 backdrop-blur-md border-b border-white/20"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3">
          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/15 p-2 rounded-lg border border-white/20 hover:bg-white/25 transition-all"
          >
            <ArrowLeft className="text-white w-5 h-5" />
          </motion.button>
          <h1 className="text-lg font-semibold text-white tracking-tight">Settings</h1>
        </div>
        
        {user && (
          <motion.div 
            className="flex items-center space-x-2 bg-white/15 rounded-lg px-3 py-1.5"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <span className="text-sm">{user.avatar || '👤'}</span>
            <span className="text-white text-sm font-medium">{user.username}</span>
          </motion.div>
        )}
      </motion.header>

      {/* Mobile Header */}
      <MobileHeader />

      <motion.main 
        className="px-4 py-6 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        {...swipeHandlers}
      >
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-[220px,1fr] gap-4">
          {/* Sidebar */}
          <motion.div variants={itemVariants} className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                    activeTab === tab.id
                      ? 'bg-white text-orange-600 shadow-lg'
                      : 'bg-white/15 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
                  }`}
                  whileHover={{ scale: 1.02, x: 3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
            
            <motion.button
              variants={itemVariants}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all mt-4 border border-red-400/20 text-sm font-medium"
              whileHover={{ scale: 1.02, x: 3 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </motion.button>
          </motion.div>

          {/* Content */}
          <motion.div variants={itemVariants}>
            <AnimatePresence mode="wait">
              <div key={activeTab}>
                {renderContent()}
              </div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
          
          {/* Swipe Hint */}
          <motion.div 
            className="flex justify-center items-center gap-2 mt-6 text-white/50 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span>Swipe left/right to navigate</span>
          </motion.div>
        </div>
      </motion.main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
      
      {/* Mobile Menu Modal */}
      <MobileMenuModal />
    </div>
  );
};

export default SettingsPage;