# 이슈 #6: Article Header에서 Featured Image 제거

## 문제 설명

**현상**:
- 로컬 환경 (http://localhost:3000): 블로그 포스트 header에 큰 Featured Image가 렌더링됨
- 예전 서버 버전 (https://stock.advenoh.pe.kr): Featured Image가 렌더링되지 않음

**스크린샷 분석**:
- 제목 아래에 메타 정보 (작성자, 날짜, 태그)
- 그 다음에 큰 검은색 배경의 이미지 표시 ← 이것이 문제
- "1. 개요" 섹션 시작

**목표**:
- Article header에서 Featured Image가 렌더링되지 않도록 수정

## 원인 분석

### 페이지 구조

**파일**: `src/app/[category]/[slug]/page.tsx`

```tsx
<article>                              // 156번 줄
  <header>                             // 166번 줄
    <h1>{post.title}</h1>              // 167번 줄
    
    <div>                              // 169번 줄
      {/* 메타 정보: 작성자, 날짜, 카테고리, 태그 */}
    </div>
    
    {post.featuredImage && (           // 209번 줄 ← 문제!
      <div>
        <img src={post.featuredImage} />
      </div>
    )}
  </header>                            // 219번 줄
  
  {/* Series 정보 */}                  // 221-252번 줄
  
  <div>                                // 254번 줄
    <MarkdownRenderer content={...} /> // 257번 줄
  </div>
</article>
```

### 문제의 코드

**파일**: `src/app/[category]/[slug]/page.tsx`
**위치**: 209-218번 줄

```tsx
{post.featuredImage && (
  <div className="relative overflow-hidden rounded-lg mb-6">
    <img
      src={post.featuredImage}
      alt={post.title}
      className="w-full h-64 md:h-96 object-cover"
      loading="lazy"
    />
  </div>
)}
```

이 코드는:
- `post.featuredImage` 값이 있으면 자동으로 이미지를 렌더링
- Article header 안에 위치함 (메타 정보 바로 아래)
- 스크린샷에서 보이는 큰 검은색 이미지가 바로 이것

### featuredImage 데이터 흐름

1. **Markdown 파일**: frontmatter에 `featuredImage` 필드 정의 (선택사항)
2. **Static Data 생성**: `scripts/generateStaticData.ts`에서 JSON으로 변환
3. **Blog 데이터**: `src/lib/blog.ts`에서 로드
4. **Page 컴포넌트**: `post.featuredImage` 값 사용

## 해결 방법

### 옵션 1: Featured Image 렌더링 제거 (권장)

**파일**: `src/app/[category]/[slug]/page.tsx`

**변경 전** (209-218번 줄):
```tsx
{post.featuredImage && (
  <div className="relative overflow-hidden rounded-lg mb-6">
    <img
      src={post.featuredImage}
      alt={post.title}
      className="w-full h-64 md:h-96 object-cover"
      loading="lazy"
    />
  </div>
)}
```

**변경 후 (옵션 A - 주석 처리)**:
```tsx
{/* Featured Image 비활성화
{post.featuredImage && (
  <div className="relative overflow-hidden rounded-lg mb-6">
    <img
      src={post.featuredImage}
      alt={post.title}
      className="w-full h-64 md:h-96 object-cover"
      loading="lazy"
    />
  </div>
)}
*/}
```

**변경 후 (옵션 B - 완전 삭제)**:
```tsx
// 209-218번 줄 전체 삭제
```

**장점**:
- 가장 간단하고 명확한 방법
- Featured Image 데이터는 유지되므로 SEO 메타데이터에서 계속 사용 가능
- 나중에 다시 활성화 가능 (주석 처리한 경우)

### 옵션 2: 조건부 렌더링 (고급)

환경 변수나 설정으로 제어:

```tsx
{process.env.NEXT_PUBLIC_SHOW_FEATURED_IMAGE === 'true' && post.featuredImage && (
  <div className="relative overflow-hidden rounded-lg mb-6">
    <img
      src={post.featuredImage}
      alt={post.title}
      className="w-full h-64 md:h-96 object-cover"
      loading="lazy"
    />
  </div>
)}
```

**장점**:
- 환경별로 유연하게 제어 가능
- 개발/프로덕션 환경 분리

**단점**:
- 환경 변수 관리 필요
- 복잡도 증가

## 영향 범위

### 영향을 받는 파일
- `src/app/[category]/[slug]/page.tsx` (209-218번 줄만 수정)

### 영향을 받지 않는 부분
- Markdown content 내의 이미지는 그대로 렌더링됨
- `src/components/markdown-renderer.tsx` (수정 불필요)
- `src/components/markdown-image.tsx` (수정 불필요)
- SEO 메타데이터의 `og:image` (계속 featuredImage 사용)

### SEO 메타데이터는 유지됨

**파일**: `src/app/[category]/[slug]/page.tsx` (56-70번 줄)

```tsx
openGraph: {
  images: post.featuredImage ? [
    {
      url: post.featuredImage,
      width: 1200,
      height: 630,
      alt: post.title,
    }
  ] : [],
},
twitter: {
  images: post.featuredImage ? [post.featuredImage] : [],
},
```

이 부분은 영향을 받지 않으므로:
- 소셜 미디어 공유 시 썸네일 이미지는 계속 표시됨
- SEO에는 영향 없음

## 테스트 방법

### 1. 로컬 개발 서버에서 확인
```bash
npm run dev
```

브라우저에서 http://localhost:3000/stock/essential-corporate-news-analysis-for-investors/ 접속:
- 제목과 메타 정보 확인
- **큰 이미지가 없어야 함** ✅
- "1. 개요" 섹션이 바로 시작되어야 함

### 2. 프로덕션 빌드 테스트
```bash
npm run build
npm run start
```

http://localhost:3000 에서 동일하게 확인

### 3. Playwright를 사용한 자동화 테스트
```bash
npm run start

# MCP Playwright로 테스트
# - 블로그 포스트 페이지 접속
# - 스크린샷 캡처
# - header 내에 큰 이미지 태그가 없는지 확인
```

### 4. SEO 메타데이터 확인
브라우저 개발자 도구에서 확인:
```html
<meta property="og:image" content="..." /> <!-- 여전히 존재해야 함 -->
```

## 추가 참고사항

### Markdown content의 이미지는?

Markdown 파일에 있는 이미지 구문:
```markdown
![토스 증권 - 호재 뉴스](image-20250927202615775.png)
```

이런 이미지들은:
- `MarkdownRenderer` 컴포넌트를 통해 렌더링됨
- 이번 수정과는 **무관**
- 계속 정상적으로 표시됨

만약 markdown content의 이미지도 제거하고 싶다면:
- `src/components/markdown-renderer.tsx`의 155-166번 줄 수정 필요
- `img` 컴포넌트가 `null` 반환하도록 변경

### Featured Image vs Content Image

| 구분 | Featured Image | Content Image |
|------|---------------|---------------|
| 위치 | Article header | Markdown content 안 |
| 소스 | `post.featuredImage` | Markdown `![](...)` |
| 렌더링 | `page.tsx` (209-218번 줄) | `markdown-renderer.tsx` |
| 이번 수정 대상 | ✅ Yes | ❌ No |

## 결론

**수정이 필요한 파일**: `src/app/[category]/[slug]/page.tsx`

**수정 위치**: 209-218번 줄

**수정 내용**: Featured Image 렌더링 조건문 제거 또는 주석 처리

**권장 방법**: 주석 처리 (나중에 복원 가능)

이렇게 하면:
- Article header에서 큰 이미지가 사라짐
- 제목 → 메타정보 → 바로 콘텐츠 시작
- SEO 메타데이터는 유지됨
- 예전 서버 버전과 동일한 동작
