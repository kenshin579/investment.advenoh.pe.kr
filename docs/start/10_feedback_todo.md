# 챗봇 답변 피드백 기능 - TODO

## 단계 1: API 레이어 수정

- [x] `src/lib/chat-api.ts`: `ChatResponse` 인터페이스에 `message_id: string` 필드 추가
- [x] `src/lib/chat-api.ts`: `sendFeedback()` 함수 추가 (`POST /feedback` 호출)

## 단계 2: MessageList 컴포넌트 수정

- [x] `src/components/chat/MessageList.tsx`: `Message` 인터페이스에 `message_id?`, `question?` 필드 추가
- [x] `src/components/chat/MessageList.tsx`: `feedbackMap` 상태 추가 (`idle` | `sending` | `done`)
- [x] `src/components/chat/MessageList.tsx`: `handleFeedback` 핸들러 구현
- [x] `src/components/chat/MessageList.tsx`: AI 답변 하단에 피드백 UI 렌더링
  - idle: "도움이 됐나요? 👍 👎" 버튼
  - sending: "전송 중..." + 버튼 비활성화
  - done: "피드백 감사합니다 👍/👎" 표시

## 단계 3: ChatWindow 연동

- [x] `src/components/chat/ChatWindow.tsx`: `assistantMsg`에 `message_id`(API 응답) 저장
- [x] `src/components/chat/ChatWindow.tsx`: `assistantMsg`에 `question`(사용자 질문) 저장

## 단계 4: 타입 체크

- [x] `npm run check` 실행하여 타입 에러 없는지 확인

## 단계 5: 테스트 (MCP Playwright)

- [ ] `npm run build && npm run start`로 로컬 서버 실행
- [ ] MCP Playwright로 챗봇 열기
- [ ] 질문 입력 후 AI 답변 확인
- [ ] 피드백 버튼(👍/👎) 표시 확인
- [ ] 피드백 버튼 클릭 후 상태 변화 확인 ("전송 중..." → "피드백 감사합니다")
- [ ] 피드백 완료 후 재클릭 불가 확인
