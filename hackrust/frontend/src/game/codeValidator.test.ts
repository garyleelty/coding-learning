import { describe, it, expect } from 'vitest'
import { validateCode, checkSyntax } from './codeValidator'

describe('checkSyntax', () => {
  it('fails for empty code', () => {
    const result = checkSyntax('')
    expect(result.success).toBe(false)
    expect(result.message).toBe('代码不能为空')
  })

  it('fails for whitespace-only code', () => {
    const result = checkSyntax('   \n  \t  ')
    expect(result.success).toBe(false)
    expect(result.message).toBe('代码不能为空')
  })

  it('passes for valid Rust code', () => {
    const result = checkSyntax('fn main() {\n    println!("hello");\n}')
    expect(result.success).toBe(true)
    expect(result.message).toBe('语法检查通过')
  })

  it('fails for unbalanced braces', () => {
    const result = checkSyntax('fn main() {\n    println!("hello");')
    expect(result.success).toBe(false)
    expect(result.details).toContain('花括号 {} 不配对')
  })

  it('fails for unbalanced parentheses', () => {
    const result = checkSyntax('fn main( {\n    println!("hello");\n}')
    expect(result.success).toBe(false)
    expect(result.details).toContain('圆括号 () 不配对')
  })

  it('fails when fn main() is missing', () => {
    const result = checkSyntax('fn hello() {\n    println!("hello");\n}')
    expect(result.success).toBe(false)
    expect(result.details).toContain('缺少 fn main() 函数定义')
  })

  it('fails for empty main body', () => {
    const result = checkSyntax('fn main() {}')
    expect(result.success).toBe(false)
    expect(result.details).toContain('main 函数体不能为空')
  })
})

describe('validateCode', () => {
  describe('required patterns', () => {
    it('passes when all required patterns are present', () => {
      const result = validateCode('fn main() {\n    println!("hello");\n}', {
        required: ['fn main', 'println!'],
      })
      expect(result.success).toBe(true)
    })

    it('fails when a required pattern is missing', () => {
      const result = validateCode('fn main() {\n    println!("hello");\n}', {
        required: ['fn main', 'let'],
      })
      expect(result.success).toBe(false)
      expect(result.message).toBe('缺少必要内容')
    })
  })

  describe('forbidden patterns', () => {
    it('passes when no forbidden patterns are present', () => {
      const result = validateCode('fn main() {\n    println!("hello");\n}', {
        required: ['fn main'],
        forbidden: ['unsafe'],
      })
      expect(result.success).toBe(true)
    })

    it('fails when a forbidden pattern is present', () => {
      const result = validateCode('fn main() {\n    unsafe { }\n}', {
        required: ['fn main'],
        forbidden: ['unsafe'],
      })
      expect(result.success).toBe(false)
      expect(result.message).toBe('包含不允许的内容')
    })
  })

  describe('test cases with static output', () => {
    it('passes when output matches expected', () => {
      const result = validateCode('fn main() {\n    println!("Hello, world!");\n}', {
        required: ['fn main', 'println!'],
        testCases: [
          { input: '', expected: 'Hello, world!', description: 'print hello' },
        ],
      })
      expect(result.success).toBe(true)
    })

    it('fails when output does not match', () => {
      const result = validateCode('fn main() {\n    println!("Goodbye");\n}', {
        required: ['fn main', 'println!'],
        testCases: [
          { input: '', expected: 'Hello, world!' },
        ],
      })
      expect(result.success).toBe(false)
      expect(result.message).toBe('输出内容不匹配')
    })

    it('fails when no print macros are present', () => {
      const result = validateCode('fn main() {\n    let x = 5;\n}', {
        required: ['fn main'],
        testCases: [
          { input: '', expected: '5' },
        ],
      })
      expect(result.success).toBe(false)
      expect(result.message).toBe('缺少输出语句')
    })

    it('handles multiple println! calls', () => {
      const code = 'fn main() {\n    println!("Hello");\n    println!("World");\n}'
      const result = validateCode(code, {
        required: ['fn main', 'println!'],
        testCases: [
          { input: '', expected: 'Hello\nWorld' },
        ],
      })
      expect(result.success).toBe(true)
    })
  })
})
