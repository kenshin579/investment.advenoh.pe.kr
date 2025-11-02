# PRD: Next.js Static Export 전환 (Backend 제거)

## 프로젝트 개요

**목표**: 현재 Express + Next.js 하이브리드 아키텍처를 Next.js Static Export로 전환하여 백엔드 없이 정적 페이지로 블로그 배포

**배경**:
- 현재: Express 서버가 API 라우트, 마크다운 파일 import, 동적 라우팅 처리
- 목표: 빌드 타임에 모든 페이지를 정적 HTML로 생성하여 CDN/호스팅 서비스에 배포
- 이점: 서버 비용 절감, 무한 확장성, 빠른 로딩 속도, 간단한 배포

## 현재 아키텍처 분석

### Express 서버 의존성 컴포넌트

서버 인프라 (server/):
- server/index.ts: Express 서버 엔트리포인트
- server/routes.ts: API 라우트 정의
- server/storage.ts: In-memory 데이터 저장소
- server/services/: RSS, Sitemap, 콘텐츠 import

Express API 엔드포인트:
- GET /api/blog-posts: 블로그 포스트 목록
- GET /api/blog-posts/:slug: 단일 포스트 조회
- GET /api/categories: 카테고리 목록
- GET /api/series: 시리즈 목록
- POST /api/newsletter/subscribe: 뉴스레터 구독

데이터 레이어:
- MemStorage: In-memory 저장소
- contentImporter: 마크다운 파일 import
- Drizzle ORM: 선택적 데이터베이스

### 콘텐츠 구조

contents/
- etc/: 9개 포스트
- etf/: 12개 포스트
- stock/: 68개 포스트
- weekly/: 14개 포스트

총 103개의 마크다운 포스트

## 변경 요구사항

### Next.js 설정 변경

next.config.ts:
- output: 'export' 활성화
- trailingSlash: true 설정
- images: { unoptimized: true }

### 제거할 컴포넌트

- server/ 디렉토리 전체
- Express 관련 dependencies
- Database 관련 코드
- src/app/api/ 디렉토리
- src/lib/blog-client.ts

### 추가/수정할 컴포넌트

1. scripts/generateStaticData.ts
   - 마크다운 파일을 JSON으로 변환
   - public/data/posts.json 생성

2. scripts/generateSitemap.ts
   - sitemap.xml, rss.xml, robots.txt 생성

3. 클라이언트 사이드 검색/필터링
   - JSON 데이터 로드하여 필터링

### 기능별 변경 전략

블로그 포스트:
- 현재: Express API → MemStorage
- 변경: 빌드타임 JSON → 정적 HTML

카테고리/시리즈:
- 현재: Express API → 동적 집계
- 변경: 빌드타임 집계 → JSON

RSS/Sitemap:
- 현재: Express 라우트
- 변경: 빌드 스크립트

조회수/좋아요:
- 제거 또는 Google Analytics로 대체

뉴스레터:
- 외부 서비스 (Mailchimp, ConvertKit)

### 빌드 프로세스

새로운 빌드 순서:
1. scripts/generateStaticData.ts 실행
2. scripts/generateSitemap.ts 실행
3. next build (정적 HTML 생성)
4. out/ 디렉토리에 정적 파일 출력

package.json:
{
  "scripts": {
    "prebuild": "tsx scripts/generateStaticData.ts && tsx scripts/generateSitemap.ts",
    "build": "next build",
    "dev": "next dev",
    "start": "npx serve@latest out"
  }
}

## 영향도 분석

제거되는 기능:
- 조회수 카운팅: 제거 또는 GA4
- 좋아요 기능: 제거
- 뉴스레터 구독: 외부 서비스
- 동적 검색: 클라이언트 필터링
- 실시간 포스트 추가: 빌드 후 재배포

유지되는 기능:
- 블로그 포스트 목록/상세
- 카테고리/태그 필터링
- 시리즈 목록/상세
- 검색 기능 (클라이언트)
- RSS Feed
- Sitemap
- SEO 최적화

성능 개선 예상:
- 첫 페이지 로드: 800ms → 200ms (4배 빠름)
- TTFB: 400ms → 50ms (8배 빠름)
- 서버 비용: $5-20/월 → $0
- 확장성: 서버 제한 → 무제한

## 구현 일정

예상 소요 시간: **8-10일**
- 빌드 스크립트 작성: 1-2일
- Next.js 설정 변경 및 리팩토링: 3-4일
- 테스트 및 검증: 2일
- 배포 설정: 1일

상세 구현 계획은 `docs/issue-4/todo.md` 참조

## 주의사항

정적 사이트 제약:
- 동적 데이터 불가
- 폼 제출 불가
- 인증 불가

콘텐츠 업데이트:
- 재빌드 필수
- Git push → CI/CD → 빌드 → 배포

검색 성능:
- 103개 포스트 전체 로드
- JSON 크기: ~500KB-1MB

## 배포 옵션

1. Vercel (권장)
   - Next.js 네이티브 지원
   - 무료 플랜

2. Netlify
   - Form 처리, Edge Functions
   - 무료 100GB/월

3. GitHub Pages
   - 완전 무료
   - 자동 배포

4. Cloudflare Pages
   - 무제한 bandwidth
   - 빠른 CDN

---

작성일: 2025-10-19
버전: 1.0
상태: Draft
