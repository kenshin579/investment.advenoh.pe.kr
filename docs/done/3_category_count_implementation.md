# 카테고리 필터 버튼 게시물 개수 표시 - 구현 가이드

## 개요

메인 페이지의 카테고리 필터 버튼에 게시물 개수를 표시합니다.

**목표**: `[Stock] → [Stock (61)]`

## 핵심 발견

✅ **데이터는 이미 준비되어 있습니다!**

- `public/data/categories.json`에 count 필드 존재
- `scripts/generateStaticData.ts`에서 자동 계산
- UI 컴포넌트에서만 활용하지 않음

## 데이터 흐름

```
빌드 타임: scripts/generateStaticData.ts → public/data/categories.json (count 포함)
런타임: src/app/page.tsx → src/components/category-filter-client.tsx (count 무시)
```

## 구현 상세

### 수정 대상 파일

**단일 파일**: `src/components/category-filter-client.tsx`

### 변경사항

#### 1. 타입 정의 수정

**위치**: 파일 상단 타입 정의 영역

```typescript
interface CategoryOption {
  id: string;
  label: string;
  count: number;  // ← 추가
}
```

#### 2. 데이터 매핑 수정

**위치**: ~28-33번째 줄

```typescript
// Before
const categoryOptions = React.useMemo(
  () => categories.map((category) => ({
    id: category.category,
    label: category.category,
  })),
  [categories]
);

// After
const categoryOptions = React.useMemo(
  () => categories.map(({ category, count }) => ({
    id: category,
    label: category,
    count: count,
  })),
  [categories]
);
```

#### 3. UI 렌더링 수정

**위치**: ~67-70번째 줄

```typescript
// Before
<Button>
  {category.label}
</Button>

// After
<Button>
  {category.label} ({category.count})
</Button>
```

### 선택사항: 접근성 개선

```typescript
<Button 
  aria-label={`${category.label} 카테고리, 게시물 ${category.count}개`}
>
  {category.label} ({category.count})
</Button>
```

## 데이터 구조

### categories.json 구조

```json
[
  { "category": "전체", "count": 103 },
  { "category": "Stock", "count": 61 },
  { "category": "Weekly", "count": 20 },
  { "category": "ETF", "count": 15 },
  { "category": "Etc", "count": 7 }
]
```

## 테스트 가이드

### 로컬 테스트

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 확인
# - http://localhost:3000
# - 각 카테고리 버튼에 개수 표시 확인
# - 버튼 클릭 시 필터링 동작 확인
```

### 프로덕션 빌드 테스트

```bash
# 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 확인 항목
# - 정적 파일 생성 확인
# - 모든 카테고리 개수 정확성 확인
```

### 타입 체크

```bash
npm run check
```

### 린트 체크

```bash
npm run lint
```

## 예상 결과

### Before
```
[전체] [Stock] [Weekly] [ETF] [Etc]
```

### After
```
[전체 (103)] [Stock (61)] [Weekly (20)] [ETF (15)] [Etc (7)]
```

## 주의사항

### 스타일링

- 기존 Tailwind CSS 클래스 유지
- 버튼 크기 변화 확인 (특히 모바일)
- 필요시 `whitespace-nowrap` 적용

### 반응형

- 모바일: 버튼이 너무 길지 않은지 확인
- 태블릿: 레이아웃 깨짐 확인
- 데스크탑: 정상 표시 확인

## 트러블슈팅

### 문제: count가 undefined로 표시됨

**원인**: categoryOptions에서 count를 추출하지 않음

**해결**: useMemo 내부에서 `count: count` 추가 확인

### 문제: TypeScript 타입 오류

**원인**: CategoryOption 인터페이스에 count 필드 누락

**해결**: 인터페이스에 `count: number` 추가

### 문제: 빌드 후 개수가 0으로 표시됨

**원인**: categories.json 파일 미생성

**해결**: `npm run dev` 또는 `npm run build` 재실행

---

**작성일**: 2025-11-02
**버전**: 1.0
