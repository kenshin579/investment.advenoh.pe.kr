# GitHub Action: README 자동 생성 TODO

## Phase 1: 로컬 테스트

### Docker 이미지 호환성 검증
- [x] Docker 이미지 로컬 실행
  ```bash
  docker run --rm \
    -v $(pwd):/workspace \
    -e WORKSPACE_DIR=/workspace \
    -e CONTENT_DIR=contents \
    -e BLOG_URL=https://investment.advenoh.pe.kr \
    kenshin579/readme-generator:latest
  ```
- [x] 생성된 README.md 확인
  ```bash
  git diff README.md
  ```
- [x] 카테고리별 콘텐츠 인식 확인 (etc, etf, stock, weekly)
- [x] 한글 콘텐츠 UTF-8 인코딩 처리 확인
- [x] TOC(목차) 생성 결과 확인
- [x] 블로그 포스트 링크 URL 확인 (https://investment.advenoh.pe.kr)

## Phase 2: 워크플로우 구현

### GitHub Action 파일 생성
- [x] `.github/workflows/` 디렉토리 생성 (없는 경우)
- [x] `generate-readme.yml` 파일 생성
- [x] 브랜치 이름 `main` 확인
- [x] BLOG_URL 환경변수 설정 확인

## Phase 3: GitHub Action 테스트

### 워크플로우 실행 검증
- [ ] 워크플로우 파일 main 브랜치에 푸시
- [ ] GitHub Actions 탭에서 워크플로우 실행 확인
- [ ] "Generate TOC in README" 워크플로우 성공 확인
- [ ] `readme-patches` 브랜치 자동 생성 확인

### PR 생성 확인
- [ ] PR 자동 생성 확인
- [ ] PR 제목 `[AUTO] Update README file` 확인
- [ ] `automated pr` 라벨 자동 부여 확인
- [ ] Assignee와 Reviewer에 `kenshin579` 설정 확인

### 무한 루프 방지 검증
- [ ] README.md만 변경하고 푸시
- [ ] 워크플로우가 트리거되지 않는지 확인 (paths-ignore 동작)

## Phase 4: 최종 검증

### PR 병합 및 모니터링
- [ ] PR 변경사항 검토
- [ ] README.md 내용 최종 확인
- [ ] PR 병합
- [ ] main 브랜치에서 README.md 최종 확인
