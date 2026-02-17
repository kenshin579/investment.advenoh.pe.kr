# 투자 블로그 ChatWindow 통합 (investment) - TODO

## 선행 조건

- [x] `7_blog_chat_integration` (blog-v2 ChatWindow) 구현 완료
- [x] `ai-chatbot.advenoh.pe.kr` API 서버 정상 동작 확인

---

### M1: investment 코드베이스 분석

- [x] `src/components/` 구조 및 기존 컴포넌트 패턴 분석
- [x] `src/lib/` 유틸리티 구조 분석
- [x] 커스텀 ThemeProvider 동작 방식 확인 (테마 hook/context)
- [x] `src/app/layout.tsx` 구조 확인

### M2: investment Collection 인덱싱

- [x] `ai-chatbot.advenoh.pe.kr`에 investment Collection 생성
- [x] `contents/` 디렉토리 (약 95개 포스트) 인덱싱
- [x] 인덱싱 결과 확인 (검색 테스트)

### M3: API 서버 CORS 설정

- [x] `ai-chatbot.advenoh.pe.kr`에 `investment.advenoh.pe.kr` 도메인 CORS 허용 추가 (이미 `allow_origins=["*"]`로 전체 허용)

### M4: ChatWindow 컴포넌트 구현

#### 환경 설정

- [x] `.env.local`에 `NEXT_PUBLIC_CHAT_API_URL` 환경 변수 추가

#### API 클라이언트

- [x] `src/lib/chat-api.ts` 생성 (`blog_id: "investment"`)

#### 컴포넌트 구현 (blog-v2 기반 포팅)

- [x] `src/components/chat/ChatButton.tsx` - 플로팅 채팅 버튼
- [x] `src/components/chat/ChatWindow.tsx` - 채팅 창 컨테이너
- [x] `src/components/chat/MessageList.tsx` - 메시지 목록
- [x] `src/components/chat/ChatInput.tsx` - 입력 필드 + 전송 버튼
- [x] `src/components/chat/SourceLinks.tsx` - 참조 블로그 글 링크 목록

#### 테마 및 레이아웃 통합

- [x] 커스텀 ThemeProvider에 맞게 테마 연동 수정
- [x] `src/app/layout.tsx`에 ChatButton 컴포넌트 추가

#### UI/UX 확인

- [x] 다크/라이트 모드 테마 연동 확인
- [x] 모바일 반응형 확인
- [x] 메시지 자동 스크롤 동작 확인
- [x] 로딩 상태 확인
- [x] 에러 처리 확인

### M5: 배포 및 E2E 테스트

- [x] `npm run build` 빌드 성공 확인
- [ ] `npm run check` 타입 체크 통과 확인 (기존 코드 타입 에러 존재, chat 컴포넌트는 에러 없음)
- [x] **MCP Playwright 테스트**:
  - [x] 플로팅 버튼 클릭 → ChatWindow 오픈 확인
  - [x] 질문 입력 → 답변 수신 확인
  - [x] 소스 인용 링크 표시 확인
  - [x] 멀티턴 대화 동작 확인
  - [x] 모바일 반응형 확인
- [ ] PR 생성 및 배포
