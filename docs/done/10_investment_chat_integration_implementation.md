# 투자 블로그 ChatWindow 통합 (investment) - Implementation

## 1. 개요

- **대상**: `investment.advenoh.pe.kr` (투자 인사이트 블로그)
- **선행 작업**: `7_blog_chat_integration` (blog-v2 ChatWindow 구현 완료 후 진행)
- **RAG API**: `ai-chatbot.advenoh.pe.kr` (blog-v2와 동일 서버, `blog_id: "investment"`)

### 1.1 blog-v2 대비 차이점

| 항목 | blog-v2 | investment |
|------|---------|------------|
| 디렉토리 구조 | `app/`, `components/`, `lib/` | `src/app/`, `src/components/`, `src/lib/` |
| 테마 시스템 | `next-themes` 라이브러리 | 커스텀 ThemeProvider (localStorage + context) |
| shadcn/ui RSC | `rsc: true` | `rsc: false` |
| blog_id | `"blog-v2"` | `"investment"` |

---

## 2. 프로젝트 구조

```
src/components/chat/
├── ChatButton.tsx        # 우하단 플로팅 채팅 버튼
├── ChatWindow.tsx        # 채팅 창 컨테이너
├── MessageList.tsx       # 메시지 목록
├── ChatInput.tsx         # 입력 필드 + 전송 버튼
└── SourceLinks.tsx       # 참조 블로그 글 링크 목록

src/lib/
└── chatApi.ts            # RAG API 호출 클라이언트
```

---

## 3. API 클라이언트

### 3.1 `src/lib/chatApi.ts`

```typescript
const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || "https://ai-chatbot.advenoh.pe.kr";
const BLOG_ID = "investment";  // blog-v2와 다른 부분

interface SourceDocument {
  title: string;
  url: string;
  snippet?: string;
}

interface ChatResponse {
  answer: string;
  sources: SourceDocument[];
}

export async function sendChatMessage(
  question: string,
  chatHistory: [string, string][]
): Promise<ChatResponse> {
  const res = await fetch(`${CHAT_API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      blog_id: BLOG_ID,
      question,
      chat_history: chatHistory,
    }),
  });

  if (!res.ok) {
    throw new Error(`Chat API error: ${res.status}`);
  }

  return res.json();
}
```

### 3.2 환경 변수

```bash
# .env.local
NEXT_PUBLIC_CHAT_API_URL=https://ai-chatbot.advenoh.pe.kr
```

---

## 4. 컴포넌트 구현

blog-v2의 chat 컴포넌트를 기반으로 investment 블로그에 맞게 조정.

### 4.1 blog-v2에서 가져올 컴포넌트

- `ChatButton.tsx` - 구조 동일, import 경로만 조정 (`@/` → `@/`)
- `ChatWindow.tsx` - 동일
- `MessageList.tsx` - 동일
- `ChatInput.tsx` - placeholder 텍스트 변경 ("투자에 대해 궁금한 것을 물어보세요...")
- `SourceLinks.tsx` - 동일

### 4.2 테마 연동 차이

blog-v2는 `next-themes`의 `useTheme()` 사용, investment는 커스텀 ThemeProvider 사용.

```typescript
// blog-v2 (next-themes)
import { useTheme } from "next-themes";
const { theme } = useTheme();

// investment (커스텀 ThemeProvider)
import { useTheme } from "@/components/theme-provider";
const { theme, toggleTheme } = useTheme();
```

→ 컴포넌트 내에서 테마 참조 부분만 investment의 ThemeProvider에 맞게 수정 필요.

### 4.3 레이아웃 통합

```tsx
// src/app/layout.tsx 하단에 추가
<ChatButton />
```

---

## 5. ChromaDB investment Collection 인덱싱

### 5.1 인덱싱 대상

- `contents/` 디렉토리 내 약 95개 포스트
- 4개 카테고리: etc (9), etf (11), stock (61), weekly (14)

### 5.2 인덱싱 작업

- `ai-chatbot.advenoh.pe.kr` 프로젝트에서 investment Collection 생성
- blog-v2 인덱싱과 동일한 방식으로 investment 콘텐츠 인덱싱
- Collection 이름: `investment`

---

## 6. API 서버 CORS 설정

`ai-chatbot.advenoh.pe.kr`에 investment 도메인 추가:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://blog-v2.advenoh.pe.kr",
        "https://investment.advenoh.pe.kr",  # 추가
        "http://localhost:3000",
    ],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)
```

---

## 7. 에러 처리

blog-v2와 동일:
- API 호출 실패 시 에러 메시지 표시
- 네트워크 오류 시 재시도 버튼
- 빈 질문 전송 방지
