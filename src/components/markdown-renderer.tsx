import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MarkdownImage } from './markdown-image';
import { MermaidDiagram } from './mermaid-diagram';
import { parseQuiz } from '@/lib/quiz';
import { Quiz } from './quiz/quiz';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  slug?: string; // Blog post slug for image path resolution
  category?: string; // Blog post category for better path resolution
}

export function MarkdownRenderer({ content, className = "", slug, category }: MarkdownRendererProps) {
  // Helper to strip Markdown links like [text](url) -> text
  const stripMarkdownLinks = (input: string) => input.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  // 첫 퀴즈에만 #quiz 앵커를 단다. /quiz 목록 카드가 이 앵커로 링크한다.
  // 반드시 함수 호출 안에서 선언한다 — 모듈 스코프에 두면 글 사이로 카운터가 새어 나간다.
  let quizIndex = 0;
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children }) => {
            const plain = stripMarkdownLinks(String(children));
            const id = plain
              .toLowerCase()
              .replace(/[^\w\s가-힣]/g, '')
              .replace(/\s+/g, '-')
              .trim();
            return (
              <h1 id={id} className="text-3xl font-bold mb-6 mt-8 text-foreground scroll-mt-8">
                {children}
              </h1>
            );
          },
          h2: ({ children }) => {
            const plain = stripMarkdownLinks(String(children));
            const id = plain
              .toLowerCase()
              .replace(/[^\w\s가-힣]/g, '')
              .replace(/\s+/g, '-')
              .trim();
            return (
              <h2 id={id} className="text-2xl font-semibold mb-4 mt-6 text-foreground scroll-mt-8">
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const plain = stripMarkdownLinks(String(children));
            const id = plain
              .toLowerCase()
              .replace(/[^\w\s가-힣]/g, '')
              .replace(/\s+/g, '-')
              .trim();
            return (
              <h3 id={id} className="text-xl font-semibold mb-3 mt-5 text-foreground scroll-mt-8">
                {children}
              </h3>
            );
          },
          h4: ({ children }) => {
            const plain = stripMarkdownLinks(String(children));
            const id = plain
              .toLowerCase()
              .replace(/[^\w\s가-힣]/g, '')
              .replace(/\s+/g, '-')
              .trim();
            return (
              <h4 id={id} className="text-lg font-semibold mb-2 mt-4 text-foreground scroll-mt-8">
                {children}
              </h4>
            );
          },
          h5: ({ children }) => {
            const plain = stripMarkdownLinks(String(children));
            const id = plain
              .toLowerCase()
              .replace(/[^\w\s가-힣]/g, '')
              .replace(/\s+/g, '-')
              .trim();
            return (
              <h5 id={id} className="text-base font-semibold mb-2 mt-3 text-foreground scroll-mt-8">
                {children}
              </h5>
            );
          },
          h6: ({ children }) => {
            const plain = stripMarkdownLinks(String(children));
            const id = plain
              .toLowerCase()
              .replace(/[^\w\s가-힣]/g, '')
              .replace(/\s+/g, '-')
              .trim();
            return (
              <h6 id={id} className="text-sm font-semibold mb-2 mt-3 text-foreground scroll-mt-8">
                {children}
              </h6>
            );
          },
          p: ({ children }) => (
            <p className="mb-4 text-foreground/80 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 text-foreground/80 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 text-foreground/80 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="mb-1">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4 bg-muted/50 py-2">
              {children}
            </blockquote>
          ),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code: (props: any) => {
            const { inline, children, className, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            if (!inline && language === 'mermaid') {
              return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
            }

            if (!inline && language === 'quiz') {
              // 서버 컴포넌트라 파싱이 빌드 타임에 끝난다. yaml 은 클라이언트로 안 내려간다.
              const questions = parseQuiz(String(children));
              if (questions.length > 0) {
                return <Quiz questions={questions} id={quizIndex++ === 0 ? 'quiz' : undefined} />;
              }
              // 파싱 실패 시 아래로 흘러가 원본 코드 블록이 보인다
            }

            return !inline && match ? (
              <SyntaxHighlighter
                style={tomorrow}
                language={language}
                PreTag="div"
                className="mb-4 rounded-lg"
                {...rest}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-muted text-muted-foreground px-2 py-1 rounded text-sm">
                {String(children).replace(/`/g, '')}
              </code>
            );
          },
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          img: ({ src, alt, title }) => {
            if (!src) return null;
            return (
              <MarkdownImage
                src={src}
                alt={alt}
                title={title}
                slug={slug}
                category={category}
              />
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-border">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
