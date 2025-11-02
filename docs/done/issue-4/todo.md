# TODO: Next.js Static Export 전환 작업

## 작업 개요
- **목표**: Express + Next.js 하이브리드 구조를 Next.js Static Export로 전환
- **배포**: Netlify 정적 호스팅
- **예상 소요 시간**: 8-10일
- **우선순위**: High

---

## Phase 0: 사전 준비 및 백업 (Day 1) ✅
> **목표**: 현재 상태 백업 및 작업 환경 준비

### 백업 및 브랜치 생성
- [x] 현재 코드베이스 전체 백업
- [x] 새로운 Git 브랜치 생성: `feat/#4-static-page`
- [x] 현재 프로덕션 데이터 백업 (필요 시)

### 환경 준비
- [x] Netlify 계정 생성/확인
- [x] 도메인 설정 확인
- [x] 현재 동작하는 기능 목록 문서화
- [x] Replit 프로젝트 백업

### Replit 관련 파일 정리
- [x] `.replit` 파일 제거
- [x] Replit 전용 환경 변수 정리
- [x] Replit 배포 스크립트 제거
- [x] Replit 관련 의존성 제거

---

## Phase 1: 빌드 스크립트 작성 (Day 2-3) ✅
> **목표**: 정적 데이터 생성을 위한 빌드 스크립트 구현

### 데이터 생성 스크립트
- [x] `scripts/` 디렉토리 생성
- [x] `scripts/generateStaticData.ts` 작성
  - [x] 마크다운 파일 읽기 로직
  - [x] Frontmatter 파싱
  - [x] JSON 데이터 구조 설계
  - [x] posts.json 생성 (95개 포스트)
  - [x] categories.json 생성 (4개 카테고리)
  - [x] series.json 생성 (6개 시리즈)
  - [x] tags.json 생성 (590개 태그)
- [x] `scripts/utils/markdown.ts` - 마크다운 처리 유틸리티

### 메타데이터 생성 스크립트
- [x] `scripts/generateSitemap.ts` 작성
  - [x] sitemap.xml 생성 로직
  - [x] 동적 URL 포함
  - [x] 이미지 sitemap 생성
- [x] `scripts/generateRssFeed.ts` 작성
  - [x] RSS 2.0 포맷 생성
  - [x] 최근 20개 포스트 포함
- [x] `scripts/generateRobots.ts` 작성

### 스크립트 테스트
- [x] 각 스크립트 단독 실행 테스트
- [x] 생성된 JSON 파일 검증
- [x] 생성된 메타 파일 검증

---

## Phase 2: Next.js 설정 변경 (Day 4) ✅
> **목표**: Next.js를 정적 Export 모드로 설정

### Next.js 설정
- [x] `next.config.ts` 수정
  - [x] `output: 'export'` 설정
  - [x] `trailingSlash: true` 설정
  - [x] `images.unoptimized: true` 설정 (기존에 이미 설정됨)
  - [x] 불필요한 설정 제거

### 패키지 스크립트 수정
- [x] `package.json` scripts 업데이트
  ```json
  {
    "dev": "next dev",
    "prebuild": "npx tsx scripts/generateStaticData.ts",
    "build": "next build",
    "postbuild": "npx tsx scripts/generateSitemap.ts && npx tsx scripts/generateRssFeed.ts && npx tsx scripts/generateRobots.ts",
    "start": "npx serve out"
  }
  ```
- [x] 서버 관련 스크립트 제거 (dev:nextjs, build:server, start:prod 등)
- [x] 테스트 스크립트 추가

### 환경 변수 정리
- [x] `.env.local` 파일 정리
- [x] 불필요한 서버 환경 변수 제거
- [x] 클라이언트 전용 환경 변수 확인

---

## Phase 3: 페이지 컴포넌트 리팩토링 (Day 5-6) ✅
> **목표**: 서버 의존성 제거 및 정적 생성 구현

### 동적 라우트 수정
- [x] `src/app/page.tsx` - 홈페이지
  - [x] 서버 API 호출 제거
  - [x] HomePageClient 컴포넌트로 분리
- [x] `src/app/[category]/page.tsx` - 카테고리 페이지
  - [x] `generateStaticParams` 구현 (기존에 이미 존재)
  - [x] 정적 데이터 로드
- [x] `src/app/[category]/[slug]/page.tsx` - 포스트 상세
  - [x] `generateStaticParams` 구현 (기존에 이미 존재)
  - [x] 마크다운 렌더링 유지
- [x] `src/app/series/page.tsx` - 시리즈 목록
- [x] `src/app/series/[series]/page.tsx` - 시리즈 상세

### 데이터 Fetching 변경
- [x] `src/lib/blog-server.ts` 수정
  - [x] API 호출을 JSON 파일 읽기로 변경
  - [x] 캐싱 로직 제거
- [x] `src/lib/blog-client.ts` 제거 또는 수정
- [x] 각 컴포넌트의 fetch 로직 업데이트

### 컴포넌트 수정
- [x] `src/components/blog-post-card.tsx`
- [x] `src/components/series-navigation.tsx`
- [x] `src/components/related-posts.tsx`
- [x] `src/components/category-list.tsx`

---

## Phase 4: 클라이언트 기능 구현 (Day 7) ✅
> **목표**: 서버 없이 동작하는 클라이언트 기능 구현

### 검색 기능
- [x] `src/components/search-bar.tsx` 존재 (기존에 이미 구현됨)
  - [x] 클라이언트 사이드 검색 로직
  - [x] 실시간 필터링
- [x] 검색 상태 관리 (useState)
- [x] URL 쿼리 파라미터 동기화

### 필터링 기능
- [x] 카테고리 필터링 클라이언트 구현 (CategoryFilterClient)
- [x] 태그 필터링 클라이언트 구현 (HomePageClient)
- [x] 시리즈 필터링 클라이언트 구현
- [x] 다중 필터 조합 로직

### 페이지네이션
- [x] 클라이언트 사이드 페이징 구현 (LoadMoreButton)
- [x] URL 파라미터 관리
- [x] 페이지 상태 유지

### 성능 최적화
- [x] useMemo 활용한 필터링 최적화
- [x] 가상 스크롤링 검토 (95개 포스트로 현재는 불필요)
- [x] 초기 로드 최적화

---

## Phase 5: 서버 코드 제거 (Day 8) ✅
> **목표**: 모든 서버 관련 코드 제거

### 디렉토리/파일 제거
- [x] `server/` 디렉토리 전체 제거 (1,534줄 삭제)
  - [x] `server/index.ts`
  - [x] `server/routes.ts`
  - [x] `server/storage.ts`
  - [x] `server/services/`
- [x] `src/app/api/` 디렉토리 제거 (Phase 3에서 완료)
- [x] `shared/schema.ts` 제거
- [x] `drizzle.config.ts` 제거
- [x] 데이터베이스 마이그레이션 파일 제거 (존재하지 않음)

### 의존성 제거
- [x] Express 관련 패키지 제거
  ```bash
  npm uninstall express express-session @types/express @types/express-session
  ```
- [x] 데이터베이스 관련 패키지 제거
  ```bash
  npm uninstall drizzle-orm drizzle-zod @neondatabase/serverless drizzle-kit
  ```
- [x] 서버 전용 패키지 제거
  ```bash
  npm uninstall esbuild passport connect-pg-simple memorystore @types/passport @types/passport-local @types/connect-pg-simple @types/ws
  ```

### 코드 정리
- [x] 불필요한 import 문 제거 (검증 완료 - 없음)
- [x] 사용하지 않는 유틸리티 함수 제거
- [x] TypeScript 타입 정리

---

## Phase 6: 빌드 및 로컬 테스트 (Day 9) ✅
> **목표**: 정적 빌드 검증 및 로컬 테스트

### 빌드 테스트
- [x] `npm run build` 실행
- [x] 빌드 에러 해결 (모두 해결 완료)
- [x] out/ 디렉토리 생성 확인
- [x] 생성된 HTML 파일 확인 (108개 정적 페이지)

### 로컬 서버 테스트
- [x] `npx serve out` 실행
- [x] 모든 페이지 접근 테스트
  - [x] 홈페이지
  - [x] 카테고리 페이지
  - [x] 포스트 상세 페이지
  - [x] 시리즈 페이지
- [x] 기능 테스트
  - [x] 검색 기능
  - [x] 필터링 기능
  - [x] 네비게이션

### 성능 테스트
- [ ] Lighthouse 실행 (배포 후 테스트 예정)
  - [ ] Performance 점수 90+
  - [ ] Accessibility 점수 90+
  - [ ] SEO 점수 90+
- [x] 번들 사이즈 확인
- [x] 이미지 최적화 확인

---

## Phase 7: Netlify 배포 설정 (Day 10) ✅
> **목표**: Netlify에 배포 및 프로덕션 환경 설정

### Netlify 프로젝트 설정
- [ ] Netlify 프로젝트 생성 (배포 예정)
- [ ] GitHub 저장소 연결 (배포 예정)
- [x] 빌드 설정 (netlify.toml에 정의됨)
  - Build command: `npm run build`
  - Publish directory: `out`
- [x] 환경 변수 설정 (필요시)

### netlify.toml 설정
- [x] `netlify.toml` 파일 생성
- [x] 헤더 설정 (캐싱, 보안)
  - [x] 보안 헤더 (CSP, XSS Protection, X-Frame-Options 등)
  - [x] 캐싱 전략 (정적 파일 1년, HTML 즉시 갱신)
- [x] 리다이렉트 규칙 설정
  - [x] Trailing slash 정규화
- [x] 404 페이지 설정

### 도메인 설정
- [ ] 커스텀 도메인 연결 (배포 시 진행)
- [ ] SSL 인증서 확인 (배포 시 진행)
- [ ] DNS 설정 (배포 시 진행)

### 배포 테스트
- [ ] 첫 배포 실행 (Phase 8에서 진행)
- [ ] 배포된 사이트 접근 테스트 (Phase 8에서 진행)
- [ ] 모든 기능 재검증 (Phase 8에서 진행)

---

## Phase 8: 최종 검증 및 마무리 (Day 10) 🔄
> **목표**: 프로덕션 배포 전 최종 확인

### 기능 검증 체크리스트
- [x] ✅ 홈페이지 정상 로드
- [x] ✅ 블로그 포스트 목록 표시
- [x] ✅ 블로그 포스트 상세 페이지
- [x] ✅ 카테고리별 필터링
- [x] ✅ 태그 필터링
- [x] ✅ 시리즈 네비게이션
- [x] ✅ 검색 기능
- [x] ✅ 페이지네이션
- [x] ✅ RSS Feed 접근 (public/rss.xml 생성됨)
- [x] ✅ Sitemap 접근 (public/sitemap.xml 생성됨)
- [x] ✅ 이미지 로딩

### SEO 검증
- [ ] 메타 태그 확인 (배포 후 검증)
- [ ] Open Graph 태그 (배포 후 검증)
- [ ] JSON-LD 구조화 데이터 (배포 후 검증)
- [x] robots.txt 확인 (public/robots.txt 생성됨)
- [x] sitemap.xml 확인 (public/sitemap.xml 생성됨)

### 성능 최종 확인
- [ ] PageSpeed Insights 테스트 (배포 후)
- [ ] GTmetrix 테스트 (배포 후)
- [ ] 실제 사용자 테스트 (배포 후)

### 문서화
- [ ] README.md 업데이트
- [ ] 배포 가이드 작성
- [ ] 콘텐츠 업데이트 가이드 작성

### 최종 배포
- [ ] main 브랜치로 PR 생성
- [ ] 코드 리뷰
- [ ] PR 머지
- [ ] 프로덕션 배포 확인

---

## 롤백 계획

### 문제 발생 시 롤백 절차
1. [ ] Netlify에서 이전 배포로 롤백
2. [ ] Git에서 이전 커밋으로 revert
3. [ ] 필요시 서버 코드 복원
4. [ ] Replit으로 임시 배포 (긴급시)

### 백업 확인
- [ ] 서버 코드 백업 위치 확인
- [ ] 데이터베이스 백업 확인
- [ ] 환경 변수 백업 확인

---

## 참고사항

### 예상 이슈 및 해결책
1. **이슈**: 빌드 시간이 너무 오래 걸림
   - **해결**: 마크다운 파싱 최적화, 병렬 처리

2. **이슈**: JSON 파일이 너무 큼
   - **해결**: 카테고리별 분할, lazy loading

3. **이슈**: 클라이언트 검색 성능 저하
   - **해결**: Web Worker 활용, 검색 인덱스 사전 생성

### 성공 지표
- [x] 빌드 시간 < 5분 (약 2분 소요)
- [ ] Lighthouse 점수 90+ (배포 후 테스트)
- [ ] 첫 페이지 로드 < 2초 (배포 후 테스트)
- [x] 검색 응답 시간 < 100ms (클라이언트 사이드 검색으로 즉시 반응)

### 관련 문서
- [PRD](./prd.md)
- [Implementation Guide](./implementation.md)
- [Next.js Static Export 문서](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Netlify 문서](https://docs.netlify.com/)

---

**작성일**: 2025-10-19
**예상 완료일**: 2025-10-29
**실제 완료일**: 2025-10-19
**담당자**: Development Team
**상태**: ✅ 기술 구현 완료 (Phase 0-7) | 🔄 배포 대기 중 (Phase 8)

---

## 구현 완료 요약

### ✅ 완료된 작업 (Phase 0-7)
- **Phase 0**: Replit 설정 제거 완료
- **Phase 1**: 빌드 스크립트 구현 완료 (95개 포스트, 4개 카테고리, 6개 시리즈, 590개 태그)
- **Phase 2**: Next.js Static Export 설정 완료
- **Phase 3**: 페이지 컴포넌트 리팩토링 완료 (API routes 제거, 클라이언트 전환)
- **Phase 4**: 클라이언트 기능 최적화 완료 (useMemo, router.push)
- **Phase 5**: 서버 코드 및 의존성 완전 제거 (1,534줄 삭제)
- **Phase 6**: 빌드 및 로컬 테스트 완료 (108개 정적 페이지 생성)
- **Phase 7**: Netlify 배포 설정 완료 (netlify.toml, 보안 헤더, 캐싱)

### 🔄 진행 중 (Phase 8)
- 최종 검증 및 문서화
- Netlify 배포
- 성능 테스트

### 📊 주요 성과
- **총 커밋**: 14개 (feat/#4-static-page 브랜치)
- **빌드 시간**: ~2분
- **생성된 페이지**: 108개
- **제거된 코드**: 1,534줄
- **배포 준비**: ✅ 완료