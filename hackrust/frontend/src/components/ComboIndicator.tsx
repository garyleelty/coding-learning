interface ComboIndicatorProps {
  combo: number;
}

function getTier(combo: number): { label: string; color: string; glow: string; pulseSpeed: string } {
  if (combo >= 10) {
    return {
      label: '🔥 LEGENDARY',
      color: 'text-cyber-yellow',
      glow: 'shadow-[0_0_20px_rgba(245,197,24,0.6)]',
      pulseSpeed: '0.6s',
    };
  }
  if (combo >= 5) {
    return {
      label: '⚡ SUPER',
      color: 'text-cyber-glow',
      glow: 'shadow-[0_0_15px_rgba(0,255,159,0.5)]',
      pulseSpeed: '0.8s',
    };
  }
  if (combo >= 3) {
    return {
      label: '🔥 COMBO',
      color: 'text-cyber-purple',
      glow: 'shadow-[0_0_10px_rgba(83,52,131,0.5)]',
      pulseSpeed: '1s',
    };
  }
  return {
    label: '',
    color: 'text-gray-400',
    glow: '',
    pulseSpeed: '0s',
  };
}

export default function ComboIndicator({ combo }: ComboIndicatorProps) {
  if (combo <= 1) return null;

  const tier = getTier(combo);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-sm font-bold ${tier.color} ${tier.glow} bg-cyber-dark/80 border border-current/30`}
      style={{
        animation: combo > 1 ? `combo-flash ${tier.pulseSpeed} ease-in-out infinite` : undefined,
      }}
    >
      <span>{combo}x</span>
      <span className="text-[0.65rem] tracking-widest">{tier.label}</span>
    </div>
  );
}
