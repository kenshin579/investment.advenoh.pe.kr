# AdSense 구현 차이 분석: blog-v2 vs investment

**작성일**: 2025-11-17
**목적**: blog-v2에서는 광고가 정상 표시되는데 investment에서는 광고가 표시되지 않는 원인 분석

---

## 🎯 핵심 요약

| 항목 | blog-v2 (✅ 광고 작동) | investment (❌ 광고 미작동) |
|------|---------------------|--------------------------|
| AdSense 클라이언트 ID | `ca-pub-8868959494983515` | `ca-pub-8868959494983515` |
| Script 로딩 방식 | Next.js `<Script>` + `strategy="afterInteractive"` | 일반 `<script>` + `async` |
| 광고 배치 방식 | 자동 광고 (Auto Ads) | 명시적 광고 단위 (Display Ads) |
| 빌드 HTML 스크립트 | `<link rel="preload">` | `<script async="">` |
| 광고 컴포넌트 | 없음 (자동 삽입) | `GoogleAdSense` 컴포넌트 |

---

## 📊 상세 비교

### 1. layout.tsx의 AdSense 스크립트 로딩 방식

#### **blog-v2**: Next.js Script 컴포넌트 사용

```tsx
// /Users/user/WebstormProjects/blog-v2.advenoh.pe.kr/app/layout.tsx

{/* Google AdSense */}
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8868959494983515"
  crossOrigin="anonymous"
  strategy="afterInteractive"  // ✅ Next.js 최적화 전략
/>
```

**장점**:
- `strategy="afterInteractive"`: 페이지가 상호작용 가능해진 후에 스크립트 로드 (성능 최적화)
- Next.js가 스크립트 로딩 타이밍을 최적화
- 빌드 시 `<link rel="preload">`로 변환되어 더 빠른 로드

#### **investment**: 일반 script 태그 사용

```tsx
// /Users/user/WebstormProjects/investment.advenoh.pe.kr/src/app/layout.tsx

{/* Google AdSense */}
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8868959494983515"
  crossOrigin="anonymous"
/>
```

**단점**:
- 일반 HTML `<script>` 태그 (Next.js 최적화 없음)
- `async` 속성만 사용하여 기본적인 비동기 로드
- 빌드 시 그대로 `<script async="">`로 변환

---

### 2. 빌드된 HTML 출력 차이

#### **blog-v2**: Preload 최적화

```html
<!-- 빌드 HTML 출력 -->
<link rel="preload"
      href="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8868959494983515"
      as="script"
      crossorigin=""/>
```

**효과**:
- 브라우저가 미리 스크립트를 로드하여 성능 향상
- AdSense 스크립트가 더 빠르게 실행됨

#### **investment**: 일반 async 스크립트

```html
<!-- 빌드 HTML 출력 -->
<script async=""
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8868959494983515"
        crossorigin="anonymous">
</script>
```

**효과**:
- 일반적인 비동기 스크립트 로드
- 최적화 없음

---

### 3. 광고 배치 방식 차이

#### **blog-v2**: 자동 광고 (Auto Ads)

**포스트 페이지에 광고 코드 없음**:
```tsx
// /Users/user/WebstormProjects/blog-v2.advenoh.pe.kr/app/[slug]/page.tsx

// 광고 관련 코드 없음
// AdSense가 자동으로 광고 위치를 선택하여 삽입
```

**추정**:
- AdSense 대시보드에서 **자동 광고(Auto Ads)가 활성화**되어 있음
- Google이 자동으로 최적의 위치에 광고 배치
- 별도의 `<ins>` 태그 필요 없음

#### **investment**: 명시적 광고 단위 (Display Ads)

**GoogleAdSense 컴포넌트 사용**:

```tsx
// /Users/user/WebstormProjects/investment.advenoh.pe.kr/src/components/google-adsense.tsx

'use client'
import { useEffect } from 'react'

export function GoogleAdSense({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = ''
}) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: 'block' }}
      data-ad-client="ca-pub-8868959494983515"
      data-ad-slot={adSlot}  // ✅ 명시적 광고 슬롯 ID
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive.toString()}
    />
  )
}
```

**포스트 페이지에서 사용**:

```tsx
// /Users/user/WebstormProjects/investment.advenoh.pe.kr/src/app/[category]/[slug]/page.tsx

<footer className="mt-12 border-t border-border pt-8">
  {/* BlogArticleBottomAd - AdSense 광고 */}
  <div className="mb-8">
    <GoogleAdSense
      adSlot="5560009326"  // ✅ 명시적 광고 단위 ID
      adFormat="auto"
    />
  </div>

  <RelatedPosts posts={relatedPosts} currentPost={post} />
</footer>
```

**문제점**:
- `adSlot="5560009326"` 광고 단위가 AdSense 대시보드에서 **승인 대기 중**이거나 **활성화되지 않았을** 가능성
- 명시적 광고 단위는 Google의 승인 절차가 필요함

---

## 🔍 광고가 안 보이는 이유 (추정)

### 1. **자동 광고 vs 디스플레이 광고 차이**

| 특성 | 자동 광고 (blog-v2) | 디스플레이 광고 (investment) |
|------|-------------------|----------------------------|
| 승인 과정 | 사이트 전체 승인 (1회) | 광고 단위별 개별 승인 필요 |
| 활성화 | AdSense 대시보드에서 토글 ON | 광고 단위 생성 + 코드 삽입 |
| 표시 시점 | 즉시 (승인 후) | 광고 단위 승인 후 |
| 광고 위치 | Google 자동 선택 | 개발자가 명시적으로 지정 |

### 2. **가능한 원인**

#### ✅ **blog-v2에서 광고가 보이는 이유**
1. AdSense 계정에서 **자동 광고가 활성화**되어 있음
2. Next.js `<Script>` 컴포넌트로 최적화된 로딩
3. Preload를 통한 빠른 스크립트 로드

#### ❌ **investment에서 광고가 안 보이는 이유**
1. **광고 단위(`5560009326`)가 AdSense에서 승인 대기 중**이거나 활성화되지 않음
2. 일반 `<script>` 태그로 인한 로딩 최적화 부족
3. 자동 광고가 비활성화되어 있을 가능성

---

## 💡 해결 방안

### 방안 1: AdSense 대시보드 확인 (우선순위 높음)

1. **AdSense 계정** 접속: https://adsense.google.com
2. **광고 > 광고 단위** 메뉴 확인
3. `5560009326` 슬롯 ID가 **활성화**되어 있는지 확인
4. 승인 대기 중이면 **승인 완료 대기**

### 방안 2: 자동 광고 활성화 (간단함)

AdSense 대시보드에서 **자동 광고**를 활성화하면 명시적 광고 단위 없이도 광고 표시 가능:

1. AdSense > **광고 > 사이트별**
2. `investment.advenoh.pe.kr` 선택
3. **자동 광고 토글 ON**
4. 저장 후 24시간 대기

### 방안 3: Next.js Script 컴포넌트로 전환 (권장)

blog-v2와 동일한 방식으로 전환:

```tsx
// src/app/layout.tsx 수정

// ❌ 기존
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8868959494983515"
  crossOrigin="anonymous"
/>

// ✅ 권장 (Next.js Script 컴포넌트 사용)
import Script from 'next/script'  // 추가

<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8868959494983515"
  crossOrigin="anonymous"
  strategy="afterInteractive"  // 성능 최적화
/>
```

### 방안 4: 새로운 광고 단위 생성

AdSense에서 새로운 광고 단위를 생성하여 테스트:

1. AdSense > **광고 > 광고 단위**
2. **디스플레이 광고** 생성
3. 생성된 코드에서 `data-ad-slot` 값 확인
4. `GoogleAdSense` 컴포넌트의 `adSlot` props 업데이트

---

## 📝 추가 확인 사항

### 1. 브라우저 개발자 도구 확인

**콘솔 에러 확인**:
```bash
# Chrome 개발자 도구 > Console
# AdSense 관련 에러 메시지 확인

# 일반적인 에러:
# - "adsbygoogle.push() error: No slot size for availableWidth=0"
# - "Ad request failed: ad slot not found"
```

### 2. ads.txt 파일 확인

두 프로젝트 모두 `public/ads.txt` 파일이 필요:

```txt
google.com, pub-8868959494983515, DIRECT, f08c47fec0942fa0
```

### 3. robots.txt 확인

AdSense 크롤러가 접근 가능한지 확인:

```txt
# AdSense 크롤러 허용
User-agent: Mediapartners-Google
Allow: /

User-agent: *
Disallow: /api/
```

---

## 🎯 권장 조치

### 즉시 조치 (우선순위 높음)

1. **AdSense 대시보드** 접속하여 광고 단위 `5560009326` 상태 확인
2. **자동 광고** 활성화 (가장 빠른 해결 방법)
3. `layout.tsx`에서 **Next.js Script 컴포넌트**로 전환

### 중장기 조치

1. 광고 단위가 승인될 때까지 대기 (1-3일 소요)
2. 새로운 광고 단위 생성 및 테스트
3. 광고 성과 모니터링

---

## 📌 참고 자료

- **Google AdSense 고객센터**: https://support.google.com/adsense
- **Next.js Script 컴포넌트**: https://nextjs.org/docs/app/api-reference/components/script
- **AdSense 자동 광고 가이드**: https://support.google.com/adsense/answer/9261805

---

## 🔄 변경 이력

- 2025-11-17: 초안 작성 (blog-v2 vs investment 비교 분석 완료)
