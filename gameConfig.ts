import { FruitType, Level } from '../types/game';

export const FRUIT_COLORS: Record<FruitType, string> = {
  APPLE: '#ff0000',
  BANANA: '#ffd700',
  ORANGE: '#ffa500',
  GRAPE: '#800080',
  BLUEBERRY: '#0000ff',
  STRAWBERRY: '#ff69b4',
};

export const FRUIT_POINTS: Record<FruitType, number> = {
  APPLE: 10,
  BANANA: 15,
  ORANGE: 20,
  GRAPE: 25,
  BLUEBERRY: 30,
  STRAWBERRY: 35,
};

export const LEVELS: Level[] = [
  {
    number: 1,
    requiredScore: 0,
    speed: 1,
    obstacles: [],
  },
  {
    number: 2,
    requiredScore: 100,
    speed: 1.2,
    obstacles: [
      { x: 10, y: 10 },
      { x: 30, y: 20 },
    ],
  },
  {
    number: 3,
    requiredScore: 250,
    speed: 1.4,
    obstacles: [
      { x: 15, y: 15 },
      { x: 25, y: 25 },
      { x: 35, y: 15 },
    ],
  },
  {
    number: 4,
    requiredScore: 500,
    speed: 1.6,
    obstacles: [
      { x: 20, y: 10 },
      { x: 20, y: 20 },
      { x: 20, y: 30 },
      { x: 10, y: 20 },
      { x: 30, y: 20 },
    ],
  },
  {
    number: 5,
    requiredScore: 1000,
    speed: 2,
    obstacles: [
      { x: 10, y: 10 },
      { x: 30, y: 10 },
      { x: 10, y: 30 },
      { x: 30, y: 30 },
      { x: 20, y: 20 },
    ],
  },
];