'use client'

import { useState, useEffect } from 'react';
import { ChevronRight, List } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export function TableOfContents({ content, className = "" }: TableOfContentsProps) {
  // Helper to strip Markdown links like [text](url) -> text
  const stripMarkdownLinks = (input: string) => input.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Parse headings from markdown content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const rawText = match[2].trim();
      const plainText = stripMarkdownLinks(rawText);
      const id = plainText
        .toLowerCase()
        .replace(/[^\w\s가-힣]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      items.push({ id, text: plainText, level });
    }

    setTocItems(items);
  }, [content]);

  useEffect(() => {
    // Observer for tracking active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { 
        rootMargin: '-10% 0px -50% 0px',
        threshold: 0.1
      }
    );

    // Observe all headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading) => {
      if (heading.id) {
        observer.observe(heading);
      }
    });

    return () => observer.disconnect();
  }, [tocItems]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (tocItems.length === 0) return null;

  return (
    <div className={`sticky top-8 ${className}`}>
      <div className="bg-card rounded-lg p-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <List className="w-4 h-4" />
            목차
          </h3>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <ChevronRight 
              className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-90'}`}
            />
          </button>
        </div>

        {!isCollapsed && (
          <nav className="space-y-1">
            {tocItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToHeading(item.id)}
                className={`
                  w-full text-left px-2 py-1 rounded text-sm transition-colors
                  hover:bg-muted hover:text-foreground
                  ${activeId === item.id 
                    ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                    : 'text-muted-foreground'
                  }
                `}
                style={{ 
                  paddingLeft: `${(item.level - 1) * 12 + 8}px` 
                }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <span>{children}</span>,
                    ol: ({ children }) => <span>{children}</span>,
                    li: ({ children }) => <span>{children}</span>,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    code: (props: any) => {
                      const { inline, children, className, ...rest } = props;
                      // Only treat as inline in TOC
                      return (
                        <code className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-xs" {...rest}>
                          {String(children).replace(/`/g, '')}
                        </code>
                      );
                    },
                    a: ({ children }) => <span>{children}</span>,
                  }}
                >
                  {item.text.replace(/^(\d+)\.\s/, '$1\\. ')}
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}