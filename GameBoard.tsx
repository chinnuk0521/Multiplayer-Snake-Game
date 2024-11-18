import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { Direction } from '../types/game';
import { FRUIT_COLORS } from '../config/gameConfig';

const CELL_SIZE = 20;
const BOARD_WIDTH = 800;
const BOARD_HEIGHT = 600;

const drawFruit = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: keyof typeof FRUIT_COLORS
) => {
  const centerX = x * CELL_SIZE + CELL_SIZE / 2;
  const centerY = y * CELL_SIZE + CELL_SIZE / 2;
  
  ctx.fillStyle = FRUIT_COLORS[type];
  ctx.shadowColor = FRUIT_COLORS[type];
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(centerX, centerY, CELL_SIZE / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
};

export const GameBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    players,
    fruits,
    powerUps,
    obstacles,
    weather,
    currentLevel,
    gameStatus,
    moveSnakes,
    updatePlayerDirection,
  } = useGameStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameStatus !== 'PLAYING') return;

      const directions: Record<string, Direction> = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
      };

      if (directions[e.key]) {
        e.preventDefault();
        updatePlayerDirection('current-player', directions[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [updatePlayerDirection, gameStatus]);

  useEffect(() => {
    if (gameStatus !== 'PLAYING') return;

    const gameInterval = setInterval(() => {
      moveSnakes();
    }, 150 / useGameStore.getState().gameSpeed);

    return () => clearInterval(gameInterval);
  }, [moveSnakes, gameStatus]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawGame = () => {
      // Clear and draw background
      ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

      // Draw grid
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= BOARD_WIDTH; x += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, BOARD_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y <= BOARD_HEIGHT; y += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(BOARD_WIDTH, y);
        ctx.stroke();
      }

      // Draw level indicator
      ctx.fillStyle = '#60A5FA';
      ctx.font = 'bold 24px Inter';
      ctx.fillText(`LEVEL ${currentLevel}`, 20, 40);

      // Draw game over message if needed
      if (gameStatus === 'GAME_OVER') {
        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 48px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', BOARD_WIDTH / 2, BOARD_HEIGHT / 2);
        
        const winner = players.find(p => p.isAlive);
        if (winner) {
          ctx.fillStyle = '#10B981';
          ctx.font = 'bold 32px Inter';
          ctx.fillText(`${winner.name} Wins!`, BOARD_WIDTH / 2, BOARD_HEIGHT / 2 + 60);
        }
      }

      // Draw obstacles
      obstacles.forEach((pos) => {
        ctx.fillStyle = '#374151';
        ctx.shadowColor = '#60A5FA';
        ctx.shadowBlur = 10;
        ctx.fillRect(
          pos.x * CELL_SIZE,
          pos.y * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE
        );
        ctx.shadowBlur = 0;
      });

      // Draw fruits
      fruits.forEach((fruit) => {
        drawFruit(ctx, fruit.position.x, fruit.position.y, fruit.type);
      });

      // Draw power-ups
      powerUps.forEach((p) => {
        ctx.fillStyle = '#FBBF24';
        ctx.shadowColor = '#FBBF24';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(
          p.position.x * CELL_SIZE + CELL_SIZE / 2,
          p.position.y * CELL_SIZE + CELL_SIZE / 2,
          CELL_SIZE / 2,
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw snakes
      players.forEach((player) => {
        if (!player.isAlive) return;
        
        ctx.fillStyle = player.color;
        ctx.shadowColor = player.color;
        ctx.shadowBlur = 10;
        player.snake.forEach((segment, index) => {
          if (index === 0) {
            // Draw head
            ctx.beginPath();
            ctx.arc(
              segment.x * CELL_SIZE + CELL_SIZE / 2,
              segment.y * CELL_SIZE + CELL_SIZE / 2,
              CELL_SIZE / 2,
              0,
              2 * Math.PI
            );
            ctx.fill();
          } else {
            // Draw body
            ctx.fillRect(
              segment.x * CELL_SIZE + 1,
              segment.y * CELL_SIZE + 1,
              CELL_SIZE - 2,
              CELL_SIZE - 2
            );
          }
        });
        ctx.shadowBlur = 0;
      });

      // Draw weather effects
      if (weather === 'RAIN') {
        ctx.strokeStyle = '#60A5FA';
        ctx.shadowColor = '#60A5FA';
        ctx.shadowBlur = 5;
        ctx.lineWidth = 1;
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * BOARD_WIDTH;
          const y = Math.random() * BOARD_HEIGHT;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 5, y + 10);
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
      }
    };

    const gameLoop = () => {
      drawGame();
      requestAnimationFrame(gameLoop);
    };

    gameLoop();
  }, [players, fruits, powerUps, obstacles, weather, currentLevel, gameStatus]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={BOARD_WIDTH}
        height={BOARD_HEIGHT}
        className="rounded-lg shadow-2xl shadow-blue-500/20 border border-blue-500/20"
      />
      <div className="absolute top-4 right-4 bg-gray-800/80 backdrop-blur px-4 py-2 rounded-lg border border-blue-500/20">
        <div className="flex items-center gap-2">
          <span className="font-medium text-blue-400">Your Fruit</span>
          <div
            className="w-4 h-4 rounded-full shadow-lg"
            style={{
              backgroundColor:
                FRUIT_COLORS[
                  players.find((p) => p.id === 'current-player')?.assignedFruit ||
                    'APPLE'
                ],
              boxShadow: `0 0 10px ${
                FRUIT_COLORS[
                  players.find((p) => p.id === 'current-player')?.assignedFruit ||
                    'APPLE'
                ]
              }`,
            }}
          />
        </div>
      </div>
    </div>
  );
};