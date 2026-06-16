import { describe, it, expect } from 'vitest'
import { calcLevel, xpForLevel, calcReward } from './xpCalc'

describe('calcLevel', () => {
  it('returns level 1 at 0 XP', () => {
    expect(calcLevel(0)).toBe(1)
  })

  it('returns level 1 for XP < 100', () => {
    expect(calcLevel(50)).toBe(1)
    expect(calcLevel(99)).toBe(1)
  })

  it('returns level 2 at 100 XP', () => {
    expect(calcLevel(100)).toBe(2)
  })

  it('returns level 3 at 400 XP', () => {
    expect(calcLevel(400)).toBe(3)
  })

  it('returns level 10 at 8100 XP', () => {
    expect(calcLevel(8100)).toBe(10)
  })
})

describe('xpForLevel', () => {
  it('returns 0 for level 1', () => {
    expect(xpForLevel(1)).toBe(0)
  })

  it('returns 100 for level 2', () => {
    expect(xpForLevel(2)).toBe(100)
  })

  it('returns 400 for level 3', () => {
    expect(xpForLevel(3)).toBe(400)
  })

  it('returns 8100 for level 10', () => {
    expect(xpForLevel(10)).toBe(8100)
  })
})

describe('calcReward', () => {
  describe('base XP by level type', () => {
    it('returns 50 for choice type', () => {
      expect(calcReward('choice', 0)).toBe(50)
    })

    it('returns 50 for judge type', () => {
      expect(calcReward('judge', 0)).toBe(50)
    })

    it('returns 75 for fill type', () => {
      expect(calcReward('fill', 0)).toBe(75)
    })

    it('returns 75 for order type', () => {
      expect(calcReward('order', 0)).toBe(75)
    })

    it('returns 200 for boss type', () => {
      expect(calcReward('boss', 0)).toBe(200)
    })

    it('returns 50 for unknown type', () => {
      expect(calcReward('unknown', 0)).toBe(50)
    })
  })

  describe('combo multiplier', () => {
    it('returns 1x multiplier for combo < 3', () => {
      expect(calcReward('choice', 0)).toBe(50)
      expect(calcReward('choice', 1)).toBe(50)
      expect(calcReward('choice', 2)).toBe(50)
    })

    it('returns 1.2x multiplier for combo 3-4', () => {
      expect(calcReward('choice', 3)).toBe(60) // 50 * 1.2 = 60
      expect(calcReward('choice', 4)).toBe(60)
    })

    it('returns 1.5x multiplier for combo 5-9', () => {
      expect(calcReward('choice', 5)).toBe(75) // 50 * 1.5 = 75
      expect(calcReward('choice', 9)).toBe(75)
    })

    it('returns 2x multiplier for combo >= 10', () => {
      expect(calcReward('choice', 10)).toBe(100) // 50 * 2 = 100
      expect(calcReward('choice', 100)).toBe(100)
    })
  })
})
