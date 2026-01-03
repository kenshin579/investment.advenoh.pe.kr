# GitHub Actions로 Claude 스펠링 체크 자동화 구축

## 개요

GitHub Actions에서 `anthropics/claude-code-action`을 사용하여 `contents/` 폴더의 마크다운 파일에서 스펠링 체크를 수행하고, 오류를 자동 수정한 후 PR을 생성하는 워크플로우를 구축합니다.

## 인증 옵션 비교

| 옵션 | 장점 | 단점 | 설정 방법 |
|-----|-----|-----|---------|
| **Claude Code OAuth** | Claude Code 구독으로 사용 가능, 추가 비용 없음 | Claude Code 구독 필요 | `/install-github-app` |
| **Claude API 구독** | 설정 간단, 직접 제어 | 별도 API 구독 필요 | console.anthropic.com |
| **AWS Bedrock** | AWS 생태계 통합 | AWS 계정 필요 | AWS 콘솔 |
| **Google Vertex AI** | GCP 생태계 통합 | GCP 계정 필요 | GCP 콘솔 |

---

## 옵션 1: Claude Code OAuth (권장)

**Claude Code를 구독 중이라면 이 방법을 사용하세요.**

### 1.1 GitHub 앱 설치

터미널에서 다음 명령어 실행:

```bash
claude /install-github-app
```

이 명령어가 자동으로:
- GitHub 앱 설치
- `CLAUDE_CODE_OAUTH_TOKEN` 시크릿 설정

### 1.2 워크플로우 설정

```yaml
- uses: anthropics/claude-code-action@v1
  with:
    claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
    prompt: "스펠링 체크 프롬프트..."
```

---

## 옵션 2: Claude API 직접 구독

### 2.1 API 키 발급

1. https://console.anthropic.com 접속 (별도 가입 필요)
2. 좌측 메뉴 → **API Keys**
3. **Create Key** 클릭
4. 키를 안전한 곳에 복사 (한 번만 표시됨)

### 2.2 GitHub 시크릿 설정

1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. 추가:
   - Name: `ANTHROPIC_API_KEY`
   - Value: 발급받은 API 키

### 2.3 워크플로우 설정

```yaml
- uses: anthropics/claude-code-action@v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    prompt: "스펠링 체크 프롬프트..."
```

---

## 옵션 3: AWS Bedrock

AWS 계정이 있다면 Amazon Bedrock을 통해 Claude를 사용할 수 있습니다.

### 3.1 사전 설정

1. AWS 콘솔에서 Amazon Bedrock 활성화
2. Claude 모델 액세스 요청 승인
3. IAM 역할 생성 (GitHub OIDC용)

### 3.2 GitHub 시크릿 설정

```
AWS_ROLE_ARN: arn:aws:iam::123456789:role/github-actions-role
```

### 3.3 워크플로우 설정

```yaml
jobs:
  spell-check:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: write
      pull-requests: write

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: us-east-1

      - uses: anthropics/claude-code-action@v1
        with:
          use_bedrock: "true"
          prompt: "스펠링 체크 프롬프트..."
          claude_args: '--model us.anthropic.claude-sonnet-4-5-20250929-v1:0'
```

---

## 옵션 4: Google Vertex AI

Google Cloud 계정이 있다면 Vertex AI를 통해 Claude를 사용할 수 있습니다.

### 4.1 사전 설정

1. GCP 프로젝트에서 Vertex AI API 활성화
2. Claude 모델 액세스 요청
3. Workload Identity Federation 설정

### 4.2 GitHub 시크릿 설정

```
GCP_WORKLOAD_IDENTITY_PROVIDER: projects/123/locations/global/workloadIdentityPools/...
GCP_SERVICE_ACCOUNT: github-actions@project.iam.gserviceaccount.com
```

### 4.3 워크플로우 설정

```yaml
jobs:
  spell-check:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: write
      pull-requests: write

    steps:
      - uses: actions/checkout@v4

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.GCP_WORKLOAD_IDENTITY_PROVIDER }}
          service_account: ${{ secrets.GCP_SERVICE_ACCOUNT }}

      - uses: anthropics/claude-code-action@v1
        with:
          use_vertex: "true"
          prompt: "스펠링 체크 프롬프트..."
          claude_args: '--model claude-sonnet-4@20250514'
```

---

## 전체 워크플로우 예제 (Claude Code OAuth 사용)

`.github/workflows/spell-check.yml`:

```yaml
name: 스펠링 체크 및 자동 수정

on:
  # 매주 월요일 오전 9시 (KST) 실행
  schedule:
    - cron: "0 0 * * 1" # UTC 00:00 = KST 09:00
  # 수동 트리거
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write
  issues: write
  id-token: write

jobs:
  spell-check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Run Claude Spell Check
        id: spell-check
        uses: anthropics/claude-code-action@v1
        with:
          claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
          prompt: |
            ## 작업: contents/ 폴더의 모든 마크다운 파일 스펠링 체크 및 자동 수정

            다음 작업을 수행해주세요:

            ### 1. 스펠링 확인
            - `contents/` 폴더의 모든 `.md` 파일에서 한글 맞춤법 오류 찾기
            - 영어 단어 스펠링 오류 찾기
            - 띄어쓰기 오류 찾기

            ### 2. 오류 유형
            - 띄어쓰기 오류 (예: "주식가격" → "주식 가격")
            - 맞춤법 오류
            - 영문 스펠링 (예: "markt" → "market")
            - 오타 수정

            ### 3. 수정 규칙 (중요!)
            - 원본 의도를 변경하지 않기
            - 마크다운 포맷 유지하기
            - **Frontmatter (---, title, date, tags 등) 절대 건드리지 않기**
            - **코드 블록 (```) 내용 변경하지 않기**
            - **URL, 파일 경로 변경하지 않기**

            ### 4. 작업 순서
            1. contents/ 폴더의 모든 .md 파일 검사
            2. 오류 발견 시 파일 직접 수정
            3. 수정 완료 후 요약 출력

            ### 5. 완료 후
            - 수정된 파일 목록 출력
            - 수정된 파일 수와 총 오류 개수 보고

          claude_args: "--max-turns 20"

      - name: Check for changes
        id: check-changes
        run: |
          if git diff --quiet; then
            echo "has_changes=false" >> $GITHUB_OUTPUT
            echo "변경사항이 없습니다."
          else
            echo "has_changes=true" >> $GITHUB_OUTPUT
            echo "변경사항이 발견되었습니다:"
            git diff --stat
          fi

      - name: Create branch and commit
        if: steps.check-changes.outputs.has_changes == 'true'
        id: commit
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          BRANCH_NAME="fix/spell-check-$(date +%Y%m%d-%H%M%S)"
          git checkout -b $BRANCH_NAME
          git add contents/
          git commit -m "[#spell-check] docs: contents/ 폴더 스펠링 자동 수정

          * Claude를 통한 자동 스펠링 체크 및 수정
          * 마크다운 포맷 및 Frontmatter 보존"
          git push origin $BRANCH_NAME
          echo "branch_name=$BRANCH_NAME" >> $GITHUB_OUTPUT

      - name: Create Pull Request
        if: steps.check-changes.outputs.has_changes == 'true'
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          gh pr create \
            --title "[자동화] 스펠링 체크 및 맞춤법 수정" \
            --body "## 자동 스펠링 체크 워크플로우

          ### 작업 완료
          - contents/ 폴더의 모든 마크다운 파일 스펠링 체크 완료
          - 발견된 오류 자동 수정 완료

          ### 검토 항목
          - [ ] 한글 맞춤법 수정 검토
          - [ ] 영문 스펠링 수정 검토
          - [ ] 원본 의도 변경 없음 확인
          - [ ] Frontmatter/코드블록 정상 여부 확인

          ---
          🤖 이 PR은 자동 생성되었습니다. 병합 전 검토 부탁드립니다." \
            --reviewer kenshin579
```

## 프롬프트 최적화

### 상세 스펠링 체크 프롬프트

```yaml
prompt: |
  ## 스펠링 및 문법 자동 수정 작업

  ### 검사 영역
  - 경로: contents/ 폴더의 모든 .md 파일
  - 제외: .git/, node_modules/, public/data/

  ### 수정 항목

  **1. 한글 맞춤법**
  - 띄어쓰기: "주식가격" → "주식 가격"
  - 조사 오류: "데이터를" vs "데이터를로"
  - 중복 어절: "이것이 이것이" → "이것이"
  - 표준어 사용

  **2. 영문 스펠링**
  - 기본 스펠링 체크
  - 기술 용어 정확성
  - 약자 사용 일관성 (API, JSON 등)

  **3. 문장 구조**
  - 문장 부호 배치
  - 괄호 매칭
  - 마크다운 링크 문법

  ### 보존 항목
  - Frontmatter (title, date, tags 등)
  - 코드 블록 내용
  - URL 및 파일 경로
  - HTML 주석
```

### 특정 카테고리만 검사

```yaml
prompt: |
  contents/stock/ 폴더의 마크다운 파일만 검사하고,
  다음 오류를 수정해주세요:
  1. 금융 용어 정확성
  2. 숫자 표기 일관성 (쉼표, 소수점)
  3. 기업명 표준 표기
```

## 비용 관리

### 모델별 비용 비교

| 모델 | 속도 | 비용 | 권장 사용 |
|-----|-----|-----|---------|
| claude-opus-4-5-20251101 | 느림 | 높음 | 복잡한 수정 |
| claude-sonnet-4-5-20250929 | 중간 | 중간 | 일반 스펠링 체크 (권장) |

### 비용 절감 팁

```yaml
claude_args: |
  --max-turns 10                      # 턴 수 제한
  --model claude-sonnet-4-5-20250929  # 저렴한 모델 사용
```

### 예상 비용

| 항목 | 예상 비용 |
|-----|---------|
| GitHub Actions | 무료 (Public 저장소) |
| Claude API (월 1회) | $5-20 |
| Claude API (주 1회) | $20-80 |

## 문제 해결

### 일반적인 오류

| 오류 | 원인 | 해결 방법 |
|-----|------|---------|
| `API key invalid` | API 키 오류 | 시크릿 값 재확인 |
| `Rate limit exceeded` | API 호출 제한 | 실행 빈도 줄이기 |
| `No changes detected` | 수정할 내용 없음 | 정상 동작 |
| `Permission denied` | 권한 부족 | `permissions` 설정 확인 |

### Claude가 응답하지 않을 때

1. `--max-turns` 값 증가
2. 프롬프트 단순화
3. 파일 개수 줄이기 (배치 처리)

## 테스트

### 수동 테스트

1. GitHub 저장소 → **Actions** 탭
2. 워크플로우 선택
3. **Run workflow** 클릭
4. 실행 결과 확인

### 로그 확인

```bash
gh run list --workflow=spell-check.yml
gh run view <run-id> --log
```

## 참고 자료

- [Claude Code Action 공식 저장소](https://github.com/anthropics/claude-code-action)
- [Claude Code GitHub Actions 문서](https://docs.anthropic.com/en/docs/claude-code/github-actions)
- [Anthropic API 콘솔](https://console.anthropic.com)
- [AWS Bedrock Claude](https://aws.amazon.com/bedrock/claude/)
- [Google Vertex AI Claude](https://cloud.google.com/vertex-ai/docs/generative-ai/partner-models/claude)

## 체크리스트

### Claude Code OAuth 사용 시 (권장)
- [ ] Claude Code 구독 확인
- [ ] `/install-github-app` 실행
- [ ] `CLAUDE_CODE_OAUTH_TOKEN` 시크릿 자동 설정 확인
- [ ] 워크플로우 파일 생성 (`.github/workflows/spell-check.yml`)
- [ ] 수동 실행으로 테스트

### Claude API 사용 시
- [ ] Anthropic API 계정 생성 및 구독
- [ ] API 키 발급
- [ ] GitHub 시크릿 설정 (`ANTHROPIC_API_KEY`)
- [ ] 워크플로우 파일 생성
- [ ] 수동 실행으로 테스트

### AWS Bedrock 사용 시
- [ ] AWS Bedrock에서 Claude 모델 액세스 요청
- [ ] IAM 역할 생성 (GitHub OIDC)
- [ ] GitHub 시크릿 설정 (`AWS_ROLE_ARN`)
- [ ] 워크플로우 파일 생성
- [ ] 수동 실행으로 테스트

### Google Vertex AI 사용 시
- [ ] Vertex AI에서 Claude 모델 액세스 요청
- [ ] Workload Identity Federation 설정
- [ ] GitHub 시크릿 설정
- [ ] 워크플로우 파일 생성
- [ ] 수동 실행으로 테스트
