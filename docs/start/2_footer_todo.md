# Footer 카테고리 표시 구현 Todo

## Phase 1: 코드 수정

### Step 1: blog-client.ts 수정
- [x] `src/lib/blog-client.ts` 파일 열기
- [x] 21행 찾기: `const response = await fetch('/api/categories')`
- [x] 수정: `'/api/categories'` → `'/data/categories.json'`
- [x] 파일 저장

### Step 2: footer.tsx 수정
- [x] `src/components/footer.tsx` 파일 열기
- [x] import 추가: `import { getAllCategoriesClient } from "@/lib/blog-client";`
- [x] 18-44행의 중복 fetch 로직 삭제
- [x] useEffect를 간단하게 변경: `getAllCategoriesClient().then(setCategories);`
- [x] 파일 저장

### Step 3: category-filter.tsx 수정
- [x] `src/components/category-filter.tsx` 파일 열기
- [x] 18행 수정: `queryKey: ['/api/categories']` → `queryKey: ['/data/categories']`
- [x] 20행 수정: `fetch('/api/categories')` → `fetch('/data/categories.json')`
- [x] 파일 저장

## Phase 2: 빌드 및 테스트

### Step 4: 로컬 빌드
- [x] 터미널에서 `npm run build` 실행
- [x] 빌드 성공 확인
- [x] `public/data/categories.json` 파일 생성 확인

### Step 5: 로컬 서버 실행
- [x] 터미널에서 `npm run start` 실행
- [x] 서버 시작 확인 (http://localhost:3000)

### Step 6: 수동 기능 검증
- [x] 브라우저에서 http://localhost:3000 접속
- [x] Footer 섹션 스크롤
- [x] 카테고리 목록 표시 확인:
  - [x] Stock (61)
  - [x] Weekly (14)
  - [x] ETF (11)
  - [x] Etc (9)
- [x] 브라우저 개발자 도구 열기 (F12)
- [x] Network 탭 확인:
  - [x] `/data/categories.json` 요청 성공 (200)
  - [x] `/api/categories` 요청 없음 확인
- [x] 카테고리 링크 클릭 테스트:
  - [x] Stock 링크 클릭 → Stock 카테고리 필터링 확인
  - [x] Weekly 링크 클릭 → Weekly 카테고리 필터링 확인

### Step 7: MCP Playwright 자동 테스트
- [x] 로컬 서버 실행 상태 확인 (`npm run start`)
- [x] Playwright 테스트 실행:
  - [x] 홈페이지 접속: `navigate({ url: 'http://localhost:3000' })`
  - [x] 전체 페이지 스크린샷: `screenshot({ name: 'homepage-with-footer', fullPage: true })`
  - [x] Footer 텍스트 확인: `get_visible_text()` → "Stock", "Weekly", "ETF", "Etc" 포함 확인
  - [x] Stock 카테고리 클릭: `click({ selector: 'footer a[href*="category=Stock"]' })`
  - [x] 필터링 결과 스크린샷: `screenshot({ name: 'category-stock-filtered' })`
  - [x] 홈으로 돌아가기: `navigate({ url: 'http://localhost:3000' })`
  - [x] Weekly 카테고리 클릭: `click({ selector: 'footer a[href*="category=Weekly"]' })`
  - [x] 필터링 결과 스크린샷: `screenshot({ name: 'category-weekly-filtered' })`
- [x] 테스트 결과 확인:
  - [x] 모든 스크린샷에 카테고리 목록 표시됨
  - [x] 카테고리 필터링 정상 동작
  - [x] Console에 에러 없음

## Phase 3: 완료

### Step 8: 정리
- [x] 로컬 서버 종료 (Ctrl+C)
- [x] 변경사항 커밋 준비
