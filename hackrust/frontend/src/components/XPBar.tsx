import { xpForLevel } from '../store/gameStore';

interface XPBarProps {
  xp: number;
  level: number;
}

export default function XPBar({ xp, level }: XPBarProps) {
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const xpInCurrentLevel = xp - currentLevelXp;
  const xpNeededForNext = nextLevelXp - currentLevelXp;
  const progress = xpNeededForNext > 0 ? Math.min(xpInCurrentLevel / xpNeededForNext, 1) : 1;
  const progressPercent = Math.round(progress * 100);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-1">
        {/* Level badge */}
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-cyber-purple text-white text-xs font-bold font-mono shadow-[0_0_8px_rgba(83,52,131,0.6)]">
          {level}
        </span>
        <div className="flex-1 text-xs font-mono text-gray-400">
          XP {xp.toLocaleString()} / {nextLevelXp.toLocaleString()}
        </div>
        <span className="text-xs font-mono text-cyber-glow">{progressPercent}%</span>
      </div>

      {/* Progress bar */}
      <div className="relative w-full h-2 bg-cyber-dark rounded-full overflow-hidden border border-cyber-blue/40">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyber-purple to-cyber-glow rounded-full shadow-[0_0_8px_rgba(0,255,159,0.4)] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
