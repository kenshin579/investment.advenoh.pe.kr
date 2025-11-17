# AdSense 광고 표시 수정 요구사항

**작성일**: 2025-11-17
**목표**: blog-v2 방식으로 AdSense 구현을 수정하여 광고가 정상적으로 표시되도록 개선

---

## 📋 요구사항 요약

blog-v2에서 광고가 정상 작동하는 방식을 investment 프로젝트에 적용하여 광고 표시 문제를 해결한다.

### 핵심 변경 사항

1. Next.js `Script` 컴포넌트로 AdSense 스크립트 로딩 최적화
2. 자동 광고(Auto Ads) 방식으로 전환 (명시적 광고 단위 제거)
3. GoogleAdSense 컴포넌트 사용 중단
4. AdSense 대시보드 설정 확인 및 자동 광고 활성화

---

## 📝 상세 요구사항

### 1. AdSense 스크립트 로딩 방식 변경

#### 현재 상태 (investment)
```tsx
// src/app/layout.tsx

<head>
  {/* Google AdSense */}
  <script
    async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8868959494983515"
    crossOrigin="anonymous"
  />
</head>
```

**문제점**:
- 일반 `<script>` 태그로 Next.js 최적화 없음
- `async` 속성만 사용하여 기본적인 비동기 로드
- 빌드 시 preload 최적화 없음

#### 목표 상태 (blog-v2 방식)
```tsx
// src/app/layout.tsx

import Script from 'next/script'

<head>
  {/* Google AdSense */}
  <Script
    async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8868959494983515"
    crossOrigin="anonymous"
    strategy="afterInteractive"  // 성능 최적화 전략
  />
</head>
```

**변경 내용**:
1. `import Script from 'next/script'` 추가
2. `<script>` → `<Script>` 컴포넌트로 변경
3. `strategy="afterInteractive"` 속성 추가

**기대 효과**:
- Next.js가 스크립트 로딩 타이밍을 최적화
- 빌드 시 `<link rel="preload">`로 변환되어 더 빠른 로드
- 페이지 성능 향상

---

### 2. 자동 광고(Auto Ads) 방식으로 전환

#### 현재 상태: 명시적 광고 단위 사용

```tsx
// src/components/google-adsense.tsx
export function GoogleAdSense({ adSlot, ... }) {
  return (
    <ins
      className="adsbygoogle"
      data-ad-client="ca-pub-8868959494983515"
      data-ad-slot={adSlot}  // ❌ 명시적 광고 슬롯
      ...
    />
  )
}

// src/app/[category]/[slug]/page.tsx
<GoogleAdSense adSlot="5560009326" />
```

**문제점**:
- 광고 단위 `5560009326`가 승인 대기 중이거나 비활성화 상태일 가능성
- 명시적 광고 단위는 개별 승인 필요
- 광고 위치를 개발자가 직접 지정해야 함

#### 목표 상태: 자동 광고 방식

```tsx
// src/app/[category]/[slug]/page.tsx

<footer className="mt-12 border-t border-border pt-8">
  {/* Auto Ads가 자동으로 광고 삽입 */}
  <RelatedPosts posts={relatedPosts} currentPost={post} />
</footer>
```

**변경 내용**:
1. `<GoogleAdSense>` 컴포넌트 제거
2. 광고 관련 `<ins>` 태그 제거
3. Google AdSense가 자동으로 최적의 위치에 광고 배치

**기대 효과**:
- 광고 단위 승인 절차 불필요
- Google이 자동으로 최적의 광고 위치 선택
- 다양한 광고 형식 자동 적용
- 관리 부담 감소

---

### 3. GoogleAdSense 컴포넌트 삭제

**작업 내용**:
```bash
rm src/components/google-adsense.tsx
```

**사유**:
- Auto Ads 방식으로 전환하여 더 이상 필요하지 않음
- Git 히스토리에 남아있어 필요시 복구 가능
- 불필요한 코드 제거로 코드베이스 정리

---

### 4. AdSense 대시보드 설정

#### 자동 광고 활성화 절차

1. **AdSense 계정 접속**: https://adsense.google.com
2. **자동 광고 활성화**:
   - 좌측 메뉴 > `광고` > `사이트별`
   - `investment.advenoh.pe.kr` 도메인 선택
   - 자동 광고 토글 **ON**으로 변경
3. **광고 형식 설정** (선택사항):
   - 페이지 내 광고 활성화
   - 고정 광고, 전면 광고 등 선택
4. **설정 저장 후 24시간 대기**

#### 기존 광고 단위 처리

- `광고 > 광고 단위` 메뉴에서 `5560009326` 슬롯 확인
- 비활성화 또는 삭제 (선택사항)

---

## 🎯 예상 결과

### 변경 전
- ❌ 광고가 표시되지 않음
- ❌ 명시적 광고 단위 승인 필요
- ❌ 일반 `<script>` 태그로 최적화 부족

### 변경 후
- ✅ Google이 자동으로 최적의 위치에 광고 배치
- ✅ Next.js Script 컴포넌트로 성능 최적화
- ✅ 빌드 시 preload로 빠른 스크립트 로드
- ✅ 광고 단위 승인 절차 불필요
- ✅ 다양한 광고 형식 자동 적용

---

## 📊 비교: 변경 전후

| 항목 | 변경 전 | 변경 후 |
|------|--------|--------|
| Script 로딩 | `<script async>` | `<Script strategy="afterInteractive">` |
| 광고 방식 | 명시적 광고 단위 | 자동 광고 (Auto Ads) |
| 광고 배치 | 개발자가 직접 지정 | Google 자동 선택 |
| 승인 절차 | 광고 단위별 개별 승인 | 사이트 전체 승인 (1회) |
| 빌드 출력 | `<script async="">` | `<link rel="preload">` |
| 컴포넌트 | GoogleAdSense 사용 | 컴포넌트 없음 |
| 관리 부담 | 높음 (광고 단위 관리) | 낮음 (자동 최적화) |

---

## ⚠️ 주의사항

### 1. 광고 표시까지 시간 소요
- 자동 광고 활성화 후 **24시간 대기** 필요
- Google이 사이트를 크롤링하고 적절한 광고 위치 분석
- 즉시 광고가 표시되지 않을 수 있음

### 2. 광고 정책 준수
- AdSense 프로그램 정책 준수 필수
- 클릭 유도, 광고 조작 금지
- 성인 콘텐츠, 저작권 위반 콘텐츠 금지

### 3. 필수 파일 확인

**ads.txt 파일**:
```txt
# public/ads.txt
google.com, pub-8868959494983515, DIRECT, f08c47fec0942fa0
```

**robots.txt 파일**:
```txt
# public/robots.txt
User-agent: Mediapartners-Google
Allow: /

User-agent: *
Disallow: /api/
Allow: /
```

---

## 📚 참고 자료

### 관련 문서
- **구현 내역**: [2_adsense_fix_implementation.md](./2_adsense_fix_implementation.md)
- **Todo 체크리스트**: [2_adsense_fix_todo.md](./2_adsense_fix_todo.md)
- **배포 가이드**: [3_deployment_guide.md](./3_deployment_guide.md)
- **비교 분석**: [1_diff_prd.md](./1_diff_prd.md)

### 공식 문서
- [Google AdSense 고객센터](https://support.google.com/adsense)
- [AdSense 자동 광고 가이드](https://support.google.com/adsense/answer/9261805)
- [Next.js Script 컴포넌트](https://nextjs.org/docs/app/api-reference/components/script)
- [Next.js Script 최적화](https://nextjs.org/docs/app/building-your-application/optimizing/scripts)

### AdSense 정책
- [AdSense 프로그램 정책](https://support.google.com/adsense/answer/48182)
- [웹마스터 가이드라인](https://support.google.com/webmasters/answer/35769)

---

## 🔄 변경 이력

- 2025-11-17: 초안 작성 (blog-v2 방식 적용을 위한 요구사항)
- 2025-11-17: 문서 정리 (구현 체크리스트 → todo.md로 분리)
