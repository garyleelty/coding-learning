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
export type LevelType = 'choice' | 'fill' | 'order' | 'judge' | 'code';

// Small level (quiz or code challenge)
export interface Level {
  id: string;
  title: string;
  type: LevelType;
  lesson?: string;
  hint?: string;
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
  // Code challenge type
  codeTask?: string;
  codeTemplate?: string;
  codeTestCases?: TestCase[];
  codeHints?: string[];
  exampleCode?: string;
  exampleOutput?: string;
  /**
   * 完整、可直接运行的参考实现（「查看答案」展示）。
   *
   * 与 `solution` 的区别：`solution` 只是期望的 stdout，用于判题比对；
   * `solutionCode` 是一份真正能编译、运行后输出 `solution` 的 Rust 源码。
   * 仓库里由 scripts/verify_solutions.py 用 rustc 逐个校验，防止写出
   * 看起来对、实际编译不过的伪代码。
   */
  solutionCode?: string;
}

// Boss challenge
export interface BossChallenge {
  title: string;
  description: string;
  template: string;
  steps?: string[];
  hints?: string[];
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

// Compilation result from Playground API or WASM interpreter
export interface CompileResult {
  success: boolean;
  output: string | null;
  compilationErrors: string | null;
  runtimeErrors: string | null;
  warnings?: string[];
  compilationSource?: 'playground' | 'wasm';
  matchExpected: boolean | null;
}
