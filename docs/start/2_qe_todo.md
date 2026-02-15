# 양적완화(QE) & 양적긴축(QT) 블로그 포스트 — TODO

## 1단계: 사전 준비

- [x] GitHub 이슈 생성 (#77)
- [x] feature 브랜치 생성: `feat/77-qe-qt-blog-post`

## 2단계: 콘텐츠 작성

- [x] `contents/etc/quantitative-easing-and-tightening/index.md` 파일 생성 + frontmatter 작성
- [x] 1~3장 작성 (개요, 통화정책 기초, QE 개념)
- [x] 4~6장 작성 (QE 작동 원리 + Mermaid, 효과/부작용, 테이퍼링)
- [x] 7~9장 작성 (QT 개념, 작동 원리 + Mermaid, 효과/리스크)
- [x] 10~11장 작성 (QE vs QT 비교표, 통화정책 사이클 + Mermaid)
- [x] 12~13장 작성 (글로벌 사례, 인플레이션)
- [x] 14~15장 작성 (투자 관점, 헷갈리는 개념)
- [x] 16~17장 작성 (마무리, 참고)

## 3단계: 검증

- [x] UTF-8 인코딩 확인: `file -I contents/etc/quantitative-easing-and-tightening/index.md`
- [x] heading 스타일 규칙 준수 확인 (`#` H1 시작, 번호 체계)
- [x] `npm run build` 정상 동작
- [x] `npm run start` 후 MCP Playwright로 포스트 렌더링 확인
- [x] Mermaid 다이어그램 정상 렌더링 확인 (MCP Playwright 스크린샷)
- [x] 한글 텍스트 깨짐 없는지 확인

## 4단계: PR 생성

- [x] feature 브랜치에 커밋
- [x] PR 생성 (reviewer: kenshin579) — #78
