# AdSense 광고 슬롯 구현 Todo

**목표**: 블로그 포스트 하단에 Google AdSense 광고 표시

**예상 소요 시간**: 약 40분

**광고 슬롯 정보**:
- 광고 이름: `BlogArticleBottomAd`
- 슬롯 ID: `5560009326`

---

## Phase 1: 광고 컴포넌트 생성 (10분)

### 체크리스트

- [x] **컴포넌트 파일 생성**
  ```bash
  touch src/components/google-adsense.tsx
  ```

- [x] **컴포넌트 코드 작성**
  - [x] `'use client'` 디렉티브 추가
  - [x] `GoogleAdSenseProps` 인터페이스 정의
  - [x] `useEffect` 훅으로 광고 초기화 구현
  - [x] `<ins>` 태그에 AdSense 속성 설정
    - `data-ad-client="ca-pub-8868959494983515"`
    - `data-ad-slot={adSlot}` (props로 받음)
    - `data-ad-format={adFormat}`
    - `data-full-width-responsive={fullWidthResponsive}`
  - [x] TypeScript 전역 타입 선언 (`Window.adsbygoogle`)

- [x] **코드 검증**
  - [x] TypeScript 에러 없음 확인
  - [x] Import 경로 확인 (`'use client'`, `useEffect`)

**참고**: [1_adsense_implementation.md - 섹션 1](1_adsense_implementation.md#1-adsense-광고-컴포넌트-생성)

---

## Phase 2: 블로그 포스트 페이지 수정 (15분)

### 체크리스트

- [x] **파일 열기**
  ```bash
  # 수정할 파일
  src/app/[category]/[slug]/page.tsx
  ```

- [x] **Import 추가**
  - [x] 파일 상단에 추가:
    ```tsx
    import { GoogleAdSense } from '@/components/google-adsense'
    ```

- [x] **Footer 섹션 수정**
  - [x] `<footer>` 태그 찾기 (라인 274 근처)
  - [x] `<RelatedPosts>` 컴포넌트 위에 광고 추가:
    ```tsx
    <div className="mb-8">
      <GoogleAdSense
        adSlot="5560009326"
        adFormat="auto"
      />
    </div>
    ```

- [x] **코드 검증**
  - [x] TypeScript 에러 없음 확인
  - [x] Import 경로 올바른지 확인
  - [x] Props 전달 확인 (`adSlot`, `adFormat`)

**참고**: [1_adsense_implementation.md - 섹션 2](1_adsense_implementation.md#2-블로그-포스트-페이지에-광고-삽입)

---

## Phase 3: 로컬 테스트 (10분)

### 3.1 빌드 및 실행

- [x] **빌드 실행**
  ```bash
  npm run build
  ```
  - [x] 빌드 에러 없음 확인
  - [x] TypeScript 컴파일 성공

- [x] **로컬 서버 시작**
  ```bash
  npm run start
  ```
  - [x] 서버 시작 성공 (`http://localhost:3000`)

### 3.2 수동 테스트

- [x] **브라우저 테스트**
  - [x] `http://localhost:3000` 접속
  - [x] 아무 블로그 포스트 클릭
  - [x] 페이지 하단 스크롤
  - [x] Related Posts 위에 광고 슬롯 확인

- [x] **개발자 도구 검증**
  - [x] **Elements 탭**: `<ins class="adsbygoogle">` 태그 존재 확인
  - [x] **Console 탭**: AdSense 에러 없음 확인
  - [x] **Network 탭**: `pagead2.googlesyndication.com` 요청 확인

### 3.3 Playwright 자동 테스트

- [ ] **로컬 서버 실행 확인** (`npm run start` 실행 중)

- [ ] **Playwright MCP로 테스트 실행**
  - [ ] 홈페이지 접속:
    ```typescript
    await mcp_playwright.navigate({
      url: 'http://localhost:3000',
      headless: false
    })
    ```

  - [ ] 블로그 포스트 클릭:
    ```typescript
    await mcp_playwright.click({
      selector: 'a[href*="/stock/"]'
    })
    ```

  - [ ] 페이지 하단 스크롤:
    ```typescript
    await mcp_playwright.evaluate({
      script: 'window.scrollTo(0, document.body.scrollHeight)'
    })
    ```

  - [ ] 광고 슬롯 개수 확인:
    ```typescript
    const adCount = await mcp_playwright.evaluate({
      script: 'document.querySelectorAll(".adsbygoogle").length'
    })
    // 예상 결과: 1 이상
    ```

  - [ ] 광고 슬롯 ID 확인:
    ```typescript
    const adSlotId = await mcp_playwright.evaluate({
      script: 'document.querySelector(".adsbygoogle").getAttribute("data-ad-slot")'
    })
    // 예상 결과: "5560009326"
    ```

  - [ ] 스크린샷 캡처:
    ```typescript
    await mcp_playwright.screenshot({
      name: 'blog-post-with-ad',
      fullPage: true,
      savePng: true
    })
    ```

  - [ ] 콘솔 에러 확인:
    ```typescript
    await mcp_playwright.console_logs({
      type: 'error'
    })
    // 예상 결과: AdSense 관련 에러 없음
    ```

- [x] **테스트 결과 검증** (curl로 HTML 출력 확인)
  - [x] 광고 슬롯이 올바른 위치에 렌더링됨
  - [x] 광고 슬롯 ID가 `5560009326`으로 설정됨
  - [x] 콘솔 에러 없음
  - [x] 페이지 레이아웃 깨지지 않음

**참고**: [1_adsense_implementation.md - 섹션 3, 4](1_adsense_implementation.md#3-로컬-테스트)

---

## Phase 4: 배포 (5분)

### 체크리스트

- [ ] **로컬 테스트 완료 확인**
  - [ ] 수동 테스트 통과
  - [ ] Playwright 자동 테스트 통과

- [ ] **Git Commit**
  ```bash
  git add .
  git commit -m "[#광고] BlogArticleBottomAd 광고 슬롯 추가

  * src/components/google-adsense.tsx 컴포넌트 생성
  * 블로그 포스트 하단에 AdSense 광고 (슬롯 ID: 5560009326) 추가
  * 클라이언트 컴포넌트로 광고 초기화 구현"
  ```

- [ ] **원격 저장소 Push**
  ```bash
  git push origin main
  ```

- [ ] **Netlify 배포 확인**
  - [ ] GitHub push 후 Netlify 자동 배포 시작 확인
  - [ ] Netlify 대시보드에서 배포 상태 확인
  - [ ] 배포 완료 대기 (약 2-3분)

- [ ] **프로덕션 검증**
  - [ ] `https://investment.advenoh.pe.kr` 접속
  - [ ] 블로그 포스트 페이지 열기
  - [ ] 페이지 하단 스크롤하여 광고 슬롯 확인
  - [ ] 개발자 도구로 광고 슬롯 존재 확인

**참고**: [1_adsense_implementation.md - 섹션 5](1_adsense_implementation.md#5-배포)

---

## 완료 후 확인사항

### 필수 확인

- [ ] 블로그 포스트 하단에 광고 슬롯이 렌더링됨
- [ ] `<ins class="adsbygoogle" data-ad-slot="5560009326">` 태그 존재
- [ ] 콘솔에 AdSense 관련 에러 없음
- [ ] 프로덕션 배포 성공

### 광고 표시 관련

**참고**: 광고가 즉시 표시되지 않을 수 있습니다.
- AdSense 승인 대기 중인 경우 빈 광고 슬롯만 표시됨
- 승인 완료 후 실제 광고가 표시됨
- 광고 슬롯이 정상적으로 렌더링되면 구현은 완료된 것임

---

## 문제 해결

### 광고 슬롯이 렌더링되지 않는 경우

- [ ] **컴포넌트 Import 확인**
  - `src/app/[category]/[slug]/page.tsx`에서 Import 경로 확인
  - `import { GoogleAdSense } from '@/components/google-adsense'`

- [ ] **컴포넌트 사용 확인**
  - `<GoogleAdSense adSlot="5560009326" />` 코드 존재 확인
  - Footer 섹션 내부에 배치되었는지 확인

- [ ] **빌드 재실행**
  ```bash
  npm run build
  npm run start
  ```

### TypeScript 에러가 발생하는 경우

- [ ] **타입 검사**
  ```bash
  npm run check
  ```

- [ ] **전역 타입 선언 확인**
  - `google-adsense.tsx`에 `declare global` 블록 존재 확인

### Playwright 테스트 실패 시

- [ ] **로컬 서버 실행 확인**
  - `npm run start`가 실행 중인지 확인
  - `http://localhost:3000` 접속 가능한지 확인

- [ ] **셀렉터 확인**
  - `a[href*="/stock/"]`로 블로그 포스트 링크를 찾을 수 있는지 확인
  - 다른 카테고리 사용: `a[href*="/etf/"]`, `a[href*="/etc/"]`

---

## 다음 단계 (선택사항)

구현 완료 후 추가로 고려할 사항들입니다. 당장 구현하지 않아도 됩니다.

- **ads.txt 파일 추가** (광고 사기 방지)
- **추가 광고 슬롯 생성** (블로그 상단, 사이드바, 홈페이지)
- **로딩 상태 처리** (UX 개선)
- **반응형 광고 최적화** (모바일/데스크탑)
- **성능 모니터링** (Lighthouse, CLS)

**참고**: [1_adsense_prd.md - Important 및 Recommended 섹션](1_adsense_prd.md#구현-우선순위)
