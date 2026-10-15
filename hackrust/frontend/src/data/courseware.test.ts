import { describe, it, expect } from 'vitest'
import { worlds } from '../data/worlds'
import type { BossChallenge, Level } from '../types'

/**
 * ══════════════════════════════════════════════════
 * 课件数据完整性测试
 * ══════════════════════════════════════════════════
 *
 * 对应 issue #1「缺课件,无法让人真实的学」以及它背后的两个真实缺陷：
 *
 * 1. 代码示例里混入了中文弯引号 “ ”（当初从文档粘贴代码时自动转换的）。
 *    Rust 编译器不认这两个字符，会直接报
 *      error: unknown start of token: \u{201c}
 *    于是「示例代码直接加载到编辑器」这个功能反而把学习者引向编译错误。
 *
 * 2. `solution` 字段只是期望的 stdout，不是代码。学习者一旦卡住，整个应用里
 *    没有任何地方能看到一份**能真正跑通**的参考实现，只能反复猜。
 *
 * 这个测试把这两条约束钉住：任何一关缺 solutionCode、或任何代码字段里
 * 重新出现弯引号，CI 都会红。
 */

const NEEDS_RUNTIME_LIBS = new Set(['w21-l01', 'w21-l02']) // 依赖 tokio，单文件 rustc 跑不了

/** 会进入编辑器或被当作代码展示的字段 */
function codeBearingFields(level: Level): Array<[string, string]> {
  const out: Array<[string, string]> = []
  if (level.codeTemplate) out.push(['codeTemplate', level.codeTemplate])
  if (level.exampleCode) out.push(['exampleCode', level.exampleCode])
  if (level.code) out.push(['code', level.code])
  for (const [i, h] of (level.codeHints ?? []).entries()) out.push([`codeHints[${i}]`, h])
  return out
}

const allLevels: Level[] = worlds.flatMap((w) => w.levels)
const codeLevels = allLevels.filter((l) => l.type === 'code')

describe('课件：代码字段的字符正确性', () => {
  it('任何代码字段都不含中文弯引号（rustc 会报 unknown start of token）', () => {
    const offenders: string[] = []
    for (const level of allLevels) {
      for (const [field, value] of codeBearingFields(level)) {
        if (value.includes('\u201c') || value.includes('\u201d')) {
          offenders.push(`${level.id}.${field}`)
        }
      }
    }
    expect(offenders).toEqual([])
  })

  it('答题用的代码模板里不会残留弯引号', () => {
    for (const level of codeLevels) {
      const tpl = level.exampleCode ?? level.codeTemplate ?? ''
      expect(tpl, `${level.id} 的模板`).not.toMatch(/[\u201c\u201d]/)
    }
  })
})

describe('课件：每个代码关卡都有可运行的参考实现', () => {
  it('所有代码关卡都提供了 solutionCode', () => {
    const missing = codeLevels.filter((l) => !l.solutionCode?.trim()).map((l) => l.id)
    expect(missing).toEqual([])
  })

  it('solutionCode 看起来是一段完整程序（有 fn main 或有测试模块）', () => {
    const suspicious: string[] = []
    for (const level of codeLevels) {
      const code = level.solutionCode ?? ''
      const hasMain = /fn\s+main\s*\(/.test(code)
      const hasTestMod = /#\[cfg\(test\)\]/.test(code)
      if (!hasMain && !hasTestMod) suspicious.push(level.id)
    }
    expect(suspicious).toEqual([])
  })

  it('solutionCode 里不含弯引号', () => {
    const bad = codeLevels
      .filter((l) => /[\u201c\u201d]/.test(l.solutionCode ?? ''))
      .map((l) => l.id)
    expect(bad).toEqual([])
  })

  it('依赖 tokio 的异步关卡确实带 #[tokio::main]', () => {
    for (const level of codeLevels.filter((l) => NEEDS_RUNTIME_LIBS.has(l.id))) {
      expect(level.solutionCode ?? '', level.id).toContain('#[tokio::main]')
    }
  })

  it('每个代码关卡都有期望输出用例，供判题比对', () => {
    const missing = codeLevels.filter((l) => !l.codeTestCases?.length).map((l) => l.id)
    expect(missing).toEqual([])
  })
})

describe('课件：结构完整性', () => {
  it('世界 ID 唯一', () => {
    const ids = worlds.map((w) => w.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('关卡 ID 全局唯一', () => {
    const ids = allLevels.map((l) => l.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('每个世界都有名称、描述、至少一关和一场 boss 战', () => {
    for (const w of worlds) {
      expect(w.name, w.id).toBeTruthy()
      expect(w.description, w.id).toBeTruthy()
      expect(w.levels.length, w.id).toBeGreaterThan(0)
      const boss: BossChallenge = w.boss
      expect(boss?.title, `${w.id} boss`).toBeTruthy()
      expect(boss?.template, `${w.id} boss`).toBeTruthy()
    }
  })

  it('每个关卡都有题面、解析与 solution', () => {
    for (const l of allLevels) {
      expect(l.title, l.id).toBeTruthy()
      expect(l.question, l.id).toBeTruthy()
      expect(l.explanation, l.id).toBeTruthy()
      expect(l.solution, l.id).toBeDefined()
    }
  })

  it('选择题至少有一个正确选项', () => {
    for (const l of allLevels.filter((x) => x.type === 'choice')) {
      expect(l.options?.some((o) => o.isCorrect), l.id).toBe(true)
    }
  })

  it('选择/填空类的 solution 必须命中选项或空格', () => {
    for (const l of allLevels.filter((x) => x.type === 'choice')) {
      const ids = (l.options ?? []).map((o) => o.id)
      expect(ids, l.id).toContain(l.solution as string)
    }
  })
})
