# Mermaid Diagram 렌더링 - 구현 문서

## 수정/생성 파일 목록

| 파일 | 작업 | 설명 |
|------|------|------|
| `package.json` | 수정 | `mermaid` 패키지 추가 |
| `src/components/mermaid-diagram.tsx` | 신규 | Mermaid 다이어그램 렌더링 컴포넌트 |
| `src/components/markdown-renderer.tsx` | 수정 | 코드 블록에서 mermaid 분기 처리 |
| `contents/etc/mermaid-diagram-sample/index.md` | 신규 | Mermaid 다이어그램 테스트용 샘플 포스트 |

## 구현 상세

### 1. 의존성 설치

```bash
npm install mermaid
```

### 2. MermaidDiagram 컴포넌트 (`src/components/mermaid-diagram.tsx`)

```tsx
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
```

핵심 포인트:
- `'use client'` 지시어로 클라이언트 컴포넌트 선언
- `import('mermaid')` 동적 import로 해당 페이지에서만 로드
- `mermaid.render()`로 SVG 생성 후 innerHTML에 삽입
- 에러 시 다이어그램 대신 에러 메시지 표시
- `aria-label`에 원본 코드 제공 (접근성)

### 3. MarkdownRenderer 수정 (`src/components/markdown-renderer.tsx`)

기존 `code` 컴포넌트 렌더러에서 `language === 'mermaid'` 분기 추가:

```tsx
import { MermaidDiagram } from './mermaid-diagram';

// code 컴포넌트 내부
code: (props: any) => {
  const { inline, children, className, ...rest } = props;
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  // mermaid 코드 블록 처리
  if (!inline && language === 'mermaid') {
    return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
  }

  return !inline && match ? (
    <SyntaxHighlighter ... />
  ) : (
    <code ... />
  );
},
```

변경점:
- `MermaidDiagram` import 추가
- `language === 'mermaid'` 조건 분기를 SyntaxHighlighter 앞에 배치

### 4. 테스트용 샘플 포스트 (`contents/etc/mermaid-diagram-sample/index.md`)

다양한 다이어그램 유형을 포함한 샘플 블로그 포스트:

- **Flowchart**: 투자 의사결정 흐름도
- **Sequence Diagram**: 주식 주문 처리 과정
- **Pie Chart**: 포트폴리오 자산 배분
- **Gantt Chart**: 리밸런싱 일정
- **State Diagram**: 주문 상태 변화
- **에러 케이스**: 잘못된 문법으로 에러 처리 동작 확인
