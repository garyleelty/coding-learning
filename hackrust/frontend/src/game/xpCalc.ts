/**
 * Calculates the player's level based on total XP.
 * Matches the formula used in the game store.
 *
 * Formula: floor(sqrt(xp / 100)) + 1
 */
export function calcLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

/**
 * Returns the cumulative XP required to reach a given level.
 * Matches the formula used in the game store.
 *
 * Formula: (level - 1)² * 100
 */
export function xpForLevel(level: number): number {
  return (level - 1) * (level - 1) * 100;
}

/**
 * Calculates the XP reward for completing a level, applying a combo multiplier.
 *
 * Base XP by level type:
 * - choice / judge: 50 XP
 * - fill / order:   75 XP
 * - boss:          200 XP
 *
 * Combo multiplier:
 * - combo >= 3:  1.2×
 * - combo >= 5:  1.5×
 * - combo >= 10: 2.0×
 */
export function calcReward(levelType: string, combo: number): number {
  let base: number;

  switch (levelType) {
    case 'choice':
    case 'judge':
      base = 50;
      break;
    case 'fill':
    case 'order':
      base = 75;
      break;
    case 'boss':
      base = 200;
      break;
    default:
      base = 50;
  }

  let multiplier: number;
  if (combo >= 10) {
    multiplier = 2;
  } else if (combo >= 5) {
    multiplier = 1.5;
  } else if (combo >= 3) {
    multiplier = 1.2;
  } else {
    multiplier = 1;
  }

  return Math.floor(base * multiplier);
}
