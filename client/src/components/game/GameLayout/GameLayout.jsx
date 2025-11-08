// components/game/GameLayout.js
import React from 'react';
import GameHeader from '../GameHeader';
import GameBoard from '../GameBoard';
import PlayersPanel from '../PlayersPanel';
import GameControls from '../GameControls';

const GameLayout = ({ 
  gameData, 
  players, 
  turn, 
  boardData, 
  currentPlayer, 
  isMyTurn,
  gameStatus 
}) => {
  return (
    <div className="min-h-screen bg-gray-700 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0">
        <GameHeader 
          gameData={gameData}
          turn={turn}
          currentPlayer={currentPlayer}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 min-h-0">
        
        {/* Left Panel - Players (Desktop) */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <PlayersPanel 
            players={players}
            turn={turn}
            currentPlayer={currentPlayer}
            layout="desktop"
          />
        </div>

        {/* Center - Game Board */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex items-center justify-center min-h-0">
            <GameBoard 
              boardData={boardData}
              players={players}
              gameStatus={gameStatus}
            />
          </div>
          
          {/* Mobile Players & Controls */}
          <div className="lg:hidden mt-4">
            <PlayersPanel 
              players={players}
              turn={turn}
              currentPlayer={currentPlayer}
              layout="mobile"
            />
          </div>
        </div>

        {/* Right Panel - Controls & Info (Desktop) */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <GameControls 
            isMyTurn={isMyTurn}
            gameStatus={gameStatus}
            currentPlayer={currentPlayer}
          />
        </div>
      </div>

      {/* Bottom Controls (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
        <GameControls 
          isMyTurn={isMyTurn}
          gameStatus={gameStatus}
          currentPlayer={currentPlayer}
          layout="mobile"
        />
      </div>
    </div>
  );
};

export default GameLayout;