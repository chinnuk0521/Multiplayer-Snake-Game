import React from 'react';
import { GameBoard } from './components/GameBoard';
import { Leaderboard } from './components/Leaderboard';
import { Chat } from './components/Chat';
import { PowerUpDisplay } from './components/PowerUpDisplay';
import { useGameStore } from './store/gameStore';

function App() {
  const { players } = useGameStore();
  const currentPlayer = players.find(p => p.id === 'current-player');

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-400 tracking-wider">
          Neon Snake
        </h1>
        
        <div className="flex gap-8">
          <div className="flex-1">
            <GameBoard />
          </div>
          
          <div className="w-64 space-y-4">
            <Leaderboard />
            <Chat />
          </div>
        </div>

        {currentPlayer && (
          <PowerUpDisplay activePowerUps={currentPlayer.powerUps} />
        )}
      </div>
    </div>
  );
}

export default App;