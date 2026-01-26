# GitHub Actions README 생성 워크플로우 권한 오류 분석

## 오류 현상

```
/usr/bin/git push --force-with-lease origin HEAD:refs/heads/readme-patches
remote: Permission to kenshin579/investment.advenoh.pe.kr.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/kenshin579/investment.advenoh.pe.kr/': The requested URL returned error: 403
Error: The process '/usr/bin/git' failed with exit code 128
```

## 원인 분석

### 근본 원인
`peter-evans/create-pull-request@v3` 액션이 `readme-patches` 브랜치를 푸시할 때 `github-actions[bot]`에게 **쓰기 권한이 없어서** 발생하는 403 Forbidden 오류입니다.

### 세부 원인

1. **GITHUB_TOKEN 기본 권한 제한**
   - GitHub Actions는 2023년 2월부터 새 저장소의 `GITHUB_TOKEN` 기본 권한을 **읽기 전용**으로 변경함
   - 기존 저장소도 설정에 따라 읽기 전용일 수 있음

2. **워크플로우에 권한 명시 없음**
   - 현재 `generate-readme.yml`에 `permissions` 블록이 없음
   - 명시적 권한 설정이 없으면 저장소 기본 설정을 따름

3. **create-pull-request 액션 버전**
   - `peter-evans/create-pull-request@v3`은 구버전임 (현재 v7까지 출시)
   - 최신 버전에서 권한 관련 개선 및 버그 수정이 있음

## 현재 워크플로우 구조

```yaml
# .github/workflows/generate-readme.yml
name: Generate TOC in README

on:
  push:
    paths-ignore:
      - 'README.md'
    branches:
      - main
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    # ⚠️ permissions 블록 없음

    steps:
      - uses: actions/checkout@v4
        # ⚠️ token 명시 없음 (기본 GITHUB_TOKEN 사용)

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v3  # ⚠️ 구버전
        # ⚠️ token 명시 없음
```

## 해결 방안

### 방안 1: 워크플로우에 permissions 추가 (권장)

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: write      # 브랜치 푸시 권한
      pull-requests: write # PR 생성 권한
```

### 방안 2: 저장소 설정에서 GITHUB_TOKEN 권한 변경

1. 저장소 → Settings → Actions → General
2. "Workflow permissions" 섹션
3. "Read and write permissions" 선택
4. "Allow GitHub Actions to create and approve pull requests" 체크

### 방안 3: 액션 버전 업그레이드 및 토큰 명시

```yaml
- uses: actions/checkout@v4
  with:
    token: ${{ secrets.GITHUB_TOKEN }}

- name: Create Pull Request
  uses: peter-evans/create-pull-request@v7
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
```

## 권장 수정 사항

```yaml
name: Generate TOC in README

on:
  push:
    paths-ignore:
      - 'README.md'
    branches:
      - main
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write

    steps:
      - uses: actions/checkout@v4

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

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v7
        with:
          commit-message: "chore: README 파일 자동 업데이트"
          branch: readme-patches
          delete-branch: true
          title: '[AUTO] README 파일 업데이트'
          body: |
            README 파일이 자동으로 업데이트되었습니다.
          labels: |
            automated pr
          assignees: kenshin579
          reviewers: kenshin579
```

## 변경 사항 요약

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| permissions | 없음 | `contents: write`, `pull-requests: write` |
| create-pull-request 버전 | v3 | v7 |
| git config/add/commit 단계 | 별도 step | 삭제 (액션 내부에서 처리) |

## 참고 자료

- [peter-evans/create-pull-request 문서](https://github.com/peter-evans/create-pull-request)
- [GitHub Actions 권한 설정](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token)
- [GITHUB_TOKEN 권한 변경 공지](https://github.blog/changelog/2023-02-02-github-actions-updating-the-default-github_token-permissions-to-read-only/)
