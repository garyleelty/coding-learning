import { Link } from 'react-router-dom';
import { useGameStore, selectPlayer } from '../store/gameStore';

export function Home() {
  const player = useGameStore(selectPlayer);
  const worlds = useGameStore((s) => s.worlds);
  const hasProgress = Object.keys(worlds).length > 0;
  const totalLevelsCompleted = Object.values(worlds).reduce(
    (sum, w) => sum + Object.values(w.levels).filter((l) => l.completed).length,
    0,
  );
  const totalBossesDefeated = Object.values(worlds).filter((w) => w.bossDefeated).length;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a1a] px-4">
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

      {/* Decorative corner brackets */}
      <div className="fixed left-6 top-6 text-sm font-bold text-[#00ff9f] opacity-30 select-none">
        {'<'}system{' />'}
      </div>
      <div className="fixed right-6 top-6 text-sm font-bold text-[#00ff9f] opacity-30 select-none">
        {'<_init_>'}
      </div>
      <div className="fixed bottom-6 left-6 text-sm font-bold text-[#00ff9f] opacity-30 select-none">
        {'[root@hackrust ~]# '}
        <span className="inline-block w-2 h-4 bg-[#00ff9f] opacity-70 animate-pulse" />
      </div>
      <div className="fixed bottom-6 right-6 text-sm text-gray-600 select-none">
        v0.1.0
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Terminal header */}
        <div className="mb-4 flex items-center gap-2 text-xs text-gray-600 font-mono">
          <span className="text-[#00ff9f]">┌──(</span>
          <span className="text-[#00ff9f]">hackrust</span>
          <span className="text-[#00ff9f]">)</span>
          <span className="text-gray-500">-</span>
          <span className="text-gray-500">[</span>
          <span className="text-gray-400">~</span>
          <span className="text-gray-500">]</span>
          <span className="text-[#00ff9f]">┐</span>
        </div>

        {/* Title with glitch effect */}
        <h1
          className="neon-text relative font-mono text-6xl font-black tracking-widest sm:text-7xl md:text-8xl"
          data-text="HACKRUST"
        >
          HACKRUST
        </h1>

        {/* Animated underscore line */}
        <div className="mt-2 h-1 w-48 rounded-full bg-gradient-to-r from-transparent via-[#00ff9f] to-transparent opacity-60" />

        {/* Subtitle */}
        <p className="mt-6 font-mono text-lg text-gray-400 tracking-wider">
          {'>'} 赛博黑客 <span className="text-gray-600">·</span> Rust 学习游戏
        </p>

        {/* Tagline */}
        <p className="mt-3 max-w-md font-mono text-sm leading-relaxed text-gray-500">
          Master the art of systems programming. Exploit vulnerabilities.
          <br />
          Conquer the terminal. Become the ultimate cyber-decker.
        </p>

        {/* Action buttons */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            to="/worlds"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded border border-[#00ff9f]/40 px-10 py-4 font-mono text-lg font-bold tracking-widest text-[#00ff9f] transition-all duration-300 hover:border-[#00ff9f] hover:shadow-[0_0_30px_rgba(0,255,159,0.3)]"
          >
            {/* Button background glow on hover */}
            <span className="absolute inset-0 translate-y-full bg-gradient-to-t from-[#00ff9f]/10 to-transparent transition-transform duration-300 group-hover:translate-y-0" />
            {/* Button content */}
            <span className="relative flex items-center gap-3">
              <span className="text-gray-500">{'>'}</span>
              <span>{hasProgress ? '继续入侵' : '开始入侵'}</span>
              <span className="inline-block w-2 h-4 bg-[#00ff9f] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </span>
          </Link>

          {/* Keyboard hint */}
          <span className="font-mono text-xs text-gray-700">
            [ ENTER <span className="text-gray-600">—</span> <span className="text-[#00ff9f]/50">{hasProgress ? '继续' : '开始'}</span> ]
          </span>
        </div>

        {/* Player stats summary */}
        {hasProgress && (
          <div className="mt-12 w-full max-w-sm">
            {/* ASCII-style separator */}
            <div className="mb-4 flex items-center gap-2 text-xs text-gray-700">
              <span className="flex-1 border-t border-gray-800" />
              <span className="font-mono">// player stats</span>
              <span className="flex-1 border-t border-gray-800" />
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono text-sm">
              <div className="rounded border border-gray-800/60 bg-white/[0.02] px-3 py-3 transition-colors hover:border-[#00ff9f]/20">
                <div className="text-xs text-gray-600">LEVEL</div>
                <div className="mt-1 text-lg font-bold text-[#00ff9f]">
                  {player.level}
                </div>
              </div>
              <div className="rounded border border-gray-800/60 bg-white/[0.02] px-3 py-3 transition-colors hover:border-[#00ff9f]/20">
                <div className="text-xs text-gray-600">XP</div>
                <div className="mt-1 text-lg font-bold text-[#00ff9f]">
                  {player.xp}
                </div>
              </div>
              <div className="rounded border border-gray-800/60 bg-white/[0.02] px-3 py-3 transition-colors hover:border-[#00ff9f]/20">
                <div className="text-xs text-gray-600">WORLDS</div>
                <div className="mt-1 text-lg font-bold text-[#00ff9f]">
                  {totalLevelsCompleted}
                  <span className="text-xs text-gray-600">
                    /{totalBossesDefeated}
                  </span>
                </div>
              </div>
            </div>

            {/* HP bar */}
            <div className="mt-4 rounded border border-gray-800/60 bg-white/[0.02] px-4 py-3">
              <div className="flex items-center justify-between text-xs font-mono text-gray-600">
                <span>HP</span>
                <span>
                  {player.hp}/{player.maxHp}
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-900">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#e94560] to-[#00ff9f] transition-all duration-500"
                  style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
