import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import type { BlogPost } from '@/types/blog';

interface QuizCardProps {
  post: BlogPost;
}

function getCategoryColor(category: string): string {
  switch (category?.toLowerCase()) {
    case 'stock':
      return 'bg-blue-500 text-white';
    case 'etf':
      return 'bg-green-500 text-white';
    case 'bonds':
      return 'bg-purple-500 text-white';
    case 'funds':
      return 'bg-orange-500 text-white';
    case 'analysis':
      return 'bg-red-500 text-white';
    case 'etc':
      return 'bg-gray-500 text-white';
    case 'weekly':
      return 'bg-indigo-500 text-white';
    default:
      return 'bg-slate-500 text-white';
  }
}

export function QuizCard({ post }: QuizCardProps) {
  const category = post.categories[0] || 'etc';
  // #quiz 는 markdown-renderer 가 글의 첫 퀴즈 블록에 심는 고정 id 다
  const href = `/${category.toLowerCase()}/${post.slug}/#quiz`;

  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <Badge className={getCategoryColor(category)}>{category}</Badge>
          <span className="text-sm text-muted-foreground">{post.quizCount}문항</span>
        </div>
        <CardTitle className="text-lg leading-snug">
          <Link href={href} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="mb-3 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
        <time dateTime={post.date} className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {post.formattedDate}
        </time>
      </CardContent>
    </Card>
  );
}
