// Core game types for HackRust

// Option for multiple choice questions
export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

// Test case for boss battles
export interface TestCase {
  input: string;
  expected: string;
  description?: string;
}

// Level types
export type LevelType = 'choice' | 'fill' | 'order' | 'judge';

// Small level (quiz)
export interface Level {
  id: string;
  title: string;
  type: LevelType;
  question: string;
  code?: string;
  solution: string | string[];
  explanation: string;
  // Choice type
  options?: Option[];
  // Fill type
  blanks?: string[];
  blanksCount?: number;
  // Order type
  shuffledLines?: string[];
  // Judge type
  judgeAnswer?: boolean;
}

// Boss challenge
export interface BossChallenge {
  title: string;
  description: string;
  template: string;
  validation: {
    required: string[];
    forbidden?: string[];
    testCases?: TestCase[];
  };
}

// World definition
export interface World {
  id: string;
  name: string;
  phase: number;
  description: string;
  levels: Level[];
  boss: BossChallenge;
}

// Player state
export interface PlayerState {
  xp: number;
  level: number;
  hp: number;
  maxHp: number;
  combo: number;
  streak: number;
  lastPlayDate: string | null;
}

// Level progress
export interface LevelProgress {
  completed: boolean;
  score: number;
  attempts: number;
  needsReview: boolean;
}

// World progress
export interface WorldProgress {
  levels: Record<string, LevelProgress>;
  bossDefeated: boolean;
}

// Game save state
export interface GameSave {
  player: PlayerState;
  worlds: Record<string, WorldProgress>;
  currentWorld: string | null;
  currentLevel: number;
}

// Validation result
export interface ValidationResult {
  success: boolean;
  message: string;
  details?: string[];
}
