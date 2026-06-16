import { describe, it, expect } from 'vitest'
import { calcDamage, calcBossHP } from './damageCalc'

describe('calcDamage', () => {
  it('returns 10 for combo < 3', () => {
    expect(calcDamage(0)).toBe(10)
    expect(calcDamage(1)).toBe(10)
    expect(calcDamage(2)).toBe(10)
  })

  it('returns 15 for combo 3-4', () => {
    expect(calcDamage(3)).toBe(15)
    expect(calcDamage(4)).toBe(15)
  })

  it('returns 20 for combo >= 5', () => {
    expect(calcDamage(5)).toBe(20)
    expect(calcDamage(10)).toBe(20)
    expect(calcDamage(100)).toBe(20)
  })
})

describe('calcBossHP', () => {
  it('returns 30 for phase 0', () => {
    expect(calcBossHP(0)).toBe(30)
  })

  it('returns 40 for phase 1', () => {
    expect(calcBossHP(1)).toBe(40)
  })

  it('returns 50 for phase 2', () => {
    expect(calcBossHP(2)).toBe(50)
  })

  it('scales linearly with phase', () => {
    expect(calcBossHP(5)).toBe(80)
    expect(calcBossHP(10)).toBe(130)
  })
})
