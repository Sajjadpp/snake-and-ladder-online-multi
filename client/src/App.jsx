import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Context Providers
import { 
  AuthProvider, 
  GameProvider, 
  SocketProvider, 
  ToastProvider, 
  useAuth
} from './contexts';

// Page Components
import BasePage from './pages/BasePage';
import Home from './pages/HomePage';
import GameCreationPage from './pages/GameCreationPage';
import PlayerWaitingPage from './pages/GameRoomPage';

// Components
import ErrorBoundary from './components/error/ErrorBoundary';
import AppLoading from './components/ui/AppLoading';

// Global Styles
import './styles/global.css';
import { useNavigation } from './hooks/useNavigation';
import AuthPage from './pages/AuthPage';
import GamePage from './pages/GamePlay';
import SettingsPage from './pages/SettingsPage';
import GameWinnerPage from './pages/GameResult';
import FriendsPage from './pages/FriendPage';
import { NotificationProvider } from './contexts/NotificationContext/NotificationContext';
import FriendRequestHandler from './handler/friendRequestHandler/FriendRequestHandler';
import soundService from './services/sound';
import MusicPermissionModal from './components/ui/Popups/SoundPermModal';
import GameInvitationHandler from './handler/gameInivitationHandler/GameInvitationHandler';
import Leaderboard from './pages/Leaderboard';

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <NotificationProvider>
              <GameProvider>
                <ToastProvider>
                  <div>
                    <FriendRequestHandler/>
                    <GameInvitationHandler/>
                    <AppContent />
                  </div>
                </ToastProvider>
              </GameProvider>
            </NotificationProvider>
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

const AppContent = () => {
  const { loading } = useAuth();
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [musicPreference, setMusicPreference] = useState(null);

  // Check user preference on mount
  useEffect(() => {
    if (loading) return;
    
    const savedPreference = localStorage.getItem('musicEnabled');
    if (savedPreference === 'true') {
      setMusicPreference('allowed');
      soundService.playBackgroundMusic().catch(console.error);
    } else if (savedPreference === 'false') {
      setMusicPreference('denied');
    } else {
      const timer = setTimeout(() => {
        setShowMusicModal(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Enhanced cleanup effect
  useEffect(() => {
    return () => {
      console.log('AppContent unmounting - stopping all sounds');
      soundService.stopBackgroundMusic();
    };
  }, []);

  // Stop music when preference changes to denied
  useEffect(() => {
    if (musicPreference === 'denied') {
      soundService.stopBackgroundMusic();
    }
  }, [musicPreference]);

  const handleAllowMusic = async () => {
    try {
      await soundService.playBackgroundMusic();
      setMusicPreference('allowed');
      localStorage.setItem('musicEnabled', 'true');
      setShowMusicModal(false);
    } catch (error) {
      console.error('Failed to start music:', error);
      // Fallback: deny music if it fails to play
      handleDenyMusic();
    }
  };

  const handleDenyMusic = () => {
    soundService.stopBackgroundMusic();
    setMusicPreference('denied');
    localStorage.setItem('musicEnabled', 'false');
    setShowMusicModal(false);
  };

  const handleCloseModal = () => {
    soundService.stopBackgroundMusic();
    setMusicPreference('denied');
    localStorage.setItem('musicEnabled', 'false');
    setShowMusicModal(false);
  };

  if (loading) {
    return <AppLoading />;
  }

  return (
    <div>
      <MusicPermissionModal 
        isOpen={showMusicModal}
        onAllow={handleAllowMusic}
        onDeny={handleDenyMusic}
        onClose={handleCloseModal}
      />
      <AppRoutes />
    </div>
  );
};

// Routes component
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<BasePage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/create-room" element={<GameCreationPage />} />
      <Route path="/room/:roomId" element={<PlayerWaitingPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/game/:gameId" element={<GamePage/>} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/friend/:userId" element={<FriendsPage />} />
      <Route path="/game-result/:gameId" element={<GameWinnerPage />} /> 
      
      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

// 404 Page Component
const NotFoundPage = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <div className="text-center text-white">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-lg mb-6">Oops! Page not found</p>
        <button
          onClick={() => navigateTo('/')}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default App;