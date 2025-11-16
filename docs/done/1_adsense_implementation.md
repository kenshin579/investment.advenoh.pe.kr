# AdSense 광고 슬롯 구현 가이드

## 개요

블로그 포스트 하단에 Google AdSense 광고를 표시하기 위한 구현 가이드입니다.

**광고 슬롯 정보**:
- **광고 이름**: `BlogArticleBottomAd`
- **광고 슬롯 ID**: `5560009326`
- **Client ID**: `ca-pub-8868959494983515`

---

## 1. AdSense 광고 컴포넌트 생성

### 파일 생성
```bash
touch src/components/google-adsense.tsx
```

### 구현 코드

**파일**: `src/components/google-adsense.tsx`

```tsx
'use client'

import { useEffect } from 'react'

interface GoogleAdSenseProps {
  adSlot: string
  adFormat?: 'auto' | 'fluid' | 'rectangle'
  fullWidthResponsive?: boolean
  className?: string
}

export function GoogleAdSense({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = ''
}: GoogleAdSenseProps) {
  useEffect(() => {
    try {
      // AdSense 광고 초기화
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
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive.toString()}
    />
  )
}

// TypeScript 타입 선언
declare global {
  interface Window {
    adsbygoogle: any[]
  }
}
```

### 주요 특징
- **클라이언트 컴포넌트**: `'use client'` 디렉티브로 브라우저에서만 실행
- **useEffect**: 컴포넌트 마운트 시 광고 초기화
- **재사용 가능**: props를 통해 다양한 광고 형식 지원
- **타입 안전성**: TypeScript 인터페이스 및 전역 타입 선언

---

## 2. 블로그 포스트 페이지에 광고 삽입

### 파일 수정

**파일**: `src/app/[category]/[slug]/page.tsx`

### 수정 내용

#### 2.1 Import 추가

파일 상단에 다음 import 추가:

```tsx
import { GoogleAdSense } from '@/components/google-adsense'
```

#### 2.2 Footer 섹션 수정

기존 footer 코드를 찾아서 수정 (라인 274 근처):

**기존 코드**:
```tsx
<footer className="mt-12 border-t border-border pt-8">
  <RelatedPosts posts={relatedPosts} currentPost={post} />

  {/* Author bio */}
  <div className="mt-8 p-6 bg-muted rounded-lg">
    ...
  </div>
</footer>
```

**수정 후 코드**:
```tsx
<footer className="mt-12 border-t border-border pt-8">
  {/* BlogArticleBottomAd 광고 추가 */}
  <div className="mb-8">
    <GoogleAdSense
      adSlot="5560009326"
      adFormat="auto"
    />
  </div>

  <RelatedPosts posts={relatedPosts} currentPost={post} />

  {/* Author bio */}
  <div className="mt-8 p-6 bg-muted rounded-lg">
    ...
  </div>
</footer>
```

### 광고 배치 위치
- **Related Posts 위**: 콘텐츠를 모두 읽은 사용자에게 광고 노출
- **Author Bio 위**: 광고와 작성자 정보 분리로 가독성 유지

---

## 3. 로컬 테스트

### 3.1 빌드 및 실행

```bash
# 정적 사이트 빌드
npm run build

# 로컬 서버 시작 (http://localhost:3000)
npm run start
```

### 3.2 수동 테스트

1. 브라우저에서 `http://localhost:3000` 접속
2. 아무 블로그 포스트 클릭
3. 페이지 하단 스크롤
4. Related Posts 위에 광고 슬롯 확인

### 3.3 개발자 도구 검증

**Console 탭**:
- AdSense 에러 메시지 없는지 확인
- `AdSense error:` 출력 없어야 함

**Network 탭**:
- `pagead2.googlesyndication.com` 요청 확인
- 광고 스크립트 로드 성공 (200 OK)

**Elements 탭**:
- `<ins class="adsbygoogle">` 태그 존재 확인
- `data-ad-slot="5560009326"` 속성 확인

---

## 4. Playwright를 활용한 자동 테스트

### 4.1 테스트 시나리오

**테스트 목적**: 광고 슬롯이 올바르게 렌더링되는지 자동 검증

### 4.2 테스트 실행

#### 테스트 스크립트

```bash
# 로컬 서버가 실행 중이어야 함 (npm run start)
```

#### Playwright MCP 명령어

```typescript
// 1. 홈페이지 접속
await mcp_playwright.navigate({
  url: 'http://localhost:3000',
  headless: false
})

// 2. 첫 번째 블로그 포스트 클릭
await mcp_playwright.click({
  selector: 'a[href*="/stock/"]'
})

// 3. 페이지 하단으로 스크롤
await mcp_playwright.evaluate({
  script: 'window.scrollTo(0, document.body.scrollHeight)'
})

// 4. 광고 슬롯 존재 확인
const adCount = await mcp_playwright.evaluate({
  script: 'document.querySelectorAll(".adsbygoogle").length'
})
// 결과: 최소 1개 이상

// 5. 광고 슬롯 속성 확인
const adSlotId = await mcp_playwright.evaluate({
  script: 'document.querySelector(".adsbygoogle").getAttribute("data-ad-slot")'
})
// 결과: "5560009326"

// 6. 스크린샷 캡처
await mcp_playwright.screenshot({
  name: 'blog-post-with-ad',
  fullPage: true,
  savePng: true
})

// 7. 콘솔 에러 확인
await mcp_playwright.console_logs({
  type: 'error'
})
// 결과: AdSense 관련 에러 없어야 함
```

### 4.3 검증 체크리스트

- ✅ 광고 슬롯 (`<ins class="adsbygoogle">`) 존재
- ✅ 광고 슬롯 ID가 `5560009326`으로 설정됨
- ✅ Related Posts 위에 광고가 배치됨
- ✅ 콘솔에 AdSense 에러 없음
- ✅ 페이지 레이아웃 깨지지 않음

---

## 5. 배포

### 5.1 Git Commit

```bash
git add .
git commit -m "[#광고] BlogArticleBottomAd 광고 슬롯 추가

* src/components/google-adsense.tsx 컴포넌트 생성
* 블로그 포스트 하단에 AdSense 광고 (슬롯 ID: 5560009326) 추가
* 클라이언트 컴포넌트로 광고 초기화 구현"
```

### 5.2 원격 저장소 Push

```bash
git push origin main
```

### 5.3 Netlify 배포 확인

1. GitHub push 후 Netlify 자동 배포 시작
2. Netlify 대시보드에서 배포 상태 확인
3. 배포 완료 후 프로덕션 URL 접속
4. 블로그 포스트에서 광고 표시 확인

### 5.4 프로덕션 검증

**URL**: `https://investment.advenoh.pe.kr`

1. 블로그 포스트 페이지 접속
2. 페이지 하단 스크롤
3. 광고 슬롯 렌더링 확인 (빈 공간 또는 실제 광고)
4. 개발자 도구로 네트워크 요청 확인

**참고**: 광고 승인까지 시간이 걸릴 수 있으며, 초기에는 빈 광고 슬롯만 표시될 수 있습니다.

---

## 문제 해결

### 광고가 표시되지 않는 경우

#### 1. 광고 슬롯이 없는 경우
```bash
# Elements 탭에서 확인
document.querySelectorAll('.adsbygoogle')
# 결과: 0이면 컴포넌트가 렌더링되지 않음
```

**해결**:
- Import 경로 확인: `@/components/google-adsense`
- 컴포넌트 사용 위치 확인: footer 섹션 내부

#### 2. AdSense 스크립트 로드 실패
```bash
# Network 탭에서 확인
# pagead2.googlesyndication.com 요청 실패
```

**해결**:
- `src/app/layout.tsx` 확인
- AdSense 스크립트 태그 존재 확인 (라인 90-95)
- 인터넷 연결 확인

#### 3. useEffect 실행 안 됨
```tsx
// google-adsense.tsx에서 로그 추가
useEffect(() => {
  console.log('GoogleAdSense mounted')
  try {
    if (typeof window !== 'undefined') {
      console.log('Initializing AdSense')
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    }
  } catch (error) {
    console.error('AdSense error:', error)
  }
}, [])
```

**해결**:
- Console에서 로그 확인
- `'use client'` 디렉티브 확인
- 서버 컴포넌트에서 사용하지 않았는지 확인

---

## 참고 자료

- [AdSense 광고 코드 구현 가이드](https://support.google.com/adsense/answer/9274019)
- [Next.js Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
