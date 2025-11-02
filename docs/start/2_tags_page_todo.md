# 태그 페이지 구현 TODO

## Phase 1: 헤더 수정 (15분)
- [ ] `src/components/header.tsx` 파일 열기
- [ ] Import에 `Hash` 추가 (6번째 줄)
- [ ] Tags 버튼 추가 (Series 버튼 앞, 64번째 줄)
- [ ] 로컬 확인: `npm run dev` → http://localhost:3000 접속
- [ ] 헤더에 # 아이콘 표시 확인

## Phase 2: 서버 함수 추가 (20분)
- [ ] `src/lib/blog-server.ts` 파일 열기
- [ ] `getAllTagsServer()` 함수 추가 (파일 끝)
- [ ] `getPostsByTagServer()` 함수 추가
- [ ] TypeScript 타입 체크: `npm run check`

## Phase 3: 태그 페이지 생성 (30분)
- [ ] `src/app/tags` 디렉토리 생성
- [ ] `src/app/tags/page.tsx` 파일 생성
- [ ] 메타데이터 및 서버 컴포넌트 코드 작성
- [ ] 브라우저에서 `/tags` 경로 접속 확인

## Phase 4: 태그 클라우드 컴포넌트 (1시간)
- [ ] `src/components/tag-cloud.tsx` 파일 생성
- [ ] TagCloud 컴포넌트 작성
- [ ] 크기별 스타일 함수 작성 (`getSize`, `getColor`)
- [ ] 상위 100개 태그만 표시 로직 확인
- [ ] 다크모드 색상 대응 확인

## Phase 5: 클라이언트 인터랙션 (1시간)
- [ ] `src/components/tags-page-client.tsx` 파일 생성
- [ ] 태그 클릭 핸들러 구현
- [ ] 포스트 필터링 로직 구현
- [ ] BlogPostCard 컴포넌트 재사용
- [ ] 선택된 태그 상태 관리

## Phase 6: 스타일링 및 테스트 (30분)
- [ ] 모바일 레이아웃 확인 (< 768px)
- [ ] 태블릿 레이아웃 확인 (768px ~ 1024px)
- [ ] 데스크톱 레이아웃 확인 (> 1024px)
- [ ] 다크모드 전환 테스트
- [ ] 한글 태그 렌더링 확인

## Phase 7: 빌드 및 배포 준비 (30분)
- [ ] TypeScript 타입 체크: `npm run check`
- [ ] ESLint 체크: `npm run lint`
- [ ] 프로덕션 빌드: `npm run build`
- [ ] 로컬 프로덕션 테스트: `npm run start` (http://localhost:3000)

### MCP Playwright를 사용한 자동화 테스트
- [ ] **기본 네비게이션 테스트**:
  - `navigate` → http://localhost:3000
  - `screenshot` → 홈페이지 확인
  - `click` → 헤더의 # 아이콘 클릭
  - `screenshot` → 태그 페이지 렌더링 확인

- [ ] **태그 클라우드 기능 테스트**:
  - `click` → 태그 버튼 클릭 (예: "ETF", "주식")
  - `screenshot` → 필터링된 포스트 목록 확인
  - 한글 태그 렌더링 정상 동작 확인 (UTF-8 인코딩)

- [ ] **반응형 디자인 테스트**:
  - 모바일 뷰포트 (375x667) 스크린샷
  - 태블릿 뷰포트 (768x1024) 스크린샷
  - 데스크톱 뷰포트 (1920x1080) 스크린샷

- [ ] **다크모드 전환 테스트**:
  - 다크모드 토글 클릭
  - `screenshot` → 다크모드 색상 확인

- [ ] **성능 및 접근성 검증**:
  - 페이지 로드 시간 측정
  - 콘솔 에러 확인 (`get_console_logs`)
  - 접근성 자동 체크 (ARIA 레이블, 키보드 네비게이션)

## Git 작업
- [ ] 변경사항 스테이징: `git add .`
- [ ] 커밋 메시지 작성:
  ```
  [#이슈번호] feat: 태그 페이지 구현

  * 헤더에 태그 아이콘 추가
  * 태그 클라우드로 시각화
  * 태그 클릭 시 포스트 필터링 기능
  * 반응형 디자인 및 다크모드 지원
  ```
- [ ] 커밋: `git commit`
- [ ] PR 생성 (필요시)

---

**총 예상 시간**: 3.5-4시간
**구현 방식**: 태그 클라우드 (간소화 버전)
