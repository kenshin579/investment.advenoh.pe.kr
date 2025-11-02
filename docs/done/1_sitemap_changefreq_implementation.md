# Sitemap Changefreq 구현 가이드

## 수정 대상 파일
- `scripts/generateSitemap.ts`

## 구현 내용

### 1. changefreq 결정 함수 추가

파일: `scripts/generateSitemap.ts`

```typescript
function determineChangefreq(url: string): string {
  const baseUrl = process.env.SITE_URL || 'https://investment.advenoh.pe.kr';

  // 홈페이지
  if (url === baseUrl) {
    return 'daily';
  }

  // Weekly 카테고리
  if (url.includes('/weekly/')) {
    return 'weekly';
  }

  // 기타 모든 페이지
  return 'monthly';
}
```

### 2. 기존 코드 수정

**변경 전:**
```typescript
const staticPages = [
  { url: baseUrl, changefreq: 'daily', priority: '1.0' },
  { url: `${baseUrl}/series`, changefreq: 'weekly', priority: '0.7' },
];

const postUrls = posts.map(post => {
  // ...
  return {
    url: `${baseUrl}/${category.toLowerCase()}/${post.slug}`,
    changefreq: 'weekly',  // 하드코딩된 값
    priority: isRecent ? '0.9' : '0.8',
    lastmod: post.date
  };
});
```

**변경 후:**
```typescript
const staticPages = [
  { url: baseUrl, changefreq: determineChangefreq(baseUrl), priority: '1.0' },
  { url: `${baseUrl}/series`, changefreq: determineChangefreq(`${baseUrl}/series`), priority: '0.7' },
];

const postUrls = posts.map(post => {
  const postUrl = `${baseUrl}/${category.toLowerCase()}/${post.slug}`;
  // ...
  return {
    url: postUrl,
    changefreq: determineChangefreq(postUrl),  // 동적 결정
    priority: isRecent ? '0.9' : '0.8',
    lastmod: post.date
  };
});
```

## 테스트 방법

### 1. 빌드 실행
```bash
npm run build
```

### 2. sitemap.xml 확인
```bash
# 홈페이지 changefreq 확인 (daily 예상)
grep -A 2 "https://investment.advenoh.pe.kr</loc>" public/sitemap.xml

# Weekly 포스트 changefreq 확인 (weekly 예상)
grep -A 2 "/weekly/" public/sitemap.xml | head -10

# 기타 포스트 changefreq 확인 (monthly 예상)
grep -A 2 "/stock/" public/sitemap.xml | head -10
grep -A 2 "/etc/" public/sitemap.xml | head -10
```

### 3. 유효성 검사
- XML 포맷이 올바른지 확인
- 모든 URL이 정상적으로 생성되었는지 확인
- changefreq 값이 규칙대로 적용되었는지 확인

## 예상 결과

```xml
<!-- 홈페이지: daily -->
<url>
  <loc>https://investment.advenoh.pe.kr</loc>
  <changefreq>daily</changefreq>
  <priority>1.0</priority>
</url>

<!-- Weekly 포스트: weekly -->
<url>
  <loc>https://investment.advenoh.pe.kr/weekly/2024-investment-summary</loc>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
  <lastmod>2024-01-15</lastmod>
</url>

<!-- 기타 포스트: monthly -->
<url>
  <loc>https://investment.advenoh.pe.kr/stock/apple-analysis</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
  <lastmod>2023-12-01</lastmod>
</url>
```
