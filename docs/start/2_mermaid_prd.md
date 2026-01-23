# Mermaid Diagram 렌더링 지원 PRD

## 배경

현재 블로그의 마크다운 렌더링 파이프라인:
- `react-markdown` + `remark-gfm` + `rehype-raw` 조합으로 클라이언트 사이드 렌더링
- 코드 블록은 `react-syntax-highlighter`(Prism)로 구문 강조 처리
- Mermaid, LaTeX 등 확장 문법은 미지원 상태

## 목표

마크다운 파일에서 ` ```mermaid ` 코드 블록을 작성하면 다이어그램으로 렌더링되도록 지원한다.

### 지원 대상 다이어그램 유형
- Flowchart (흐름도)
- Sequence Diagram (시퀀스 다이어그램)
- Class Diagram (클래스 다이어그램)
- State Diagram (상태 다이어그램)
- Gantt Chart (간트 차트)
- Pie Chart (파이 차트)
- ER Diagram (ER 다이어그램)

## 요구사항

### 기능 요구사항

1. **마크다운 코드 블록 인식**
   - ` ```mermaid ` 로 시작하는 코드 블록을 Mermaid 다이어그램으로 렌더링
   - 일반 코드 블록(`js`, `python` 등)은 기존 구문 강조 유지

2. **렌더링 품질**
   - SVG 기반 렌더링으로 선명한 출력
   - 반응형 지원 (모바일/데스크톱 모두 가독성 확보)
   - 다크/라이트 테마 대응 불필요 (현재 라이트 테마만 사용)

3. **에러 처리**
   - 잘못된 Mermaid 문법 작성 시 에러 메시지 표시 (다이어그램 대신)
   - 페이지 전체가 깨지지 않도록 격리

### 비기능 요구사항

1. **성능**
   - Mermaid 라이브러리는 해당 코드 블록이 있는 페이지에서만 로드 (동적 import)
   - 초기 번들 사이즈 증가 최소화

2. **정적 사이트 호환**
   - `output: 'export'` 설정과 호환 (SSG 빌드 정상 동작)
   - 클라이언트 사이드 렌더링으로 구현

3. **접근성**
   - 다이어그램에 대한 대체 텍스트 제공 (원본 Mermaid 코드를 aria-label 또는 접근 가능한 형태로)

## 기술 구현 방향

### 접근 방식: 클라이언트 사이드 렌더링

`react-markdown`의 커스텀 컴포넌트 렌더러에서 `language === 'mermaid'`인 코드 블록을 별도 Mermaid 컴포넌트로 위임한다.

### 수정 대상 파일

| 파일 | 변경 내용 |
|------|-----------|
| `src/components/markdown-renderer.tsx` | 코드 블록 렌더러에서 mermaid 언어 분기 추가 |
| `src/components/mermaid-diagram.tsx` | 신규 - Mermaid 다이어그램 렌더링 컴포넌트 |
| `package.json` | `mermaid` 패키지 추가 |

### 구현 단계

1. **의존성 설치**: `mermaid` 패키지 추가
2. **Mermaid 컴포넌트 생성**: `src/components/mermaid-diagram.tsx`
   - `mermaid` 라이브러리를 동적 import
   - `useEffect`에서 다이어그램 렌더링
   - 에러 바운더리 포함
3. **MarkdownRenderer 수정**: 코드 블록 렌더러에 mermaid 분기 추가
4. **테스트용 마크다운 작성**: 샘플 블로그 포스트에 mermaid 코드 블록 추가하여 검증

## 테스트 기준

- [ ] ` ```mermaid ` 코드 블록이 다이어그램으로 렌더링됨
- [ ] 일반 코드 블록(js, python 등)은 기존과 동일하게 구문 강조됨
- [ ] 잘못된 Mermaid 문법 시 에러 메시지 표시 (페이지 미깨짐)
- [ ] `npm run build` 정상 동작 (정적 빌드 호환)
- [ ] 모바일 뷰에서 다이어그램 가독성 확인
- [ ] Mermaid 코드 블록이 없는 페이지에서는 mermaid 라이브러리 미로드

## 참고

- Mermaid 공식 문서: https://mermaid.js.org/
- react-markdown 커스텀 컴포넌트: https://github.com/remarkjs/react-markdown#components
