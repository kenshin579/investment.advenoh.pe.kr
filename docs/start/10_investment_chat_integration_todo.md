# 투자 블로그 ChatWindow 통합 (investment) - TODO

## 선행 조건

- [ ] `7_blog_chat_integration` (blog-v2 ChatWindow) 구현 완료
- [ ] `ai-chatbot.advenoh.pe.kr` API 서버 정상 동작 확인

---

### M1: investment 코드베이스 분석

- [ ] `src/components/` 구조 및 기존 컴포넌트 패턴 분석
- [ ] `src/lib/` 유틸리티 구조 분석
- [ ] 커스텀 ThemeProvider 동작 방식 확인 (테마 hook/context)
- [ ] `src/app/layout.tsx` 구조 확인

### M2: investment Collection 인덱싱

- [ ] `ai-chatbot.advenoh.pe.kr`에 investment Collection 생성
- [ ] `contents/` 디렉토리 (약 95개 포스트) 인덱싱
- [ ] 인덱싱 결과 확인 (검색 테스트)

### M3: API 서버 CORS 설정

- [ ] `ai-chatbot.advenoh.pe.kr`에 `investment.advenoh.pe.kr` 도메인 CORS 허용 추가

### M4: ChatWindow 컴포넌트 구현

#### 환경 설정

- [ ] `.env.local`에 `NEXT_PUBLIC_CHAT_API_URL` 환경 변수 추가

#### API 클라이언트

- [ ] `src/lib/chatApi.ts` 생성 (`blog_id: "investment"`)

#### 컴포넌트 구현 (blog-v2 기반 포팅)

- [ ] `src/components/chat/ChatButton.tsx` - 플로팅 채팅 버튼
- [ ] `src/components/chat/ChatWindow.tsx` - 채팅 창 컨테이너
- [ ] `src/components/chat/MessageList.tsx` - 메시지 목록
- [ ] `src/components/chat/ChatInput.tsx` - 입력 필드 + 전송 버튼
- [ ] `src/components/chat/SourceLinks.tsx` - 참조 블로그 글 링크 목록

#### 테마 및 레이아웃 통합

- [ ] 커스텀 ThemeProvider에 맞게 테마 연동 수정
- [ ] `src/app/layout.tsx`에 ChatButton 컴포넌트 추가

#### UI/UX 확인

- [ ] 다크/라이트 모드 테마 연동 확인
- [ ] 모바일 반응형 확인
- [ ] 메시지 자동 스크롤 동작 확인
- [ ] 로딩 상태 확인
- [ ] 에러 처리 확인

### M5: 배포 및 E2E 테스트

- [ ] `npm run build` 빌드 성공 확인
- [ ] `npm run check` 타입 체크 통과 확인
- [ ] **MCP Playwright 테스트**:
  - [ ] 플로팅 버튼 클릭 → ChatWindow 오픈 확인
  - [ ] 질문 입력 → 답변 수신 확인
  - [ ] 소스 인용 링크 표시 확인
  - [ ] 멀티턴 대화 동작 확인
  - [ ] 모바일 반응형 확인
- [ ] PR 생성 및 배포
