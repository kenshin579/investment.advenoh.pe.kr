# 카테고리 필터 버튼에 게시물 개수 표시 기능 PRD

## 1. 개요 (Overview)

### 목적
메인 페이지의 카테고리 필터 버튼에 각 카테고리별 게시물 개수를 표시하여 사용자 경험을 개선합니다.

### 현재 UI
```
[전체] [Stock] [Weekly] [ETF] [Etc]
```

### 목표 UI
```
[전체 103] [Stock 61] [Weekly 20] [ETF 15] [Etc 7]
```

### 비즈니스 가치
- 사용자가 각 카테고리의 콘텐츠 규모를 한눈에 파악 가능
- 콘텐츠가 풍부한 카테고리로 사용자 유도
- 전체 블로그의 콘텐츠 규모 시각화

---

## 2. 현재 상태 분석 (Current State Analysis)

### 중요 발견사항 ✨
**게시물 개수 데이터는 이미 생성되고 있습니다!** 단순히 UI에서 활용하지 않고 있을 뿐입니다.

### 데이터 흐름 (Data Flow)

```
1. 빌드 타임
   scripts/generateStaticData.ts
   ↓ (마크다운 파싱)
   contents/{category}/*.md
   ↓ (카테고리별 게시물 집계)
   public/data/categories.json  ← ✅ 여기에 이미 count 필드 존재!

2. 런타임
   src/app/page.tsx (Server Component)
   ↓ (getCategoriesWithCount 호출)
   src/lib/blog-server.ts
   ↓ (categories.json 읽기)
   public/data/categories.json
   ↓ (props 전달)
   src/components/home-page-client.tsx
   ↓ (카테고리 데이터 전달)
   src/components/category-filter-client.tsx  ← ⚠️ count 필드를 무시함!
```

### 핵심 파일 및 현재 상태

#### 데이터 소스: `public/data/categories.json`
```json
[
  { "category": "전체", "count": 103 },
  { "category": "Stock", "count": 61 },
  { "category": "Weekly", "count": 20 }
]
```
✅ **상태**: 완료 - 이미 count 필드 포함

#### 데이터 생성: `scripts/generateStaticData.ts`
✅ **상태**: 완료 - 카테고리별 게시물 개수 자동 계산

#### 서버 데이터 접근: `src/lib/blog-server.ts`
✅ **상태**: 완료 - count 필드를 포함하여 반환

#### 메인 페이지: `src/app/page.tsx`
✅ **상태**: 완료 - categories에 count 포함하여 전달

#### UI 컴포넌트: `src/components/category-filter-client.tsx`
❌ **상태**: 수정 필요 - count 필드를 사용하지 않음

---

## 3. 요구사항 (Requirements)

### 기능 요구사항 (Functional Requirements)

#### FR-1: 게시물 개수 표시
- 각 카테고리 버튼에 `{카테고리명} ({개수})` 형식으로 표시
- 예: "Stock (61)", "Weekly (20)"

#### FR-2: 전체 카테고리 표시
- "전체" 카테고리는 모든 게시물의 총합을 표시
- 예: "전체 (103)"

#### FR-3: 동적 업데이트
- 새 게시물 추가 시 빌드 타임에 자동으로 개수 업데이트
- 별도의 수동 작업 불필요

### 비기능 요구사항 (Non-Functional Requirements)

#### NFR-1: 성능
- 정적 데이터 사용으로 런타임 성능 영향 없음
- 빌드 타임 증가 없음 (이미 계산 중)

#### NFR-2: 일관성
- 기존 UI 디자인 시스템 유지
- Tailwind CSS 스타일링 규칙 준수

#### NFR-3: 접근성
- 스크린 리더 지원
- 키보드 네비게이션 유지

---

## 4. 구현 가이드

구현 상세 내용은 별도 문서를 참고하세요:

📄 **[3_category_count_implementation.md](3_category_count_implementation.md)**
- 코드 변경사항 상세
- 데이터 구조
- 테스트 가이드
- 트러블슈팅

**요약**:
- 수정 대상: `src/components/category-filter-client.tsx` (1개 파일)
- 변경사항: 타입 정의 추가, count 필드 추출, UI 렌더링 수정
- 예상 시간: 30-50분

---

## 5. 작업 체크리스트

작업 단계별 체크리스트는 별도 문서를 참고하세요:

✅ **[3_category_count_todo.md](3_category_count_todo.md)**
- Phase 1: 코드 수정
- Phase 2: 로컬 테스트
- Phase 3: 코드 품질 검사
- Phase 4: 프로덕션 빌드 테스트
- Phase 5: Git 커밋 및 배포

---

## 6. 예상 결과 (Expected Outcome)

### 시각적 변화

#### Before (현재)
```
┌────────┐ ┌─────────┐ ┌──────────┐ ┌───────┐ ┌───────┐
│  전체  │ │  Stock  │ │  Weekly  │ │  ETF  │ │  Etc  │
└────────┘ └─────────┘ └──────────┘ └───────┘ └───────┘
```

#### After (변경 후)
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  전체 (103)  │ │  Stock (61)  │ │  Weekly (20) │ │  ETF (15)    │ │  Etc (7)     │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### 사용자 경험 개선
1. **정보 제공**: 클릭 전에 카테고리별 콘텐츠 규모 파악
2. **의사결정 지원**: 콘텐츠가 많은 카테고리 우선 탐색
3. **신뢰성 향상**: 블로그의 콘텐츠 규모를 명확히 전달

---

## 7. 위험 요소 및 고려사항 (Risks and Considerations)

### 위험 요소

#### 위험 #1: UI 레이아웃 깨짐 (가능성: 낮음)
**증상**: 긴 숫자로 인한 버튼 크기 변화
**해결책**: Tailwind CSS의 `whitespace-nowrap` 사용, 반응형 디자인 재검증

#### 위험 #2: 다국어 지원 고려 (가능성: 낮음)
**해결책**: 현재는 한국어만 지원하므로 영향 없음

#### 위험 #3: 빌드 타임 증가 (가능성: 없음)
**분석**: 이미 카테고리 개수 계산 중, UI 변경만으로 빌드 타임 영향 없음

---

## 8. 참고 자료 (References)

### 관련 파일
- `src/components/category-filter-client.tsx` - 수정 대상
- `public/data/categories.json` - 데이터 소스
- `scripts/generateStaticData.ts` - 데이터 생성
- `src/lib/blog-server.ts` - 서버 데이터 접근

### 관련 문서
- [3_category_count_implementation.md](3_category_count_implementation.md) - 구현 가이드
- [3_category_count_todo.md](3_category_count_todo.md) - 작업 체크리스트
- `CLAUDE.md` - 프로젝트 개요 및 아키텍처
- `.github/git-commit-instructions.md` - 커밋 메시지 규칙

### 기술 스택
- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS
- **Components**: shadcn/ui
- **Type Safety**: TypeScript 5.x

---

## 9. 결론 (Conclusion)

### 핵심 요약
- ✅ 데이터는 이미 준비되어 있음 (categories.json에 count 필드 존재)
- ✅ 빌드 스크립트 수정 불필요
- ✅ UI 컴포넌트 1개 파일만 수정하면 됨
- ✅ 30-50분 내 구현 가능
- ✅ 위험도 낮음 (UI 변경만)

### 권장 우선순위
**High Priority** - 사용자 경험을 크게 개선하는 간단한 작업

### 다음 단계
1. 이 PRD 검토 및 승인
2. [3_category_count_implementation.md](3_category_count_implementation.md) 참고하여 구현
3. [3_category_count_todo.md](3_category_count_todo.md) 체크리스트 따라 진행
4. Git 커밋 및 배포

---

**작성일**: 2025-11-02
**작성자**: Claude Code
**버전**: 1.1
