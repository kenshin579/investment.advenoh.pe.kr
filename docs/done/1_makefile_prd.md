# Makefile 생성 PRD (Product Requirements Document)

## 1. 개요

### 목적
로컬 개발 환경에서 README.md 파일을 쉽게 생성할 수 있도록 Makefile을 구현합니다.

### 배경
현재 README.md 파일 생성은 GitHub Actions 워크플로우를 통해서만 가능합니다. 로컬에서도 동일한 작업을 수행할 수 있도록 Makefile을 제공하여 개발자 경험을 개선합니다.

### 범위
- 루트 디렉토리에 Makefile 생성
- `make generate-readme` 명령어로 README 생성 기능 구현
- GitHub Actions 워크플로우와 동일한 도커 명령어 사용

## 2. 참조 자료

### 기존 구현
GitHub Actions 워크플로우: [.github/workflows/generate-readme.yml](.github/workflows/generate-readme.yml)

```yaml
- name: Run README generator
  run: |
    docker run --rm \
      -v ${{ github.workspace }}:/workspace \
      -e WORKSPACE_DIR=/workspace \
      -e CONTENT_DIR=contents \
      -e BLOG_URL=https://investment.advenoh.pe.kr \
      -e PROJECT_TITLE="Frank's Investment Insights Blog" \
      -e HITCOUNT_PATH=kenshin579/investment.advenoh.pe.kr \
      -e NETLIFY_BADGE_ID=359125d0-4402-402d-9168-5b48f60d6a6c \
      kenshin579/readme-generator:latest
```

## 3. 요구사항

### 3.1 기능 요구사항

#### FR-1: Makefile 생성
- **위치**: 프로젝트 루트 디렉토리
- **파일명**: `Makefile`

#### FR-2: generate-readme 타겟 구현
- **명령어**: `make generate-readme`
- **동작**:
  - Docker 이미지 `kenshin579/readme-generator:latest` 실행
  - 현재 작업 디렉토리를 컨테이너의 `/workspace`로 마운트
  - 필요한 환경 변수 전달
  - README.md 파일 생성

#### FR-3: 환경 변수 설정
다음 환경 변수들을 도커 컨테이너에 전달:
- `WORKSPACE_DIR=/workspace`
- `CONTENT_DIR=contents`
- `BLOG_URL=https://investment.advenoh.pe.kr`
- `PROJECT_TITLE="Frank's Investment Insights Blog"`
- `HITCOUNT_PATH=kenshin579/investment.advenoh.pe.kr`
- `NETLIFY_BADGE_ID=359125d0-4402-402d-9168-5b48f60d6a6c`

### 3.2 비기능 요구사항

#### NFR-1: 일관성
- GitHub Actions 워크플로우와 동일한 도커 명령어 사용
- 로컬 실행 결과와 CI/CD 실행 결과가 동일해야 함

#### NFR-2: 사용성
- 간단한 명령어로 실행 가능: `make generate-readme`
- Docker가 설치되어 있으면 즉시 실행 가능

#### NFR-3: 에러 처리
- Docker가 설치되지 않은 경우 명확한 에러 메시지 제공
- 실행 실패 시 적절한 종료 코드 반환

### 3.3 제약사항

#### C-1: 사전 요구사항
- Docker가 로컬 환경에 설치되어 있어야 함
- Docker 데몬이 실행 중이어야 함

#### C-2: 권한
- 현재 디렉토리에 대한 읽기/쓰기 권한 필요
- README.md 파일 생성/수정 권한 필요

## 4. 기술 설계

### 4.1 Makefile 구조

구현 내용은 [1_makefile_implementation.md](1_makefile_implementation.md) 참조

### 4.2 주요 차이점 (GitHub Actions vs Makefile)

| 항목 | GitHub Actions | Makefile |
|------|----------------|----------|
| 작업 디렉토리 마운트 | `${{ github.workspace }}` | `$(PWD)` |
| 실행 환경 | CI/CD 서버 | 로컬 개발 환경 |
| 트리거 | Git push/manual | 수동 실행 |

### 4.3 실행 흐름

```
사용자 → `make generate-readme` → Docker 실행 → README.md 생성
```

1. 사용자가 `make generate-readme` 명령어 실행
2. Makefile이 도커 명령어 실행
3. Docker 컨테이너가 프로젝트 디렉토리 마운트
4. readme-generator 스크립트가 markdown 파일 분석
5. README.md 파일 생성/업데이트

## 5. 사용 시나리오

### 5.1 일반적인 사용
```bash
# README 생성
make generate-readme

# 변경사항 확인
git diff README.md

# 커밋
git add README.md
git commit -m "[#이슈번호] README 업데이트"
```

### 5.2 에러 시나리오

#### Docker 미설치
```bash
$ make generate-readme
make: docker: Command not found
```
→ Docker 설치 필요

#### Docker 데몬 미실행
```bash
$ make generate-readme
Cannot connect to the Docker daemon...
```
→ Docker 데몬 시작 필요

## 6. 유지보수

- Docker 이미지 버전 업데이트 시 Makefile도 함께 업데이트 필요
- 환경 변수 변경 시 GitHub Actions와 Makefile 모두 수정 필요

## 7. 구현 체크리스트

구현 및 테스트 계획은 [1_makefile_todo.md](1_makefile_todo.md) 참조

## 8. 참조

- 구현 가이드: [1_makefile_implementation.md](1_makefile_implementation.md)
- 구현 체크리스트: [1_makefile_todo.md](1_makefile_todo.md)
- GitHub Actions 워크플로우: `.github/workflows/generate-readme.yml`
- Docker 이미지: `kenshin579/readme-generator:latest`
- 프로젝트 구조: `CLAUDE.md`
