'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface Category {
  category: string;
  count: number;
}

interface CategoryOption {
  id: string;
  label: string;
  count: number;
}

interface CategoryFilterClientProps {
  categories: Category[];
  selectedCategory?: string;
  searchTerm?: string;
  selectedTags?: string[];
}

export function CategoryFilterClient({
  categories,
  selectedCategory = 'all',
  searchTerm = '',
  selectedTags = []
}: CategoryFilterClientProps) {
  const router = useRouter()

  // History 도 다른 카테고리와 똑같이 노출한다.
  // 한때 감췄던 이유는 본문 없는 스텁 14개가 목록을 덮는 것을 막기 위해서였는데,
  // 지금은 stub 글이 categories.json 집계와 홈 목록 양쪽에서 빠지므로 그 우회책이 필요 없다.
  // 오히려 감춰 두면 "전체" 개수와 실제 목록 개수가 어긋난다.
  const visibleCategories = Array.isArray(categories) ? categories : []

  // Calculate total count for "전체" category
  const totalCount = visibleCategories.reduce((sum, cat) => sum + cat.count, 0)

  const allCategories: CategoryOption[] = [
    { id: "all", label: "전체", count: totalCount },
    ...visibleCategories.map(({ category, count }) => ({
      id: category,
      label: category,
      count: count
    }))
  ]

  const handleCategoryChange = (category: string) => {
    // URL 파라미터 구성
    const params = new URLSearchParams()
    if (category !== 'all') {
      params.set('category', category)
    }
    if (searchTerm) {
      params.set('search', searchTerm)
    }
    if (selectedTags.length > 0) {
      params.set('tags', selectedTags[0])
    }

    // 클라이언트 사이드 네비게이션 (페이지 리로드 없음)
    const url = params.toString() ? `/?${params.toString()}` : '/'
    router.push(url)
  }

  return (
    <section className="bg-background py-8 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-3">
          {allCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`category-filter px-6 py-2 rounded-full font-medium ${
                selectedCategory === category.id
                  ? "active bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-muted"
              }`}
              onClick={() => handleCategoryChange(category.id)}
              aria-label={`${category.label} 카테고리, 게시물 ${category.count}개`}
            >
              {category.label} <span className="text-muted-foreground">{category.count}</span>
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}