// components/game/PlayingPiece.js
import React from 'react';
import './style.css';

const PlayingPiece = ({
  player = 1,
  color = '#ff6b6b',
  size = 'md',
  style = 'classic',
  position = 1,
  isAnimating = false,
  isCurrentTurn = false,
  className = ''
}) => {
  // Size variants
  const sizeVariants = {
    xs: { width: 16, height: 16, border: 1 },
    sm: { width: 20, height: 20, border: 1.5 },
    md: { width: 24, height: 24, border: 2 },
    lg: { width: 32, height: 32, border: 2.5 },
    xl: { width: 40, height: 40, border: 3 }
  };

  const { width, height, border } = sizeVariants[size];

  // Color variants with gradients
  const colorGradients = {
    red: { primary: '#ff6b6b', secondary: '#ee5a52' },
    blue: { primary: '#4dabf7', secondary: '#339af0' },
    green: { primary: '#51cf66', secondary: '#40c057' },
    yellow: { primary: '#ffd43b', secondary: '#fcc419' },
    purple: { primary: '#cc5de8', secondary: '#be4bdb' },
    pink: { primary: '#f783ac', secondary: '#f06595' },
    orange: { primary: '#ff922b', secondary: '#fd7e14' },
    cyan: { primary: '#3bc9db', secondary: '#22b8cf' }
  };

  // Get gradient colors based on color name or hex
  const getGradientColors = () => {
    if (colorGradients[color]) {
      return colorGradients[color];
    }
    // For hex colors, create a slightly darker shade for gradient
    return {
      primary: color,
      secondary: adjustColor(color, -20)
    };
  };

  const { primary, secondary } = getGradientColors();

  // Render different piece styles
  const renderPiece = () => {
    switch (style) {
      case 'modern':
        return renderModernPiece();
      case 'flat':
        return renderFlatPiece();
      case '3d':
        return render3DPiece();
      case 'minimal':
        return renderMinimalPiece();
      case 'character':
        return renderCharacterPiece();
      default:
        return renderClassicPiece();
    }
  };

  const renderClassicPiece = () => (
    <div 
      className="piece-classic"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: `radial-gradient(circle at 30% 30%, ${primary}, ${secondary})`,
        border: `${border}px solid ${adjustColor(secondary, -30)}`,
        boxShadow: `
          inset 1px 1px 2px rgba(255, 255, 255, 0.3),
          inset -1px -1px 2px rgba(0, 0, 0, 0.2),
          0 2px 4px rgba(0, 0, 0, 0.3)
        `
      }}
    >
      <span 
        className="piece-number"
        style={{
          color: getContrastColor(primary),
          fontSize: `${width * 0.4}px`,
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
        }}
      >
        {player}
      </span>
    </div>
  );

  const renderModernPiece = () => (
    <div 
      className="piece-modern"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: `linear-gradient(135deg, ${primary}, ${secondary})`,
        border: `${border}px solid ${adjustColor(secondary, -20)}`,
        boxShadow: `
          0 4px 8px rgba(0, 0, 0, 0.2),
          inset 1px 1px 2px rgba(255, 255, 255, 0.4)
        `
      }}
    >
      <span 
        className="piece-number"
        style={{
          color: getContrastColor(primary),
          fontSize: `${width * 0.35}px`,
          fontWeight: 'bold'
        }}
      >
        P{player}
      </span>
    </div>
  );

  const renderFlatPiece = () => (
    <div 
      className="piece-flat"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: primary,
        border: `${border}px solid ${adjustColor(primary, -30)}`,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
      }}
    >
      <span 
        className="piece-number"
        style={{
          color: getContrastColor(primary),
          fontSize: `${width * 0.4}px`
        }}
      >
        {player}
      </span>
    </div>
  );

  const render3DPiece = () => (
    <div 
      className="piece-3d"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: `linear-gradient(145deg, ${primary}, ${secondary})`,
        border: `${border}px solid ${adjustColor(secondary, -40)}`,
        boxShadow: `
          4px 4px 8px rgba(0, 0, 0, 0.3),
          -2px -2px 4px rgba(255, 255, 255, 0.1),
          inset 2px 2px 4px rgba(255, 255, 255, 0.2),
          inset -2px -2px 4px rgba(0, 0, 0, 0.2)
        `,
        transform: 'rotateX(10deg) rotateY(10deg)'
      }}
    >
      <span 
        className="piece-number"
        style={{
          color: getContrastColor(primary),
          fontSize: `${width * 0.35}px`,
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
        }}
      >
        {player}
      </span>
    </div>
  );

  const renderMinimalPiece = () => (
    <div 
      className="piece-minimal"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: primary,
        border: `${border}px solid ${adjustColor(primary, -20)}`
      }}
    >
      <span 
        className="piece-number"
        style={{
          color: getContrastColor(primary),
          fontSize: `${width * 0.3}px`,
          opacity: 0.8
        }}
      >
        {player}
      </span>
    </div>
  );

  const renderCharacterPiece = () => (
    <div 
      className="piece-character"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: `radial-gradient(circle at 30% 30%, ${primary}, ${secondary})`,
        border: `${border}px solid ${adjustColor(secondary, -25)}`,
        boxShadow: `
          0 3px 6px rgba(0, 0, 0, 0.2),
          inset 1px 1px 2px rgba(255, 255, 255, 0.3)
        `
      }}
    >
      <span 
        className="piece-emoji"
        style={{
          fontSize: `${width * 0.5}px`
        }}
      >
        {getPlayerEmoji(player)}
      </span>
    </div>
  );

  return (
    <div 
      className={`
        playing-piece 
        piece-${style} 
        size-${size} 
        ${isAnimating ? 'animating' : ''} 
        ${isCurrentTurn ? 'current-turn' : ''}
        ${className}
      `}
      data-player={player}
      data-position={position}
    >
      {renderPiece()}
      
      {/* Current turn indicator */}
      {isCurrentTurn && (
        <div className="turn-indicator" />
      )}
    </div>
  );
};

// Helper functions
const adjustColor = (color, amount) => {
  let usePound = false;
  if (color[0] === "#") {
    color = color.slice(1);
    usePound = true;
  }

  const num = parseInt(color, 16);
  let r = (num >> 16) + amount;
  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  let b = ((num >> 8) & 0x00FF) + amount;
  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  let g = (num & 0x0000FF) + amount;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
};

const getContrastColor = (hexcolor) => {
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
};

const getPlayerEmoji = (playerNumber) => {
  const emojis = ['👑', '⚡', '🌟', '🔥', '💎', '🚀', '🎯', '🏆'];
  return emojis[(playerNumber - 1) % emojis.length] || '👤';
};

export default PlayingPiece;