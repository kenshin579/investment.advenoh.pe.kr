# Makefile 구현 체크리스트

## Phase 1: Makefile 생성

- [x] 루트 디렉토리에 Makefile 생성
- [x] `.PHONY` 타겟 선언 (`generate-readme`, `help`)
- [x] `generate-readme` 타겟 구현
  - [x] Docker 명령어 작성
  - [x] 볼륨 마운트 설정: `$(PWD):/workspace`
  - [x] 환경 변수 6개 전달
    - [x] WORKSPACE_DIR=/workspace
    - [x] CONTENT_DIR=contents
    - [x] BLOG_URL=https://investment.advenoh.pe.kr
    - [x] PROJECT_TITLE="Frank's Investment Insights Blog"
    - [x] HITCOUNT_PATH=kenshin579/investment.advenoh.pe.kr
    - [x] NETLIFY_BADGE_ID=359125d0-4402-402d-9168-5b48f60d6a6c
- [x] `help` 타겟 구현 (사용 가능한 명령어 목록 표시)

## Phase 2: 테스트

- [x] Docker 설치 확인
  ```bash
  docker --version
  # Docker version 28.4.0, build d8eb465
  ```
- [x] Docker 데몬 실행 확인
  ```bash
  docker ps
  # Running successfully
  ```
- [x] `make generate-readme` 실행 테스트
- [x] README.md 파일 생성 확인
- [x] 생성된 README.md가 GitHub Actions 결과와 동일한지 비교
  - 로컬 실행 결과: 93 → 95 포스트 업데이트 확인

## Phase 3: 문서화

- [x] CLAUDE.md에 `make generate-readme` 사용법 추가
- [x] 에러 시나리오 문서화
  - [x] Docker 미설치 시 대응 방법
  - [x] Docker 데몬 미실행 시 대응 방법
