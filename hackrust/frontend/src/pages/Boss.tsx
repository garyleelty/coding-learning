import { useMemo, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getWorld } from '../data/worlds';
import { calcBossHP, calcDamage } from '../game/damageCalc';
import { checkSyntax, validateCode } from '../game/codeValidator';
import { useGameStore, selectWorldProgress } from '../store/gameStore';
import { CodeBlock, Feedback, HPBar, ComboIndicator } from '../components';

type FeedbackState = {
  type: 'correct' | 'wrong' | 'info';
  message: string;
  explanation?: string;
  defeated?: boolean;
};

export function Boss() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const worldId = id || '';
  const world = useMemo(() => getWorld(worldId), [worldId]);
  const gameStore = useGameStore();
  const worldProgress = useGameStore(selectWorldProgress(worldId));

  const maxBossHp = useMemo(() => (world ? calcBossHP(world.phase) : 0), [world]);
  const [code, setCode] = useState(() => world?.boss.template ?? '');
  const [bossHp, setBossHp] = useState(maxBossHp);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const allLevelsCompleted = world
    ? world.levels.every((level) => worldProgress?.levels[level.id]?.completed)
    : false;
  const bossDefeated = worldProgress?.bossDefeated ?? false;

  const resetBattle = useCallback(() => {
    setFeedback(null);
    setBossHp(maxBossHp);
    gameStore.heal(gameStore.player.maxHp);
  }, [gameStore, maxBossHp]);

  const handleSubmit = useCallback(() => {
    if (!world) return;

    const syntax = checkSyntax(code);
    if (!syntax.success) {
      const nextPlayerHp = Math.max(0, gameStore.player.hp - 10);
      gameStore.resetCombo();
      gameStore.takeDamage(10);
      setFeedback({
        type: 'wrong',
        message: nextPlayerHp === 0 ? '系统过载' : syntax.message,
        explanation:
          nextPlayerHp === 0
            ? `${syntax.details?.join('\n') ?? syntax.message}\nHP 已归零。重置战斗后继续尝试。`
            : syntax.details?.join('\n'),
      });
      return;
    }

    const validation = validateCode(code, world.boss.validation);
    if (!validation.success) {
      const nextPlayerHp = Math.max(0, gameStore.player.hp - 10);
      gameStore.resetCombo();
      gameStore.takeDamage(10);
      setFeedback({
        type: 'wrong',
        message: nextPlayerHp === 0 ? '系统过载' : validation.message,
        explanation:
          nextPlayerHp === 0
            ? `${validation.details?.join('\n') ?? validation.message}\nHP 已归零。重置战斗后继续尝试。`
            : validation.details?.join('\n'),
      });
      return;
    }

    const damage = calcDamage(gameStore.player.combo);
    const nextHp = Math.max(0, bossHp - damage);
    setBossHp(nextHp);
    gameStore.incrementCombo();

    if (nextHp === 0) {
      gameStore.addXp(200);
      gameStore.defeatBoss(world.id);
      setFeedback({
        type: 'correct',
        message: 'Boss 已击败！',
        explanation: `验证通过，造成 ${damage} 点伤害。获得 200 XP。`,
        defeated: true,
      });
      return;
    }

    setFeedback({
      type: 'info',
      message: `命中 Boss，造成 ${damage} 点伤害`,
      explanation: validation.details?.join('\n'),
    });
  }, [bossHp, code, gameStore, world]);

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
        <ComboIndicator combo={gameStore.player.combo} />
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
              disabled={bossDefeated}
              className={`rounded px-8 py-3 font-mono font-bold transition-all ${
                bossDefeated
                  ? 'cursor-not-allowed bg-gray-800 text-gray-600'
                  : 'cursor-pointer bg-cyber-red text-white hover:shadow-[0_0_20px_rgba(233,69,96,0.5)]'
              }`}
            >
              {bossDefeated ? '已击败' : '执行攻击'}
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
                  {gameStore.player.hp}/{gameStore.player.maxHp}
                </span>
              </div>
              <div className="mt-2 flex justify-between">
                <span>本次伤害</span>
                <span className="text-cyber-red">{calcDamage(gameStore.player.combo)}</span>
              </div>
            </div>
          </div>

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
              {world.boss.validation.forbidden && (
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
              ? gameStore.player.hp === 0
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
