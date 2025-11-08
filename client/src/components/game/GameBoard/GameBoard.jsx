import React, { memo, useMemo, useState, useEffect, useRef, useCallback, lazy } from 'react';
import PlayingPiece from '../PlayingPiece';
import './GameBoard.css';
import soundService from '../../../services/sound';

// Import board images

import Board1 from '../../../assets/boards/Board1.jpg';
import Board2 from '../../../assets/boards/Board2.jpg';


const BOARD_IMAGES = {
  board1: Board1,
  board2: Board2
};


const GameBoard = ({ 
  boardData, 
  players, 
  gameStatus,
  diceRoll
}) => {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [displayPositions, setDisplayPositions] = useState({});
  const [isAnimating, setIsAnimating] = useState({});
  const [animatingPlayerSnake, setAnimatingPlayerSnake] = useState(null);
  const [animatingPlayerLadder, setAnimatingPlayerLadder] = useState(null);
  
  const previousPositionsRef = useRef({});
  const animationTimeoutRef = useRef(null);

  // Get board background image
  const boardBackground = useMemo(() => {
    const boardId = boardData?.id || 'board2';
    return BOARD_IMAGES[boardId] || BOARD_IMAGES.board2;
  }, [boardData?.id]);

  // Find cell by number
  const findCellByNumber = useCallback((number) => {
    if (!boardData.board) return null;
    for (const row of boardData.board) {
      for (const cell of row) {
        if (cell.number === number) {
          return cell;
        }
      }
    }
    return null;
  }, [boardData.board]);

  // Detect position changes and animate
  useEffect(() => {
    players.forEach(player => {
      const playerId = player.user._id;
      const currentPos = player.position;
      const previousPos = previousPositionsRef.current[playerId];

      // If position changed, animate movement
      if (previousPos !== undefined && previousPos !== currentPos) {
        animatePlayerMovement(playerId, previousPos, currentPos)
        .then(()=> {
          // Update display position to current
          setDisplayPositions(prev => ({
            ...prev,
            [playerId]: currentPos
          }));

          previousPositionsRef.current[playerId] = currentPos;
        });
      }
      else {
        // Update display position to current
        setDisplayPositions(prev => ({
          ...prev,
          [playerId]: currentPos
        }));

        previousPositionsRef.current[playerId] = currentPos;
      }

      
    });
  }, [players]);

  const animatePlayerMovement = useCallback(async (playerId, fromPosition, toPosition) => {
    console.log('Animation started:', { fromPosition, toPosition, playerId });

    // Validate positions
    if (fromPosition === toPosition || fromPosition === 0 || toPosition === 0) {
      console.log('Skipping animation - invalid positions');
      return;
    }

    setIsAnimating(prev => ({ ...prev, [playerId]: true }));

    const steps = Math.abs(toPosition - fromPosition);
    const direction = toPosition > fromPosition ? 1 : -1;

    // Calculate delay per step
    const maxTime = 2000;
    const stepDelay = Math.max(50, Math.min(200, maxTime / steps));

    // Animate each step
    for (let step = 1; step <= steps; step++) {
      const currentPos = fromPosition + step * direction;

      setDisplayPositions(prev => ({
        ...prev,
        [playerId]: currentPos
      }));

      // Play step sound occasionally
      if (step % 2 === 0) {
        soundService.generateTone(600 + step * 30, 0.05, 'sine');
      }

      await new Promise(resolve => setTimeout(resolve, stepDelay));
    }

    // Handle snake/ladder at final position
    const finalCell = findCellByNumber(toPosition);
    let finalPosition = toPosition;

    if (finalCell && finalCell.type) {
      if (finalCell.type === 'SNAKE') {
        soundService.snakeHit();
        setAnimatingPlayerSnake(playerId);
        await new Promise(resolve => setTimeout(resolve, 600));
        setAnimatingPlayerSnake(null);
        finalPosition = finalCell.to;
      } else if (finalCell.type === 'LADDER') {
        soundService.ladderClimb();
        setAnimatingPlayerLadder(playerId);
        await new Promise(resolve => setTimeout(resolve, 600));
        setAnimatingPlayerLadder(null);
        finalPosition = finalCell.to;
      }
      
      // Update to final position after snake/ladder effect
      setDisplayPositions(prev => ({
        ...prev,
        [playerId]: finalPosition
      }));

      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Clear animation state
    setIsAnimating(prev => ({ ...prev, [playerId]: false }));
  }, [findCellByNumber]);

  const boardStyle = useMemo(() => ({
    backgroundImage: `url(${boardBackground})`,
    backgroundSize: '100% 100%',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat'
  }), [boardBackground]);

  return (
    <div className="game-board-container">
      <div className="game-board" style={boardStyle}>
        {boardData?.board?.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`board-cell ${getCellColorClass(cell.number)}`}
                data-number={cell.number}
                data-type={cell.type}
                onMouseEnter={() => setHoveredCell(cell)}
                onMouseLeave={() => setHoveredCell(null)}
              >
                {/* Render player pieces */}
                {players.map((player) => {
                  const displayPos = displayPositions[player.user._id] !== undefined 
                    ? displayPositions[player.user._id] 
                    : player.position;
                  const isPlayerAnimating = isAnimating[player.user._id];
                  const isOnSnake = animatingPlayerSnake === player.user._id;
                  const isOnLadder = animatingPlayerLadder === player.user._id;

                  return displayPos === cell.number ? (
                    <PlayingPiece
                      key={player.user._id}
                      player={player.order}
                      color={player.color}
                      size="sm"
                      style="classic"
                      className={`${
                        isPlayerAnimating ? 'piece-animating piece-glowing' : ''
                      } ${isOnSnake ? 'piece-snake-hit' : ''} ${
                        isOnLadder ? 'piece-ladder-climb' : ''
                      }`}
                    />
                  ) : null;
                })}

                {/* Destination highlight for snakes/ladders */}
                {hoveredCell && hoveredCell.to === cell.number && (
                  <div className="destination-highlight"></div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const getCellColorClass = (number) => {
  const row = Math.floor((number - 1) / 10);
  const isEvenRow = row % 2 === 0;
  const isEvenCell = number % 2 === 0;

  if ((isEvenRow && isEvenCell) || (!isEvenRow && !isEvenCell)) {
    return 'cell-light';
  } else {
    return 'cell-dark';
  }
};

export default memo(GameBoard);