import { useNavigate, useParams } from 'react-router-dom';
import { worlds, getWorld } from '../data/worlds';
import type { World } from '../types';
import { useGameStore, selectWorldProgress } from '../store/gameStore';

// ── Level type icons ──────────────────────────────────────────────────
const LEVEL_TYPE_ICONS: Record<string, string> = {
  choice: '?',
  fill: '_',
  order: '\u2195',
  judge: '\u2713',
};

// ── Phase label helper ────────────────────────────────────────────────
function getPhaseLabel(phase: number): string {
  switch (phase) {
    case 0:
      return '\u5165\u95E8'; // 入门
    case 1:
      return '\u57FA\u7840'; // 基础
    case 2:
      return '\u8FDB\u9636'; // 进阶
    case 3:
      return '\u9AD8\u7EA7'; // 高级
    default:
      return `Phase ${phase}`;
  }
}

// ── World list view ───────────────────────────────────────────────────
function WorldList({ navigate }: { navigate: (path: string) => void }) {
  const player = useGameStore((s) => s.player);
  const allWorldProgress = useGameStore((s) => s.worlds);

  const phases = Array.from(new Set(worlds.map((w) => w.phase))).sort((a, b) => a - b);

  const getProgress = (world: World) => {
    const wp = allWorldProgress[world.id];
    const total = world.levels.length;
    const completed = wp
      ? Object.values(wp.levels).filter((l) => l.completed).length
      : 0;
    return { completed, total };
  };

  const isUnlocked = (world: World) => player.level >= world.phase + 1;

  return (
    <div>
      {/* ── Title section ──────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="neon-text font-mono text-3xl font-bold tracking-widest">
          {'\u4E16\u754C\u9009\u62E9'}
        </h1>
        <div className="mt-2 h-0.5 w-32 rounded-full bg-gradient-to-r from-transparent via-[#00ff9f] to-transparent opacity-60" />
        <p className="mt-3 font-mono text-sm text-gray-500">
          {'> '}选择目标，开始你的黑客之旅
        </p>
      </div>

      {/* ── Empty state ─────────────────────────────────────────────── */}
      {worlds.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="font-mono text-4xl text-gray-800">[ ]</div>
          <p className="mt-4 font-mono text-sm text-gray-600">
            没有找到世界数据
          </p>
        </div>
      )}

      {/* ── Worlds grouped by phase ────────────────────────────────── */}
      {phases.length > 0 &&
        phases.map((phase) => {
          const phaseWorlds = worlds.filter((w) => w.phase === phase);
          if (phaseWorlds.length === 0) return null;
          return (
            <div key={phase} className="mb-10">
              {/* Phase header */}
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded bg-cyber-purple/60 px-2 py-0.5 text-xs font-bold text-cyber-glow font-mono">
                  Phase {phase}
                </span>
                <span className="text-sm text-gray-500 font-mono">
                  {getPhaseLabel(phase)}
                </span>
                <div className="flex-1 border-t border-gray-800" />
              </div>

              {/* World cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {phaseWorlds.map((world) => {
                  const unlocked = isUnlocked(world);
                  const { completed, total } = getProgress(world);

                  return (
                    <div
                      key={world.id}
                      onClick={() => unlocked && navigate(`/worlds/${world.id}`)}
                      className={`
                        group cursor-pointer rounded-lg border p-5 transition-all duration-300 backdrop-blur-sm
                        ${
                          unlocked
                            ? 'border-cyber-dark bg-cyber-dark/60 hover:border-cyber-glow/40 hover:shadow-[0_0_20px_rgba(0,255,159,0.1)]'
                            : 'border-gray-800/40 bg-cyber-dark/30 opacity-50 cursor-not-allowed'
                        }
                      `}
                    >
                      {/* Top row: phase badge + lock indicator */}
                      <div className="mb-3 flex items-center justify-between">
                        <span className="rounded bg-cyber-blue/60 px-2 py-0.5 text-[0.65rem] font-bold text-gray-400 font-mono">
                          Phase {world.phase}
                        </span>
                        {!unlocked && (
                          <span className="text-[0.65rem] font-mono text-gray-600 tracking-wider">
                            LOCKED
                          </span>
                        )}
                      </div>

                      {/* World name */}
                      <h3
                        className={`font-mono text-lg font-bold ${
                          unlocked ? 'text-gray-100' : 'text-gray-500'
                        }`}
                      >
                        {world.name}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 font-mono text-sm leading-relaxed text-gray-500 line-clamp-2">
                        {world.description}
                      </p>

                      {/* Progress bar */}
                      <div className="mt-4 flex items-center gap-2 text-xs font-mono text-gray-600">
                        <div className="flex-1 h-1 rounded-full bg-gray-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-cyber-glow transition-all duration-500"
                            style={{
                              width: `${
                                total > 0 ? (completed / total) * 100 : 0
                              }%`,
                            }}
                          />
                        </div>
                        <span
                          className={
                            unlocked ? 'text-cyber-glow' : 'text-gray-600'
                          }
                        >
                          {completed}/{total}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
}

// ── World detail / level tree view ────────────────────────────────────
function WorldDetail({
  worldId,
  navigate,
}: {
  worldId: string;
  navigate: (path: string) => void;
}) {
  const world = getWorld(worldId);
  const player = useGameStore((s) => s.player);
  const worldProgress = useGameStore(selectWorldProgress(worldId));

  // ── Error state: unknown world ─────────────────────────────────────
  if (!world) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="font-mono text-6xl text-gray-800">[!]</div>
        <p className="mt-4 font-mono text-sm text-gray-500">
          未知世界:{' '}
          <span className="text-cyber-red font-mono">{worldId}</span>
        </p>
        <button
          onClick={() => navigate('/worlds')}
          className="mt-6 rounded border border-cyber-glow/40 px-6 py-2 font-mono text-sm text-cyber-glow transition-all hover:border-cyber-glow hover:shadow-[0_0_15px_rgba(0,255,159,0.2)]"
        >
          {'< '}返回世界列表
        </button>
      </div>
    );
  }

  const worldUnlocked = player.level >= world.phase + 1;
  const levels = world.levels;

  // Build node metadata
  const levelNodes = levels.map((level, index) => {
    const progress = worldProgress?.levels[level.id];
    const completed = progress?.completed ?? false;
    const needsReview = progress?.needsReview ?? false;
    return { level, index, completed, needsReview };
  });

  // Find first incomplete level index
  let firstIncomplete = -1;
  for (let i = 0; i < levelNodes.length; i++) {
    if (!levelNodes[i].completed) {
      firstIncomplete = i;
      break;
    }
  }

  const allLevelsCompleted = firstIncomplete === -1;

  return (
    <div>
      {/* ── Back button ────────────────────────────────────────────── */}
      <button
        onClick={() => navigate('/worlds')}
        className="mb-6 flex items-center gap-1 font-mono text-sm text-gray-500 transition-colors hover:text-cyber-glow"
      >
        <span>{'<'}</span>
        <span>返回世界列表</span>
      </button>

      {/* ── World header ────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <span className="rounded bg-cyber-blue/60 px-2 py-0.5 text-xs font-bold text-gray-400 font-mono">
            Phase {world.phase}
          </span>
          {!worldUnlocked && (
            <span className="text-[0.65rem] font-mono text-gray-600 tracking-wider">
              LOCKED
            </span>
          )}
        </div>
        <h1 className="neon-text font-mono text-2xl font-bold tracking-wider">
          {world.name}
        </h1>
        <p className="mt-2 font-mono text-sm text-gray-500">
          {world.description}
        </p>
      </div>

      {/* ── Locked world notice ─────────────────────────────────────── */}
      {!worldUnlocked ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 font-mono text-5xl text-gray-800">[LOCKED]</div>
          <p className="font-mono text-sm text-gray-500">
            需要玩家等级{' '}
            <span className="text-cyber-glow">{world.phase + 1}</span>{' '}
            才能解锁此世界
          </p>
          <p className="mt-1 font-mono text-xs text-gray-600">
            当前等级: {player.level}
          </p>
        </div>
      ) : (
        <>
          {/* ── Level tree ─────────────────────────────────────────── */}
          <div className="relative">
            {levelNodes.map((node, i) => {
              const isCompleted = node.completed;
              const isCurrent = !isCompleted && i === firstIncomplete;
              const isLocked = !isCompleted && !isCurrent;
              const showReview = node.needsReview;

              return (
                <div
                  key={node.level.id}
                  className="relative flex items-start gap-4 pb-6"
                >
                  {/* Vertical connector line */}
                  {i < levels.length - 1 && (
                    <div
                      className={`absolute left-[15px] top-8 w-0.5 -translate-x-1/2 ${
                        isCompleted ? 'h-full bg-cyber-glow/40' : 'h-full bg-gray-800'
                      }`}
                    />
                  )}

                  {/* Node circle indicator */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`
                        flex h-8 w-8 items-center justify-center rounded-full border-2 font-mono text-sm transition-all duration-300
                        ${
                          isCompleted
                            ? 'border-cyber-glow bg-cyber-glow/20 text-cyber-glow shadow-[0_0_10px_rgba(0,255,159,0.3)]'
                            : isCurrent
                              ? 'border-cyber-glow bg-cyber-dark text-cyber-glow shadow-[0_0_8px_rgba(0,255,159,0.2)]'
                              : 'border-gray-700 bg-cyber-dark/60 text-gray-600'
                        }
                      `}
                    >
                      {isCompleted ? '\u2713' : isCurrent ? '\u25B6' : i + 1}
                    </div>
                  </div>

                  {/* Level card */}
                  <div
                    onClick={() => {
                      if (!isLocked) {
                        navigate(`/worlds/${worldId}/level/${i + 1}`);
                      }
                    }}
                    className={`
                      flex-1 cursor-pointer rounded-lg border p-3 transition-all duration-300
                      ${
                        isCompleted
                          ? 'border-cyber-glow/20 bg-cyber-dark/60 hover:border-cyber-glow/40'
                          : isCurrent
                            ? 'border-cyber-glow/30 bg-cyber-dark/80 hover:border-cyber-glow/60 hover:shadow-[0_0_15px_rgba(0,255,159,0.15)]'
                            : 'border-gray-800/40 bg-cyber-dark/30 opacity-50 cursor-not-allowed'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Type icon badge */}
                        <span
                          className={`
                            inline-flex h-6 w-6 items-center justify-center rounded text-xs font-mono font-bold
                            ${
                              isCompleted
                                ? 'bg-cyber-glow/20 text-cyber-glow'
                                : isCurrent
                                  ? 'bg-cyber-glow/10 text-cyber-glow/70'
                                  : 'bg-gray-800/50 text-gray-600'
                            }
                          `}
                        >
                          {LEVEL_TYPE_ICONS[node.level.type]}
                        </span>

                        {/* Level number + title */}
                        <span
                          className={`font-mono text-sm ${
                            isCompleted || isCurrent
                              ? 'text-gray-200'
                              : 'text-gray-600'
                          }`}
                        >
                          <span className="text-gray-500">
                            Level {i + 1}
                          </span>{' '}
                          {node.level.title}
                        </span>
                      </div>

                      {/* Status badges */}
                      <div className="flex items-center gap-2">
                        {showReview && (
                          <span className="rounded border border-cyber-yellow/40 bg-cyber-yellow/10 px-1.5 py-0.5 text-[0.6rem] font-mono text-cyber-yellow">
                            需复习
                          </span>
                        )}
                        {isCurrent && (
                          <span className="inline-block h-4 w-2 animate-pulse bg-cyber-glow" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Boss battle button ─────────────────────────────────── */}
          <div className="mt-8 border-t border-gray-800 pt-8">
            <div
              onClick={() => {
                if (allLevelsCompleted) {
                  navigate(`/worlds/${worldId}/boss`);
                }
              }}
              className={`
                flex items-center justify-center gap-3 rounded-lg border-2 p-5 font-mono text-lg font-bold tracking-wider transition-all duration-300
                ${
                  allLevelsCompleted
                    ? 'border-cyber-red/50 bg-cyber-red/10 text-cyber-red cursor-pointer hover:border-cyber-red hover:shadow-[0_0_25px_rgba(233,69,96,0.3)] neon-red'
                    : 'border-gray-800/40 bg-cyber-dark/30 text-gray-600 opacity-50 cursor-not-allowed'
                }
              `}
            >
              {allLevelsCompleted ? (
                <>
                  <span className="text-xl">{'\u26A1'}</span>
                  <span>BOSS 战斗</span>
                  <span className="text-xs tracking-normal opacity-70">
                    {world.boss?.title}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm text-gray-600">[LOCKED]</span>
                  <span>BOSS 锁定</span>
                  <span className="text-xs tracking-normal text-gray-600">
                    ({levelNodes.filter((n) => n.completed).length}/
                    {levels.length} 关卡完成)
                  </span>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Page entry ────────────────────────────────────────────────────────
export function WorldMap() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (id) {
    return <WorldDetail worldId={id} navigate={navigate} />;
  }

  return <WorldList navigate={navigate} />;
}
