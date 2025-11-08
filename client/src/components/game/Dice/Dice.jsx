// components/game/Dice/Dice.jsx
import { useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useSocket } from '../../../contexts/SocketContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useGame } from '../../../hooks/useGame';

const Dice = ({
  isMine = false,
  disabled = false,
  player = 'user123'
}) => {
  const [isRolling, setIsRolling] = useState(false);
  const [currentFace, setCurrentFace] = useState(1);
  
  const socket = useSocket();
  const { user } = useAuth();
  const gameId = useParams().gameId;
  const { diceRoll, turn } = useGame();

  // Listen for dice roll results from server
  useEffect(() => {
    if (diceRoll && player === diceRoll.playerId) {
      handleServerRoll(diceRoll.diceValue);
    }
  }, [diceRoll, player]);

  const handleServerRoll = (newFace) => {
    if (isRolling) return;
    
    setIsRolling(true);
    
    // Set face value at 60% of animation duration for better sync
    setTimeout(() => {
      setCurrentFace(newFace);
    }, 420); // 0.42s (60% of 0.7s)
    
    // Reset rolling state after animation completes
    setTimeout(() => {
      setIsRolling(false);
    }, 700); // 0.7s total duration
  };

  const getDiceRotation = () => {
    const rotations = {
      1: 'rotateX(0deg) rotateY(0deg)',
      2: 'rotateX(0deg) rotateY(-90deg)',
      3: 'rotateX(0deg) rotateY(180deg)',
      4: 'rotateX(0deg) rotateY(90deg)',
      5: 'rotateX(-90deg) rotateY(0deg)',
      6: 'rotateX(90deg) rotateY(0deg)'
    };
    return rotations[currentFace];
  };

  const renderDots = (number) => {
    const dots = [];
    const dotPositions = {
      1: [{ top: '50%', left: '50%' }],
      2: [
        { top: '25%', left: '25%' },
        { top: '75%', left: '75%' }
      ],
      3: [
        { top: '25%', left: '25%' },
        { top: '50%', left: '50%' },
        { top: '75%', left: '75%' }
      ],
      4: [
        { top: '25%', left: '25%' },
        { top: '25%', left: '75%' },
        { top: '75%', left: '25%' },
        { top: '75%', left: '75%' }
      ],
      5: [
        { top: '25%', left: '25%' },
        { top: '25%', left: '75%' },
        { top: '50%', left: '50%' },
        { top: '75%', left: '25%' },
        { top: '75%', left: '75%' }
      ],
      6: [
        { top: '20%', left: '25%' },
        { top: '20%', left: '75%' },
        { top: '50%', left: '25%' },
        { top: '50%', left: '75%' },
        { top: '80%', left: '25%' },
        { top: '80%', left: '75%' }
      ]
    };

    dotPositions[number].forEach((position, index) => {
      dots.push(
        <div
          key={index}
          className="dot"
          style={{
            position: 'absolute',
            top: position.top,
            left: position.left,
            transform: 'translate(-50%, -50%)',
            width: '5px',
            height: '5px',
            background: 'radial-gradient(circle, #333 40%, #555 100%)',
            borderRadius: '50%',
            boxShadow: 'inset 0.5px 0.5px 1px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)'
          }}
        />
      );
    });

    return dots;
  };

  const handleDiceClick = () => {
    if (!isMine || disabled || isRolling || turn.user._id !== user._id) return;
    
    // Emit socket event to server
    socket.emit('request_dice_roll', {
      playerId: user._id, 
      gameId: gameId
    });
  };

  return (
    <div>
      <style>
        {`
          @keyframes rollAnimation {
            0% { 
              transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
            }
            25% { 
              transform: rotateX(180deg) rotateY(90deg) rotateZ(45deg) scale(1.1);
            }
            50% { 
              transform: rotateX(360deg) rotateY(180deg) rotateZ(90deg) scale(1.2);
            }
            75% { 
              transform: rotateX(540deg) rotateY(270deg) rotateZ(135deg) scale(1.1);
            }
            100% { 
              transform: rotateX(720deg) rotateY(360deg) rotateZ(180deg);
            }
          }

          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-5px);
            }
            60% {
              transform: translateY(-2px);
            }
          }

          .dice-container {
            perspective: 400px;
            animation: ${isRolling ? 'none' : 'bounce 2s infinite'};
          }

          .dice {
            position: relative;
            width: 35px;
            height: 35px;
            transform-style: preserve-3d;
            transition: ${isRolling ? 'none' : 'transform 0.3s ease'};
            cursor: pointer;
            user-select: none;
          }

          .dice:hover:not(.rolling) {
            transform: rotateX(-10deg) rotateY(10deg) scale(1.05);
          }

          .dice.rolling {
            animation: rollAnimation 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }

          .face {
            position: absolute;
            width: 35px;
            height: 35px;
            background: linear-gradient(145deg, #ffffff, #f0f0f0);
            border: 1.5px solid #333;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 
              inset 1px 1px 2px rgba(0, 0, 0, 0.1),
              inset -1px -1px 2px rgba(255, 255, 255, 0.8),
              0 3px 8px rgba(0, 0, 0, 0.3);
            backface-visibility: hidden;
          }

          .face-1 { transform: rotateY(0deg) translateZ(17.5px); }
          .face-2 { transform: rotateY(90deg) translateZ(17.5px); }
          .face-3 { transform: rotateY(180deg) translateZ(17.5px); }
          .face-4 { transform: rotateY(-90deg) translateZ(17.5px); }
          .face-5 { transform: rotateX(90deg) translateZ(17.5px); }
          .face-6 { transform: rotateX(-90deg) translateZ(17.5px); }
        `}
      </style>

      <div className="dice-container">
        <div 
          className={`dice ${isRolling ? 'rolling' : ''}`}
          style={{ 
            transform: isRolling ? '' : getDiceRotation()
          }}
          onClick={handleDiceClick}
        >
          <div className="face face-1">{renderDots(1)}</div>
          <div className="face face-2">{renderDots(2)}</div>
          <div className="face face-3">{renderDots(3)}</div>
          <div className="face face-4">{renderDots(4)}</div>
          <div className="face face-5">{renderDots(5)}</div>
          <div className="face face-6">{renderDots(6)}</div>
        </div>
      </div>
    </div>
  );
};

export default Dice;