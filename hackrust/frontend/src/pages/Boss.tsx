import { useMemo, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getWorld } from '../data/worlds';
import type { World } from '../types';
import { calcBossHP, calcDamage } from '../game/damageCalc';
import { useGameStore, selectWorldProgress } from '../store/gameStore';
import { CodeBlock, Feedback, HPBar, ComboIndicator } from '../components';
import { compileRust } from '../lib/api';

type FeedbackState = {
  type: 'correct' | 'wrong' | 'info';
  message: string;
  explanation?: string;
  defeated?: boolean;
};

export function Boss() {
  const { id } = useParams<{ id: string }>();
  const worldId = id || '';
  const world = useMemo(() => getWorld(worldId), [worldId]);
  const worldProgress = useGameStore(selectWorldProgress(worldId));

  const allLevelsCompleted = world
    ? world.levels.every((level) => worldProgress?.levels[level.id]?.completed)
    : false;
  const bossDefeated = worldProgress?.bossDefeated ?? false;

  if (!world) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a1a]">
        <div className="text-center font-mono">
          <p className="mb-4 text-4xl text-red-500">⚠</p>
          <p className="text-xl text-gray-400">世界未找到</p>
          <Link to="/worlds" className="mt-6 inline-block text-sm text-[#00ff9f] hover:underline">
            ← 返回世界地图
          </Link>
        </div>
      </div>
    );
  }

  if (!allLevelsCompleted && !bossDefeated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a1a] px-4 text-gray-200">
        <div className="max-w-md rounded-lg border border-gray-800 bg-cyber-dark/50 p-8 text-center font-mono">
          <div className="mb-4 text-5xl text-gray-700">[LOCKED]</div>
          <h1 className="text-xl font-bold text-gray-300">Boss 战尚未解锁</h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            先完成 {world.name} 的全部关卡，再回来挑战 {world.boss.title}。
          </p>
          <Link
            to={`/worlds/${world.id}`}
            className="mt-6 inline-block rounded border border-cyber-glow/40 px-5 py-2 text-sm text-cyber-glow transition-colors hover:border-cyber-glow"
          >
            ← 返回关卡树
          </Link>
        </div>
      </div>
    );
  }

  return <BossBattle key={world.id} world={world} bossDefeated={bossDefeated} />;
}

function BossBattle({
  world,
  bossDefeated,
}: {
  world: World;
  bossDefeated: boolean;
}) {
  const navigate = useNavigate();
  const player = useGameStore((s) => s.player);
  const addXp = useGameStore((s) => s.addXp);
  const incrementCombo = useGameStore((s) => s.incrementCombo);
  const resetCombo = useGameStore((s) => s.resetCombo);
  const takeDamage = useGameStore((s) => s.takeDamage);
  const heal = useGameStore((s) => s.heal);
  const defeatBoss = useGameStore((s) => s.defeatBoss);

  const maxBossHp = useMemo(() => calcBossHP(world.phase), [world.phase]);
  const [code, setCode] = useState(() => world.boss.template);
  const [bossHp, setBossHp] = useState(maxBossHp);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [usedOffline, setUsedOffline] = useState(false);
  const [, setFailedAttempts] = useState(0);
  const [visibleHints, setVisibleHints] = useState(0);

  const resetBattle = useCallback(() => {
    setFeedback(null);
    setBossHp(maxBossHp);
    setFailedAttempts(0);
    setVisibleHints(0);
    heal(player.maxHp);
  }, [heal, maxBossHp, player.maxHp]);

  const [isCompiling, setIsCompiling] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (isCompiling) return;
    
    setIsCompiling(true);
    setFeedback({
      type: 'info',
      message: '编译中...',
      explanation: '正在验证你的代码...',
    });

    try {
      const expectedOutput = world.boss.validation.testCases?.[0]?.expected;

      const result = await compileRust(code, expectedOutput);
      setUsedOffline(result.compilationSource === 'wasm');

      if (result.compilationErrors) {
        const nextPlayerHp = Math.max(0, player.hp - 10);
        resetCombo();
        takeDamage(10);
        setFailedAttempts((prev) => {
          const next = prev + 1;
          if (next >= 2 && world.boss.hints) {
            setVisibleHints((h) => Math.min(h + 1, world.boss.hints!.length));
          }
          return next;
        });
        setFeedback({
          type: 'wrong',
          message: nextPlayerHp === 0 ? '系统过载' : '编译错误',
          explanation:
            nextPlayerHp === 0
              ? `${result.compilationErrors}\nHP 已归零。重置战斗后继续尝试。`
              : result.compilationErrors,
        });
        return;
      }

      if (result.runtimeErrors) {
        const nextPlayerHp = Math.max(0, player.hp - 10);
        resetCombo();
        takeDamage(10);
        setFailedAttempts((prev) => {
          const next = prev + 1;
          if (next >= 2 && world.boss.hints) {
            setVisibleHints((h) => Math.min(h + 1, world.boss.hints!.length));
          }
          return next;
        });
        setFeedback({
          type: 'wrong',
          message: nextPlayerHp === 0 ? '系统过载' : '运行时错误',
          explanation:
            nextPlayerHp === 0
              ? `${result.runtimeErrors}\nHP 已归零。重置战斗后继续尝试。`
              : result.runtimeErrors,
        });
        return;
      }

      if (result.matchExpected === false) {
        const nextPlayerHp = Math.max(0, player.hp - 10);
        resetCombo();
        takeDamage(10);
        setFailedAttempts((prev) => {
          const next = prev + 1;
          if (next >= 2 && world.boss.hints) {
            setVisibleHints((h) => Math.min(h + 1, world.boss.hints!.length));
          }
          return next;
        });
        setFeedback({
          type: 'wrong',
          message: nextPlayerHp === 0 ? '系统过载' : '输出不匹配',
          explanation:
            nextPlayerHp === 0
              ? `期望输出:\n${expectedOutput}\n\n实际输出:\n${result.output}\n\nHP 已归零。重置战斗后继续尝试。`
              : `期望输出:\n${expectedOutput}\n\n实际输出:\n${result.output}`,
        });
        return;
      }

      const damage = calcDamage(player.combo);
      const nextHp = Math.max(0, bossHp - damage);
      setBossHp(nextHp);
      incrementCombo();

      if (nextHp === 0) {
        const bossReward = 200;
        const comboAfterHit = player.combo + 1;
        const multiplier = comboAfterHit >= 10 ? 2 : comboAfterHit >= 5 ? 1.5 : comboAfterHit >= 3 ? 1.2 : 1;
        const actualXp = Math.floor(bossReward * multiplier);
        addXp(bossReward);
        defeatBoss(world.id);
        setFeedback({
          type: 'correct',
          message: 'Boss 已击败！',
          explanation: `验证通过，造成 ${damage} 点伤害。获得 ${actualXp} XP。`,
          defeated: true,
        });
        return;
      }

      let explanation = '';
      if (result.output) {
        explanation = `程序输出:\n${result.output}`;
      }
      if (result.warnings && result.warnings.length > 0) {
        if (explanation) explanation += '\n\n';
        explanation += `警告:\n${result.warnings.join('\n')}`;
      }
      setFeedback({
        type: 'info',
        message: `命中 Boss，造成 ${damage} 点伤害`,
        explanation: explanation || undefined,
      });
    } catch (error) {
      setFeedback({
        type: 'wrong',
        message: '验证失败',
        explanation: `代码验证出错: ${error instanceof Error ? error.message : '未知错误'}`,
      });
    } finally {
      setIsCompiling(false);
    }
  }, [addXp, bossHp, code, defeatBoss, incrementCombo, isCompiling, player.combo, player.hp, resetCombo, setUsedOffline, takeDamage, world]);

  return (
    <div className="relative min-h-screen bg-[#0a0a1a] text-gray-200">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 159, 0.15) 2px, rgba(0, 255, 159, 0.15) 4px)',
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 255, 159, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 159, 0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 flex h-14 items-center justify-between border-b border-cyber-red/20 px-4 sm:px-8">
        <Link
          to={`/worlds/${world.id}`}
          className="flex items-center gap-1 font-mono text-sm text-gray-400 transition-colors hover:text-cyber-glow"
        >
          <span className="text-lg">←</span>
          <span>返回</span>
        </Link>
        <ComboIndicator combo={player.combo} />
      </div>

      <main className="relative z-10 mx-auto grid max-w-5xl gap-6 px-4 py-8 lg:grid-cols-[1fr_22rem]">
        <section>
          <div className="mb-6">
            <span className="rounded bg-cyber-red/20 px-2 py-1 font-mono text-xs font-bold text-cyber-red">
              BOSS // Phase {world.phase}
            </span>
            <h1 className="neon-red mt-3 font-mono text-3xl font-black tracking-wider text-cyber-red">
              {world.boss.title}
            </h1>
            <p className="mt-3 whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-400">
              {world.boss.description}
            </p>
          </div>

          {usedOffline && (
            <div className="mb-4 rounded border border-yellow-600/40 bg-yellow-900/20 px-4 py-3 font-mono text-xs text-yellow-300">
              ⚡ 离线模式 · 结果基于 WASM 解释器，可能与真实 rustc 有差异
            </div>
          )}

          <div className="overflow-hidden rounded-lg border border-cyber-blue/40 bg-[#0d1117]">
            <div className="flex items-center justify-between border-b border-cyber-blue/30 bg-cyber-dark/80 px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <span className="font-mono text-xs text-gray-500">main.rs</span>
              <span className="font-mono text-xs text-cyber-glow/60">rust</span>
            </div>
            <textarea
              value={code}
              onChange={(event) => setCode(event.target.value)}
              spellCheck={false}
              className="min-h-[24rem] w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed text-cyber-glow/90 outline-none placeholder:text-gray-700"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleSubmit}
              disabled={bossDefeated || isCompiling}
              className={`rounded px-8 py-3 font-mono font-bold transition-all ${
                bossDefeated || isCompiling
                  ? 'cursor-not-allowed bg-gray-800 text-gray-600'
                  : 'cursor-pointer bg-cyber-red text-white hover:shadow-[0_0_20px_rgba(233,69,96,0.5)]'
              }`}
            >
              {bossDefeated ? '已击败' : isCompiling ? '编译中...' : '执行攻击'}
            </button>
            <button
              onClick={() => setCode(world.boss.template)}
              className="rounded border border-gray-700 px-5 py-3 font-mono text-sm text-gray-300 transition-colors hover:border-cyber-glow/50"
            >
              重置代码
            </button>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-lg border border-cyber-red/30 bg-cyber-red/5 p-5">
            <HPBar current={bossDefeated ? 0 : bossHp} max={maxBossHp} label="BOSS HP" />
            <div className="mt-5 border-t border-cyber-red/20 pt-4 font-mono text-xs text-gray-500">
              <div className="flex justify-between">
                <span>你的 HP</span>
                <span className="text-cyber-glow">
                  {player.hp}/{player.maxHp}
                </span>
              </div>
              <div className="mt-2 flex justify-between">
                <span>本次伤害</span>
                <span className="text-cyber-red">{calcDamage(player.combo)}</span>
              </div>
            </div>
          </div>

          {world.boss.steps && world.boss.steps.length > 0 && (
            <div className="rounded-lg border border-cyber-blue/30 bg-cyber-dark/40 p-5">
              <h2 className="font-mono text-sm font-bold text-cyber-glow">任务步骤</h2>
              <ol className="mt-3 space-y-2 font-mono text-xs text-gray-400 list-decimal list-inside">
                {world.boss.steps.map((step, i) => (
                  <li key={i} className="leading-relaxed">{step}</li>
                ))}
              </ol>
            </div>
          )}

          {world.boss.hints && world.boss.hints.length > 0 && (
            <div className="rounded-lg border border-yellow-600/30 bg-yellow-900/10 p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-sm font-bold text-yellow-400">提示 Hints</h2>
                {visibleHints < world.boss.hints.length && (
                  <button
                    onClick={() => setVisibleHints((h) => Math.min(h + 1, world.boss.hints!.length))}
                    className="rounded border border-yellow-600/40 px-3 py-1 font-mono text-xs text-yellow-400 transition-colors hover:bg-yellow-900/30 cursor-pointer"
                  >
                    {visibleHints === 0 ? '显示提示' : '下一个提示'}
                  </button>
                )}
              </div>
              <div className="mt-3 space-y-3 font-mono text-xs text-gray-400">
                {world.boss.hints.slice(0, visibleHints).map((hint, i) => (
                  <div key={i} className="rounded bg-yellow-900/20 p-3 text-yellow-200/80 whitespace-pre-wrap">
                    <span className="text-yellow-500/60">提示 {i + 1}: </span>{hint}
                  </div>
                ))}
                {visibleHints === 0 && (
                  <p className="text-gray-600 text-xs">答错 2 次后自动显示提示，或点击按钮提前查看</p>
                )}
              </div>
            </div>
          )}

          <div className="rounded-lg border border-cyber-blue/30 bg-cyber-dark/40 p-5">
            <h2 className="font-mono text-sm font-bold text-cyber-glow">验证规则</h2>
            <div className="mt-3 space-y-3 font-mono text-xs text-gray-400">
              <div>
                <div className="mb-1 text-gray-600">必须包含</div>
                <div className="flex flex-wrap gap-2">
                  {world.boss.validation.required.map((item) => (
                    <code key={item} className="rounded bg-cyber-glow/10 px-2 py-1 text-cyber-glow">
                      {item}
                    </code>
                  ))}
                </div>
              </div>
              {world.boss.validation.forbidden && world.boss.validation.forbidden.length > 0 && (
                <div>
                  <div className="mb-1 text-gray-600">禁止出现</div>
                  <div className="flex flex-wrap gap-2">
                    {world.boss.validation.forbidden.map((item) => (
                      <code key={item} className="rounded bg-cyber-red/10 px-2 py-1 text-cyber-red">
                        {item}
                      </code>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {world.boss.validation.testCases?.[0] && (
            <CodeBlock code={world.boss.validation.testCases[0].expected} title="expected output" />
          )}
        </aside>
      </main>

      {feedback && (
        <Feedback
          type={feedback.type}
          message={feedback.message}
          explanation={feedback.explanation}
          onRetry={
            feedback.type === 'wrong'
              ? player.hp === 0
                ? resetBattle
                : () => setFeedback(null)
              : undefined
          }
          onNext={
            feedback.defeated
              ? () => navigate(`/worlds/${world.id}`)
              : () => setFeedback(null)
          }
        />
      )}
    </div>
  );
}
