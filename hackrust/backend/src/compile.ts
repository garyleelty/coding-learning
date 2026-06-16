import { execFile } from 'child_process';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { existsSync } from 'fs';

const TEMP_DIR = join(process.cwd(), 'temp');
const TIMEOUT_MS = 5000; // 5 seconds timeout for compilation + execution

interface CompileResult {
  success: boolean;
  output: string | null;
  compilationErrors: string | null;
  runtimeErrors: string | null;
  matchExpected: boolean | null;
}

/**
 * Ensures the temp directory exists
 */
async function ensureTempDir(): Promise<void> {
  if (!existsSync(TEMP_DIR)) {
    await mkdir(TEMP_DIR, { recursive: true });
  }
}

/**
 * Generates a unique filename for the temp Rust file
 */
function generateFilename(): string {
  return `main_${randomBytes(8).toString('hex')}`;
}

/**
 * Compiles Rust code using rustc
 */
function compileRust(sourcePath: string, outputPath: string): Promise<{ success: boolean; errors: string }> {
  return new Promise((resolve) => {
    execFile(
      'rustc',
      [sourcePath, '-o', outputPath, '--edition', '2021'],
      { timeout: TIMEOUT_MS },
      (error, stdout, stderr) => {
        if (error) {
          resolve({
            success: false,
            errors: stderr || error.message,
          });
        } else {
          resolve({
            success: true,
            errors: stderr || '',
          });
        }
      }
    );
  });
}

/**
 * Runs a compiled binary and captures output
 */
function runBinary(binaryPath: string): Promise<{ success: boolean; output: string; errors: string }> {
  return new Promise((resolve) => {
    execFile(
      binaryPath,
      [],
      { timeout: TIMEOUT_MS, maxBuffer: 1024 * 1024 }, // 1MB max output
      (error, stdout, stderr) => {
        if (error) {
          // Check if it was killed by timeout
          if (error.killed) {
            resolve({
              success: false,
              output: stdout || '',
              errors: '程序执行超时（超过5秒）',
            });
          } else {
            resolve({
              success: false,
              output: stdout || '',
              errors: stderr || error.message,
            });
          }
        } else {
          resolve({
            success: true,
            output: stdout || '',
            errors: stderr || '',
          });
        }
      }
    );
  });
}

/**
 * Cleans up temporary files
 */
async function cleanup(...paths: string[]): Promise<void> {
  for (const path of paths) {
    try {
      await unlink(path);
    } catch {
      // Ignore cleanup errors
    }
  }
}

/**
 * Compiles and runs Rust code
 * 
 * @param code - The Rust source code to compile and run
 * @param expectedOutput - Optional expected output to compare against
 * @returns CompileResult with success status, output, and any errors
 */
export async function compileAndRun(code: string, expectedOutput?: string): Promise<CompileResult> {
  await ensureTempDir();

  const filename = generateFilename();
  const sourcePath = join(TEMP_DIR, `${filename}.rs`);
  const binaryPath = join(TEMP_DIR, filename);

  try {
    // Write the Rust source code to a temp file
    await writeFile(sourcePath, code, 'utf-8');

    // Compile the code
    const compileResult = await compileRust(sourcePath, binaryPath);
    
    if (!compileResult.success) {
      return {
        success: false,
        output: null,
        compilationErrors: compileResult.errors,
        runtimeErrors: null,
        matchExpected: null,
      };
    }

    // Run the compiled binary
    const runResult = await runBinary(binaryPath);

    if (!runResult.success) {
      return {
        success: false,
        output: runResult.output || null,
        compilationErrors: null,
        runtimeErrors: runResult.errors,
        matchExpected: null,
      };
    }

    // Compare with expected output if provided
    let matchExpected: boolean | null = null;
    if (expectedOutput !== undefined) {
      matchExpected = runResult.output.trimEnd() === expectedOutput.trimEnd();
    }

    return {
      success: true,
      output: runResult.output,
      compilationErrors: compileResult.errors || null,
      runtimeErrors: runResult.errors || null,
      matchExpected,
    };
  } finally {
    // Clean up temp files
    await cleanup(sourcePath, binaryPath);
  }
}
