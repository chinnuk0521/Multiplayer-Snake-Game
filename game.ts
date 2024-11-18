export type Position = {
  x: number;
  y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type PowerUpType = 'SPEED' | 'SHRINK' | 'INVINCIBLE' | 'TELEPORT';

export type FruitType = 'APPLE' | 'BANANA' | 'ORANGE' | 'GRAPE' | 'BLUEBERRY' | 'STRAWBERRY';

export type Fruit = {
  position: Position;
  type: FruitType;
  points: number;
};

export type PowerUp = {
  type: PowerUpType;
  position: Position;
  duration: number;
};

export type Player = {
  id: string;
  name: string;
  snake: Position[];
  direction: Direction;
  score: number;
  assignedFruit: FruitType;
  color: string;
  powerUps: PowerUpType[];
  level: number;
  isAlive: boolean;
};

export type Level = {
  number: number;
  requiredScore: number;
  speed: number;
  obstacles: Position[];
};

export type GameStatus = 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export type GameState = {
  players: Player[];
  fruits: Fruit[];
  powerUps: PowerUp[];
  obstacles: Position[];
  weather: 'CLEAR' | 'FOG' | 'RAIN' | 'DARK';
  gameSpeed: number;
  currentLevel: number;
  levels: Level[];
  gameStatus: GameStatus;
};