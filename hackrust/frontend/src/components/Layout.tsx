import { Link, useLocation } from 'react-router-dom';
import { useGameStore, selectPlayer } from '../store/gameStore';
import HPBar from './HPBar';
import ComboIndicator from './ComboIndicator';

interface LayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { to: '/worlds', label: '世界' },
  { to: '/sandbox', label: '沙盒' },
] as const;

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const player = useGameStore(selectPlayer);

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-gray-200 font-mono">
      {/* Grid background pattern */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 255, 159, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 159, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Top nav bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 h-14 bg-cyber-dark/90 backdrop-blur-md border-b border-cyber-blue/40 flex items-center px-6">
        {/* Title */}
        <Link
          to="/"
          className="text-lg font-bold tracking-widest text-cyber-glow neon-text no-underline mr-10"
        >
          HACKRUST
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`text-sm tracking-wide transition-colors no-underline ${
                location.pathname.startsWith(link.to)
                  ? 'text-cyber-glow neon-text'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Player stats */}
        {player && (
          <div className="flex items-center gap-4">
            {/* Level */}
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyber-purple text-white text-[0.6rem] font-bold shadow-[0_0_6px_rgba(83,52,131,0.6)]">
                {player.level}
              </span>
              <span className="text-xs text-gray-400">Lv.{player.level}</span>
            </div>

            {/* HP bar - compact */}
            <div className="w-28">
              <HPBar current={player.hp} max={player.maxHp} animate />
            </div>

            {/* Combo */}
            <ComboIndicator combo={player.combo} />
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="relative z-10 pt-20 pb-8 px-4 max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
}
