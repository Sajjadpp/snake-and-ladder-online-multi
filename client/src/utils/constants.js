// Animation Variants
export const ANIMATION_VARIANTS = {
  // Page transitions
  page: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15
      }
    }
  },
  
  // Container transitions
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },
  
  // Item animations
  item: {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  },
  
  // Button animations
  button: {
    hover: { 
      scale: 1.02,
      y: -2,
      boxShadow: "0 8px 25px rgba(255, 152, 0, 0.25)",
      color: '#fb923c',
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  },
  
  // Slide animations
  slideUp: {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  },
  
  slideDown: {
    hidden: { y: -30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  },
  
  slideLeft: {
    hidden: { x: 30, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  },
  
  // Modal animations
  modal: {
    hidden: {
      y: "100%",
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      y: "100%",
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  }
};

// Color Theme
export const COLOR_THEME = {
  // Primary colors
  primary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316', // Main orange
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12'
  },
  
  // Background colors
  background: {
    light: '#f8fafc',
    dark: '#1f2937', // gray-800
    gradient: 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600'
  },
  
  // Text colors
  text: {
    light: '#ffffff',
    dark: '#1f2937',
    muted: 'rgba(255, 255, 255, 0.75)',
    mutedDark: 'rgba(31, 41, 55, 0.6)'
  },
  
  // Status colors
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  }
};

// Game Constants
export const GAME_MODES = {
  SOLO: 'solo',
  ONE_VS_ONE: '1vs1',
  TWO_VS_TWO: '2vs2',
  ONLINE: 'online'
};

export const GAME_MODE_CONFIG = {
  [GAME_MODES.SOLO]: {
    label: 'Solo',
    icon: 'Crown',
    description: 'Play against AI'
  },
  [GAME_MODES.ONE_VS_ONE]: {
    label: '1 vs 1',
    icon: 'User',
    description: 'Player vs Player'
  },
  [GAME_MODES.TWO_VS_TWO]: {
    label: '2 vs 2',
    icon: 'Users',
    description: 'Team Battle'
  },
  [GAME_MODES.ONLINE]: {
    label: 'Online',
    icon: 'Globe',
    description: 'Online Multiplayer',
    hasBadge: true
  }
};