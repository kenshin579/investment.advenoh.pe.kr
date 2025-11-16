# Google AdSense 광고 표시 문제 분석 및 해결 방안

## 📚 문서 구조

이 PRD는 3개의 문서로 구성되어 있습니다:

1. **[1_adsense_prd.md](1_adsense_prd.md)** (현재 문서)
   - 문제 정의 및 원인 분석
   - 해결 방안 개요
   - 광고 슬롯 정보

2. **[1_adsense_implementation.md](1_adsense_implementation.md)**
   - 상세 구현 가이드
   - 코드 예시 및 설명
   - 테스트 방법
   - 문제 해결 가이드

3. **[1_adsense_todo.md](1_adsense_todo.md)**
   - 단계별 체크리스트
   - Playwright 테스트 시나리오
   - 배포 절차

---

## 문제 정의

### 현상
- `investment.advenoh.pe.kr` 사이트에서 Google AdSense 광고가 표시되지 않음
- AdSense 스크립트는 로드되지만 실제 광고 슬롯이 렌더링되지 않음

### 영향도
- **수익 손실**: 광고 수익 발생 불가
- **사용자 경험**: 의도한 광고 위치에 빈 공간 또는 레이아웃 불일치 가능성
- **SEO**: 광고 배치가 없어 콘텐츠 구조 최적화 미흡

---

## 원인 분석

### 1. 스크립트는 있지만 광고 슬롯이 없음 ⚠️

**현재 상태**:
```tsx
// src/app/layout.tsx (라인 90-95)
{/* Google AdSense */}
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8868959494983515"
  crossOrigin="anonymous"
/>
```

**문제점**:
- AdSense 스크립트는 `<head>`에 포함되어 있음 ✅
- 하지만 **광고를 표시할 `<ins>` 태그 (광고 슬롯)가 전혀 없음** ❌
- 블로그 포스트 페이지 (`src/app/[category]/[slug]/page.tsx`)에도 광고 코드 없음
- 홈페이지 (`src/app/page.tsx`)에도 광고 코드 없음

**AdSense 광고 표시 필수 요소**:
```tsx
// 필요하지만 없는 코드
<ins
  className="adsbygoogle"
  style={{ display: 'block' }}
  data-ad-client="ca-pub-8868959494983515"
  data-ad-slot="YOUR_AD_SLOT_ID"
  data-ad-format="auto"
  data-full-width-responsive="true"
/>
<script>
  (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

### 2. 정적 사이트 특성으로 인한 제약사항

**프로젝트 아키텍처**:
- Next.js Static Export (`output: 'export'`)
- 모든 페이지가 빌드 타임에 HTML로 생성됨
- 서버 사이드 런타임 없음 (CDN/static hosting)

**AdSense와의 호환성 문제**:
- AdSense는 클라이언트 사이드에서 동적으로 광고를 렌더링
- 정적 HTML에서는 광고 스크립트가 실행되어야 광고가 표시됨
- 클라이언트 컴포넌트에서 광고를 초기화해야 함

### 3. 잠재적 추가 원인

#### 3.1 AdSense 계정 상태
- [ ] AdSense 계정 승인 상태 확인 필요
- [ ] 사이트 등록 및 ads.txt 파일 확인 필요
- [ ] 광고 단위 생성 여부 확인

#### 3.2 Content Security Policy (CSP)
```tsx
// next.config.ts에서 보안 헤더 설정 확인 필요
// AdSense 스크립트 및 광고 도메인이 허용되어 있는지 검증
```

#### 3.3 빌드/배포 환경
- Netlify 배포 시 클라이언트 사이드 스크립트 실행 확인
- 정적 파일 서빙 시 JavaScript 실행 여부

---

## 해결 방안

### 📌 실제 광고 슬롯 정보

**AdSense에서 생성된 광고 단위**:
- **광고 이름**: `BlogArticleBottomAd` (블로그 아티클 하단 광고)
- **광고 슬롯 ID**: `5560009326`
- **Client ID**: `ca-pub-8868959494983515`

**제공된 HTML 광고 코드**:
```html
<!-- BlogArticleBottomAd -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-8868959494983515"
     data-ad-slot="5560009326"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

> **참고**: 추가 광고 슬롯이 필요한 경우 AdSense 대시보드에서 더 생성할 수 있습니다.

---

### Phase 1: 광고 슬롯 구현

**목표**: 재사용 가능한 AdSense 광고 컴포넌트 생성 및 블로그 포스트 하단에 광고 배치

**작업 내용**:
1. **광고 컴포넌트 생성** (`src/components/google-adsense.tsx`)
   - 클라이언트 컴포넌트로 구현 (`'use client'`)
   - `useEffect`로 광고 초기화
   - Props를 통한 재사용 가능한 구조

2. **블로그 포스트 페이지 수정** (`src/app/[category]/[slug]/page.tsx`)
   - 컴포넌트 Import
   - Footer 섹션에 광고 슬롯 추가 (Related Posts 위)
   - 광고 슬롯 ID: `5560009326` 사용

**상세 구현 가이드**: [1_adsense_implementation.md - 섹션 1, 2](1_adsense_implementation.md)

### Phase 2: 테스트 및 검증

**목표**: 로컬 환경에서 광고 슬롯 렌더링 확인 및 Playwright 자동 테스트

**작업 내용**:
1. **로컬 빌드 및 실행**
   - `npm run build` → `npm run start`
   - 브라우저에서 수동 테스트

2. **Playwright 자동 테스트**
   - 광고 슬롯 존재 확인
   - 광고 슬롯 ID 검증 (`5560009326`)
   - 콘솔 에러 확인
   - 스크린샷 캡처

**상세 테스트 가이드**: [1_adsense_implementation.md - 섹션 3, 4](1_adsense_implementation.md#3-로컬-테스트)
**테스트 체크리스트**: [1_adsense_todo.md - Phase 3](1_adsense_todo.md#phase-3-로컬-테스트-10분)

### Phase 3: 배포

**목표**: 프로덕션 환경에 배포 및 광고 표시 확인

**작업 내용**:
1. **Git Commit 및 Push**
   - 변경사항 커밋
   - 원격 저장소에 Push

2. **Netlify 자동 배포**
   - 배포 상태 확인
   - 프로덕션에서 광고 슬롯 검증

**상세 배포 가이드**: [1_adsense_implementation.md - 섹션 5](1_adsense_implementation.md#5-배포)
**배포 체크리스트**: [1_adsense_todo.md - Phase 4](1_adsense_todo.md#phase-4-배포-5분)

---

## 구현 우선순위

### 🔴 Critical (즉시 구현 - 총 소요 시간: 약 40분)
1. **광고 컴포넌트 생성** (`src/components/google-adsense.tsx`) - 10분
2. **블로그 포스트 하단에 광고 삽입** (슬롯 ID: `5560009326`) - 15분
3. **로컬 테스트** (`npm run build && npm run start`) - 5분
4. **프로덕션 배포** (git push) - 10분

> ✅ **완료 후**: 블로그 포스트 하단에 `BlogArticleBottomAd` 광고 표시됨

### 🟡 Important (광고 확인 후 1-2주 내)
5. **ads.txt 파일 추가** (`public/ads.txt`)
6. **추가 광고 슬롯 생성** (AdSense 대시보드)
   - 블로그 상단 광고 (`BlogArticleTopAd`)
   - 사이드바 광고 (`BlogArticleSidebarAd`)
   - 홈페이지 광고 (`HomePageTopAd`, `HomePageInfeedAd`)
7. **홈페이지에 광고 삽입** (추가 슬롯 사용)
8. **CSP 헤더 업데이트** (보안 강화, 필요 시)

### 🟢 Recommended (광고 안정화 후 1개월 내)
9. **로딩 상태 처리** (UX 개선)
10. **반응형 광고 최적화** (모바일/데스크탑)
11. **성능 모니터링** (Lighthouse, CLS)
12. **광고 수익 분석** (AdSense 대시보드)

---

## 예상 결과

### 구현 후 기대 효과

**수익 측면**:
- 광고 수익 발생 시작
- 트래픽 대비 적절한 광고 배치로 RPM (1000 임프레션당 수익) 향상

**사용자 경험**:
- 적절한 광고 배치로 콘텐츠 가독성 유지
- 로딩 상태 처리로 레이아웃 안정성 확보

**기술적 개선**:
- 정적 사이트에서의 AdSense 통합 모범 사례 구현
- 클라이언트 컴포넌트 활용으로 동적 광고 렌더링 지원

---

## 참고 자료

### AdSense 공식 문서
- [AdSense 시작하기](https://support.google.com/adsense/answer/6242051)
- [광고 코드 구현 가이드](https://support.google.com/adsense/answer/9274019)
- [ads.txt 가이드](https://support.google.com/adsense/answer/7532444)

### Next.js 관련
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)

### 성능 최적화
- [Core Web Vitals (CLS)](https://web.dev/cls/)
- [광고 성능 최적화](https://developers.google.com/publisher-tag/guides/ad-best-practices)

---

## 구현 가이드

### 📋 단계별 체크리스트
**[1_adsense_todo.md](1_adsense_todo.md)** 참조

- Phase 1: 광고 컴포넌트 생성 (10분)
- Phase 2: 블로그 포스트 페이지 수정 (15분)
- Phase 3: 로컬 테스트 - Playwright 포함 (10분)
- Phase 4: 배포 (5분)

### 🛠️ 상세 구현 방법
**[1_adsense_implementation.md](1_adsense_implementation.md)** 참조

- 컴포넌트 코드 예시
- 테스트 시나리오
- 문제 해결 가이드

---

## 📌 핵심 요약

### 문제
AdSense 스크립트는 로드되지만 **광고 슬롯 (`<ins>` 태그)이 없어서** 광고가 표시되지 않음

### 해결책
1. 클라이언트 컴포넌트로 광고 초기화 (`src/components/google-adsense.tsx`)
2. 블로그 포스트 하단에 광고 슬롯 추가 (슬롯 ID: `5560009326`)
3. Playwright로 자동 테스트
4. 프로덕션 배포 (총 40분 소요)

### 다음 액션
**[1_adsense_todo.md](1_adsense_todo.md)**의 Phase 1부터 시작

---

**작성일**: 2025-11-15
**문서 버전**: 1.1 (실제 광고 슬롯 ID 반영)
**다음 리뷰 예정일**: 광고 구현 완료 후
**실제 광고 슬롯**: `BlogArticleBottomAd` (ID: `5560009326`)
