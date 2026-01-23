'use client';

import { useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
        });

        if (containerRef.current) {
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          const { svg } = await mermaid.render(id, chart);
          containerRef.current.innerHTML = svg;
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Mermaid 다이어그램 렌더링 실패');
      }
    };

    renderDiagram();
  }, [chart]);

  if (error) {
    return (
      <div className="mb-4 p-4 border border-red-300 bg-red-50 rounded-lg">
        <p className="text-red-600 text-sm font-medium">Mermaid 렌더링 오류</p>
        <pre className="text-red-500 text-xs mt-2 whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mb-4 flex justify-center overflow-x-auto"
      aria-label={chart}
    />
  );
}
