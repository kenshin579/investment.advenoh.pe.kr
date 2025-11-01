# GitHub Action: README 자동 생성 워크플로우 적용

## 목표

`blog-v2.advenoh.pe.kr` 프로젝트의 README 자동 생성 GitHub Action을 현재 프로젝트에 적용

## 원본 워크플로우 분석

### 동작 방식
1. **트리거**: master 브랜치 푸시 시 (README.md 변경 제외)
2. **실행**: Docker 컨테이너로 README 생성기 실행
3. **커밋**: 생성된 README.md 변경사항 커밋
4. **PR 생성**: 자동으로 Pull Request 생성

### 사용 Docker 이미지
- `kenshin579/readme-generator:latest`
- 이미 Docker Registry에 존재 (빌드 불필요)

## 현재 프로젝트 적용 시 변경 사항

### 1. 브랜치 이름
- **원본**: `master`
- **변경**: `main`

### 2. 환경변수
- `BLOG_URL`: `https://blog.advenoh.pe.kr` → `https://investment.advenoh.pe.kr`
- `CONTENT_DIR`: `contents` (동일)
- `WORKSPACE_DIR`: `/workspace` (동일)

### 3. Contents 디렉토리 구조
```
contents/
├── etc/
├── etf/
├── stock/
└── weekly/
```

## 위험 요소

### 무한 루프 위험
**문제**: README.md 업데이트 → 푸시 → 워크플로우 트리거 → README.md 업데이트 (반복)

**대응**: `paths-ignore: - 'README.md'` 설정으로 방지

### 머지 충돌
**문제**: 수동으로 README.md 수정 시 자동 생성된 내용과 충돌 가능

**대응**: README.md에 자동 생성 영역과 수동 관리 영역 명확히 구분

## 관련 문서

- **구현**: [1_generate_readme_implementation.md](1_generate_readme_implementation.md)
- **TODO**: [1_generate_readme_todo.md](1_generate_readme_todo.md)
- **원본 워크플로우**: `/Users/user/WebstormProjects/blog-v2.advenoh.pe.kr/.github/workflows/generate-readme.yml`
