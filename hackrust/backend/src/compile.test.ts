import { describe, it, expect } from 'vitest'
import { compileAndRun } from './compile'

describe('compileAndRun', () => {
  it('compiles and runs valid Rust code', async () => {
    const code = 'fn main() {\n    println!("Hello, world!");\n}'
    const result = await compileAndRun(code)
    
    expect(result.success).toBe(true)
    expect(result.output).toBe('Hello, world!\n')
    expect(result.compilationErrors).toBeNull()
    expect(result.runtimeErrors).toBeNull()
  }, 10000)

  it('returns compilation errors for invalid code', async () => {
    const code = 'fn main() {\n    let x: i32 = "hello";\n}'
    const result = await compileAndRun(code)
    
    expect(result.success).toBe(false)
    expect(result.output).toBeNull()
    expect(result.compilationErrors).toContain('mismatched types')
  }, 10000)

  it('returns syntax errors for malformed code', async () => {
    const code = 'fn main() { let x = '
    const result = await compileAndRun(code)
    
    expect(result.success).toBe(false)
    expect(result.compilationErrors).toBeTruthy()
  }, 10000)

  it('matches expected output when provided', async () => {
    const code = 'fn main() {\n    println!("Expected output");\n}'
    const result = await compileAndRun(code, 'Expected output')
    
    expect(result.success).toBe(true)
    expect(result.matchExpected).toBe(true)
  }, 10000)

  it('reports mismatch when output differs', async () => {
    const code = 'fn main() {\n    println!("Actual output");\n}'
    const result = await compileAndRun(code, 'Expected output')
    
    expect(result.success).toBe(true)
    expect(result.matchExpected).toBe(false)
  }, 10000)

  it('handles multiple println! calls', async () => {
    const code = 'fn main() {\n    println!("Line 1");\n    println!("Line 2");\n}'
    const result = await compileAndRun(code, 'Line 1\nLine 2')
    
    expect(result.success).toBe(true)
    expect(result.matchExpected).toBe(true)
  }, 10000)

  it('returns null matchExpected when no expected output provided', async () => {
    const code = 'fn main() {\n    println!("Hello");\n}'
    const result = await compileAndRun(code)
    
    expect(result.success).toBe(true)
    expect(result.matchExpected).toBeNull()
  }, 10000)
})
