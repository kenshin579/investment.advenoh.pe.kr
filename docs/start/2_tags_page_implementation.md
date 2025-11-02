# 태그 Bubble Chart 페이지 구현 가이드

## 개요
이 문서는 태그 Bubble Chart 페이지의 최소 구현 가이드입니다.

---

## 1. 헤더에 Tags 아이콘 추가

### 파일: `src/components/header.tsx`

**Import 추가** (6번째 줄):
```tsx
import { Search, Menu, X, ChartLine, Sun, Moon, BookOpen, Hash } from "lucide-react";
```

**Tags 버튼 추가** (64번째 줄, Series 버튼 앞에 삽입):
```tsx
{/* Tags Button */}
<Link href="/tags">
  <Button
    variant="ghost"
    size="sm"
    className="relative w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
  >
    <span className="sr-only">태그</span>
    <Hash className="w-5 h-5 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" />
  </Button>
</Link>
```

---

## 2. 서버 함수 추가

### 파일: `src/lib/blog-server.ts`

파일 끝에 추가:

```typescript
// Get all tags data
export async function getAllTagsServer(): Promise<Array<{ tag: string; count: number }>> {
  const tagsPath = path.join(process.cwd(), 'public/data/tags.json')
  const tagsData = fs.readFileSync(tagsPath, 'utf-8')
  const tags: Array<{ tag: string; count: number }> = JSON.parse(tagsData)

  return tags.sort((a, b) => b.count - a.count)
}

// Get posts by tag
export async function getPostsByTagServer(tagName: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPostsServer()
  return posts.filter(post => post.tags && post.tags.includes(tagName))
}
```

---

## 3. 태그 페이지 생성

### 파일: `src/app/tags/page.tsx` (새로 생성)

```tsx
import { Metadata } from 'next'
import { getAllTagsServer } from '@/lib/blog-server'
import TagsPageClient from '@/components/tags-page-client'

export const metadata: Metadata = {
  title: '태그',
  description: '블로그의 모든 태그를 탐색하고 관심 주제의 콘텐츠를 찾아보세요.',
}

export default async function TagsPage() {
  const tags = await getAllTagsServer()

  return <TagsPageClient tags={tags} />
}
```

---

## 4. 태그 클라우드 컴포넌트 (간소화 버전)

### 파일: `src/components/tag-cloud.tsx` (새로 생성)

**Note**: D3.js Bubble Chart 대신 간단한 태그 클라우드로 구현

```tsx
'use client'

interface TagData {
  tag: string
  count: number
}

interface TagCloudProps {
  tags: TagData[]
  onTagClick: (tag: string) => void
}

export function TagCloud({ tags, onTagClick }: TagCloudProps) {
  const getSize = (count: number) => {
    if (count >= 20) return 'text-4xl'
    if (count >= 10) return 'text-3xl'
    if (count >= 5) return 'text-2xl'
    return 'text-xl'
  }

  const getColor = (count: number) => {
    if (count >= 20) return 'text-blue-600 dark:text-blue-400'
    if (count >= 10) return 'text-green-600 dark:text-green-400'
    if (count >= 5) return 'text-orange-600 dark:text-orange-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center items-center p-8">
      {tags.slice(0, 100).map((item) => (
        <button
          key={item.tag}
          onClick={() => onTagClick(item.tag)}
          className={`${getSize(item.count)} ${getColor(item.count)} font-bold hover:scale-110 transition-transform cursor-pointer`}
        >
          {item.tag}
          <span className="text-sm ml-1">({item.count})</span>
        </button>
      ))}
    </div>
  )
}
```

---

## 5. 클라이언트 페이지 컴포넌트

### 파일: `src/components/tags-page-client.tsx` (새로 생성)

```tsx
'use client'

import { useState } from 'react'
import { TagCloud } from './tag-cloud'
import { BlogPostCard } from './blog-post-card'

interface TagsPageClientProps {
  tags: Array<{ tag: string; count: number }>
}

export default function TagsPageClient({ tags }: TagsPageClientProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])

  const handleTagClick = async (tag: string) => {
    setSelectedTag(tag)

    const response = await fetch('/data/posts.json')
    const allPosts = await response.json()
    const filtered = allPosts.filter((post: any) => post.tags?.includes(tag))
    setFilteredPosts(filtered)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">태그 탐색</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          태그를 클릭하여 관련 콘텐츠를 찾아보세요
        </p>
      </header>

      <TagCloud tags={tags} onTagClick={handleTagClick} />

      {selectedTag && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">
            #{selectedTag} ({filteredPosts.length})
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

---

## 구현 참고사항

### 최소 구현 선택
- D3.js Bubble Chart 대신 **태그 클라우드** 방식 선택
- 이유: 구현 시간 단축 (2-3시간), 동일한 정보 전달 가능
- 향후 D3.js로 업그레이드 가능

### 데이터 검증
- `public/data/tags.json` 이미 존재 확인
- 태그 개수: 2,362개
- 상위 100개만 표시 (성능 고려)

### 테스트 방법
```bash
# 개발 서버 실행
npm run dev

# 타입 체크
npm run check

# 빌드 테스트
npm run build
npm run start
```
