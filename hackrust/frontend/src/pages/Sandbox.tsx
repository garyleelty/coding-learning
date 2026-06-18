import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { compileRust } from '../lib/api';

const DEFAULT_CODE = `fn main() {
    println!("Hello, Rust!");
}`;

export function Sandbox() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setOutput(null);
    setError(null);

    try {
      const result = await compileRust(code);
      if (result.compilationErrors) {
        setError(result.compilationErrors);
      } else if (result.runtimeErrors) {
        setError(result.runtimeErrors);
      } else {
        setOutput(result.output ?? '(无输出)');
      }
    } catch (err) {
      setError(`运行出错: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setIsRunning(false);
    }
  }, [code]);

  return (
    <div className="relative min-h-screen bg-[#0a0a1a] text-gray-200">
      {/* Scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 159, 0.15) 2px, rgba(0, 255, 159, 0.15) 4px)',
        }}
      />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#00ff9f]/20 px-4 sm:px-8 h-14">
        <Link
          to="/"
          className="flex items-center gap-1 font-mono text-sm text-gray-400 hover:text-[#00ff9f] transition-colors"
        >
          <span className="text-lg">←</span>
          <span>首页</span>
        </Link>
        <span className="font-mono text-sm text-[#00ff9f]/60">Rust 沙盒</span>
        <div />
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-6">
        <div className="mb-4">
          <h1 className="font-mono text-2xl font-bold text-white mb-2">Rust 代码沙盒</h1>
          <p className="font-mono text-sm text-gray-500">
            自由编写 Rust 代码，点击运行查看结果。没有评分，没有限制，随意实验。
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          {/* Editor */}
          <div>
            <div className="overflow-hidden rounded-lg border border-cyan-800/40 bg-[#0d1117]">
              <div className="flex items-center justify-between border-b border-cyan-800/30 bg-[#161b22] px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <span className="font-mono text-xs text-gray-500">main.rs</span>
                <span className="font-mono text-xs text-cyan-400/60">rust</span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="min-h-[28rem] w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed text-[#00ff9f]/90 outline-none placeholder:text-gray-700"
              />
            </div>

            <div className="mt-3 flex gap-3">
              <button
                onClick={handleRun}
                disabled={isRunning}
                className={`rounded px-6 py-2.5 font-mono font-bold transition-all cursor-pointer ${
                  isRunning
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-[#00ff9f] text-black hover:shadow-[0_0_15px_rgba(0,255,159,0.4)]'
                }`}
              >
                {isRunning ? '运行中...' : '▶ 运行'}
              </button>
              <button
                onClick={() => {
                  setCode(DEFAULT_CODE);
                  setOutput(null);
                  setError(null);
                }}
                className="rounded border border-gray-700 px-4 py-2.5 font-mono text-sm text-gray-300 transition-colors hover:border-[#00ff9f]/50 cursor-pointer"
              >
                重置
              </button>
            </div>
          </div>

          {/* Output */}
          <div>
            <div className="rounded-lg border border-gray-700/50 bg-[#0d1117] min-h-[28rem] flex flex-col">
              <div className="border-b border-gray-700/30 bg-[#161b22] px-4 py-2">
                <span className="font-mono text-xs text-gray-500">输出</span>
              </div>
              <div className="flex-1 p-4">
                {output !== null && (
                  <pre className="font-mono text-sm text-gray-200 whitespace-pre-wrap">{output}</pre>
                )}
                {error !== null && (
                  <pre className="font-mono text-sm text-red-300 whitespace-pre-wrap">{error}</pre>
                )}
                {output === null && error === null && (
                  <pre className="font-mono text-sm text-gray-600">点击"运行"查看输出...</pre>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
