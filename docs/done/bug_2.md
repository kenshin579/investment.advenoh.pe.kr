# Bug #2: HTML 메타 태그 중복 문제

## 문제 요약

`http://localhost:3000`의 HTML 소스를 확인한 결과, 다음 메타 태그들이 중복으로 렌더링되고 있습니다:

- `<meta charset="utf-8">` - 여러 번 선언
- `<meta name="viewport">` - 여러 번 선언
- `<meta name="keywords">` - 여러 번 선언
- `<meta name="description">` - 여러 번 선언
- `<meta name="robots">` - 여러 번 선언
- Open Graph 태그들 (`og:description`, `og:site_name`, `og:locale`, `og:type`, `og:url`) - 여러 번 선언
- Twitter Card 태그들 (`twitter:title`, `twitter:description`, `twitter:card`) - 여러 번 선언

## 근본 원인 분석

### 1. Next.js Metadata API와 수동 메타 태그 생성의 이중 사용

**파일**: [src/app/layout.tsx](../../src/app/layout.tsx)

#### 문제점 1: Next.js Metadata API 사용 (자동 생성)

```typescript
// src/app/layout.tsx:29-44
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: '투자 인사이트 - 주식, ETF, 채권, 펀드 전문 블로그',
  description: '투자에 대한 깊이 있는 인사이트와 실전 경험을 공유하는 전문 금융 블로그입니다.',
  keywords: ['투자', '주식', 'ETF', '채권', '펀드', '금융', '재테크'],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: baseUrl,
    siteName: '투자 인사이트',
  },
  robots: {
    index: true,
    follow: true,
  }
}
```

**Next.js가 자동으로 생성하는 메타 태그**:
- `<title>`, `<meta name="description">`, `<meta name="keywords">`
- `<meta property="og:type">`, `<meta property="og:locale">`, `<meta property="og:url">`, `<meta property="og:site_name">`
- `<meta name="robots">`

#### 문제점 2: 수동 메타 태그 생성 (중복 생성)

```typescript
// src/app/layout.tsx:46-60
const siteMetadata = {
  title: '투자 인사이트 - 주식, ETF, 채권, 펀드 전문 블로그',
  description: '투자에 대한 깊이 있는 인사이트와 실전 경험을 공유하는 전문 금융 블로그입니다.',
  keywords: ['투자', '주식', 'ETF', '채권', '펀드', '금융', '재테크'],
  openGraph: { ... },
  robots: { ... }
}

// src/app/layout.tsx:63-98
function generateMetaTags(metadata: ...): React.ReactElement[] {
  // 수동으로 메타 태그 생성
  metaTags.push(<title key="title">{metadata.title}</title>)
  metaTags.push(<meta key="description" name="description" content={metadata.description} />)
  metaTags.push(<meta key="keywords" name="keywords" content={metadata.keywords.join(', ')} />)
  metaTags.push(<meta key="robots" name="robots" content={...} />)

  // Open Graph 태그들
  metaTags.push(<meta key="og:title" property="og:title" content={og.siteName} />)
  metaTags.push(<meta key="og:description" property="og:description" content={metadata.description} />)
  metaTags.push(<meta key="og:site_name" property="og:site_name" content={og.siteName} />)
  metaTags.push(<meta key="og:locale" property="og:locale" content={og.locale} />)
  metaTags.push(<meta key="og:type" property="og:type" content={og.type} />)
  metaTags.push(<meta key="og:url" property="og:url" content={og.url} />)

  // Twitter Card 태그들
  metaTags.push(<meta key="twitter:title" name="twitter:title" content={metadata.title} />)
  metaTags.push(<meta key="twitter:description" name="twitter:description" content={metadata.description} />)
  metaTags.push(<meta key="twitter:card" name="twitter:card" content="summary" />)

  return metaTags
}

// src/app/layout.tsx:107-113
<head>
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  {generateMetaTags({...siteMetadata, metadataBase: undefined})}
</head>
```

**결과**: Next.js가 자동으로 생성한 메타 태그 + 수동으로 생성한 메타 태그 = **중복 렌더링**

### 2. 페이지별 Metadata와 Layout Metadata의 병합

**파일들**:
- [src/app/page.tsx:6-9](../../src/app/page.tsx#L6-L9)
- [src/app/[category]/[slug]/page.tsx:36-76](../../src/app/[category]/[slug]/page.tsx#L36-L76)

각 페이지에서도 `export const metadata` 또는 `generateMetadata` 함수를 사용하여 메타데이터를 정의하고 있습니다:

```typescript
// src/app/page.tsx
export const metadata: Metadata = {
  title: '투자 인사이트 - 주식, ETF, 채권, 펀드 전문 블로그',
  description: '투자에 대한 깊이 있는 인사이트와 실전 경험을 공유하는 전문 금융 블로그입니다.',
}

// src/app/[category]/[slug]/page.tsx
export async function generateMetadata({ params }: CategorySlugPageProps): Promise<Metadata> {
  return {
    title: post.title,
    description: post.excerpt,
    keywords: [...post.tags, ...post.categories],
    openGraph: { ... },
    twitter: { ... },
  }
}
```

Next.js는 이러한 페이지별 metadata를 layout의 metadata와 병합하는데, layout에서 이미 수동으로 메타 태그를 생성하고 있기 때문에 추가 중복이 발생할 수 있습니다.

## 영향도

### SEO 및 성능 영향

1. **SEO 혼란**: 검색 엔진이 중복된 메타 태그를 발견하면 어느 것을 우선할지 불확실
2. **페이지 크기 증가**: 불필요한 중복 태그로 인한 HTML 크기 증가
3. **유지보수성 저하**: 메타데이터 변경 시 여러 곳을 수정해야 함
4. **표준 위반**: Next.js의 권장 패턴에서 벗어남

### 브라우저 동작

- 대부분의 브라우저와 크롤러는 **첫 번째 메타 태그를 우선**하여 사용
- Open Graph와 Twitter Card는 중복 시 예측 불가능한 동작 가능

## 해결 방안

### 권장 솔루션: Next.js Metadata API만 사용

Next.js 13+ App Router의 Metadata API를 사용하고, 수동 메타 태그 생성을 제거합니다.

**변경 필요 사항**:

1. **layout.tsx 수정**:
   - `generateMetaTags` 함수 제거
   - `siteMetadata` 객체 제거 (또는 주석 처리)
   - `<head>` 내부의 `{generateMetaTags(...)}` 호출 제거
   - `export const metadata`만 유지

2. **charset과 viewport는 유지**:
   ```typescript
   <head>
     <meta charSet="utf-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1" />
     <meta name="naver-site-verification" content="..." />
     <meta name="msvalidate.01" content="..." />
     <link rel="icon" href="/favicon.ico" />
     {/* Google Analytics, AdSense 스크립트는 유지 */}
   </head>
   ```

3. **페이지별 metadata는 유지**:
   - `src/app/page.tsx`의 `export const metadata`
   - `src/app/[category]/[slug]/page.tsx`의 `generateMetadata` 함수
   - Next.js가 자동으로 layout metadata와 병합

### 기대 효과

- ✅ 메타 태그 중복 제거
- ✅ Next.js 권장 패턴 준수
- ✅ 코드 간소화 및 유지보수성 향상
- ✅ SEO 개선
- ✅ HTML 크기 감소

## 참고 자료

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Next.js Metadata Files](https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
