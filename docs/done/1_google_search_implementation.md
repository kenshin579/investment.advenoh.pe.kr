# 구글 검색 결과 개선 - 구현 가이드

## 개요

구글 검색 결과에서 사이트 이름을 "Frank's Investment Blog"로 표시하고, 투자 관련 커스텀 파비콘을 적용합니다.

## 구현 항목

### 1. Favicon 파일 준비

**필요한 파일**:
- `public/favicon.ico` (32x32)
- `public/icon.png` (192x192 또는 512x512)
- `public/apple-touch-icon.png` (180x180)

**디자인 방향**:
- 투자/금융 관련 아이콘 (차트, 상승 화살표 등)
- 간결하고 식별 가능한 디자인
- 다크/라이트 모드 모두 잘 보이는 색상

**생성 도구**:
- [Favicon Generator](https://realfavicongenerator.net/) 사용 권장
- 또는 디자인 툴로 직접 제작

### 2. Next.js Metadata 설정

**파일**: `src/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: {
    default: "Frank's Investment Blog",
    template: "%s | Frank's Investment Blog"
  },
  description: "투자에 대한 인사이트 - 주식, ETF, 재테크 정보 블로그",
  openGraph: {
    siteName: "Frank's Investment Blog",
    // ... 기존 설정 유지
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' }
    ],
    apple: '/apple-touch-icon.png'
  }
}
```

### 3. JSON-LD Schema 추가

**파일**: `src/lib/json-ld-schema.ts`

기존 함수에 WebSite schema 추가:

```typescript
export function generateWebSiteSchema(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: "Frank's Investment Blog",
    alternateName: "Frank's Investment Insights",
    url: 'https://investment.advenoh.pe.kr',
    description: '투자에 대한 인사이트 - 주식, ETF, 재테크 정보 블로그'
  }
}
```

**적용**: `src/app/layout.tsx`에서 WebSite schema 추가

```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(generateWebSiteSchema())
  }}
/>
```

### 4. 파일 구조

```
public/
├── favicon.ico         # 브라우저 탭 아이콘
├── icon.png           # 일반 아이콘 (192x192 이상)
└── apple-touch-icon.png  # iOS 홈 화면 아이콘

src/
├── app/
│   └── layout.tsx     # Metadata 설정
└── lib/
    └── json-ld-schema.ts  # JSON-LD schema 함수
```

## 검증 방법

### 로컬 테스트
```bash
npm run build
npm run start
```

1. 브라우저에서 `http://localhost:3000` 접속
2. 브라우저 탭의 파비콘 확인
3. 개발자 도구 > Application > Manifest 확인
4. 페이지 소스에서 JSON-LD 확인

### Google 검증
1. [Rich Results Test](https://search.google.com/test/rich-results) 실행
2. URL 입력 또는 코드 스니펫 테스트
3. WebSite schema 인식 확인

### 배포 후 확인
1. 실제 사이트 배포 후 Google Search Console 확인
2. `site:investment.advenoh.pe.kr` 검색
3. 반영 시간: 1-2주 소요 가능

## 기술적 고려사항

### Next.js App Router
- `src/app/icon.png` 파일을 추가하면 Next.js가 자동으로 favicon 처리
- 또는 `public/` 디렉토리에 수동 배치 가능
- App Router metadata API 사용 권장

### Static Export
- 정적 빌드이므로 `public/` 디렉토리 파일이 그대로 배포됨
- favicon 파일은 반드시 `public/`에 위치해야 함

### 캐싱
- 파비콘 변경 후 브라우저 캐시 클리어 필요
- 배포 후 Google 재크롤링 필요

## 참고 자료

- [Google Search Central - Site Names](https://developers.google.com/search/docs/appearance/site-names)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Schema.org WebSite](https://schema.org/WebSite)
