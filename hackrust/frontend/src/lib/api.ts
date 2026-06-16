/**
 * API client for communicating with the HackRust backend
 */

export interface CompileResult {
  success: boolean;
  output: string | null;
  compilationErrors: string | null;
  runtimeErrors: string | null;
  matchExpected: boolean | null;
}

/**
 * Compiles and runs Rust code via the backend API
 * 
 * @param code - The Rust source code to compile
 * @param expectedOutput - Optional expected output to compare against
 * @returns CompileResult with success status, output, and any errors
 */
export async function compileRust(code: string, expectedOutput?: string): Promise<CompileResult> {
  const response = await fetch('/api/compile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, expectedOutput }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
