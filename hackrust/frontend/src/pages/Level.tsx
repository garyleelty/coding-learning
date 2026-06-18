import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getWorld } from '../data/worlds';
import type { Level as LevelType } from '../types';
import { useGameStore } from '../store/gameStore';
import { CodeBlock, CodeRunner, Feedback, ComboIndicator } from '../components';

export function Level() {
  const { id, n } = useParams<{ id: string; n: string }>();
  const navigate = useNavigate();
  const playerCombo = useGameStore((s) => s.player.combo);
  const addXp = useGameStore((s) => s.addXp);
  const incrementCombo = useGameStore((s) => s.incrementCombo);
  const resetCombo = useGameStore((s) => s.resetCombo);
  const completeLevel = useGameStore((s) => s.completeLevel);

  const worldId = id || '';
  const levelNum = parseInt(n || '1', 10);

  const world = useMemo(() => getWorld(worldId), [worldId]);
  const level = useMemo(() => world?.levels[levelNum - 1] ?? null, [world, levelNum]);

  // ── Quiz state ──────────────────────────────────────────────
  const [selectedAnswer, setSelectedAnswer] = useState<string | boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [sequence, setSequence] = useState<number[]>([]);

  // Fill-blank state
  const blanksCount = useMemo(() => {
    if (!level || level.type !== 'fill') return 0;
    if (level.blanksCount !== undefined) return level.blanksCount;
    if (!level.code) return 0;
    return Math.max(0, level.code.split('___').length - 1);
  }, [level]);

  const [fillSlots, setFillSlots] = useState<number[]>([]);

  // Reset all local state when navigating to a different level
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setSubmitted(false);
      setIsCorrect(false);
      setSelectedAnswer(null);
      setSequence([]);
      setFillSlots([]);
    });

    return () => cancelAnimationFrame(frame);
  }, [level?.id, blanksCount]);

  // ── Derived ─────────────────────────────────────────────────
  const isLastLevel = world ? levelNum >= world.levels.length : false;

  const canSubmit = useMemo(() => {
    if (!level || submitted) return false;
    switch (level.type) {
      case 'choice':
        return selectedAnswer !== null;
      case 'fill':
        return fillSlots.length === blanksCount;
      case 'order':
        return level.shuffledLines ? sequence.length === level.shuffledLines.length : false;
      case 'judge':
        return selectedAnswer !== null;
      case 'code':
        return false; // Code type has its own submit button in CodeRunner
      default:
        return false;
    }
  }, [blanksCount, level, submitted, selectedAnswer, fillSlots, sequence]);

  // ── Fill: split code into segments around ___ ───────────────
  const codeParts = useMemo(() => {
    if (!level || level.type !== 'fill' || !level.code) return [];
    return level.code.split('___');
  }, [level]);

  // Lines available for ordering (not yet placed)
  const remainingLines = useMemo(() => {
    if (!level || level.type !== 'order') return [];
    return (level.shuffledLines || [])
      .map((line, index) => ({ line, index }))
      .filter((item) => !sequence.includes(item.index));
  }, [level, sequence]);

  // ── Handlers ────────────────────────────────────────────────

  const handlePillClick = useCallback(
    (optionIndex: number) => {
      if (fillSlots.length >= blanksCount || fillSlots.includes(optionIndex)) return;
      setFillSlots((prev) => [...prev, optionIndex]);
    },
    [blanksCount, fillSlots],
  );

  const handleSlotClick = useCallback(
    (index: number) => {
      setFillSlots((prev) => prev.filter((_, i) => i !== index));
    },
    [],
  );

  const handleOrderPlace = useCallback(
    (lineIndex: number) => {
      setSequence((prev) => (prev.includes(lineIndex) ? prev : [...prev, lineIndex]));
    },
    [],
  );

  const handleOrderRemove = useCallback(
    (index: number) => {
      setSequence((prev) => prev.filter((_, i) => i !== index));
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    if (!level) return;

    let correct = false;
    switch (level.type) {
      case 'choice':
        correct = selectedAnswer === level.solution;
        break;
      case 'fill': {
        const filled = fillSlots.map((optionIndex) => level.blanks?.[optionIndex] ?? '').join('');
        correct = filled === level.solution;
        break;
      }
      case 'order': {
        const solution = level.solution as string[];
        const orderedLines = sequence.map((lineIndex) => level.shuffledLines?.[lineIndex] ?? '');
        correct =
          orderedLines.length === solution.length &&
          orderedLines.every((item, i) => item === solution[i]);
        break;
      }
      case 'judge':
        correct = selectedAnswer === level.judgeAnswer;
        break;
    }

    if (correct) {
      const xpAmount = level.type === 'fill' || level.type === 'order' ? 75 : 50;
      addXp(xpAmount);
      incrementCombo();
      completeLevel(worldId, level.id, 100);
      setIsCorrect(true);
    } else {
      resetCombo();
      setIsCorrect(false);
    }
    setSubmitted(true);
  }, [addXp, completeLevel, fillSlots, incrementCombo, level, resetCombo, selectedAnswer, sequence, worldId]);

  const handleRetry = useCallback(() => {
    setSubmitted(false);
    setIsCorrect(false);
  }, []);

  const handleNext = useCallback(() => {
    if (!world) return;
    if (isLastLevel) {
      navigate(`/worlds/${worldId}/boss`);
    } else {
      navigate(`/worlds/${worldId}/level/${levelNum + 1}`);
    }
  }, [world, isLastLevel, worldId, levelNum, navigate]);

  // ── Guard: not found ────────────────────────────────────────

  if (!world) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a1a]">
        <div className="text-center font-mono">
          <p className="text-4xl text-red-500 mb-4">⚠</p>
          <p className="text-xl text-gray-400">世界未找到</p>
          <Link
            to="/worlds"
            className="mt-6 inline-block text-sm text-[#00ff9f] hover:underline"
          >
            ← 返回世界地图
          </Link>
        </div>
      </div>
    );
  }

  if (!level) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a1a]">
        <div className="text-center font-mono">
          <p className="text-4xl text-red-500 mb-4">⚠</p>
          <p className="text-xl text-gray-400">关卡未找到</p>
          <Link
            to={`/worlds/${worldId}`}
            className="mt-6 inline-block text-sm text-[#00ff9f] hover:underline"
          >
            ← 返回 {world.name}
          </Link>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────

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

      {/* Grid background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 255, 159, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 159, 0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#00ff9f]/20 px-4 sm:px-8 h-14">
        <Link
          to={`/worlds/${worldId}`}
          className="flex items-center gap-1 font-mono text-sm text-gray-400 hover:text-[#00ff9f] transition-colors"
        >
          <span className="text-lg">←</span>
          <span>返回</span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-gray-500">
            第 <span className="text-[#00ff9f]">{levelNum}</span>
            <span className="text-gray-600">/{world.levels.length}</span> 关
          </span>
          <div className="hidden sm:block">
            <ComboIndicator combo={playerCombo} />
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-2xl px-4 pt-10 pb-24">
        {/* Level title */}
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-mono text-gray-600 uppercase tracking-widest border border-gray-800 px-2 py-0.5 rounded">
            {typeLabel(level.type)}
          </span>
        </div>
        <h1 className="font-mono text-2xl font-bold text-white mb-8">
          {level.title}
        </h1>

        {level.lesson && (
          <div className="mb-6 rounded-lg border border-[#00ff9f]/20 bg-[#00ff9f]/5 p-4">
            <div className="mb-2 font-mono text-xs font-bold tracking-widest text-[#00ff9f]">
              先学一下
            </div>
            <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
              {level.lesson}
            </p>
          </div>
        )}

        {/* Question */}
        <div className="mb-8">
          <p className="text-xl font-bold text-gray-100 leading-relaxed whitespace-pre-wrap">
            {level.question}
          </p>
        </div>

        {/* Code block for judge / choice-with-code */}
        {level.type === 'judge' && level.code && (
          <div className="mb-8">
            <CodeBlock code={level.code} title="main.rs" />
          </div>
        )}

        {/* ── Answer area ──────────────────────────────────── */}

        {/* Choice */}
        {level.type === 'choice' && level.options && (
          <div className="grid gap-3 mb-8">
            {level.options.map((opt) => {
              const isSelected = selectedAnswer === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    if (!submitted) setSelectedAnswer(opt.id);
                  }}
                  disabled={submitted}
                  className={`w-full text-left px-5 py-4 rounded-lg font-mono text-sm transition-all duration-200 ${
                    isSelected
                      ? 'border-2 border-[#00ff9f] bg-[#00ff9f]/10 shadow-[0_0_15px_rgba(0,255,159,0.2)]'
                      : 'border border-gray-700/60 bg-white/[0.03] hover:border-[#00ff9f]/40 hover:shadow-[0_0_10px_rgba(0,255,159,0.08)]'
                  } ${submitted ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? 'border-[#00ff9f] bg-[#00ff9f] text-black'
                          : 'border-gray-600 text-gray-600'
                      }`}
                    >
                      {opt.id.toUpperCase()}
                    </span>
                    <span className="pt-0.5 text-gray-200">{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Fill */}
        {level.type === 'fill' && (
          <div className="mb-8">
            {/* Interactive code block */}
            <div className="w-full rounded-md overflow-hidden border border-cyan-800/40 bg-[#0d1117]">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-cyan-800/30">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                <span className="ml-2 text-xs text-gray-500 font-mono">main.rs</span>
              </div>
              <div className="p-4 font-mono text-sm leading-relaxed text-[#00ff9f]/90 whitespace-pre-wrap">
                {codeParts.length > 0 ? (
                  codeParts.map((part, i) => (
                    <span key={i}>
                      <span>{part}</span>
                      {i < codeParts.length - 1 && (
                        <span
                          onClick={() => !submitted && handleSlotClick(i)}
                          className={`inline-block min-w-[3rem] px-1.5 mx-0.5 rounded text-center border border-dashed transition-all cursor-pointer ${
                            fillSlots[i] !== undefined
                              ? 'border-[#00ff9f]/60 bg-[#00ff9f]/20 text-[#00ff9f]'
                              : 'border-gray-600 bg-gray-900 text-gray-500 hover:border-gray-400'
                          }`}
                        >
                          {fillSlots[i] !== undefined ? level.blanks?.[fillSlots[i]] : '___'}
                        </span>
                      )}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">（无需填写的代码）</span>
                )}
              </div>
            </div>

            {/* Pill options */}
            {level.blanks && level.blanks.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-mono text-gray-500 mb-2 text-center">
                  点击选项填入空白，点击已填空白移除
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {level.blanks.map((pill, i) => {
                    const isUsed = fillSlots.includes(i);
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          if (!submitted && !isUsed) handlePillClick(i);
                        }}
                        disabled={submitted || isUsed}
                        className={`px-4 py-2 rounded font-mono text-sm border transition-all ${
                          isUsed
                            ? 'border-gray-700 bg-gray-800 text-gray-600 cursor-not-allowed line-through'
                            : 'border-cyan-700/50 bg-cyan-900/20 text-cyan-300 hover:bg-cyan-900/40 hover:border-cyan-500 cursor-pointer'
                        } ${submitted ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        {pill}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order */}
        {level.type === 'order' && level.shuffledLines && (
          <div className="mb-8">
            {/* Remaining lines */}
            <div className="mb-6">
              <p className="text-xs font-mono text-gray-500 mb-2">
                点击代码行添加到答案区
              </p>
              <div className="flex flex-wrap gap-2">
                {remainingLines.length === 0 && (
                  <span className="text-sm text-gray-600 italic font-mono">
                    所有代码行已添加
                  </span>
                )}
                {remainingLines.map((item) => (
                  <button
                    key={`avail-${item.index}`}
                    onClick={() => !submitted && handleOrderPlace(item.index)}
                    disabled={submitted}
                    className={`px-4 py-2 rounded font-mono text-xs border border-gray-700/60 bg-gray-900/50 text-gray-300 hover:border-[#00ff9f]/40 hover:bg-[#00ff9f]/5 transition-all ${
                      submitted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <span className="text-gray-600 mr-1">+</span>
                    {item.line}
                  </button>
                ))}
              </div>
            </div>

            {/* Placed sequence */}
            <div>
              <p className="text-xs font-mono text-gray-500 mb-2">
                你的排序 {sequence.length > 0 && <span className="text-gray-600">（点击移除）</span>}
              </p>
              {sequence.length === 0 ? (
                <div className="border border-dashed border-gray-700/50 rounded-lg p-6 text-center text-sm text-gray-600 font-mono">
                  点击上方代码行来构建排序
                </div>
              ) : (
                <div className="space-y-1">
                  {sequence.map((lineIndex, i) => (
                    <div
                      key={`seq-${i}`}
                      onClick={() => !submitted && handleOrderRemove(i)}
                      className={`flex items-center gap-2 px-4 py-2 rounded border border-[#00ff9f]/30 bg-[#00ff9f]/5 text-sm font-mono text-[#00ff9f]/90 transition-all ${
                        submitted ? 'cursor-default' : 'cursor-pointer hover:border-red-500/50 hover:bg-red-900/10'
                      }`}
                    >
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00ff9f]/20 text-[#00ff9f] flex items-center justify-center text-[10px] font-bold">
                        {i + 1}
                      </span>
                      <code className="flex-1">{level.shuffledLines?.[lineIndex]}</code>
                      {!submitted && (
                        <span className="text-xs text-gray-600 hover:text-red-400 transition-colors">
                          ✕
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Judge */}
        {level.type === 'judge' && (
          <div className="mb-8">
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => !submitted && setSelectedAnswer(true)}
                disabled={submitted}
                className={`flex-1 max-w-[200px] px-8 py-6 rounded-lg font-mono text-lg font-bold border-2 transition-all duration-200 ${
                  selectedAnswer === true
                    ? 'border-[#00ff9f] bg-[#00ff9f]/10 text-[#00ff9f] shadow-[0_0_20px_rgba(0,255,159,0.2)]'
                    : 'border-gray-700/60 bg-white/[0.03] text-gray-400 hover:border-[#00ff9f]/40 hover:text-gray-200'
                } ${submitted ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="text-2xl block mb-1">✓</span>
                正确
              </button>
              <button
                onClick={() => !submitted && setSelectedAnswer(false)}
                disabled={submitted}
                className={`flex-1 max-w-[200px] px-8 py-6 rounded-lg font-mono text-lg font-bold border-2 transition-all duration-200 ${
                  selectedAnswer === false
                    ? 'border-red-500 bg-red-500/10 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                    : 'border-gray-700/60 bg-white/[0.03] text-gray-400 hover:border-red-500/40 hover:text-gray-200'
                } ${submitted ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="text-2xl block mb-1">✗</span>
                错误
              </button>
            </div>
          </div>
        )}

        {/* Code challenge */}
        {level.type === 'code' && level.codeTemplate && (
          <div className="mb-8">
            <CodeRunner
              task={level.codeTask ?? level.question}
              template={level.codeTemplate}
              testCases={level.codeTestCases}
              hints={level.codeHints}
              onPass={() => {
                if (!submitted) {
                  addXp(75);
                  incrementCombo();
                  completeLevel(worldId, level.id, 100);
                  setSubmitted(true);
                  setIsCorrect(true);
                }
              }}
              onFail={() => {
                if (!submitted) {
                  resetCombo();
                }
              }}
            />
          </div>
        )}

        {/* ── Submit button (hidden for code type) ───────────── */}
        {level.type !== 'code' && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`font-mono font-bold px-8 py-3 rounded transition-all duration-200 ${
              canSubmit
                ? 'bg-[#00ff9f] text-black hover:shadow-[0_0_20px_#00ff9f] cursor-pointer'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            提交答案
          </button>
        </div>
        )}

        {/* ── Combo (mobile) ────────────────────────────────── */}
        {playerCombo > 0 && (
          <div className="flex justify-center mt-6 sm:hidden">
            <ComboIndicator combo={playerCombo} />
          </div>
        )}
      </div>

      {/* ── Feedback modal ─────────────────────────────────── */}
      {submitted && level.type !== 'code' && (
        <Feedback
          type={isCorrect ? 'correct' : 'wrong'}
          message={isCorrect ? '回答正确！' : '回答错误'}
          explanation={
            isCorrect
              ? level.explanation
              : `${level.explanation}${level.hint ? `\n\n提示：${level.hint}` : ''}`
          }
          onNext={isCorrect ? handleNext : undefined}
          onRetry={!isCorrect ? handleRetry : undefined}
        />
      )}

      {/* Code type success feedback */}
      {submitted && isCorrect && level.type === 'code' && (
        <Feedback
          type="correct"
          message="代码通过！"
          explanation={level.explanation}
          onNext={handleNext}
        />
      )}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────

function typeLabel(type: LevelType['type']): string {
  switch (type) {
    case 'choice':
      return '选择题';
    case 'fill':
      return '填空题';
    case 'order':
      return '排序题';
    case 'judge':
      return '判断题';
    case 'code':
      return '编程题';
  }
}
