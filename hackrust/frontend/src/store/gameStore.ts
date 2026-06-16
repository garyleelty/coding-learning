import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameSave, PlayerState, LevelProgress } from '../types';

const INITIAL_PLAYER: PlayerState = {
  xp: 0,
  level: 1,
  hp: 100,
  maxHp: 100,
  combo: 0,
  streak: 0,
  lastPlayDate: null,
};

function calcLevel(xp: number): number {
  // Simple level curve: level = floor(sqrt(xp / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

function getDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function calcStreak(lastPlayDate: string | null, currentStreak: number): number {
  if (!lastPlayDate) return 1;

  const last = new Date(lastPlayDate);
  const now = new Date();
  const lastDay = getDayKey(last);
  const today = getDayKey(now);
  if (lastDay === today) return Math.max(1, currentStreak);

  const msPerDay = 1000 * 60 * 60 * 24;
  const lastUtc = Date.UTC(last.getUTCFullYear(), last.getUTCMonth(), last.getUTCDate());
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const diffDays = Math.round((todayUtc - lastUtc) / msPerDay);

  return diffDays === 1 ? currentStreak + 1 : 1;
}

export function xpForLevel(level: number): number {
  return (level - 1) * (level - 1) * 100;
}

interface GameActions {
  addXp: (amount: number) => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  completeLevel: (worldId: string, levelId: string, score: number) => void;
  defeatBoss: (worldId: string) => void;
  markNeedsReview: (worldId: string, levelId: string) => void;
  clearReview: (worldId: string, levelId: string) => void;
  setCurrentWorld: (worldId: string | null) => void;
  setCurrentLevel: (level: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameSave & GameActions>()(
  persist(
    (set) => ({
      player: { ...INITIAL_PLAYER },
      worlds: {},
      currentWorld: null,
      currentLevel: 0,

      addXp: (amount: number) => {
        set((state) => {
          const comboMultiplier = state.player.combo >= 10 ? 2 : state.player.combo >= 5 ? 1.5 : state.player.combo >= 3 ? 1.2 : 1;
          const finalXp = Math.floor(amount * comboMultiplier);
          const newXp = state.player.xp + finalXp;
          const newLevel = calcLevel(newXp);
          const now = new Date().toISOString();
          return {
            player: {
              ...state.player,
              xp: newXp,
              level: newLevel,
              streak: calcStreak(state.player.lastPlayDate, state.player.streak),
              lastPlayDate: now,
            },
          };
        });
      },

      incrementCombo: () => {
        set((state) => ({
          player: {
            ...state.player,
            combo: state.player.combo + 1,
          },
        }));
      },

      resetCombo: () => {
        set((state) => ({
          player: {
            ...state.player,
            combo: 0,
          },
        }));
      },

      takeDamage: (amount: number) => {
        set((state) => ({
          player: {
            ...state.player,
            hp: Math.max(0, state.player.hp - amount),
          },
        }));
      },

      heal: (amount: number) => {
        set((state) => ({
          player: {
            ...state.player,
            hp: Math.min(state.player.maxHp, state.player.hp + amount),
          },
        }));
      },

      completeLevel: (worldId: string, levelId: string, score: number) => {
        set((state) => {
          const worldProgress = state.worlds[worldId] || { levels: {}, bossDefeated: false };
          const levelProgress: LevelProgress = {
            completed: true,
            score,
            attempts: (worldProgress.levels[levelId]?.attempts || 0) + 1,
            needsReview: false,
          };
          return {
            worlds: {
              ...state.worlds,
              [worldId]: {
                ...worldProgress,
                levels: {
                  ...worldProgress.levels,
                  [levelId]: levelProgress,
                },
              },
            },
          };
        });
      },

      defeatBoss: (worldId: string) => {
        set((state) => {
          const worldProgress = state.worlds[worldId] || { levels: {}, bossDefeated: false };
          return {
            worlds: {
              ...state.worlds,
              [worldId]: {
                ...worldProgress,
                bossDefeated: true,
              },
            },
          };
        });
      },

      markNeedsReview: (worldId: string, levelId: string) => {
        set((state) => {
          const worldProgress = state.worlds[worldId];
          if (!worldProgress) return state;
          const levelProgress = worldProgress.levels[levelId];
          if (!levelProgress) return state;
          return {
            worlds: {
              ...state.worlds,
              [worldId]: {
                ...worldProgress,
                levels: {
                  ...worldProgress.levels,
                  [levelId]: {
                    ...levelProgress,
                    needsReview: true,
                  },
                },
              },
            },
          };
        });
      },

      clearReview: (worldId: string, levelId: string) => {
        set((state) => {
          const worldProgress = state.worlds[worldId];
          if (!worldProgress) return state;
          const levelProgress = worldProgress.levels[levelId];
          if (!levelProgress) return state;
          return {
            worlds: {
              ...state.worlds,
              [worldId]: {
                ...worldProgress,
                levels: {
                  ...worldProgress.levels,
                  [levelId]: {
                    ...levelProgress,
                    needsReview: false,
                  },
                },
              },
            },
          };
        });
      },

      setCurrentWorld: (worldId: string | null) => {
        set({ currentWorld: worldId });
      },

      setCurrentLevel: (level: number) => {
        set({ currentLevel: level });
      },

      resetGame: () => {
        set({
          player: { ...INITIAL_PLAYER },
          worlds: {},
          currentWorld: null,
          currentLevel: 0,
        });
      },
    }),
    {
      name: 'hackrust-save',
    }
  )
);

// Selectors
export const selectPlayer = (state: GameSave) => state.player;
export const selectWorldProgress = (worldId: string) => (state: GameSave) => state.worlds[worldId];
export const selectLevelProgress = (worldId: string, levelId: string) => (state: GameSave) =>
  state.worlds[worldId]?.levels[levelId];
