interface HPBarProps {
  current: number;
  max: number;
  label?: string;
  animate?: boolean;
}

export default function HPBar({ current, max, label, animate = true }: HPBarProps) {
  const ratio = Math.max(0, Math.min(current / max, 1));
  const targetWidth = ratio * 100;

  const barColor =
    ratio > 0.5
      ? 'bg-cyber-glow'
      : ratio > 0.25
        ? 'bg-cyber-yellow'
        : 'bg-cyber-red';

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1 text-xs font-mono">
        <span className="text-gray-400 uppercase tracking-wider">{label ?? 'HP'}</span>
        <span className={ratio > 0.25 ? 'text-cyber-glow' : 'text-cyber-red neon-red'}>
          {current}/{max}
        </span>
      </div>
      <div className="relative w-full h-3 bg-cyber-dark rounded-sm overflow-hidden border border-cyber-blue/50">
        <div
          className={`absolute inset-0 ${barColor} rounded-sm shadow-[0_0_6px_${ratio > 0.5 ? '#00ff9f' : ratio > 0.25 ? '#f5c518' : '#e94560'}]`}
          style={{
            width: `${targetWidth}%`,
            transition: animate ? 'width 0.4s ease-out' : undefined,
          }}
        />
        {/* Subtle shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
    </div>
  );
}
