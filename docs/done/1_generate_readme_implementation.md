# GitHub Action: README 자동 생성 구현

## 1. 워크플로우 파일 생성

### 파일 경로
`.github/workflows/generate-readme.yml`

### 워크플로우 내용

```yaml
name: Generate TOC in README

on:
  push:
    paths-ignore:
      - 'README.md'
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Run README generator
        run: |
          docker run --rm \
            -v ${{ github.workspace }}:/workspace \
            -e WORKSPACE_DIR=/workspace \
            -e CONTENT_DIR=contents \
            -e BLOG_URL=https://investment.advenoh.pe.kr \
            kenshin579/readme-generator:latest

      - name: Create commits
        run: |
          echo "username: ${{github.actor}}"
          echo "email: ${{github.email}}"
          
          git config user.name ${{github.actor}}
          git config user.email 'kenshin579@hotmail.com'
          git add README.md
          git commit -am "update README file"

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v3
        with:
          commit-message: Update README file
          branch: readme-patches
          delete-branch: true
          title: '[AUTO] Update README file'
          body: |
            Update README file
          labels: |
            automated pr
          assignees: kenshin579
          reviewers: kenshin579
```

### 주요 변경 사항

원본 워크플로우 대비 변경된 부분:

1. **브랜치**: `master` → `main`
2. **BLOG_URL**: `https://blog.advenoh.pe.kr` → `https://investment.advenoh.pe.kr`

## 2. 로컬 테스트

### Docker 이미지 테스트

```bash
# 프로젝트 루트에서 실행
docker run --rm \
  -v $(pwd):/workspace \
  -e WORKSPACE_DIR=/workspace \
  -e CONTENT_DIR=contents \
  -e BLOG_URL=https://investment.advenoh.pe.kr \
  kenshin579/readme-generator:latest

# 생성된 README.md 확인
git diff README.md
```

### 예상 결과

- `README.md` 파일에 TOC(목차) 자동 생성
- `contents/` 디렉토리의 마크다운 파일들이 카테고리별로 정리되어 링크 생성

## 3. GitHub Action 테스트

### 테스트 절차

1. `.github/workflows/generate-readme.yml` 파일 생성
2. 파일을 main 브랜치에 커밋 및 푸시
3. GitHub Actions 탭에서 워크플로우 실행 확인
4. 자동 생성된 PR 확인
5. PR의 변경사항 검토 후 병합

### 확인 사항

- Actions 탭에서 "Generate TOC in README" 워크플로우가 성공적으로 실행되는지
- `readme-patches` 브랜치가 자동으로 생성되는지
- PR이 `[AUTO] Update README file` 제목으로 생성되는지
- PR에 `automated pr` 라벨이 자동으로 붙는지
- README.md 변경사항이 올바른지

## 4. 무한 루프 방지

워크플로우에서 `paths-ignore: - 'README.md'` 설정이 포함되어 있어, README.md 파일만 변경될 경우 워크플로우가 트리거되지 않습니다.

이를 통해 다음 무한 루프를 방지합니다:
```
README.md 업데이트 → 푸시 → 워크플로우 트리거 → README.md 업데이트 → ...
```
