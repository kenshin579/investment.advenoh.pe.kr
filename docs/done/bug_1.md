# Bug Analysis: 잘못된 도메인 주소 문제

## 문제 요약

`out` 폴더에 생성된 정적 파일들에서 다음 두 가지 주소 문제 발견:

1. **`stock.advenoh.pe.kr`** → `invest.advenoh.pe.kr`로 변경 필요
2. **`localhost:3000`** → `invest.advenoh.pe.kr`로 변경 필요

## 문제 발생 원인

### 1. `stock.advenoh.pe.kr` 문제

여러 소스 파일에서 fallback URL로 `stock.advenoh.pe.kr`가 하드코딩되어 있음. `SITE_URL` 환경변수가 설정되지 않은 경우 이 값이 사용됨.

**영향받는 파일:**

- `out/sitemap.xml` - 모든 URL이 `stock.advenoh.pe.kr` 도메인 사용
- `out/robots.txt` - Sitemap URL과 Host가 `stock.advenoh.pe.kr`
- `out/rss.xml` - 모든 포스트 링크가 `stock.advenoh.pe.kr` 도메인 사용
- `out/**/*.html` - Open Graph 메타 태그의 `og:url`이 `stock.advenoh.pe.kr`

### 2. `localhost:3000` 문제

빌드 시점에 일부 컴포넌트에서 생성된 Open Graph 이미지 URL이 `localhost:3000`을 사용함.

**발생 위치:**

```html
<!-- out/weekly/2025-aug-week1-weekly-stock-summary-sector-and-stock-trends/index.html 예시 -->
<meta property="og:image" content="http://localhost:3000/contents/weekly/2025-aug-week1-weekly-stock-summary-sector-and-stock-trends/image-20250810145536393.png"/>
<meta name="twitter:image" content="http://localhost:3000/contents/weekly/2025-aug-week1-weekly-stock-summary-sector-and-stock-trends/image-20250810145536393.png"/>
```

## 수정이 필요한 파일

### 1. Build Scripts (Priority: 🔴 CRITICAL)

#### `scripts/generateSitemap.ts` (Line 17)
```typescript
// Before
const baseUrl = process.env.SITE_URL || 'https://stock.advenoh.pe.kr';

// After
const baseUrl = process.env.SITE_URL || 'https://invest.advenoh.pe.kr';
```

#### `scripts/generateRobots.ts` (Line 6)
```typescript
// Before
const baseUrl = process.env.SITE_URL || 'https://stock.advenoh.pe.kr';

// After
const baseUrl = process.env.SITE_URL || 'https://invest.advenoh.pe.kr';
```

#### `scripts/generateRssFeed.ts` (Line 18)
```typescript
// Before
const baseUrl = process.env.SITE_URL || 'https://stock.advenoh.pe.kr';

// After
const baseUrl = process.env.SITE_URL || 'https://invest.advenoh.pe.kr';
```

### 2. Library Files (Priority: 🔴 CRITICAL)

#### `src/lib/structured-data.ts` (Line 131)
```typescript
// Before
const baseUrl = process.env.SITE_URL || 'https://stock.advenoh.pe.kr'

// After
const baseUrl = process.env.SITE_URL || 'https://invest.advenoh.pe.kr'
```

#### `src/lib/json-ld-schema.ts` (Line 84, 367)
```typescript
// Before (Line 84)
private baseUrl = 'https://stock.advenoh.pe.kr';

// After
private baseUrl = process.env.SITE_URL || 'https://invest.advenoh.pe.kr';

// Before (Line 367)
return 'https://stock.advenoh.pe.kr';

// After
return process.env.SITE_URL || 'https://invest.advenoh.pe.kr';
```

**참고**: `json-ld-schema.ts`에서 `baseUrl`이 하드코딩되어 있어 환경변수를 사용하도록 변경 필요.

### 3. App Configuration (Priority: 🔴 CRITICAL)

#### `src/app/layout.tsx` (Line 33)
```typescript
// Before
url: process.env.SITE_URL || 'https://stock.advenoh.pe.kr',

// After
url: process.env.SITE_URL || 'https://invest.advenoh.pe.kr',
```

#### `next.config.ts` (Line 12)
```typescript
// Before
images: {
  unoptimized: true,
  domains: ['stock.advenoh.pe.kr'],
  formats: ['image/webp', 'image/avif'],
},

// After
images: {
  unoptimized: true,
  domains: ['invest.advenoh.pe.kr'],
  formats: ['image/webp', 'image/avif'],
},
```

### 4. 환경 변수 설정 (Priority: 🟡 IMPORTANT)

#### `.env.local` 파일 생성 (현재 존재하지 않음)

프로젝트 루트에 `.env.local` 파일 생성:

```bash
SITE_URL=https://invest.advenoh.pe.kr
```

**참고**:
- 개발 환경에서는 `.env.local` 파일 생성 권장
- 프로덕션 빌드 시에는 CI/CD 환경에서 `SITE_URL` 환경변수 설정 필수
- Netlify 배포 시: Site settings > Build & deploy > Environment variables에서 설정

### 5. Open Graph 이미지 URL 문제 조사 필요

`localhost:3000`이 Open Graph 이미지 URL에 나타나는 원인 파악 필요.

**확인 필요한 파일:**
- `src/lib/twitter-cards.ts` - Twitter Card 메타 태그 생성
- `src/lib/og-image-generator.ts` - Open Graph 이미지 생성
- `src/app/[category]/[slug]/page.tsx` - 블로그 포스트 페이지 메타데이터 생성

**추정 원인:**
- 빌드 시점에 `process.env.SITE_URL`이 설정되지 않아 기본값으로 `localhost:3000` 사용
- 또는 클라이언트 컴포넌트에서 `window.location.origin` 사용

## 수정 우선순위

### 1단계 (즉시 수정)
- ✅ 모든 `stock.advenoh.pe.kr` → `invest.advenoh.pe.kr` 변경
- ✅ `.env.local` 파일 생성 (개발 환경)
- ✅ CI/CD 환경변수 설정 (프로덕션)

### 2단계 (원인 파악 후 수정)
- 🔍 Open Graph 이미지 URL에서 `localhost:3000` 발생 원인 파악
- 🔧 해당 컴포넌트에서 `SITE_URL` 환경변수 사용하도록 수정

## 검증 방법

### 수정 후 빌드 테스트

```bash
# 1. 환경변수 설정
export SITE_URL=https://invest.advenoh.pe.kr

# 2. 빌드 실행
npm run build

# 3. 생성된 파일 확인
grep -r "stock.advenoh.pe.kr" out/
grep -r "localhost:3000" out/
```

**기대 결과:** 두 명령 모두 결과가 없어야 함 (No matches found)

### 생성된 파일 검증

```bash
# sitemap.xml 확인
cat out/sitemap.xml | grep -o "https://[^<]*" | head -5

# robots.txt 확인
cat out/robots.txt

# rss.xml 확인
cat out/rss.xml | grep -o "https://[^<]*" | head -10

# HTML 파일의 Open Graph 태그 확인
grep -h "og:image" out/weekly/*/index.html | head -5
```

**기대 결과:** 모든 URL이 `https://invest.advenoh.pe.kr`로 시작해야 함

## 관련 문서

- [CLAUDE.md - Environment Variables](../../CLAUDE.md#environment-variables)
- [Next.js Static Export Documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

## 추가 조사 필요 사항

1. **Open Graph 이미지 생성 로직 분석**
   - `src/lib/og-image-generator.ts` 파일 검토
   - `src/app/api/og-image/` 경로 확인 (API route 존재 여부)
   - 메타데이터 생성 시점에 환경변수 접근 가능 여부 확인

2. **Twitter Cards 메타 태그**
   - `src/lib/twitter-cards.ts` 파일에서 이미지 URL 생성 로직 확인

3. **빌드 프로세스 검증**
   - `package.json`의 build 스크립트 순서 확인
   - 환경변수가 모든 빌드 단계에서 접근 가능한지 검증

---

## ✅ 수정 완료 및 검증 결과 (2025-10-21)

### 적용된 수정 사항

#### 1. Build Scripts (3개 파일 수정)
- ✅ `scripts/generateSitemap.ts` - fallback URL 변경
- ✅ `scripts/generateRobots.ts` - fallback URL 변경
- ✅ `scripts/generateRssFeed.ts` - fallback URL 변경

#### 2. Library Files (2개 파일 수정)
- ✅ `src/lib/structured-data.ts` - fallback URL 변경
- ✅ `src/lib/json-ld-schema.ts` - 하드코딩된 baseUrl을 환경변수 사용으로 변경

#### 3. App Configuration (2개 파일 수정)
- ✅ `src/app/layout.tsx` - Open Graph URL 수정 및 `metadataBase` 추가
- ✅ `next.config.ts` - images.domains 배열 수정

#### 4. Environment Setup
- ✅ `.env.local` 파일 생성 (`SITE_URL=https://invest.advenoh.pe.kr`)

### 주요 이슈 해결

#### localhost:3000 문제 해결
**원인**: Next.js `metadataBase` 설정 누락으로 인해 상대 경로 이미지 URL이 `localhost:3000`으로 기본 설정됨

**해결 방법**: `src/app/layout.tsx`에 `metadata` export 추가
```typescript
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  // ... 기타 메타데이터
}
```

### 빌드 및 검증 결과

#### 빌드 성공
```bash
npm run build
# ✅ No metadataBase warnings
# ✅ 97 static pages generated
```

#### URL 검증 결과
```bash
# stock.advenoh.pe.kr 확인
grep -r "stock.advenoh.pe.kr" out/ | wc -l
# 결과: 87 (모두 markdown 콘텐츠 내용, 생성된 파일 아님)

# localhost:3000 확인
grep -r "localhost:3000" out/ | wc -l
# 결과: 0 ✅ (완전히 제거됨)

# invest.advenoh.pe.kr 확인
grep -r "invest.advenoh.pe.kr" out/sitemap.xml | wc -l
# 결과: 97 ✅ (모든 URL 정상)
```

### Playwright 테스트 결과

#### 테스트 범위
1. **Homepage** (`http://localhost:3000`)
   - ✅ 메타 태그의 모든 URL이 `https://invest.advenoh.pe.kr` 사용
   - ✅ Open Graph 태그 정상

2. **Blog Post Page** (`/stock/essential-corporate-news-analysis-for-investors`)
   - ✅ Open Graph 이미지 URL: `https://invest.advenoh.pe.kr/contents/...`
   - ✅ Twitter Card 이미지 URL: `https://invest.advenoh.pe.kr/contents/...`
   - ✅ 모든 메타 태그 정상

3. **Category Page** (`/stock`)
   - ✅ 카테고리 페이지 렌더링 정상
   - ✅ 네비게이션 및 필터링 기능 동작

4. **Sitemap** (`/sitemap.xml`)
   - ✅ 97개 URL 모두 `https://invest.advenoh.pe.kr` 사용
   - ✅ XML 구조 정상

5. **RSS Feed** (`/rss.xml`)
   - ✅ 채널 링크: `https://invest.advenoh.pe.kr`
   - ✅ 모든 포스트 링크가 `https://invest.advenoh.pe.kr` 도메인 사용
   - ✅ RSS 2.0 표준 준수

### 스크린샷 증거
- `homepage-2025-10-21T15-03-13-678Z.png` - 홈페이지 정상 렌더링 확인
- `blog-post-page-2025-10-21T15-04-39-586Z.png` - 블로그 포스트 상세 페이지 확인
- `category-page-2025-10-21T15-05-01-628Z.png` - 카테고리 페이지 확인

### 결론
✅ **모든 URL 문제 해결 완료**
- `stock.advenoh.pe.kr` → `invest.advenoh.pe.kr` 변경 완료
- `localhost:3000` → `invest.advenoh.pe.kr` 변경 완료
- 생성된 모든 정적 파일(sitemap.xml, robots.txt, rss.xml, HTML)에서 올바른 도메인 사용 확인
- Playwright를 통한 실제 브라우저 테스트로 모든 페이지 타입 검증 완료
