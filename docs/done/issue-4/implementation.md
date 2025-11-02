# Implementation Guide: Next.js Static Export 전환

## 1. 구현 개요

### 목표
- Express.js + Next.js 하이브리드 구조에서 Next.js Static Export로 전환
- 백엔드 서버 완전 제거, 정적 사이트로 변환
- Netlify에 배포 가능한 정적 빌드 구성
- 기존 사이트 Look & Feel 100% 유지

### 기술 스택 변경사항
| 항목 | 현재 | 변경 후 |
|------|------|---------|
| 서버 | Express.js + Next.js | Next.js Only (Static) |
| 데이터 저장 | In-memory / PostgreSQL | JSON 파일 |
| 배포 방식 | Node.js Server | Static Hosting |
| 콘텐츠 관리 | 서버 런타임 Import | 빌드타임 생성 |
| 호스팅 | Replit (Node.js) | Netlify (CDN) |

## 2. 아키텍처 변경

### 2.1 데이터 플로우 변경

**현재 아키텍처:**
```
User Request → Express Server → MemStorage → API Response → Next.js SSR → HTML
```

**변경 후 아키텍처:**
```
Build Time: Markdown → JSON Generation → Static HTML
Runtime: User Request → CDN → Static HTML/JSON
```

### 2.2 파일 구조 변경

```
# 제거할 디렉토리/파일
server/                 # Express 서버 전체 제거
├── index.ts
├── routes.ts
├── storage.ts
└── services/

src/app/api/           # Next.js API 라우트 제거
shared/schema.ts       # Drizzle 스키마 제거
drizzle.config.ts      # Drizzle 설정 제거
.replit                # Replit 설정 제거

# 추가할 디렉토리/파일
scripts/               # 빌드 스크립트
├── generateStaticData.ts
├── generateSitemap.ts
└── generateRssFeed.ts

public/data/           # 생성된 정적 데이터
├── posts.json
├── categories.json
├── series.json
└── tags.json
```

## 3. 핵심 구현 상세

### 3.1 Next.js 설정 변경

**next.config.ts:**
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',            // 정적 export 활성화
  trailingSlash: true,        // 디렉토리 구조 URL
  images: {
    unoptimized: true,        // 이미지 최적화 비활성화 (정적 사이트)
  },
  basePath: '',
  assetPrefix: '',
}

export default nextConfig
```

### 3.2 빌드 스크립트 구현

**scripts/generateStaticData.ts:**
```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { glob } from 'glob'

// 1. 모든 마크다운 파일 읽기
// 2. Frontmatter 파싱 및 콘텐츠 처리
// 3. JSON 파일로 저장
// 4. 카테고리, 태그, 시리즈 집계
```

### 3.3 정적 페이지 생성

**src/app/[category]/[slug]/page.tsx:**
```typescript
export async function generateStaticParams() {
  const posts = await getStaticPosts()
  return posts.map(post => ({
    category: post.category,
    slug: post.slug,
  }))
}
```

### 3.4 클라이언트 사이드 검색

**src/components/search-client.tsx:**
```typescript
'use client'
import { useState, useEffect } from 'react'
import posts from '/data/posts.json'

// 클라이언트 사이드 필터링 로직
// 검색, 카테고리, 태그 필터링
```

## 4. 마이그레이션 단계별 가이드

### Phase 1: 빌드 스크립트 작성
1. `scripts/generateStaticData.ts` 작성
   - 마크다운 파일 파싱
   - JSON 데이터 생성
   - 메타데이터 집계

2. `scripts/generateSitemap.ts` 작성
   - sitemap.xml 생성
   - robots.txt 생성

3. `scripts/generateRssFeed.ts` 작성
   - RSS feed 생성

### Phase 2: Next.js 설정 변경
1. `next.config.ts` 수정
   - output: 'export' 설정
   - 이미지 최적화 비활성화
   - trailingSlash 활성화

2. `package.json` 스크립트 수정
   ```json
   {
     "scripts": {
       "dev": "next dev",
       "prebuild": "tsx scripts/generateStaticData.ts",
       "build": "next build",
       "postbuild": "tsx scripts/generateSitemap.ts"
     }
   }
   ```

### Phase 3: 페이지 컴포넌트 리팩토링

1. **동적 라우트 수정:**
   - `generateStaticParams` 구현
   - 서버 API 호출 제거
   - JSON 파일에서 데이터 로드

2. **데이터 Fetching 변경:**
   ```typescript
   // Before (서버 API)
   const posts = await fetch('/api/blog-posts')

   // After (정적 JSON)
   import posts from '@/data/posts.json'
   ```

### Phase 4: 클라이언트 기능 구현

1. **검색 기능:**
   - 클라이언트 사이드 필터링
   - Fuse.js 또는 간단한 필터 로직

2. **페이지네이션:**
   - 클라이언트 사이드 페이징
   - URL 쿼리 파라미터 활용

### Phase 5: 서버 코드 제거

1. **제거할 파일:**
   - `server/` 디렉토리 전체
   - `src/app/api/` 디렉토리
   - `src/lib/blog-client.ts`
   - Database 관련 파일들

2. **패키지 정리:**
   ```bash
   npm uninstall express drizzle-orm @neondatabase/serverless
   npm uninstall @types/express tsx esbuild
   ```

### Phase 6: 빌드 및 배포

1. **로컬 빌드 테스트:**
   ```bash
   npm run build
   npx serve out  # 정적 파일 테스트
   ```

2. **Netlify 배포 설정:**
   - Build command: `npm run build`
   - Publish directory: `out/`
   - Environment variables 제거

## 5. 기능별 마이그레이션 상세

### 5.1 블로그 포스트 목록
- **현재:** Express API → MemStorage 조회
- **변경:** posts.json 로드 → 클라이언트 필터링
- **구현 포인트:**
  - 초기 로드 시 전체 포스트 목록 로드
  - useMemo로 필터링 최적화
  - 가상 스크롤링 고려 (100+ 포스트)

### 5.2 카테고리/태그 필터링
- **현재:** 서버 사이드 필터링
- **변경:** 클라이언트 사이드 필터링
- **구현 포인트:**
  - URL 쿼리 파라미터 동기화
  - 필터 상태 관리 (useState/useReducer)

### 5.3 시리즈 네비게이션
- **현재:** 서버에서 시리즈 정보 조회
- **변경:** series.json에서 정적 로드
- **구현 포인트:**
  - 빌드 시 시리즈 관계 미리 계산
  - 이전/다음 포스트 링크 포함

### 5.4 RSS Feed
- **현재:** Express 라우트에서 동적 생성
- **변경:** 빌드 시 정적 파일 생성
- **구현 포인트:**
  - public/rss.xml로 생성
  - 최근 20개 포스트 포함

### 5.5 Sitemap
- **현재:** Express 라우트에서 동적 생성
- **변경:** 빌드 시 정적 파일 생성
- **구현 포인트:**
  - public/sitemap.xml로 생성
  - 모든 포스트 URL 포함

## 6. 성능 최적화

### 6.1 JSON 파일 최적화
- posts.json 분할 고려 (카테고리별)
- 초기 로드 최소화 (lazy loading)
- Gzip 압축 활용

### 6.2 이미지 최적화
- WebP/AVIF 포맷 사용
- 적절한 크기로 사전 리사이징
- Lazy loading 적용

### 6.3 번들 최적화
- 코드 스플리팅
- Tree shaking
- 불필요한 의존성 제거

## 7. 제거되는 기능 대체 방안

### 7.1 조회수 카운팅
- **제거 이유:** 서버 없이 불가능
- **대체 방안:** Google Analytics 이벤트

### 7.2 뉴스레터 구독
- **제거 이유:** 서버 API 필요
- **대체 방안:**
  - Mailchimp 임베드 폼
  - ConvertKit 위젯
  - Netlify Forms

### 7.3 동적 검색
- **제거 이유:** 서버 사이드 검색 불가
- **대체 방안:** 클라이언트 사이드 필터링

## 8. 배포 프로세스

### 8.1 Netlify 설정

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "out"

[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

### 8.2 GitHub Actions CI/CD

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Netlify
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: netlify/actions/deploy@v1
        with:
          publish-dir: './out'
```

## 9. 테스트 체크리스트

### 빌드 검증
- [ ] `npm run build` 성공
- [ ] out/ 디렉토리 생성 확인
- [ ] 모든 페이지 HTML 파일 생성

### 기능 검증
- [ ] 홈페이지 정상 로드
- [ ] 블로그 포스트 상세 페이지
- [ ] 카테고리 필터링
- [ ] 검색 기능
- [ ] 시리즈 네비게이션
- [ ] RSS Feed 접근
- [ ] Sitemap 접근

### 성능 검증
- [ ] Lighthouse 점수 90+
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] 번들 사이즈 < 500KB

## 10. 롤백 계획

만약 정적 사이트 전환에 문제가 발생하면:

1. **Git 롤백:**
   ```bash
   git revert <commit-hash>
   ```

2. **서버 복구:**
   - server/ 디렉토리 복원
   - Express 의존성 재설치
   - 환경 변수 복구

3. **배포 롤백:**
   - Netlify에서 이전 배포로 롤백
   - 또는 Replit으로 재배포

## 11. 마이그레이션 후 관리

### 콘텐츠 업데이트 워크플로우
1. 마크다운 파일 추가/수정
2. Git commit & push
3. CI/CD 자동 빌드
4. Netlify 자동 배포

### 모니터링
- Google Analytics 설정
- Netlify Analytics 활용
- Sentry 에러 트래킹

---

작성일: 2025-10-19
버전: 1.0
작성자: Claude Code Assistant