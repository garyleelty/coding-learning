/**
 * API client for communicating with the HackRust backend
 * Supports: local backend, Rust Playground API, offline fallback
 */

export interface CompileResult {
  success: boolean;
  output: string | null;
  compilationErrors: string | null;
  runtimeErrors: string | null;
  matchExpected: boolean | null;
}

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
 * Compiles and runs Rust code via local backend API
 */
async function compileViaBackend(code: string, expectedOutput?: string): Promise<CompileResult> {
  const response = await fetch('/api/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, expectedOutput }),
  });

  if (!response.ok) {
    throw new Error(`Backend API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Compiles and runs Rust code
 * Tries: local backend → Rust Playground → error
 */
export async function compileRust(code: string, expectedOutput?: string): Promise<CompileResult> {
  // Try local backend first
  try {
    return await compileViaBackend(code, expectedOutput);
  } catch {
    // Backend not available, try Playground
  }

  // Try Rust Playground API
  const result = await compileViaPlayground(code);

  // Compare output if expected
  if (expectedOutput !== undefined && result.success && result.output) {
    result.matchExpected = result.output.trimEnd() === expectedOutput.trimEnd();
  }

  return result;
}
