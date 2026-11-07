import { describe, it, expect, vi, beforeEach } from 'vitest'

const chunk = vi.hoisted(() => ({ fail: true }))

vi.mock('../../../../wasm/code-validator/pkg/code_validator', () => {
  if (chunk.fail) {
    throw new Error('chunk load failed')
  }
  return {
    run_code: () => ({ success: true, output: '', errors: [], warnings: [] }),
  }
})

describe('getWasmInterpreter', () => {
  beforeEach(() => {
    vi.resetModules()
    chunk.fail = true
  })

  it('retries the dynamic import after a failed chunk load', async () => {
    const { getWasmInterpreter } = await import('./wasmLoader')

    // A failed chunk import is wrapped by vitest, so only assert that it rejects.
    await expect(getWasmInterpreter()).rejects.toThrow()

    chunk.fail = false
    const interpreter = await getWasmInterpreter()
    expect(interpreter.run_code).toBeTypeOf('function')
  })

  it('reuses the loaded module on subsequent calls', async () => {
    chunk.fail = false
    const { getWasmInterpreter } = await import('./wasmLoader')

    const first = await getWasmInterpreter()
    const second = await getWasmInterpreter()
    expect(second).toBe(first)
  })
})
