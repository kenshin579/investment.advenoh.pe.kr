# PRD: Production 도메인 변경 작업

## 📋 개요
- **작업 제목**: Production 도메인 변경
- **변경 사항**: `invest.advenoh.pe.kr` → `investment.advenoh.pe.kr`
- **작업 범위**: 코드베이스 내 하드코딩된 도메인 URL 전체 변경
- **영향도**: SEO, 빌드 스크립트, 환경변수, 설정 파일

## 🎯 작업 목적
- Production 도메인을 `invest`에서 `investment`로 변경
- 일관된 도메인 사용으로 SEO 및 브랜드 통일성 확보
- sitemap, RSS feed, robots.txt 등 자동 생성 파일의 올바른 URL 보장

## 📂 수정이 필요한 파일 목록

### 1. 환경변수 Fallback 값 변경 (8개 파일)

#### 1.1 프론트엔드 레이아웃
**파일**: `src/app/layout.tsx`
- **라인**: 27
- **현재 코드**:
  ```typescript
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://invest.advenoh.pe.kr';
  ```
- **변경 후**:
  ```typescript
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://investment.advenoh.pe.kr';
  ```
- **목적**: 메타데이터 baseUrl 설정 시 fallback 값 변경

#### 1.2 빌드 스크립트
**파일**: `scripts/generateSitemap.ts`
- **라인**: 17
- **현재 코드**:
  ```typescript
  const baseUrl = process.env.SITE_URL || 'https://invest.advenoh.pe.kr';
  ```
- **변경 후**:
  ```typescript
  const baseUrl = process.env.SITE_URL || 'https://investment.advenoh.pe.kr';
  ```
- **목적**: sitemap.xml 생성 시 URL 변경

**파일**: `scripts/generateRssFeed.ts`
- **라인**: 18
- **현재 코드**:
  ```typescript
  const baseUrl = process.env.SITE_URL || 'https://invest.advenoh.pe.kr';
  ```
- **변경 후**:
  ```typescript
  const baseUrl = process.env.SITE_URL || 'https://investment.advenoh.pe.kr';
  ```
- **목적**: RSS feed 생성 시 URL 변경

**파일**: `scripts/generateRobots.ts`
- **라인**: 6
- **현재 코드**:
  ```typescript
  const baseUrl = process.env.SITE_URL || 'https://invest.advenoh.pe.kr';
  ```
- **변경 후**:
  ```typescript
  const baseUrl = process.env.SITE_URL || 'https://investment.advenoh.pe.kr';
  ```
- **목적**: robots.txt 생성 시 sitemap URL 변경

#### 1.3 JSON-LD Schema 및 Structured Data
**파일**: `src/lib/structured-data.ts`
- **라인**: 131
- **현재 코드**:
  ```typescript
  const baseUrl = process.env.SITE_URL || 'https://invest.advenoh.pe.kr'
  ```
- **변경 후**:
  ```typescript
  const baseUrl = process.env.SITE_URL || 'https://investment.advenoh.pe.kr'
  ```
- **목적**: Structured data 생성 시 URL 변경

**파일**: `src/lib/json-ld-schema.ts`
- **라인**: 84 (JSONLDSchemaGenerator 클래스 내부)
- **현재 코드**:
  ```typescript
  private baseUrl = process.env.SITE_URL || 'https://invest.advenoh.pe.kr';
  ```
- **변경 후**:
  ```typescript
  private baseUrl = process.env.SITE_URL || 'https://investment.advenoh.pe.kr';
  ```

- **라인**: 367 (getCurrentUrl 메서드 내부)
- **현재 코드**:
  ```typescript
  return 'https://stock.advenoh.pe.kr';
  ```
- **변경 후**:
  ```typescript
  return 'https://investment.advenoh.pe.kr';
  ```
- **목적**: JSON-LD schema 생성 시 URL 변경

### 2. Next.js 설정 파일
**파일**: `next.config.ts`
- **라인**: 12
- **현재 코드**:
  ```typescript
  images: {
    unoptimized: true,
    domains: ['invest.advenoh.pe.kr'],
    formats: ['image/webp', 'image/avif'],
  },
  ```
- **변경 후**:
  ```typescript
  images: {
    unoptimized: true,
    domains: ['investment.advenoh.pe.kr'],
    formats: ['image/webp', 'image/avif'],
  },
  ```
- **목적**: Next.js Image 컴포넌트의 허용 도메인 변경

### 3. Netlify 배포 설정
**파일**: `netlify.toml`
- **라인**: 12 (주석 처리되어 있음)
- **현재 코드**:
  ```toml
  # [build.environment]
  #   SITE_URL = "https://invest.advenoh.pe.kr"
  ```
- **변경 후**:
  ```toml
  # [build.environment]
  #   SITE_URL = "https://investment.advenoh.pe.kr"
  ```
- **목적**: Netlify 환경변수 주석 업데이트 (참고용)

## 🔄 작업 절차

### 1단계: 코드 변경
1. 위에 나열된 8개 파일의 하드코딩된 URL 변경
2. 변경 사항 검증 (TypeScript 컴파일 확인)

### 2단계: 로컬 테스트
1. 개발 서버 실행:
   ```bash
   npm run dev
   ```
2. 생성된 파일 확인:
   - `public/sitemap.xml` - URL 확인
   - `public/rss.xml` - URL 확인
   - `public/robots.txt` - sitemap URL 확인
3. 메타데이터 확인 (브라우저 개발자 도구):
   - Open Graph 태그
   - JSON-LD schema

### 3단계: Production 빌드 테스트
1. Production 빌드:
   ```bash
   npm run build
   ```
2. Static 파일 확인:
   - `out/sitemap.xml`
   - `out/rss.xml`
   - `out/robots.txt`
3. 로컬에서 production 빌드 실행:
   ```bash
   npm run start
   ```
4. Playwright MCP로 검증:
   - 메타데이터 확인
   - 구조화된 데이터 확인
   - 링크 URL 확인

### 4단계: 환경변수 설정 (Netlify)
1. Netlify Dashboard 접속
2. 환경변수 추가 또는 수정:
   ```
   SITE_URL=https://investment.advenoh.pe.kr
   ```
3. 재배포 트리거

### 5단계: DNS 및 도메인 설정 (인프라 팀)
1. 새 도메인 `investment.advenoh.pe.kr` DNS 설정
2. Netlify 도메인 설정 업데이트
3. SSL 인증서 자동 발급 확인
4. 이전 도메인 리다이렉트 설정 (선택사항):
   ```
   https://invest.advenoh.pe.kr → https://investment.advenoh.pe.kr (301 Permanent)
   ```

### 6단계: 배포 후 검증
1. 새 도메인 접속 확인
2. Sitemap 확인:
   ```
   https://investment.advenoh.pe.kr/sitemap.xml
   ```
3. RSS Feed 확인:
   ```
   https://investment.advenoh.pe.kr/rss.xml
   ```
4. robots.txt 확인:
   ```
   https://investment.advenoh.pe.kr/robots.txt
   ```
5. Google Search Console 업데이트:
   - 새 도메인 속성 추가
   - sitemap 재제출
6. Google Analytics 설정 확인 (필요시 업데이트)

## ⚠️ 주의사항

### 1. 환경변수 우선순위
- 환경변수 `SITE_URL`이 설정되어 있으면 하드코딩된 fallback 값은 사용되지 않음
- Netlify에서 환경변수 설정 필수

### 2. 빌드 타임 vs 런타임
- 이 프로젝트는 **Static Export** 모드이므로 모든 URL은 **빌드 타임**에 결정됨
- 배포 후 환경변수 변경 시 **전체 재빌드 필요**

### 3. 기존 도메인 처리
- 기존 `invest.advenoh.pe.kr`에서 `investment.advenoh.pe.kr`로 301 리다이렉트 설정 권장
- SEO 영향 최소화를 위해 Google Search Console에서 주소 변경 알림

### 4. 캐시 무효화
- CDN/Netlify 캐시 클리어 필요
- 브라우저 캐시로 인해 이전 도메인이 보일 수 있음

## 📊 영향 범위

### SEO 영향
- **Sitemap**: 모든 페이지 URL이 새 도메인으로 변경
- **RSS Feed**: 구독자에게 새 도메인 URL 제공
- **Structured Data**: JSON-LD schema의 모든 URL 변경
- **Meta Tags**: Open Graph 및 Twitter Card URL 변경

### 사용자 영향
- 기존 북마크: 리다이렉트 설정 시 정상 작동
- RSS 구독자: 새 피드 URL로 자동 업데이트
- 검색 엔진: 301 리다이렉트로 SEO 점수 유지

### 개발 영향
- 로컬 개발: 환경변수 없이도 새 도메인 사용
- CI/CD: 환경변수 설정 필요
- 테스트: URL 관련 테스트 케이스 업데이트 필요

## ✅ 완료 체크리스트

### 코드 변경
- [ ] `src/app/layout.tsx` 수정
- [ ] `scripts/generateSitemap.ts` 수정
- [ ] `scripts/generateRssFeed.ts` 수정
- [ ] `scripts/generateRobots.ts` 수정
- [ ] `src/lib/structured-data.ts` 수정
- [ ] `src/lib/json-ld-schema.ts` 수정 (2곳)
- [ ] `next.config.ts` 수정
- [ ] `netlify.toml` 수정 (주석)

### ��스트
- [ ] 로컬 개발 서버 테스트
- [ ] Production 빌드 테스트
- [ ] sitemap.xml 검증
- [ ] rss.xml 검증
- [ ] robots.txt 검증
- [ ] 메타데이터 검증
- [ ] JSON-LD schema 검증

### 인프라
- [ ] Netlify 환경변수 설정
- [ ] DNS 설정
- [ ] SSL 인증서 확인
- [ ] 이전 도메인 리다이렉트 설정

### SEO
- [ ] Google Search Console 새 속성 추가
- [ ] Sitemap 재제출
- [ ] 주소 변경 알림
- [ ] Google Analytics 설정 확인

## 📚 참고 문서
- Next.js Static Export: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- Netlify Environment Variables: https://docs.netlify.com/configure-builds/environment-variables/
- Google Search Console 주소 변경: https://support.google.com/webmasters/answer/9370220

## 🔗 관련 이슈
- 이슈 번호: #[이슈 번호 입력]
- 관련 PR: #[PR 번호 입력]

---

**작성일**: 2025-10-22
**작성자**: Claude Code
**검토 필요**: 인프라 팀, SEO 팀
