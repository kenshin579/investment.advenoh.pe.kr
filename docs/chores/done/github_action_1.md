# GitHub Action #1: PR Assignee 자동 지정

## 요구사항 요약

Pull Request가 생성될 때 자동으로 assignees를 지정하는 GitHub Action을 구현하여 PR 관리 효율성을 향상시킵니다.

**현재 상황**:
- PR 생성 시 수동으로 assignee를 지정해야 함
- assignee 지정을 잊어버리는 경우 발생
- PR 리뷰 및 관리 프로세스 추적이 어려움

**목표**:
- PR 생성 시 자동으로 assignee 지정
- 일관된 PR 관리 프로세스 확립
- PR 추적 및 책임 소재 명확화

## 기능 요구사항

### 1. 기본 Assignee 자동 지정

**필수 기능**:
- PR이 생성되면 자동으로 기본 assignee를 지정
- 기본 assignee는 repository owner 또는 특정 사용자로 설정 가능
- PR 작성자(author)를 자동으로 assignee로 지정하는 옵션

**기본 동작**:
```yaml
# 옵션 1: Repository owner를 assignee로 지정
assignees: [repository_owner]

# 옵션 2: 특정 사용자를 assignee로 지정
assignees: ["kenshin579"]

# 옵션 3: PR 작성자를 assignee로 지정
assignees: [pr_author]
```

### 2. 조건부 Assignee 지정 (선택사항)

**고급 기능**:

#### 2.1 파일 경로 기반 Assignee
특정 파일이나 디렉토리가 변경되었을 때 관련 담당자를 assignee로 지정:

```yaml
# 예시: 프론트엔드 파일 변경 시
path: "src/components/**"
assignees: ["frontend-lead"]

# 예시: 문서 파일 변경 시
path: "docs/**"
assignees: ["documentation-team"]

# 예시: GitHub Actions 변경 시
path: ".github/workflows/**"
assignees: ["devops-lead"]
```

#### 2.2 레이블 기반 Assignee
PR에 특정 레이블이 추가되었을 때 관련 담당자를 assignee로 지정:

```yaml
# 예시: bug 레이블이 추가된 경우
label: "bug"
assignees: ["bug-fixer"]

# 예시: enhancement 레이블이 추가된 경우
label: "enhancement"
assignees: ["feature-developer"]
```

#### 2.3 브랜치 패턴 기반 Assignee
브랜치 이름 패턴에 따라 assignee 지정:

```yaml
# 예시: feature/* 브랜치
branch_pattern: "feature/*"
assignees: ["feature-reviewer"]

# 예시: hotfix/* 브랜치
branch_pattern: "hotfix/*"
assignees: ["release-manager"]
```

### 3. 중복 Assignee 방지

**동작**:
- 이미 assignee가 지정된 PR에는 중복으로 assignee를 추가하지 않음
- 기존 assignee를 유지하면서 새로운 assignee만 추가하는 옵션

### 4. 에러 처리

**견고성**:
- assignee 추가 실패 시 에러 로깅
- 유효하지 않은 사용자명 처리
- GitHub API 호출 실패 시 재시도 로직

## 기술 요구사항

### 1. GitHub Actions 워크플로우

**트리거 이벤트**:
```yaml
on:
  pull_request:
    types: [opened]
  # 선택사항: reopened, labeled 등 추가 가능
```

**필요한 권限**:
```yaml
permissions:
  pull-requests: write  # PR assignee 수정을 위해 필수
  contents: read        # 파일 경로 기반 조건을 위해 필요
```

### 2. 사용 가능한 GitHub Actions

#### 옵션 1: pozil/auto-assign-issue (추천)
- **장점**: 간단한 설정, 파일 경로 기반 assignee 지원
- **GitHub**: https://github.com/pozil/auto-assign-issue
- **설치**: Marketplace에서 설치 가능

#### 옵션 2: kentaro-m/auto-assign-action
- **장점**: 커스터마이징 가능, 설정 파일 기반
- **GitHub**: https://github.com/kentaro-m/auto-assign-action
- **설치**: 워크플로우에서 직접 사용

#### 옵션 3: GitHub CLI (gh) 사용
- **장점**: 완전한 제어, 복잡한 조건 로직 구현 가능
- **단점**: 스크립트 작성 필요

### 3. 설정 방법

#### 방법 1: pozil/auto-assign-issue 사용 (추천)

**워크플로우 파일**: `.github/workflows/auto-assign-pr.yml`

```yaml
name: Auto Assign PR

on:
  pull_request:
    types: [opened]

jobs:
  auto-assign:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - name: Auto assign PR
        uses: pozil/auto-assign-issue@v2
        with:
          assignees: kenshin579
          numOfAssignee: 1
```

#### 방법 2: kentaro-m/auto-assign-action 사용

**워크플로우 파일**: `.github/workflows/auto-assign-pr.yml`

```yaml
name: Auto Assign PR

on:
  pull_request:
    types: [opened]

jobs:
  auto-assign:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
      contents: read
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Auto assign
        uses: kentaro-m/auto-assign-action@v2.0.0
```

**설정 파일**: `.github/auto_assign.yml`

```yaml
# Set to true to add assignees to pull requests
addAssignees: true

# A list of assignees
assignees:
  - kenshin579

# Set to true to add reviewers to pull requests
addReviewers: false

# A number of reviewers added to pull requests
# numberOfReviewers: 0

# A list of reviewers to be added to pull requests (GitHub user name)
# reviewers:
#   - reviewerA
#   - reviewerB

# A list of keywords to be skipped the process that add reviewers if pull requests include it
# skipKeywords:
#   - wip
```

#### 방법 3: GitHub CLI 사용 (고급)

**워크플로우 파일**: `.github/workflows/auto-assign-pr.yml`

```yaml
name: Auto Assign PR

on:
  pull_request:
    types: [opened]

jobs:
  auto-assign:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - name: Auto assign PR
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
          REPO: ${{ github.repository }}
        run: |
          # PR에 assignee 추가
          gh pr edit $PR_NUMBER --repo $REPO --add-assignee "kenshin579"
```

## 구현 방안

### 단계별 구현 계획

#### Phase 1: 기본 기능 구현
1. **기본 assignee 자동 지정**:
   - pozil/auto-assign-issue 또는 kentaro-m/auto-assign-action 사용
   - repository owner를 기본 assignee로 설정
   - PR 생성 시 자동 동작 확인

2. **테스트**:
   - 테스트 PR 생성하여 assignee 자동 지정 확인
   - 에러 로그 확인

#### Phase 2: 고급 기능 추가 (선택사항)
1. **조건부 assignee 지정**:
   - 파일 경로 기반 assignee 설정
   - 레이블 기반 assignee 설정

2. **에러 처리 강화**:
   - GitHub API 호출 실패 시 재시도
   - 유효하지 않은 사용자명 처리

### 추천 구현 방법

**현재 프로젝트에 적합한 방법**: **pozil/auto-assign-issue**

**이유**:
- 간단한 설정으로 바로 사용 가능
- 추가 설정 파일 불필요
- 워크플로우 파일에서 직접 assignee 지정
- 개인 프로젝트에 적합한 단순한 구조

**구현 코드**:

```yaml
name: Auto Assign PR

on:
  pull_request:
    types: [opened]

jobs:
  auto-assign:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - name: Auto assign PR to repository owner
        uses: pozil/auto-assign-issue@v2
        with:
          assignees: kenshin579
          numOfAssignee: 1
```

## 고려사항

### 1. 권한 관리

**필수 권한**:
- `pull-requests: write`: PR에 assignee를 추가하기 위해 필수
- `contents: read`: 파일 경로 기반 조건 사용 시 필요

**보안**:
- `GITHUB_TOKEN`은 GitHub Actions에서 자동으로 제공됨 (별도 설정 불필요)
- Personal Access Token은 불필요 (기본 토큰으로 충분)

### 2. 에러 처리

**가능한 에러**:
- 존재하지 않는 사용자명을 assignee로 지정
- GitHub API 호출 실패 (rate limit, network error)
- 권한 부족 (permissions 설정 누락)

**에러 처리 방법**:
- GitHub Actions 로그에서 에러 확인
- 워크플로우 실패 시 GitHub에서 자동으로 알림
- 필요 시 Slack/이메일 알림 추가 가능

### 3. 성능 및 비용

**성능**:
- PR 생성 후 즉시 실행 (일반적으로 10초 이내)
- GitHub API 호출 횟수 최소화

**비용**:
- GitHub Actions 무료 사용량 (월 2,000분)
- Public repository는 무료 사용량 무제한
- 현재 프로젝트는 public이므로 비용 걱정 없음

### 4. 테스트 계획

**테스트 시나리오**:
1. 기본 시나리오:
   - PR 생성 → assignee 자동 지정 확인
2. 중복 assignee:
   - 이미 assignee가 있는 PR에서 동작 확인
3. 에러 시나리오:
   - 잘못된 사용자명으로 테스트 (에러 로그 확인)

**테스트 방법**:
1. 테스트 브랜치 생성
2. 테스트 PR 생성
3. Actions 탭에서 워크플로우 실행 확인
4. PR에 assignee가 자동으로 추가되었는지 확인

### 5. 유지보수

**모니터링**:
- GitHub Actions 실행 로그 정기 확인
- 실패한 워크플로우 즉시 대응

**업데이트**:
- 사용하는 GitHub Action의 버전 업데이트 확인
- Breaking changes 사전 검토

## 기대 효과

### 1. 효율성 향상
- ✅ PR 생성 시 assignee 지정 자동화
- ✅ 수동 작업 제거로 시간 절약
- ✅ assignee 지정 누락 방지

### 2. 프로세스 개선
- ✅ 일관된 PR 관리 프로세스
- ✅ PR 추적 및 책임 소재 명확화
- ✅ 리뷰 프로세스 개선

### 3. 유지보수성
- ✅ 간단한 설정으로 쉬운 유지보수
- ✅ GitHub Actions 표준 사용
- ✅ 확장 가능한 구조

## 참고 자료

### GitHub Actions 공식 문서
- [GitHub Actions - Pull Request Events](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request)
- [GitHub Actions - Permissions](https://docs.github.com/en/actions/using-jobs/assigning-permissions-to-jobs)
- [GitHub REST API - Assignees](https://docs.github.com/en/rest/issues/assignees)

### 추천 GitHub Actions
- [pozil/auto-assign-issue](https://github.com/pozil/auto-assign-issue)
- [kentaro-m/auto-assign-action](https://github.com/kentaro-m/auto-assign-action)
- [GitHub CLI (gh)](https://cli.github.com/)

### 예제 프로젝트
- [pozil/auto-assign-issue Examples](https://github.com/pozil/auto-assign-issue#examples)
- [kentaro-m/auto-assign-action Examples](https://github.com/kentaro-m/auto-assign-action#configuration)

## 다음 단계

1. **구현**:
   - `.github/workflows/auto-assign-pr.yml` 파일 생성
   - pozil/auto-assign-issue 사용 추천
   - assignee를 `kenshin579`로 설정

2. **테스트**:
   - 테스트 PR 생성하여 동작 확인
   - Actions 탭에서 워크플로우 실행 로그 확인

3. **문서화**:
   - README.md에 Auto Assign 기능 추가 언급 (선택사항)
   - 팀원에게 새로운 기능 공지 (필요 시)

4. **모니터링**:
   - 첫 주는 매일 워크플로우 실행 로그 확인
   - 문제 발생 시 즉시 대응
