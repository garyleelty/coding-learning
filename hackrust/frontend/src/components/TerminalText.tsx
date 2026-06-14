import { useEffect, useState } from 'react';

interface TerminalTextProps {
  text: string;
  speed?: number;
  className?: string;
}

export default function TerminalText({ text, speed = 50, className = '' }: TerminalTextProps) {
  return <TerminalTextInner key={`${text}:${speed}`} text={text} speed={speed} className={className} />;
}

function TerminalTextInner({ text, speed, className }: Required<TerminalTextProps>) {
  const [visibleChars, setVisibleChars] = useState(0);
  const done = visibleChars >= text.length;
  const displayed = text.slice(0, visibleChars);

  useEffect(() => {
    if (!text || done) {
      return;
    }

    const timer = setTimeout(() => {
      setVisibleChars((current) => Math.min(current + 1, text.length));
    }, speed);

    return () => clearTimeout(timer);
  }, [done, text, speed]);

  return (
    <span className={`font-mono ${className}`}>
      {displayed}
      {!done && <span className="cursor-blink" />}
    </span>
  );
}
