/**
 * Calculates the damage dealt to the boss based on the player's current combo.
 *
 * - Combo < 3:  base damage 10
 * - Combo >= 3: damage 15
 * - Combo >= 5: damage 20
 */
export function calcDamage(combo: number): number {
  if (combo >= 5) return 20;
  if (combo >= 3) return 15;
  return 10;
}

/**
 * Calculates the boss's total HP for a given world phase.
 *
 * Formula: 30 + (worldPhase * 10)
 *
 * Examples:
 * - Phase 0: 30 HP
 * - Phase 1: 40 HP
 * - Phase 2: 50 HP
 */
export function calcBossHP(worldPhase: number): number {
  return 30 + worldPhase * 10;
}
