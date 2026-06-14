import { useEffect, useState } from 'react';

interface FeedbackProps {
  type: 'correct' | 'wrong' | 'info';
  message: string;
  explanation?: string;
  onNext?: () => void;
  onRetry?: () => void;
}

const typeConfig = {
  correct: {
    icon: '✔',
    border: 'border-cyber-glow',
    bg: 'bg-cyber-glow/10',
    text: 'text-cyber-glow',
    glow: 'neon-text',
    btnBg: 'bg-cyber-glow text-cyber-dark hover:bg-cyber-glow/90',
  },
  wrong: {
    icon: '✘',
    border: 'border-cyber-red',
    bg: 'bg-cyber-red/10',
    text: 'text-cyber-red',
    glow: 'neon-red',
    btnBg: 'bg-cyber-red text-white hover:bg-cyber-red/90',
  },
  info: {
    icon: 'ⓘ',
    border: 'border-cyber-blue',
    bg: 'bg-cyber-blue/20',
    text: 'text-blue-300',
    glow: '',
    btnBg: 'bg-cyber-blue text-white hover:bg-cyber-blue/90',
  },
};

export default function Feedback({ type, message, explanation, onNext, onRetry }: FeedbackProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in on mount
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const config = typeConfig[type];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className={`w-full max-w-md mx-4 ${config.bg} border ${config.border} rounded-lg p-6 shadow-[0_0_30px_rgba(0,255,159,0.15)] transition-all duration-300 ${visible ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'}`}
      >
        {/* Icon + Message */}
        <div className="flex items-start gap-3 mb-4">
          <span className={`text-2xl ${config.text} ${config.glow}`}>{config.icon}</span>
          <div className="flex-1">
            <p className={`text-lg font-bold font-mono ${config.text} ${config.glow}`}>{message}</p>
          </div>
        </div>

        {/* Explanation */}
        {explanation && (
          <div className="mb-6 pl-8">
            <p className="text-sm text-gray-300 leading-relaxed">{explanation}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-5 py-2 text-sm font-mono rounded border border-gray-600 text-gray-300 hover:bg-gray-700/50 transition-colors cursor-pointer"
            >
              重试 Retry
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              className={`px-5 py-2 text-sm font-bold font-mono rounded transition-all cursor-pointer ${config.btnBg}`}
            >
              继续 Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
