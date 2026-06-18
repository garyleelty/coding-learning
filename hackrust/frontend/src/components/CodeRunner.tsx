import { useState, useCallback, useRef } from 'react';
import type { TestCase } from '../types';
import { compileRust } from '../lib/api';

interface CodeRunnerProps {
  task: string;
  template: string;
  testCases?: TestCase[];
  hints?: string[];
  onPass?: () => void;
  onFail?: () => void;
  showExpected?: boolean;
}

export default function CodeRunner({
  task,
  template,
  testCases,
  hints,
  onPass,
  onFail,
  showExpected = true,
}: CodeRunnerProps) {
  const [code, setCode] = useState(template);
  const [output, setOutput] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'running' | 'pass' | 'fail' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [visibleHints, setVisibleHints] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const expectedOutput = testCases?.[0]?.expected ?? null;

  // Tab key support — insert spaces instead of moving focus
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      // Restore cursor position
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      });
    }
    // Auto-close brackets
    const pairs: Record<string, string> = { '{': '}', '(': ')', '[': ']', '"': '"', "'": "'" };
    if (pairs[e.key]) {
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start === end) {
        e.preventDefault();
        const newCode = code.substring(0, start) + e.key + pairs[e.key] + code.substring(end);
        setCode(newCode);
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        });
      }
    }
  }, [code]);

  const handleRun = useCallback(async () => {
    setStatus('running');
    setOutput(null);
    setErrorMsg(null);

    try {
      const result = await compileRust(code, expectedOutput ?? undefined);

      if (result.compilationErrors) {
        setStatus('error');
        setErrorMsg(result.compilationErrors);
        setFailCount((c) => {
          const next = c + 1;
          if (hints && next >= 2) {
            setVisibleHints((h) => Math.min(h + 1, hints.length));
          }
          return next;
        });
        onFail?.();
        return;
      }

      if (result.runtimeErrors) {
        setStatus('error');
        setErrorMsg(result.runtimeErrors);
        setFailCount((c) => {
          const next = c + 1;
          if (hints && next >= 2) {
            setVisibleHints((h) => Math.min(h + 1, hints.length));
          }
          return next;
        });
        onFail?.();
        return;
      }

      setOutput(result.output ?? '(无输出)');

      if (result.matchExpected === true) {
        setStatus('pass');
        onPass?.();
      } else if (result.matchExpected === false) {
        setStatus('fail');
        setFailCount((c) => {
          const next = c + 1;
          if (hints && next >= 2) {
            setVisibleHints((h) => Math.min(h + 1, hints.length));
          }
          return next;
        });
        onFail?.();
      } else {
        setStatus('idle');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg(`运行出错: ${err instanceof Error ? err.message : '未知错误'}`);
      onFail?.();
    }
  }, [code, expectedOutput, hints, onPass, onFail]);

  const handleReset = useCallback(() => {
    setCode(template);
    setOutput(null);
    setStatus('idle');
    setErrorMsg(null);
    setFailCount(0);
    setVisibleHints(0);
  }, [template]);

  // Line numbers
  const lineCount = code.split('\n').length;

  return (
    <div className="space-y-4">
      {/* Task description */}
      <div className="rounded-lg border border-[#00ff9f]/20 bg-[#00ff9f]/5 p-4">
        <div className="mb-2 font-mono text-xs font-bold tracking-widest text-[#00ff9f]">
          任务目标
        </div>
        <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{task}</p>
      </div>

      {/* Code editor */}
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
        <div className="flex">
          {/* Line numbers */}
          <div className="flex-shrink-0 select-none border-r border-cyan-800/20 bg-[#0d1117] py-4 pr-2 text-right">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} className="px-2 font-mono text-xs leading-relaxed text-gray-600">
                {i + 1}
              </div>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="min-h-[16rem] w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed text-[#00ff9f]/90 outline-none placeholder:text-gray-700"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleRun}
          disabled={status === 'running'}
          className={`rounded px-6 py-2.5 font-mono font-bold transition-all cursor-pointer ${
            status === 'running'
              ? 'bg-gray-700 text-gray-400'
              : 'bg-[#00ff9f] text-black hover:shadow-[0_0_15px_rgba(0,255,159,0.4)]'
          }`}
        >
          {status === 'running' ? '运行中...' : '▶ 运行'}
        </button>
        <button
          onClick={handleReset}
          className="rounded border border-gray-700 px-4 py-2.5 font-mono text-sm text-gray-300 transition-colors hover:border-[#00ff9f]/50 cursor-pointer"
        >
          重置代码
        </button>
      </div>

      {/* Output */}
      {output !== null && (
        <div className="rounded-lg border border-gray-700/50 bg-[#0d1117] p-4">
          <div className="mb-2 font-mono text-xs font-bold text-gray-500">输出</div>
          <pre className="font-mono text-sm text-gray-200 whitespace-pre-wrap">{output}</pre>
        </div>
      )}

      {/* Error */}
      {errorMsg && (
        <div className="rounded-lg border border-red-500/30 bg-red-900/10 p-4">
          <div className="mb-2 font-mono text-xs font-bold text-red-400">错误</div>
          <pre className="font-mono text-sm text-red-300 whitespace-pre-wrap">{errorMsg}</pre>
        </div>
      )}

      {/* Expected output comparison */}
      {showExpected && expectedOutput && status !== 'idle' && (
        <div className="rounded-lg border border-gray-700/50 bg-[#0d1117] p-4">
          <div className="mb-2 font-mono text-xs font-bold text-gray-500">期望输出</div>
          <pre className="font-mono text-sm text-gray-400 whitespace-pre-wrap">{expectedOutput}</pre>
        </div>
      )}

      {/* Status badge */}
      {status === 'pass' && (
        <div className="rounded-lg border border-[#00ff9f]/40 bg-[#00ff9f]/10 p-3 text-center font-mono text-sm font-bold text-[#00ff9f]">
          ✔ 输出正确！
        </div>
      )}
      {status === 'fail' && (
        <div className="rounded-lg border border-red-500/40 bg-red-900/10 p-3 text-center font-mono text-sm font-bold text-red-400">
          ✘ 输出不匹配，请修改代码后重试
        </div>
      )}

      {/* Hints */}
      {hints && hints.length > 0 && visibleHints > 0 && (
        <div className="rounded-lg border border-yellow-600/30 bg-yellow-900/10 p-4">
          <div className="mb-2 font-mono text-xs font-bold text-yellow-400">提示</div>
          <div className="space-y-2">
            {hints.slice(0, visibleHints).map((hint, i) => (
              <div key={i} className="rounded bg-yellow-900/20 p-3 font-mono text-xs text-yellow-200/80 whitespace-pre-wrap">
                <span className="text-yellow-500/60">提示 {i + 1}: </span>{hint}
              </div>
            ))}
          </div>
        </div>
      )}
      {hints && hints.length > 0 && visibleHints < hints.length && failCount >= 1 && (
        <button
          onClick={() => setVisibleHints((h) => Math.min(h + 1, hints.length))}
          className="rounded border border-yellow-600/40 px-4 py-2 font-mono text-xs text-yellow-400 transition-colors hover:bg-yellow-900/30 cursor-pointer"
        >
          显示提示 ({visibleHints}/{hints.length})
        </button>
      )}
    </div>
  );
}
