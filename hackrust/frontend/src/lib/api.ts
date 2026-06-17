/**
 * API client for communicating with the HackRust backend
 * Supports: Rust Playground API, offline WASM fallback
 */

import { getWasmInterpreter } from './wasmLoader';
import type { CompileResult } from '../types';

/**
 * Compiles and runs Rust code via Rust Playground API (free, no auth)
 */
async function compileViaPlayground(code: string): Promise<CompileResult> {
  const response = await fetch('https://play.rust-lang.org/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      edition: '2021',
      mode: 'debug',
      channel: 'stable',
      crateType: 'bin',
      tests: false,
      backtrace: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Playground API error: ${response.status}`);
  }

  const data = await response.json();
  const success = data.success === true;
  const stderr = data.stderr || '';
  const stdout = data.stdout || '';

  // Filter out compilation noise from stderr
  const cleanStderr = stderr
    .replace(/^\s*Compiling.*$/gm, '')
    .replace(/^\s*Finished.*$/gm, '')
    .replace(/^\s*Running.*$/gm, '')
    .trim();

  return {
    success,
    output: stdout || null,
    compilationErrors: !success && cleanStderr ? cleanStderr : null,
    runtimeErrors: success && cleanStderr ? cleanStderr : null,
    matchExpected: null,
  };
}

/**
 * Compiles and runs Rust code
 * Tries: Rust Playground API → WASM interpreter (offline fallback)
 */
export async function compileRust(code: string, expectedOutput?: string): Promise<CompileResult> {
  // 1. Try Rust Playground API (online)
  try {
    const result = await compileViaPlayground(code);
    if (expectedOutput !== undefined && result.success && result.output != null) {
      result.matchExpected = result.output.trimEnd() === expectedOutput.trimEnd();
    }
    return result;
  } catch {
    // Playground unavailable — fall through to WASM
  }

  // 2. Fallback to WASM interpreter (offline)
  try {
    const wasm = await getWasmInterpreter();
    const result = wasm.run_code(code);

    let matchExpected = null;
    if (expectedOutput !== undefined && result.success && result.output != null) {
      matchExpected = result.output.trimEnd() === expectedOutput.trimEnd();
    }

    return {
      success: result.success,
      output: result.output ?? null,
      compilationErrors: result.errors.length > 0 ? result.errors.join('\n') : null,
      runtimeErrors: null,
      warnings: result.warnings,
      matchExpected,
    };
  } catch (err) {
    return {
      success: false,
      output: null,
      compilationErrors: `WASM interpreter error: ${err}`,
      runtimeErrors: null,
      warnings: [],
      matchExpected: null,
    };
  }
}
