interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  lineNumbers?: boolean;
}

export default function CodeBlock({ code, language, title, lineNumbers = false }: CodeBlockProps) {
  const lines = code.split('\n');

  return (
    <div className="w-full rounded-md overflow-hidden border border-cyber-blue/40 bg-[#0d1117]">
      {/* Title bar */}
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-cyber-dark/80 border-b border-cyber-blue/30">
          <div className="flex items-center gap-2">
            {/* macOS-style dots */}
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-xs text-gray-500 font-mono">{title}</span>
          {language && <span className="text-xs text-cyber-glow/60 font-mono">{language}</span>}
          {!language && <span />}
        </div>
      )}

      {/* Code content */}
      <div className="flex font-mono text-sm leading-relaxed">
        {/* Line numbers */}
        {lineNumbers && (
          <div className="select-none text-right pr-4 pl-3 py-3 text-gray-600 border-r border-cyber-blue/20 min-w-[3rem]">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}

        {/* Code */}
        <pre className="flex-1 p-3 overflow-x-auto text-cyber-glow/90 whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
