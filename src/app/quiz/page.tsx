import type { Metadata } from 'next';
import { getAllBlogPosts } from '@/lib/blog';
import { QuizCard } from '@/components/quiz/quiz-card';

export const metadata: Metadata = {
  title: '퀴즈',
  description: '투자 인사이트 글에 붙은 퀴즈 모음. 글을 읽고 이해했는지 바로 확인해 보세요.',
};

export default async function QuizPage() {
  const posts = await getAllBlogPosts();
  const quizPosts = posts
    // stub 은 본문이 없어 hasQuiz 가 붙지 않지만 의도를 드러내기 위해 명시한다
    .filter((post) => post.hasQuiz && post.stub !== true)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 border-b border-border pb-6">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">퀴즈</h1>
          <p className="text-muted-foreground">
            글을 읽고 이해했는지 바로 확인해 보세요. 현재 {quizPosts.length}개의 글에 퀴즈가 있습니다.
          </p>
        </header>

        {quizPosts.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">아직 퀴즈가 있는 글이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizPosts.map((post) => (
              <QuizCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
