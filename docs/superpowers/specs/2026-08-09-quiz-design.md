# 인터랙티브 퀴즈 설계

- 작성일: 2026-08-09
- 대상 저장소: `investment.advenoh.pe.kr`
- 참조: `blog-v2.advenoh.pe.kr`의 `docs/superpowers/specs/2026-08-07-interactive-quiz-design.md`

## 1. 목표

투자 블로그 글에 인터랙티브 퀴즈를 넣는다. 독자가 보기를 고르면 즉시 정답/오답 판정과 해설이 나오고, 세트를 다 풀면 점수가 집계된다. 퀴즈가 있는 글은 `/quiz` 목록 페이지에 모인다.

blog-v2에 같은 기능이 이미 있다. 문항 형식과 UI는 거기서 가져오되, 이 저장소의 렌더링 구조와 콘텐츠 성격에 맞게 바꾼다.

## 2. 현재 상태

- 퀴즈 기능은 없다.
- 본문은 `src/components/markdown-renderer.tsx`가 `react-markdown`으로 렌더한다. `components` 맵에 태그별 컴포넌트를 지정하는 방식이고, `code` 분기에서 `language === 'mermaid'`를 잡아 `<MermaidDiagram>`으로 바꾸는 선례가 이미 있다 (130행).
- 글은 한국어 단일이다. `index_en.md`는 0개다.
- 헤더에 `/timeline` 링크가 있다 (`src/components/header.tsx` 59행 데스크톱, 151행 모바일). `/quiz`도 같은 자리에 넣는다.
- 빌드 타임 콘텐츠 검증기 `scripts/validateContent.ts`(`npm run check:content`)가 있다. 지금은 `contents/history/`만 검사한다.
- 테스트는 vitest이고 `vitest.config.ts`의 `include`가 `scripts/**/*.test.ts`만 잡는다.

### blog-v2와의 결정적 차이

blog-v2는 마크다운을 빌드 타임에 **HTML 문자열**로 만들어 `dangerouslySetInnerHTML`로 렌더한다. 그래서 퀴즈를 붙이려면 클라이언트에서 DOM을 스캔해 `pre`를 숨기고 React portal로 마운트하는 배관(`article-body.tsx`, `quiz-renderer.tsx`)이 필요했고, `yaml` 파서가 브라우저로 내려갔다.

investment는 `react-markdown`이 렌더 시점에 React 트리를 만든다. 퀴즈는 `components` 맵의 분기 하나로 끝나고, `MarkdownRenderer`가 서버 컴포넌트이므로 **YAML 파싱이 빌드 타임에 끝난다.** blog-v2가 감수한 비용 대부분이 여기서는 발생하지 않는다.

## 3. 범위

### 포함

- 문제 유형 4종: 객관식(`mcq`), OX(`ox`), 사례 판단(`case`), 빈칸 채우기(`blank`)
- 세트 단위 점수 집계와 다시 풀기
- `/quiz` 목록 페이지와 헤더 링크
- 글 3편에 각 10문항 작성
- `npm run check:content`에 퀴즈 검증 규칙 추가
- `CLAUDE.md`에 퀴즈 작성 가이드 절 추가

### 제외 (YAGNI)

- 점수 저장(localStorage 등). 진행 상태는 메모리에만 두고 새로고침하면 초기화된다
- 글 전체 통합 점수. 점수는 ` ```quiz ` 블록(세트) 단위로만 집계한다
- 서버 통계, 랭킹, 공유
- 서술형 문항
- **검색 인덱스 필터링.** 아래 근거 참조
- **RSS 필터링.** 피드에는 `excerpt`(본문 앞 150자)만 나가고 퀴즈는 글 끝에 온다

#### 검색 필터링을 하지 않는 근거

`src/lib/search.ts`(Fuse 기반)는 어디서도 import되지 않는 죽은 코드다. `@shared/schema`를 참조하는데 그 디렉토리는 정적 사이트 전환 때 삭제됐다.

실제 검색은 `src/components/home-page-client.tsx` 52~57행의 부분 문자열 매칭이고, 결과 카드에는 `title`과 `excerpt`만 표시된다. 퀴즈 본문이 화면에 뜨는 경로가 없다. 남는 영향은 "퀴즈에만 있는 단어로 검색하면 그 글이 결과에 뜬다"는 노이즈뿐이라 비용이 실익을 넘는다.

## 4. 렌더링 구조

### 선택한 접근

`markdown-renderer.tsx`의 기존 `code` 분기에 `quiz`를 추가한다. mermaid와 같은 패턴이다.

```tsx
if (!inline && language === 'quiz') {
  const questions = parseQuiz(String(children));
  if (questions.length > 0) {
    return <Quiz questions={questions} id={quizIndex++ === 0 ? 'quiz' : undefined} />;
  }
  // 파싱 실패 시 아래 SyntaxHighlighter 로 흘러가 원본 코드 블록이 보인다
}
```

`quizIndex`는 첫 블록에만 앵커를 달기 위한 카운터다. 선언 위치가 중요하므로 6절 "앵커"에서 따로 다룬다.

검토한 대안:

| 안 | 방식 | 판단 |
|----|------|------|
| **1안 (선택)** | `components.code` 분기 + 서버 컴포넌트에서 파싱 | mermaid와 동일 패턴. 신규 배관 없음. `yaml`이 클라이언트 번들에 안 실림 |
| 2안 | blog-v2처럼 클라이언트 DOM 스캔 + portal | HTML 문자열을 다루지 않는 구조에서는 순수 손해 |
| 3안 | 빌드 타임 rehype 플러그인 | react-markdown 파이프라인을 새로 손대야 함 |

### 컴포넌트

| 단위 | 책임 |
|------|------|
| `src/lib/quiz.ts` (신규) | 문항 타입, `parseQuiz`, `normalizeBlankAnswer`, `isBlankCorrect` |
| `src/components/markdown-renderer.tsx` (수정) | `code` 분기에 `quiz` 추가. 서버에서 파싱해 문항 배열을 props로 전달 |
| `src/components/quiz/quiz.tsx` (신규) | 퀴즈 세트 UI. 클라이언트 컴포넌트. 문항 상태, 판정, 점수, 다시 풀기 |
| `src/components/quiz/quiz-card.tsx` (신규) | `/quiz` 목록의 글 카드 |
| `src/app/quiz/page.tsx` (신규) | 퀴즈가 있는 글 목록 |

### 파서 위치

`src/lib/quiz.ts` **단일 소스**로 둔다. 빌드 스크립트(`scripts/generateStaticData.ts`, `scripts/validateContent.ts`)는 상대 경로(`../src/lib/quiz`)로 import한다.

이 저장소에는 `scripts/lib/timeline/types.ts`와 `src/components/timeline/types.ts`를 복제해 둔 선례가 있지만 퀴즈는 그러면 안 된다. 파서가 갈라지면 "빌드가 센 문항 수"와 "페이지가 실제로 렌더한 문항 수"가 어긋나 목록 페이지의 숫자가 틀린다.

파서 테스트를 붙이기 위해 `vitest.config.ts`의 `include`에 `src/**/*.test.ts`를 추가한다.

### 의존성

- `yaml` 패키지를 `dependencies`에 추가한다. 빌드 타임에만 쓰이지만 `next build`가 서버 컴포넌트를 렌더할 때 필요하다

### 오류 처리

- **YAML 전체 파싱 실패**: 콘솔 경고를 남기고 원래 코드 블록을 그대로 보여준다
- **개별 문항 형식 오류**: 그 문항만 건너뛰고 콘솔 경고를 남긴다. 세트 전체를 버리지 않는다
- 조용히 빠지는 문항은 `npm run check:content`가 빌드 전에 잡는다 (7절 규칙 1)

## 5. 작성 형식

블록 하나가 퀴즈 세트 하나다. 문항은 YAML 배열이고 4가지 유형을 섞어 쓴다.

아래는 4유형의 표기를 보이기 위한 **형식 예시**다. 실제 세트는 한 글에서만 문항을 뽑으므로 이렇게 여러 글의 주제가 섞이지 않는다.

````markdown
```quiz
- type: mcq
  q: "연금저축과 IRP를 합쳐 받을 수 있는 세액공제 납입 한도는?"
  choices: ["600만 원", "700만 원", "900만 원", "1,800만 원"]
  answer: 2
  explain: "연금저축 600만 원에 IRP 300만 원을 더해 900만 원이다. 1,800만 원은 세액공제와 무관한 납입 한도다. (3.1절)"

- type: case
  q: "이 직장인이 카드 공제로 받을 수 있는 공제 대상 금액은?"
  given:
    - "총급여: 6,000만 원"
    - "신용카드 사용액: 1,800만 원"
    - "체크카드·현금영수증: 없음"
  choices: ["300만 원", "450만 원", "600만 원", "1,800만 원"]
  answer: 0
  explain: "최저사용금액은 총급여의 25%인 1,500만 원이다. 이를 초과한 300만 원만 공제 대상이 된다. (4.1절)"

- type: ox
  q: "양적긴축은 중앙은행이 보유 채권을 시장에 매각하는 방식으로만 이루어진다"
  answer: false
  explain: "만기 도래 채권을 재투자하지 않는 방식이 실제로는 더 흔하다. (7.3절)"

- type: blank
  q: "중앙은행이 기준금리를 더 내릴 수 없는 상태에서 쓰는 비전통적 통화정책을 ___라고 한다"
  answer: ["양적완화", "QE"]
  explain: "정책금리가 실효하한에 닿으면 자산 매입으로 장기금리를 눌러야 한다. (2.3절)"
```
````

### 유형별 필드

| 유형 | 필수 필드 | 비고 |
|------|----------|------|
| `mcq` | `q`, `choices`, `answer`, `explain` | `answer`는 0부터 세는 정답 인덱스 |
| `ox` | `q`, `answer`, `explain` | `answer`는 `true`/`false` |
| `case` | `q`, `given`, `choices`, `answer`, `explain` | `given`은 조건 문자열 **배열**. 테두리 박스 안에 목록으로 렌더 |
| `blank` | `q`, `answer`, `explain` | `q`의 빈칸은 `___`(밑줄 3개). `answer`는 허용 답 배열. 비교 시 앞뒤 공백 제거·소문자화 |

`explain`은 전 유형 공통 필수다. 정답 여부와 함께 표시되며 관련 절 안내("(4.1절)")를 담는다.

### `case` 유형에 관하여

blog-v2의 `code`(코드 결과 맞히기) 자리를 대신한다. 구조는 같다 — 블록 하나에 객관식이 붙는 형태 — 이므로 파서와 UI를 거의 그대로 쓴다.

`given`을 여러 줄 문자열이 아니라 배열로 잡은 이유:

- 조건 하나하나가 독립된 항목이라 목록으로 렌더하면 읽기 쉽다
- 검증기가 "조건이 0개인 `case`"를 형식 오류로 잡을 수 있다

세금·정책 글에서는 조건 없이 물으면 성립하지 않는 문항이 많다. 연말정산 글의 카드 사용 전략, 연금저축 글의 인출 순서가 그렇다.

### 번호 규칙

`answer`는 0부터 세지만 화면에는 1부터 번호가 붙는다. `mcq`·`case`의 보기는 `1.`~`4.`로 렌더되므로 `answer: 0`이 화면의 `1.`이다. **`explain`에서 보기를 가리킬 때는 화면 번호(1부터)를 쓴다.** `ox`는 O/X라 번호가 붙지 않는다.

## 6. UI 동작

blog-v2의 `components/article/quiz.tsx`를 이식하되 i18n 배관을 걷어내고 문구를 한국어로 고정한다.

- 문항마다: 보기 클릭(`blank`는 입력 후 확인 버튼) → 즉시 정답/오답 표시 + `explain` 노출 → 답 변경 불가
- 전 문항 응답 시 세트 하단에 점수 카드("8 / 10 맞았습니다")와 다시 풀기 버튼
- 다시 풀기: 해당 세트 상태 초기화 (`resetKey`로 전 문항 리마운트해 `blank` 입력 로컬 상태까지 비운다)
- 진행 상태는 메모리에만 유지
- 고정 문구: `정답` / `오답` / `확인` / `다시 풀기` / `정답:` / `O` / `X` / `{score} / {total} 맞았습니다`
- shadcn/ui 프리미티브(`Button`, `Input`)를 쓰고 라이트/다크 대응

### 스타일 격리

퀴즈는 `.markdown-content` 안에서 렌더된다. `src/app/globals.css`의 `.markdown-content ul, ol`(183행)과 `.markdown-content p`(162행) 규칙이 `case`의 `given` 목록과 문항 텍스트에 걸린다. 퀴즈 루트에서 이 규칙들의 영향을 끊는다.

blog-v2는 Tailwind Typography를 쓰므로 `not-prose` 한 클래스로 해결했지만, 이 저장소의 `.markdown-content`는 일반 CSS라 그 방법을 쓸 수 없다.

### 앵커

첫 퀴즈 블록에만 `id="quiz"`를 단다. `/quiz` 목록의 카드가 `/{category}/{slug}/#quiz`로 링크하기 때문이다. 헤딩 번호가 글마다 달라 헤딩 id를 쓸 수 없다.

카운터는 **`MarkdownRenderer` 함수 호출 안에** `let quizIndex = 0`으로 선언해 `components` 맵이 클로저로 잡게 한다. 모듈 스코프에 두면 글 사이로 카운터가 새어 나간다.

blog-v2는 퀴즈가 클라이언트에서 마운트돼 페이지 로드 시점에 `#quiz`가 없었고 그래서 `scrollIntoView`를 직접 호출해야 했다. 여기서는 정적 HTML에 `id="quiz"`가 이미 박혀 나가므로 브라우저 기본 동작으로 충분하다.

## 7. 빌드 타임 검증

`scripts/validateContent.ts`에 퀴즈 패스를 추가한다. 기존 history 검사는 `contents/history/`만 보지만 퀴즈 검사는 `contents/` 전체를 대상으로 한다.

**실패 (exit code 1)**

1. **형식 오류 문항** — YAML 배열 항목 수와 `parseQuiz` 통과 수가 다르면 실패한다. 문항이 조용히 빠지는 것을 잡는다
2. **blank 정답 노출** — `blank`의 허용 답이 같은 세트 다른 문항의 `q`·`choices`·`given`에 대소문자·공백 무시로 등장하면 실패한다

**경고 (출력만)**

3. `mcq`+`case`의 정답 인덱스가 한 값에 절반 이상 몰림
4. 정답 보기가 나머지 보기 평균 길이의 1.6배를 넘음

규칙 2가 이 설계에서 가장 값어치 있는 부분이다. blog-v2는 같은 결함을 `CLAUDE.md`의 수동 체크리스트로 관리하는데, 그 문서에 5편 중 4편에서 발생했다고 기록돼 있다.

**한계를 분명히 해둔다: 문자열 일치만 잡는다.** blog-v2 문서에 나온 "정답이 `대괄호`인데 코드 스니펫의 `[T any]`가 답을 보여준 사례" 같은 의미적 노출은 자동으로 잡히지 않는다. 작성 후 육안 확인이 여전히 필요하다.

`explain`은 검사 대상이 아니다. 그 문항을 푼 뒤에만 보이므로 정답 노출이 아니다. 다만 앞 문항의 `explain`이 뒤 문항 답을 흘리는 경우는 작성 시 주의한다.

## 8. 데이터 파이프라인

| 파일 | 작업 |
|------|------|
| `scripts/generateStaticData.ts` | 본문의 모든 ` ```quiz ` 블록을 `parseQuiz`로 세어 `quizCount`를 구하고 `hasQuiz = quizCount > 0`으로 정한다. 둘 다 `posts.json`에 저장하되 0/false면 필드를 생략한다. 블록은 있는데 유효 문항이 0이면 빌드 로그에 경고 |
| `src/types/blog.ts` | `BlogPost`에 `hasQuiz?: boolean`, `quizCount?: number` 추가 |
| `src/components/header.tsx` | `/timeline` 옆에 `/quiz` 링크. **데스크톱(59행)·모바일(151행) 두 군데** |
| `scripts/generateSitemap.ts` | `staticPages`(40행)에 `/quiz` 추가 |
| `vitest.config.ts` | `include`에 `src/**/*.test.ts` 추가 |
| `package.json` | `yaml` 의존성 추가 |

`/quiz` 페이지는 서버 컴포넌트로 `getAllBlogPosts()`를 호출해 `hasQuiz`로 거르고 날짜 내림차순으로 정렬한다. 본문 없는 타임라인 stub 글(`stub: true`)은 `hasQuiz`가 false라 자연히 빠지지만 필터에 명시한다.

## 9. 콘텐츠 작업

대상 글 3편, 각 10문항:

| 글 | 경로 | 퀴즈 섹션 | 참고 섹션 |
|----|------|----------|----------|
| 연금저축 인출 전략 | `contents/etc/pension-savings-withdrawal-strategy/` | 새 `8. 퀴즈` | `8` → `9` |
| 연말정산 준비 | `contents/etc/year-end-tax-settlement-preparation-guide/` | 새 `10. 퀴즈` | `10` → `11` |
| QE·QT 정리 | `contents/etc/quantitative-easing-and-tightening/` | 새 `18. 퀴즈` | `18` → `19` |

퀴즈는 `참고` 섹션 **바로 앞**에 넣는다. 이러면 뒤로 밀리는 헤딩이 `참고` 하나뿐이다.

### 작성 규칙

- 유형 배분은 대략 `mcq` 4 / `case` 2~3 / `ox` 2 / `blank` 1~2. **순서를 기계적으로 순환시키지 않는다**
- 정답 인덱스를 고르게 분산한다. 한 인덱스에 쏠리면 같은 버튼만 눌러 만점이 나온다
- 같은 문항의 보기 길이를 비슷하게 맞춘다. 정답만 설명형으로 길면 길이만으로 티가 난다
- `mcq`·`case`는 4지선다로 통일한다
- **본문에 근거가 있는 것만 묻는다.** 일반적으로 맞는 사실이어도 그 글에 없으면 쓰지 않는다
- **이모지를 쓰지 않는다.** 저장소 `CLAUDE.md` 규칙이 퀴즈 문항에도 적용된다
- 세금·제도 문항은 글에 적힌 연도 기준을 따르고, `explain`에 근거 절을 남긴다

### 번호 재조정 시 확인

`참고` 섹션 번호를 미루기 전에 본문이 그 번호를 참조하는 곳이 없는지 확인한다.

## 10. 문서

`CLAUDE.md`에 "퀴즈" 절을 추가한다:

- 블록 형식과 유형별 필드
- `answer` 0-based / 화면 1-based 함정
- 세트당 10문항 권장, 4유형 혼합
- 정답 분산·보기 길이 균형 규칙
- `npm run check:content`로 검증한다는 안내와 그 한계

## 11. 완료 기준

- `npm run check`, `npm run lint`, `npm test`, `npm run check:content` 모두 통과
- `npm run build` 성공, `out/quiz/` 생성
- 3편에서 10문항이 렌더되고 판정·해설·점수·다시 풀기가 동작
- `/quiz` 목록에 3편이 노출되고, 카드 클릭 시 글의 `#quiz` 위치로 이동
- 헤더의 `/quiz` 링크가 데스크톱·모바일 양쪽에서 동작
- 라이트/다크 양쪽에서 스타일 확인
- `src/lib/quiz.ts` 유닛 테스트: 4유형 정상 파싱, 형식 오류 문항 제외, `blank` 정규화 비교
- 클라이언트 번들에 `yaml`이 들어가지 않음
