import { create } from 'zustand';
import { GameState, Player, Position, PowerUpType, Direction, FruitType, Level } from '../types/game';
import { FRUIT_COLORS, FRUIT_POINTS, LEVELS } from '../config/gameConfig';

interface GameStore extends GameState {
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updatePlayerPosition: (playerId: string, positions: Position[]) => void;
  updatePlayerDirection: (playerId: string, direction: Direction) => void;
  updateScore: (playerId: string, score: number) => void;
  addPowerUp: (playerId: string, powerUp: PowerUpType) => void;
  removePowerUp: (playerId: string, powerUp: PowerUpType) => void;
  setWeather: (weather: GameState['weather']) => void;
  setGameSpeed: (speed: number) => void;
  moveSnakes: () => void;
  checkLevelUp: (playerId: string) => void;
  eliminatePlayer: (playerId: string) => void;
}

const INITIAL_STATE: GameState = {
  players: [
    {
      id: 'current-player',
      name: 'Player 1',
      snake: [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
      ],
      direction: 'RIGHT',
      score: 0,
      assignedFruit: 'APPLE',
      color: FRUIT_COLORS.APPLE,
      powerUps: [],
      level: 1,
      isAlive: true
    }
  ],
  fruits: [
    { position: { x: 15, y: 15 }, type: 'APPLE', points: FRUIT_POINTS.APPLE },
    { position: { x: 25, y: 15 }, type: 'BANANA', points: FRUIT_POINTS.BANANA },
    { position: { x: 35, y: 15 }, type: 'ORANGE', points: FRUIT_POINTS.ORANGE },
  ],
  powerUps: [],
  obstacles: [],
  weather: 'CLEAR',
  gameSpeed: 1,
  currentLevel: 1,
  levels: LEVELS,
  gameStatus: 'PLAYING'
};

const generateNewFruit = (excludePositions: Position[]): Position => {
  let newPosition: Position;
  do {
    newPosition = {
      x: Math.floor(Math.random() * 40),
      y: Math.floor(Math.random() * 30),
    };
  } while (
    excludePositions.some(
      (pos) => pos.x === newPosition.x && pos.y === newPosition.y
    )
  );
  return newPosition;
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_STATE,

  eliminatePlayer: (playerId: string) => {
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, isAlive: false } : p
      ),
      gameStatus: state.players.filter(p => p.id !== playerId && p.isAlive).length === 1 
        ? 'GAME_OVER' 
        : state.gameStatus
    }));
  },

  addPlayer: (player) => {
    const state = get();
    const usedFruits = state.players.map((p) => p.assignedFruit);
    const availableFruits = Object.keys(FRUIT_COLORS).filter(
      (fruit) => !usedFruits.includes(fruit as FruitType)
    ) as FruitType[];
    
    if (availableFruits.length === 0) return;

    const assignedFruit = availableFruits[0];
    const newPlayer = {
      ...player,
      assignedFruit,
      color: FRUIT_COLORS[assignedFruit],
      isAlive: true
    };

    set((state) => ({ players: [...state.players, newPlayer] }));
  },

  moveSnakes: () => {
    const state = get();
    
    state.players.forEach((player) => {
      if (!player.isAlive) return;

      const newHead = { ...player.snake[0] };
      
      switch (player.direction) {
        case 'UP':
          newHead.y -= 1;
          break;
        case 'DOWN':
          newHead.y += 1;
          break;
        case 'LEFT':
          newHead.x -= 1;
          break;
        case 'RIGHT':
          newHead.x += 1;
          break;
      }

      // Wrap around board edges
      newHead.x = (newHead.x + 40) % 40;
      newHead.y = (newHead.y + 30) % 30;

      const newSnake = [newHead, ...player.snake.slice(0, -1)];

      // Check for fruit collision
      const fruitIndex = state.fruits.findIndex(
        (f) => f.position.x === newHead.x && f.position.y === newHead.y
      );

      if (fruitIndex !== -1) {
        const fruit = state.fruits[fruitIndex];
        
        if (fruit.type === player.assignedFruit) {
          // Player ate their assigned fruit
          newSnake.push(player.snake[player.snake.length - 1]);
          const newScore = player.score + fruit.points;
          
          set((state) => ({
            players: state.players.map((p) =>
              p.id === player.id
                ? {
                    ...p,
                    snake: newSnake,
                    score: newScore,
                    color: FRUIT_COLORS[fruit.type],
                  }
                : p
            ),
            fruits: [
              ...state.fruits.slice(0, fruitIndex),
              ...state.fruits.slice(fruitIndex + 1),
              {
                position: generateNewFruit([
                  ...state.players.flatMap((p) => p.snake),
                  ...state.fruits.map((f) => f.position),
                ]),
                type: fruit.type,
                points: FRUIT_POINTS[fruit.type],
              },
            ],
          }));

          get().checkLevelUp(player.id);
        } else {
          // Player ate someone else's fruit - eliminate them
          get().eliminatePlayer(player.id);
        }
      } else {
        // Regular movement without eating fruit
        set((state) => ({
          players: state.players.map((p) =>
            p.id === player.id ? { ...p, snake: newSnake } : p
          ),
        }));
      }
    });
  },

  // Rest of the store methods remain the same
  removePlayer: (playerId) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== playerId),
    })),

  updatePlayerPosition: (playerId, positions) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, snake: positions } : p
      ),
    })),

  updatePlayerDirection: (playerId, direction) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, direction } : p
      ),
    })),

  updateScore: (playerId, score) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, score } : p
      ),
    })),

  checkLevelUp: (playerId) => {
    const state = get();
    const player = state.players.find((p) => p.id === playerId);
    if (!player) return;

    const nextLevel = state.levels.find(
      (level) => level.number === player.level + 1
    );

    if (nextLevel && player.score >= nextLevel.requiredScore) {
      set((state) => ({
        players: state.players.map((p) =>
          p.id === playerId ? { ...p, level: p.level + 1 } : p
        ),
        currentLevel: nextLevel.number,
        obstacles: nextLevel.obstacles,
        gameSpeed: nextLevel.speed,
      }));
    }
  },

  addPowerUp: (playerId, powerUp) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId
          ? { ...p, powerUps: [...p.powerUps, powerUp] }
          : p
      ),
    })),

  removePowerUp: (playerId, powerUp) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId
          ? { ...p, powerUps: p.powerUps.filter((pu) => pu !== powerUp) }
          : p
      ),
    })),

  setWeather: (weather) => set({ weather }),
  setGameSpeed: (gameSpeed) => set({ gameSpeed }),
}));