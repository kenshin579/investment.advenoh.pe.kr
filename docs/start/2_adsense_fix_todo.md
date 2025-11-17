# AdSense 광고 표시 수정 Todo

**작성일**: 2025-11-17

---

## Phase 1: 코드 구현 ✅

- [x] `src/app/layout.tsx` 파일에 Script 컴포넌트 import 추가
- [x] `<script>` 태그를 `<Script>` 컴포넌트로 변경
- [x] `strategy="afterInteractive"` 속성 추가
- [x] `src/app/[category]/[slug]/page.tsx`에서 GoogleAdSense import 제거
- [x] GoogleAdSense 컴포넌트 사용 부분 삭제
- [x] `src/components/google-adsense.tsx` 파일 삭제

---

## Phase 2: 빌드 검증 ✅

- [x] `npm run build` 실행
- [x] 빌드 에러 없음 확인
- [x] 정적 페이지 생성 확인 (109개 페이지)
- [x] `out/` 디렉토리 생성 확인

---

## Phase 3: Git 커밋 및 푸시 ✅

- [x] Git 변경사항 확인
  ```bash
  git status
  ```

- [x] 변경 파일 스테이징
  ```bash
  git add src/app/layout.tsx
  git add src/app/\[category\]/\[slug\]/page.tsx
  git add src/components/google-adsense.tsx  # 삭제된 파일
  git add docs/start/  # 문서 추가
  ```

- [x] 커밋 (Korean commit message format)
  ```bash
  git commit -m "[#49] AdSense Auto Ads 방식으로 전환

  * Next.js Script 컴포넌트 적용 (afterInteractive 전략)
  * 명시적 광고 단위 제거하고 Auto Ads로 전환
  * GoogleAdSense 컴포넌트 삭제
  * blog-v2 방식과 동일하게 구현
  * AdSense 수정 관련 문서 추가 (PRD, 구현내역, Todo)"
  ```

- [x] 푸시
  ```bash
  git push -u origin feature/issue-49-adsense-auto-ads
  ```

---

## Phase 4: 배포 확인 ✅

- [x] GitHub 푸시 완료 확인
  - PR #50 생성: https://github.com/kenshin579/investment.advenoh.pe.kr/pull/50
- [x] Netlify 자동 빌드 시작 확인
  - 배포 상태: success (완료)
  - 배포 URL: https://app.netlify.com/projects/investmentadvenoh/deploys/691b1b89f40f0a00080032a9
- [x] 배포 로그 확인 (빌드 성공 여부)
  - 빌드 성공 확인됨
- [x] 배포 완료 후 사이트 접속 확인
  - Deploy Preview: https://deploy-preview-50--investmentadvenoh.netlify.app
  - 프로덕션 (PR 머지 후): https://investment.advenoh.pe.kr

---

## Phase 5: AdSense 대시보드 설정 ⏳

### 5.1 AdSense 계정 접속
- [ ] https://adsense.google.com 접속
- [ ] 계정 로그인 확인

### 5.2 자동 광고 활성화
- [ ] 좌측 메뉴에서 `광고` 클릭
- [ ] `사이트별` 탭 선택
- [ ] `investment.advenoh.pe.kr` 도메인 찾기
- [ ] 자동 광고 토글을 **ON**으로 변경
- [ ] 설정 저장

### 5.3 광고 형식 설정 (선택사항)
- [ ] 페이지 내 광고 활성화
- [ ] 고정 광고 설정 (선택)
- [ ] 전면 광고 설정 (선택)

### 5.4 기존 광고 단위 처리
- [ ] `광고 > 광고 단위` 메뉴 접속
- [ ] `5560009326` 슬롯 ID 상태 확인
- [ ] 비활성화 또는 삭제 (선택)

---

## Phase 6: 배포 후 검증 (24시간 대기) ⏳

### 6.1 사이트 접속 확인
- [ ] 브라우저에서 https://investment.advenoh.pe.kr 접속
- [ ] 페이지 정상 렌더링 확인
- [ ] 블로그 포스트 페이지 접속 확인

### 6.2 AdSense 스크립트 로드 확인
- [ ] Chrome DevTools 열기 (F12)
- [ ] **Network 탭** 이동
- [ ] 페이지 새로고침
- [ ] `adsbygoogle` 필터링
- [ ] `adsbygoogle.js` Status 200 확인

### 6.3 HTML 소스 확인
- [ ] 브라우저에서 소스 보기 (Cmd+Option+U / Ctrl+U)
- [ ] `<link rel="preload">` 태그 존재 확인
- [ ] Client ID `ca-pub-8868959494983515` 포함 확인

### 6.4 Console 오류 확인
- [ ] Chrome DevTools > Console 탭
- [ ] AdSense 관련 오류 없음 확인
- [ ] 경고 메시지 확인 (24시간 이내는 정상)

---

## Phase 7: MCP Playwright 테스트 ⏳

### 7.1 로컬 서버 시작
- [ ] `npm run build` 실행
- [ ] `npm run start` 실행 (http://localhost:3000)

### 7.2 Playwright 기본 테스트
- [ ] MCP Playwright로 홈페이지 접속
  ```typescript
  mcp_playwright.navigate({ url: 'http://localhost:3000' })
  ```
- [ ] 스크린샷 캡처
  ```typescript
  mcp_playwright.screenshot({ name: 'homepage', fullPage: true })
  ```
- [ ] 블로그 포스트 클릭 테스트
  ```typescript
  mcp_playwright.click({ selector: 'a[href*="/stock/"]' })
  mcp_playwright.screenshot({ name: 'blog-post' })
  ```

### 7.3 AdSense 스크립트 검증
- [ ] Console 로그 확인
  ```typescript
  mcp_playwright.console_logs({ type: 'error' })
  ```
- [ ] Network 요청 확인 (adsbygoogle.js 로드)
- [ ] HTML 소스에서 Script 태그 확인

### 7.4 한글 텍스트 인코딩 확인
- [ ] 페이지 텍스트 정상 렌더링 확인
- [ ] 한글 깨짐 없음 확인

---

## Phase 8: 광고 표시 확인 (24-48시간 후) ⏳

### 8.1 광고 표시 확인
- [ ] 블로그 포스트 페이지에서 광고 확인
- [ ] 다양한 카테고리 페이지에서 광고 확인
- [ ] 데스크톱/모바일 모두 확인

### 8.2 AdSense 성과 확인
- [ ] AdSense 대시보드 > `보고서` 접속
- [ ] 페이지 조회수 증가 확인
- [ ] 광고 노출 수 확인
- [ ] 예상 수익 확인

---

## Phase 9: 문서화 및 정리 ⏳

- [ ] 구현 내역 문서 검토
- [ ] 배포 가이드 업데이트 (필요시)
- [ ] 트러블슈팅 내용 추가 (문제 발생 시)
- [ ] 프로젝트 README 업데이트 (필요시)

---

## 🚨 문제 발생 시 체크리스트

### 광고가 24시간 후에도 표시되지 않는 경우

- [ ] AdSense 대시보드에서 자동 광고 활성화 확인
- [ ] 사이트 승인 상태 확인
- [ ] 정책 위반 경고 확인
- [ ] 브라우저 Console 에러 확인
- [ ] Network 탭에서 스크립트 로드 확인 (Status 200)
- [ ] 광고 차단 프로그램 비활성화 후 테스트

### 빌드 실패 시

- [ ] TypeScript 오류 확인
- [ ] 의존성 설치 확인 (`npm install`)
- [ ] Node.js 버전 확인
- [ ] `.env` 환경 변수 확인

### 배포 실패 시

- [ ] Netlify 빌드 로그 확인
- [ ] 환경 변수 설정 확인
- [ ] 빌드 명령어 확인 (`npm run build`)
- [ ] Node.js 버전 설정 확인

---

## 📊 진행 상황

| Phase | 상태 | 완료일 |
|-------|------|--------|
| Phase 1: 코드 구현 | ✅ 완료 | 2025-11-17 |
| Phase 2: 빌드 검증 | ✅ 완료 | 2025-11-17 |
| Phase 3: Git 커밋 및 푸시 | ✅ 완료 | 2025-11-17 |
| Phase 4: 배포 확인 | ✅ 완료 | 2025-11-17 |
| Phase 5: AdSense 설정 | ⏳ 대기 | - |
| Phase 6: 배포 후 검증 | ⏳ 대기 | - |
| Phase 7: Playwright 테스트 | ⏳ 대기 | - |
| Phase 8: 광고 표시 확인 | ⏳ 대기 | - |
| Phase 9: 문서화 | ⏳ 대기 | - |

---

## 📝 참고 문서

- **요구사항**: [2_adsense_fix_prd.md](./2_adsense_fix_prd.md)
- **구현 내역**: [2_adsense_fix_implementation.md](./2_adsense_fix_implementation.md)
- **배포 가이드**: [3_deployment_guide.md](./3_deployment_guide.md)
