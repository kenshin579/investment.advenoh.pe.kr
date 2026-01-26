# Mermaid Diagram 렌더링 - TODO

## 1단계: 의존성 설치

- [x] `npm install mermaid` 실행

## 2단계: MermaidDiagram 컴포넌트 생성

- [x] `src/components/mermaid-diagram.tsx` 생성
  - [x] 동적 import로 mermaid 로드
  - [x] useEffect에서 SVG 렌더링
  - [x] 에러 상태 처리 (에러 메시지 UI)
  - [x] aria-label로 접근성 대체 텍스트 제공
  - [x] 반응형 컨테이너 (overflow-x-auto)

## 3단계: MarkdownRenderer 수정

- [x] `src/components/markdown-renderer.tsx` 수정
  - [x] `MermaidDiagram` import 추가
  - [x] code 렌더러에서 `language === 'mermaid'` 분기 추가

## 4단계: 샘플 포스트 작성

- [x] `contents/etc/mermaid-diagram-sample/index.md` 생성
  - [x] Flowchart (투자 의사결정 흐름도)
  - [x] Sequence Diagram (주식 주문 처리)
  - [x] Pie Chart (포트폴리오 자산 배분)
  - [x] Gantt Chart (리밸런싱 일정)
  - [x] State Diagram (주문 상태 변화)
  - [x] 에러 케이스 (잘못된 문법)

## 5단계: 빌드 검증

- [x] `npm run check` 타입 체크 통과
- [x] `npm run build` 정적 빌드 정상 동작
- [x] 샘플 포스트가 정상적으로 빌드에 포함되는지 확인

## 6단계: 테스트 (MCP Playwright)

- [x] `npm run start`로 로컬 서버 실행
- [x] 샘플 포스트 접속: `http://localhost:3000/etc/mermaid-diagram-sample`
- [x] 다이어그램이 SVG로 렌더링되는지 스크린샷 확인
- [x] 잘못된 Mermaid 문법 시 에러 메시지 표시 확인
- [ ] 일반 코드 블록(js, python 등) 구문 강조 정상 동작 확인
- [ ] Mermaid 없는 페이지에서 mermaid 라이브러리 미로드 확인 (Network 탭)
