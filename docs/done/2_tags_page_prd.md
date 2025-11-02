# 태그 Bubble Chart 페이지 구현 PRD

## 1. 개요 (Overview)

### 목적
블로그의 모든 태그를 시각적인 Bubble Chart로 표현하여 사용자가 태그별 콘텐츠 규모를 직관적으로 파악하고, 관심 있는 주제로 빠르게 탐색할 수 있도록 합니다.

### 현재 상태
- 태그 데이터: `public/data/tags.json`에 이미 생성됨 (총 2,362개)
- 태그 네비게이션: **없음** (현재 태그 탐색 방법 부재)
- 헤더 구조: Series 아이콘만 존재

### 목표 UI

#### Before (현재)
```
┌────────────────────────────────────────┐
│  Logo    전체 Stock ETF Weekly Etc     │
│                          📚 🌙          │  ← Series, DarkMode만 있음
└────────────────────────────────────────┘
```

#### After (변경 후)
```
┌────────────────────────────────────────┐
│  Logo    전체 Stock ETF Weekly Etc     │
│                       #️⃣ 📚 🌙         │  ← Tags 아이콘 추가
└────────────────────────────────────────┘

/tags 페이지:
┌─────────────────────────────────────────┐
│              태그 탐색                    │
│  Bubble Chart (태그 시각화)              │
│   ● ETF (26)                            │
│      ●● 주식 (20)  ● 주간브리핑 (13)     │
│           ● 미래에셋 (9)                 │
│  [클릭한 태그의 포스트 목록]              │
└─────────────────────────────────────────┘
```

### 비즈니스 가치
- **탐색성 향상**: 2,362개의 태그를 시각적으로 한눈에 파악
- **사용자 참여**: 인터랙티브한 버블 차트로 재미있는 탐색 경험
- **콘텐츠 발견**: 숨겨진 콘텐츠를 태그를 통해 발견
- **SEO 개선**: 태그 페이지를 통한 내부 링크 구조 강화

---

## 2. 현재 상태 분석 (Current State Analysis)

### 중요 발견사항 ✨
**태그 데이터는 이미 완벽하게 생성되고 있습니다!**
- 총 **2,362개**의 태그 (매우 풍부한 콘텐츠)
- 상위 태그: ETF(26), 주식(20), 주간브리핑(13), 주요섹터(13)
- 빌드 타임에 자동 생성 (`scripts/generateStaticData.ts`)

### 데이터 흐름 (Data Flow)

```
1. 빌드 타임
   scripts/generateStaticData.ts
   ↓ (마크다운 파싱)
   contents/{category}/*.md
   ↓ (태그별 포스트 집계)
   public/data/tags.json  ← ✅ 이미 존재!

2. 런타임 (구현 필요)
   src/app/tags/page.tsx (Server Component) ← ❌ 없음
   ↓ (getTags 호출)
   src/lib/blog-server.ts ← ❌ getTags 함수 없음
   ↓ (JSON 읽기)
   public/data/tags.json
   ↓ (props 전달)
   src/components/tag-bubble-chart.tsx ← ❌ 없음
```

### 핵심 파일 및 현재 상태

#### 1. `public/data/tags.json` (데이터 소스)
**위치**: 빌드 타임에 자동 생성
```json
[
  { "tag": "ETF", "count": 26 },
  { "tag": "주식", "count": 20 },
  { "tag": "주간 브리핑", "count": 13 },
  ...
  { "tag": "8월 5주차", "count": 1 }
]
```
✅ **상태**: 완료 - 이미 tag와 count 필드 포함

#### 2. `src/components/header.tsx` (헤더 수정 필요)
**위치**: 64-73번째 줄 (Series 버튼)
```tsx
{/* Series Button */}
<Link href="/series">
  <Button variant="ghost" size="sm">
    <BookOpen className="w-5 h-5" />
  </Button>
</Link>
```
❌ **상태**: 수정 필요 - Tags 아이콘 추가 필요

#### 3. `src/app/tags/page.tsx` (태그 페이지)
❌ **상태**: 없음 - 새로 생성 필요

#### 4. `src/lib/blog-server.ts` (서버 데이터 접근)
❌ **상태**: `getTags()` 함수 없음 - 추가 필요

#### 5. `src/components/tag-bubble-chart.tsx` (Bubble Chart)
❌ **상태**: 없음 - 새로 생성 필요

### 참고: 시리즈 페이지 구조
**파일**: `src/app/series/page.tsx`
- 카드 레이아웃으로 시리즈 목록 표시
- 각 시리즈에 포스트 개수 표시
- 시리즈 클릭 시 `/series/[seriesName]`으로 이동
- **유사한 구조를 태그 페이지에 적용 가능**

---

## 3. 요구사항 (Requirements)

### 기능 요구사항 (Functional Requirements)

#### FR-1: 헤더에 태그 아이콘 추가
- Series 아이콘(BookOpen) 옆에 Tags 아이콘 추가
- lucide-react의 `Hash` 또는 `Tag` 아이콘 사용
- `/tags` 경로로 링크 연결
- 동일한 스타일 (ghost 버튼, 원형, 크기 w-10 h-10)

#### FR-2: 태그 Bubble Chart 시각화
- 태그를 원(bubble) 형태로 표시
- Bubble 크기: 포스트 개수에 비례 (count 값)
- Bubble 배치: 큰 것부터 중앙 → 가장자리 순
- 각 Bubble에 태그명과 개수 표시: `"ETF (26)"`

#### FR-3: Bubble 클릭 시 포스트 필터링
- Bubble 클릭 → 해당 태그의 포스트 목록 표시
- 같은 페이지 내에서 동적으로 표시 (옵션 1 선택)
- 기존 `blog-post-card.tsx` 컴포넌트 재사용

#### FR-4: 반응형 디자인
- 모바일: 작은 화면에서도 읽기 쉽게 Bubble 크기 조정
- 태블릿/데스크톱: 더 많은 태그를 한 화면에 표시

### 비기능 요구사항 (Non-Functional Requirements)

#### NFR-1: 성능
- 정적 데이터 사용으로 런타임 성능 영향 최소화
- 2,362개 태그 중 상위 50-100개만 Bubble Chart에 표시 (성능 고려)
- 나머지 태그는 "더보기" 또는 검색으로 접근

#### NFR-2: 일관성
- 기존 Series 페이지 디자인 시스템 유지
- Tailwind CSS 및 shadcn/ui 스타일링 규칙 준수
- 다크모드 완벽 지원

#### NFR-3: 접근성
- 스크린 리더 지원 (ARIA 레이블)
- 키보드 네비게이션 (Tab, Enter)
- 색맹 사용자를 위한 색상 대비

---

## 4. 기술적 분석 (Technical Analysis)

### 필요한 변경사항

#### 변경 #1: 헤더에 Tags 아이콘 추가
**파일**: `src/components/header.tsx`
**위치**: 64-73번째 줄 (Series 버튼 바로 뒤)

```tsx
// 현재 (Series 버튼만 존재)
<Link href="/series">
  <Button variant="ghost" size="sm">
    <BookOpen className="w-5 h-5" />
  </Button>
</Link>

// 변경 후 (Tags 버튼 추가)
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

{/* Series Button */}
<Link href="/series">
  <Button variant="ghost" size="sm">
    <BookOpen className="w-5 h-5" />
  </Button>
</Link>
```

**Import 추가**: `import { Hash } from "lucide-react";`

#### 변경 #2: 서버 데이터 접근 함수 추가
**파일**: `src/lib/blog-server.ts`
**위치**: 파일 끝에 추가

```typescript
// Get all tags data
export async function getAllTagsServer(): Promise<Array<{ tag: string; count: number }>> {
  const tagsPath = path.join(process.cwd(), 'public/data/tags.json')
  const tagsData = fs.readFileSync(tagsPath, 'utf-8')
  const tags: Array<{ tag: string; count: number }> = JSON.parse(tagsData)

  // Sort by count descending
  return tags.sort((a, b) => b.count - a.count)
}

// Get posts by tag
export async function getPostsByTagServer(tagName: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPostsServer()
  return posts.filter(post => post.tags && post.tags.includes(tagName))
}
```

#### 변경 #3: 태그 페이지 생성
**파일**: `src/app/tags/page.tsx` (새로 생성)

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

#### 변경 #4: Bubble Chart 컴포넌트 생성
**파일**: `src/components/tag-bubble-chart.tsx` (새로 생성)

**라이브러리 선택**: **D3.js** (force simulation)
- 이유: 정교한 Bubble 배치 알고리즘
- 대안: recharts (간단), CSS만으로 구현 (경량)

**주요 기능**:
- Force simulation으로 자연스러운 Bubble 배치
- Collision detection (겹침 방지)
- Bubble 크기: `Math.sqrt(count) * scaleFactor`
- 중앙에 큰 Bubble, 가장자리에 작은 Bubble

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

interface TagData {
  tag: string
  count: number
}

interface BubbleChartProps {
  tags: TagData[]
  onTagClick: (tag: string) => void
}

export function TagBubbleChart({ tags, onTagClick }: BubbleChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // D3 force simulation 구현
    // ...
  }, [tags])

  return (
    <svg ref={svgRef} width="100%" height="600" />
  )
}
```

#### 변경 #5: 태그 페이지 클라이언트 컴포넌트
**파일**: `src/components/tags-page-client.tsx` (새로 생성)

```tsx
'use client'

import { useState } from 'react'
import { TagBubbleChart } from './tag-bubble-chart'
import { BlogPostCard } from './blog-post-card'

interface TagsPageClientProps {
  tags: Array<{ tag: string; count: number }>
}

export default function TagsPageClient({ tags }: TagsPageClientProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [filteredPosts, setFilteredPosts] = useState([])

  const handleTagClick = async (tag: string) => {
    setSelectedTag(tag)
    // Fetch posts for this tag (client-side)
    const response = await fetch(`/data/posts.json`)
    const allPosts = await response.json()
    const filtered = allPosts.filter(post => post.tags?.includes(tag))
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

      {/* Bubble Chart */}
      <TagBubbleChart
        tags={tags.slice(0, 100)} // 상위 100개만 표시
        onTagClick={handleTagClick}
      />

      {/* Filtered Posts */}
      {selectedTag && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">
            #{selectedTag} ({filteredPosts.length})
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map(post => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

### 데이터 구조 검증

#### tags.json 예시 (실제 데이터)
```json
[
  { "tag": "ETF", "count": 26 },
  { "tag": "주식", "count": 20 },
  { "tag": "주간 브리핑", "count": 13 },
  { "tag": "주요 섹터", "count": 13 },
  { "tag": "주식 트랜드", "count": 13 }
]
```

---

## 5. 구현 계획 (Implementation Plan)

### Phase 1: 헤더 수정 (15분)
1. `src/components/header.tsx` 수정
2. Hash 아이콘 import 추가
3. Tags 버튼 추가 (Series 옆)
4. 로컬 확인: `npm run dev`

### Phase 2: 서버 함수 추가 (20분)
1. `src/lib/blog-server.ts`에 `getAllTagsServer()` 추가
2. `getPostsByTagServer()` 함수 추가
3. TypeScript 타입 체크 통과

### Phase 3: 태그 페이지 생성 (30분)
1. `src/app/tags/page.tsx` 생성
2. 메타데이터 설정
3. 서버 컴포넌트로 태그 데이터 로드

### Phase 4: Bubble Chart 구현 (2-3시간) ⚠️ **가장 시간 소요**
1. D3.js 설치: `npm install d3 @types/d3`
2. `src/components/tag-bubble-chart.tsx` 생성
3. Force simulation 구현
   - Bubble 크기 계산
   - Collision detection
   - 중앙 → 가장자리 배치
4. 스타일링 (색상, 호버 효과)
5. 다크모드 대응

### Phase 5: 클라이언트 인터랙션 (1시간)
1. `src/components/tags-page-client.tsx` 생성
2. 태그 클릭 핸들러
3. 포스트 필터링 로직
4. BlogPostCard 재사용

### Phase 6: 스타일링 및 반응형 (1시간)
1. 모바일 레이아웃 조정
2. 다크모드 색상 테스트
3. 접근성 속성 추가 (ARIA)

### Phase 7: 테스트 및 최적화 (1시간)
1. 로컬 빌드: `npm run build`
2. 프로덕션 테스트: `npm run start`
3. 성능 확인 (Lighthouse)
4. 다양한 화면 크기 테스트

### 총 소요 시간 예상
**6-8시간** (Bubble Chart 구현이 대부분의 시간 차지)

---

## 6. 예상 결과 (Expected Outcome)

### 시각적 변화

#### Before (현재)
```
태그 탐색 방법: 없음
사용자는 포스트를 하나씩 클릭해야 관련 태그 확인 가능
```

#### After (변경 후)
```
┌──────────────────────────────────────────┐
│           태그 탐색                        │
├──────────────────────────────────────────┤
│                                          │
│          ●●●                             │
│        ● ETF ●  (26개)                   │
│      ●●  주식  ●●  (20개)                │
│    ●   주간브리핑   ●  (13개)            │
│      ●●  미래에셋  ●●  (9개)             │
│          ●●●                             │
│                                          │
├──────────────────────────────────────────┤
│  # ETF (26개의 포스트)                    │
│  ┌──────┐ ┌──────┐ ┌──────┐             │
│  │Post 1│ │Post 2│ │Post 3│             │
│  └──────┘ └──────┘ └──────┘             │
└──────────────────────────────────────────┘
```

### 사용자 경험 개선
1. **시각적 탐색**: Bubble Chart로 태그 분포 한눈에 파악
2. **인터랙티브**: 클릭 한 번으로 관련 포스트 확인
3. **콘텐츠 발견**: 숨겨진 태그를 통해 새로운 주제 발견
4. **직관적 UI**: Bubble 크기로 인기 주제 즉시 파악

### 데이터 정확성
- 빌드 타임마다 자동 재계산
- 마크다운 파일의 태그 변경 시 자동 반영
- 수동 업데이트 불필요

---

## 7. 위험 요소 및 고려사항 (Risks and Considerations)

### 위험 요소

#### 위험 #1: 성능 문제 (가능성: 중간)
**증상**: 2,362개 태그 전체를 렌더링하면 브라우저 성능 저하
**해결책**:
- 상위 100개 태그만 Bubble Chart에 표시
- 나머지는 "모든 태그 보기" 버튼으로 목록 표시
- Virtual scrolling 적용 (react-window)

#### 위험 #2: D3.js 학습 곡선 (가능성: 높음)
**증상**: D3.js force simulation 구현 복잡도
**해결책**:
- 옵션 A: D3 대신 CSS Grid + 간단한 정렬 알고리즘 사용
- 옵션 B: recharts 라이브러리 사용 (bubble chart 지원)
- 옵션 C: 기존 D3 예제 코드 활용 및 수정

#### 위험 #3: 모바일 UX (가능성: 중간)
**증상**: 작은 화면에서 Bubble이 너무 작거나 겹침
**해결책**:
- 모바일: 간단한 리스트 뷰로 대체
- 태블릿 이상: Bubble Chart 표시
- 반응형 breakpoint: `md:` (768px)

#### 위험 #4: 한글 태그 렌더링 (가능성: 낮음)
**증상**: SVG 텍스트 렌더링 시 한글 깨짐
**해결책**:
- 시스템 폰트 사용 확인
- Tailwind 폰트 스택 활용
- UTF-8 인코딩 검증

### 고려사항

#### Bubble Chart 색상 전략
```typescript
// 옵션 1: 개수에 따른 그라데이션
const getColor = (count: number) => {
  if (count >= 20) return 'hsl(220, 90%, 60%)'  // 파랑 (인기)
  if (count >= 10) return 'hsl(160, 70%, 50%)'  // 초록 (중간)
  return 'hsl(30, 80%, 60%)'  // 주황 (적음)
}

// 옵션 2: 카테고리별 색상
const getCategoryColor = (tag: string) => {
  // ETF 관련: 파랑
  // 주식 관련: 초록
  // 세금 관련: 빨강
}

// 옵션 3: 랜덤 색상 (일관성 유지)
const getHashColor = (tag: string) => {
  // 태그명 해시 → 고유 색상
}
```

**권장**: 옵션 1 (개수 기반) - 사용자가 인기 주제를 쉽게 파악

#### 접근성 (Accessibility)
```tsx
<circle
  aria-label={`${tag} 태그, 포스트 ${count}개`}
  role="button"
  tabIndex={0}
  onKeyPress={(e) => e.key === 'Enter' && handleClick()}
/>
```

#### 대안 UI (Bubble Chart가 너무 복잡할 경우)
- **태그 클라우드**: 글자 크기로 개수 표현 (구현 간단)
- **카드 그리드**: Series 페이지와 동일한 레이아웃
- **트리맵**: 계층 구조 표현

---

## 8. 구현 체크리스트 (Implementation Checklist)

### 준비 작업
- [ ] D3.js 라이브러리 설치 (`npm install d3 @types/d3`)
- [ ] 기존 태그 데이터 구조 확인 (`public/data/tags.json`)

### 코드 변경
- [ ] `src/components/header.tsx`: Hash 아이콘 추가
- [ ] `src/lib/blog-server.ts`: `getAllTagsServer()` 함수 추가
- [ ] `src/lib/blog-server.ts`: `getPostsByTagServer()` 함수 추가
- [ ] `src/app/tags/page.tsx`: 태그 페이지 생성 (서버 컴포넌트)
- [ ] `src/components/tag-bubble-chart.tsx`: Bubble Chart 컴포넌트 생성
- [ ] `src/components/tags-page-client.tsx`: 클라이언트 인터랙션 로직

### Bubble Chart 구현
- [ ] Force simulation 초기화
- [ ] Bubble 크기 계산 로직
- [ ] Collision detection (겹침 방지)
- [ ] 중앙 → 가장자리 배치 알고리즘
- [ ] 클릭 이벤트 핸들러
- [ ] 호버 효과 (transition, scale)

### 스타일링
- [ ] 색상 스키마 정의 (개수 기반 그라데이션)
- [ ] 다크모드 색상 대응
- [ ] 반응형 디자인 (모바일/태블릿/데스크톱)
- [ ] 접근성 속성 (ARIA, tabIndex)

### 테스트
- [ ] 로컬 개발 환경 확인 (`npm run dev`)
- [ ] TypeScript 타입 체크 통과 (`npm run check`)
- [ ] ESLint 통과 (`npm run lint`)
- [ ] 프로덕션 빌드 성공 (`npm run build`)
- [ ] 프로덕션 로컬 테스트 (`npm run start`)
- [ ] Lighthouse 성능 점수 확인
- [ ] 모바일/태블릿/데스크톱 반응형 확인
- [ ] 다크모드 전환 테스트
- [ ] 한글 인코딩 확인 (UTF-8)

### 배포 전 검증
- [ ] Bubble Chart 애니메이션 확인
- [ ] 태그 클릭 → 포스트 필터링 동작 확인
- [ ] 2,362개 태그 중 상위 100개만 표시 확인
- [ ] 접근성 테스트 (스크린 리더, 키보드)

### Git 작업
- [ ] 커밋 메시지 작성 (한글, `.github/git-commit-instructions.md` 참고)
  ```
  [#이슈번호] feat: 태그 Bubble Chart 페이지 구현

  * 헤더에 태그 아이콘 추가
  * D3.js를 사용한 인터랙티브 Bubble Chart 구현
  * 태그 클릭 시 포스트 필터링 기능
  * 반응형 디자인 및 다크모드 지원
  ```
- [ ] PR 생성 및 리뷰 요청

---

## 9. 참고 자료 (References)

### 관련 파일 경로
```
/src/components/header.tsx                 ← 수정 (태그 아이콘 추가)
/src/lib/blog-server.ts                    ← 수정 (getTags 함수 추가)
/src/app/tags/page.tsx                     ← 신규 (태그 페이지)
/src/components/tag-bubble-chart.tsx       ← 신규 (Bubble Chart)
/src/components/tags-page-client.tsx       ← 신규 (클라이언트 로직)
/public/data/tags.json                     ← 데이터 소스 (자동 생성)
/scripts/generateStaticData.ts             ← 데이터 생성 스크립트
```

### 참고 구현
- `src/app/series/page.tsx`: 유사한 페이지 구조
- `src/components/category-filter-client.tsx`: 필터링 로직 참고

### 추가 문서
- `CLAUDE.md`: 프로젝트 개요 및 아키텍처
- `.github/git-commit-instructions.md`: 커밋 메시지 규칙

### 기술 스택
- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS, shadcn/ui
- **Data Visualization**: D3.js v7
- **Type Safety**: TypeScript 5.x
- **Icons**: lucide-react

### 외부 참고 자료
- [D3.js Force Simulation](https://d3js.org/d3-force)
- [D3 Bubble Chart Examples](https://observablehq.com/@d3/bubble-chart)
- [Recharts Bubble Chart](https://recharts.org/en-US/examples/SimpleScatterChart) (대안)

---

## 10. 결론 (Conclusion)

### 핵심 요약
- ✅ 태그 데이터는 이미 준비되어 있음 (tags.json에 2,362개 태그)
- ✅ 빌드 스크립트 수정 불필요
- ⚠️ Bubble Chart 구현이 핵심 과제 (D3.js 학습 필요)
- ✅ 6-8시간 내 구현 가능
- ⚠️ 중간 위험도 (D3.js 복잡도, 성능 고려)

### 권장 우선순위
**Medium-High Priority** - 사용자 경험을 크게 개선하지만 구현 복잡도가 있는 작업

### 구현 옵션 검토

#### 옵션 A: 전체 구현 (D3 Bubble Chart)
- **장점**: 매우 인터랙티브하고 시각적으로 매력적
- **단점**: 구현 복잡도 높음, 6-8시간 소요
- **추천**: 블로그의 핵심 기능으로 만들고 싶다면

#### 옵션 B: 간소화 (태그 클라우드)
- **장점**: 구현 간단 (2-3시간), 동일한 정보 전달
- **단점**: 시각적 매력 떨어짐
- **추천**: 빠른 MVP가 필요하다면

#### 옵션 C: 카드 그리드 (Series 방식)
- **장점**: 기존 코드 재사용, 1-2시간
- **단점**: 요구사항과 다름 (Bubble Chart 아님)
- **추천**: 일관성 있는 UI를 선호한다면

### 다음 단계
1. 이 PRD 검토 및 구현 옵션 선택
2. D3.js 간단한 예제로 학습 (1시간)
3. 단계별 구현 시작 (Phase 1부터)
4. 각 Phase마다 테스트 및 검증

---

**작성일**: 2025-11-02
**작성자**: Claude Code
**버전**: 1.0
**예상 구현 시간**: 6-8시간
**위험도**: 중간 (D3.js 학습 곡선)
