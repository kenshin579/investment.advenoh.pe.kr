# Footer 카테고리 표시 구현

## 1. blog-client.ts 수정

**파일**: `src/lib/blog-client.ts:21`

### 변경 내용
```typescript
// 수정 전
const response = await fetch('/api/categories')

// 수정 후
const response = await fetch('/data/categories.json')
```

### 전체 함수
```typescript
export async function getAllCategoriesClient(): Promise<Array<{ category: string; count: number }>> {
  try {
    const response = await fetch('/data/categories.json')
    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}
```

## 2. footer.tsx 수정

**파일**: `src/components/footer.tsx`

### 변경 내용

1. import 추가:
```typescript
import { getAllCategoriesClient } from "@/lib/blog-client";
```

2. useEffect 로직 단순화 (18-44행 → 간단한 형태):
```typescript
// 수정 전 (18-44행)
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    }
  };

  fetchCategories();
}, []);

// 수정 후
useEffect(() => {
  getAllCategoriesClient().then(setCategories);
}, []);
```

## 3. category-filter.tsx 수정

**파일**: `src/components/category-filter.tsx:18-26`

### 변경 내용
```typescript
// 수정 전
const { data: apiCategories } = useQuery<Category[]>({
  queryKey: ['/api/categories'],
  queryFn: async () => {
    const response = await fetch('/api/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  },
});

// 수정 후
const { data: apiCategories } = useQuery<Category[]>({
  queryKey: ['/data/categories'],
  queryFn: async () => {
    const response = await fetch('/data/categories.json');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  },
});
```

## 테스트 방법

### 수동 테스트

```bash
# 빌드
npm run build

# 로컬 서버 실행
npm run start
```

**확인 사항**:
1. http://localhost:3000 접속
2. Footer 섹션에서 카테고리 목록 확인
3. 브라우저 Network 탭에서 `/data/categories.json` 요청 확인 (200 OK)
4. 카테고리 링크 클릭 시 필터링 동작 확인

### MCP Playwright 자동 테스트

로컬 서버 실행 후 (`npm run start`) Playwright로 자동 테스트:

```typescript
// 1. 홈페이지 접속 및 스크린샷
await mcp_playwright.navigate({ url: 'http://localhost:3000' })
await mcp_playwright.screenshot({ name: 'homepage-with-footer', fullPage: true })

// 2. Footer 영역 확인 (카테고리 섹션 존재 확인)
await mcp_playwright.get_visible_text()  // Footer 텍스트에 "Stock", "Weekly", "ETF", "Etc" 포함 확인

// 3. 카테고리 링크 클릭 테스트 (예: Stock)
await mcp_playwright.click({ selector: 'footer a[href*="category=Stock"]' })
await mcp_playwright.screenshot({ name: 'category-stock-filtered' })

// 4. Network 요청 확인 (Console Logs)
await mcp_playwright.console_logs({ type: 'all', search: 'categories' })

// 5. 다른 카테고리 테스트 (예: Weekly)
await mcp_playwright.navigate({ url: 'http://localhost:3000' })
await mcp_playwright.click({ selector: 'footer a[href*="category=Weekly"]' })
await mcp_playwright.screenshot({ name: 'category-weekly-filtered' })
```

**검증 포인트**:
- Footer에 4개 카테고리 링크 표시
- 각 카테고리 링크 클릭 시 해당 카테고리로 필터링
- `/data/categories.json` 성공적으로 로드
- `/api/categories` 요청 없음
