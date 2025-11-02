# Makefile 구현 체크리스트

## Phase 1: Makefile 생성

- [ ] 루트 디렉토리에 Makefile 생성
- [ ] `.PHONY` 타겟 선언 (`generate-readme`, `help`)
- [ ] `generate-readme` 타겟 구현
  - [ ] Docker 명령어 작성
  - [ ] 볼륨 마운트 설정: `$(PWD):/workspace`
  - [ ] 환경 변수 6개 전달
    - [ ] WORKSPACE_DIR=/workspace
    - [ ] CONTENT_DIR=contents
    - [ ] BLOG_URL=https://investment.advenoh.pe.kr
    - [ ] PROJECT_TITLE="Frank's Investment Insights Blog"
    - [ ] HITCOUNT_PATH=kenshin579/investment.advenoh.pe.kr
    - [ ] NETLIFY_BADGE_ID=359125d0-4402-402d-9168-5b48f60d6a6c
- [ ] `help` 타겟 구현 (사용 가능한 명령어 목록 표시)

## Phase 2: 테스트

- [ ] Docker 설치 확인
  ```bash
  docker --version
  ```
- [ ] Docker 데몬 실행 확인
  ```bash
  docker ps
  ```
- [ ] `make generate-readme` 실행 테스트
- [ ] README.md 파일 생성 확인
- [ ] 생성된 README.md가 GitHub Actions 결과와 동일한지 비교

## Phase 3: 문서화

- [ ] CLAUDE.md에 `make generate-readme` 사용법 추가
- [ ] 에러 시나리오 문서화
  - [ ] Docker 미설치 시 대응 방법
  - [ ] Docker 데몬 미실행 시 대응 방법
