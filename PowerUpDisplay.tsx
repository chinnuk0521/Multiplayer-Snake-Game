import React from 'react';
import { Zap, Minimize, Shield, Move } from 'lucide-react';
import { PowerUpType } from '../types/game';

const powerUpIcons: Record<PowerUpType, React.ReactNode> = {
  SPEED: <Zap className="text-yellow-500 neon-text" />,
  SHRINK: <Minimize className="text-purple-500 neon-text" />,
  INVINCIBLE: <Shield className="text-blue-500 neon-text" />,
  TELEPORT: <Move className="text-green-500 neon-text" />,
};

interface PowerUpDisplayProps {
  activePowerUps: PowerUpType[];
}

export const PowerUpDisplay: React.FC<PowerUpDisplayProps> = ({ activePowerUps }) => {
  return (
    <div className="fixed top-4 right-4 flex gap-2">
      {activePowerUps.map((powerUp, index) => (
        <div
          key={`${powerUp}-${index}`}
          className="w-10 h-10 bg-gray-800/50 backdrop-blur border border-blue-500/20 rounded-lg shadow-lg flex items-center justify-center"
        >
          {powerUpIcons[powerUp]}
        </div>
      ))}
    </div>
  );
};