import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Trophy } from 'lucide-react';
import { FRUIT_COLORS } from '../config/gameConfig';

export const Leaderboard: React.FC = () => {
  const { players } = useGameStore();
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-blue-500/20 p-4 rounded-lg shadow-lg w-64">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="text-yellow-500 neon-text" />
        <h2 className="text-xl font-bold text-blue-400">Leaderboard</h2>
      </div>
      <div className="space-y-2">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className="flex items-center justify-between p-2 rounded bg-gray-900/50 border border-blue-500/10 backdrop-blur"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-400">#{index + 1}</span>
              <div
                className="w-3 h-3 rounded-full"
                style={{ 
                  backgroundColor: FRUIT_COLORS[player.assignedFruit],
                  boxShadow: `0 0 10px ${FRUIT_COLORS[player.assignedFruit]}` 
                }}
              />
              <div>
                <span className="text-gray-100">{player.name}</span>
                <span className="text-xs text-blue-400 block">
                  Level {player.level}
                </span>
              </div>
            </div>
            <span className="font-bold text-blue-400">{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};