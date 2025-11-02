# Codebase Exploration Summary: Adding Post Counts to Category Buttons

## Overview
This document maps the current codebase structure for understanding how category data flows from generation to UI rendering, with analysis of what's needed to add post counts to category filter buttons.

---

## 1. Category Data Structure

### Current Data Format (public/data/categories.json)
```json
[
  {
    "category": "Stock",
    "count": 61
  },
  {
    "category": "Weekly",
    "count": 14
  },
  {
    "category": "ETF",
    "count": 11
  },
  {
    "category": "Etc",
    "count": 9
  }
]
```

**Key Finding**: Post counts are ALREADY AVAILABLE in the generated categories.json file. The count field is populated during build time by `generateStaticData.ts`.

---

## 2. Data Generation Layer

### File: `/src/scripts/generateStaticData.ts`

**Relevant Code Sections**:

```typescript
// Line 32-35: CategoryData Interface
interface CategoryData {
  category: string;
  count: number;
}

// Line 222-234: generateCategories Function
function generateCategories(posts: BlogPost[]): CategoryData[] {
  const categoryCount: { [key: string]: number } = {};

  posts.forEach(post => {
    post.categories.forEach(category => {
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
  });

  return Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])  // Sort by count descending
    .map(([category, count]) => ({ category, count }));
}

// Line 357-362: Write categories.json
await writeFile(
  'public/data/categories.json',
  JSON.stringify(categories, null, 2),
  'utf-8'
);
```

**How it Works**:
1. Scans all markdown files in `contents/` directory
2. Counts posts per category
3. Sorts categories by post count (descending)
4. Generates `public/data/categories.json` with count field

---

## 3. Data Types Definition

### File: `/src/types/blog.ts`

```typescript
// Line 21-24: Category Interface (ALREADY has count field)
export interface Category {
  category: string;
  count: number;
}
```

**Status**: The TypeScript interface already includes the `count` field.

---

## 4. Server-Side Data Access

### File: `/src/lib/blog-server.ts`

```typescript
// Line 16-23: getAllCategoriesServer Function
export async function getAllCategoriesServer(): Promise<Array<{ category: string; count: number }>> {
  const categoriesPath = path.join(process.cwd(), 'public/data/categories.json')
  const categoriesData = fs.readFileSync(categoriesPath, 'utf-8')
  const categories: Array<{ category: string; count: number }> = JSON.parse(categoriesData)

  return categories
}
```

**Status**: Server function correctly reads and returns category data WITH counts.

---

## 5. Client-Side Data Access

### File: `/src/lib/blog-client.ts`

```typescript
// Line 19-30: getAllCategoriesClient Function
export async function getAllCategoriesClient(): Promise<Array<{ category: string; count: number }>> {
  try {
    const response = await fetch('/api/categories')
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

**Status**: Client function calls API endpoint `/api/categories` to fetch categories with counts.

---

## 6. Data Flow to Home Page

### File: `/src/app/page.tsx` (Server Component)

```typescript
// Line 12-13: Data fetching
const posts = await getAllBlogPosts()
let categories = await getAllCategories()  // From blog.ts (re-exports blog-server.ts)

// Line 34: Pass to client component
<HomePageClient posts={posts} categories={categories} />
```

**Data Flow**:
1. Server component fetches categories from JSON file via `getAllCategoriesServer()`
2. Passes complete `categories` array (with count) to `HomePageClient`

---

## 7. Client Component Receiving Data

### File: `/src/components/home-page-client.tsx`

```typescript
// Line 12-15: Props interface
interface HomePageClientProps {
  posts: BlogPost[]
  categories: Array<{ category: string; count: number }>  // Has count!
}

// Line 17: Destructure props
export function HomePageClient({ posts, categories }: HomePageClientProps) {

// Line 76-81: Pass to CategoryFilterClient
<CategoryFilterClient
  categories={categories}
  selectedCategory={selectedCategory}
  searchTerm={searchTerm}
  selectedTags={selectedTags}
/>
```

**Status**: HomePageClient receives categories WITH counts and passes to CategoryFilterClient.

---

## 8. Category Filter UI Components (Current Implementation)

### File: `/src/components/category-filter-client.tsx` (MAIN COMPONENT)

```typescript
// Line 6-9: Props interface
interface Category {
  category: string;
  count: number;  // HAS COUNT BUT NOT USED IN DISPLAY
}

// Line 18-32: Receives categories with counts
export function CategoryFilterClient({
  categories,
  selectedCategory = 'all',
  searchTerm = '',
  selectedTags = []
}: CategoryFilterClientProps) {

  // Line 26-32: Transform categories for display
  const allCategories = [
    { id: "all", label: "전체" },
    ...(Array.isArray(categories) ? categories.map(({ category }) => ({  // ONLY EXTRACTS category NAME
      id: category,
      label: category
    })) : [])
  ]

  // Line 56-68: Button rendering (NO COUNT DISPLAY)
  {allCategories.map((category) => (
    <Button
      key={category.id}
      variant={selectedCategory === category.id ? "default" : "outline"}
      className={`category-filter px-6 py-2 rounded-full font-medium ${
        selectedCategory === category.id 
          ? "active bg-primary text-primary-foreground shadow-md" 
          : "hover:bg-muted"
      }`}
      onClick={() => handleCategoryChange(category.id)}
    >
      {category.label}  {/* ONLY SHOWS LABEL, NOT COUNT */}
    </Button>
  ))}
```

**KEY FINDING**: The count data exists in the `categories` prop, but the component:
1. Only extracts `category` name (line 28)
2. Does NOT extract the `count` field
3. Does NOT display count in the button label

---

### File: `/src/components/category-filter.tsx` (DEPRECATED - Uses API)

```typescript
// Line 15-26: Fetch from API instead of using props
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

// Line 29-35: Only extracts category name
const categories = [
  { id: "all", label: "전体" },
  ...(apiCategories?.map(({ category }) => ({
    id: category,
    label: category
  })) || [])
];
```

**Status**: This component also ignores the count field.

---

## 9. Data Flow Summary

```
Contents (Markdown)
    ↓
scripts/generateStaticData.ts
    ↓
public/data/categories.json (with count ✓)
    ↓
src/lib/blog-server.ts getAllCategoriesServer()
    ↓
src/app/page.tsx (Server Component)
    ↓
HomePageClient (with categories + count ✓)
    ↓
CategoryFilterClient (receives count but doesn't use ✗)
    ↓
Button display (shows only label, no count ✗)
```

---

## 10. Key Components & File Locations

| Layer | File | Status | Key Function |
|-------|------|--------|--------------|
| **Build** | `scripts/generateStaticData.ts` | ✓ Generates counts | `generateCategories()` |
| **Data** | `public/data/categories.json` | ✓ Has counts | Data file |
| **Types** | `src/types/blog.ts` | ✓ Has count type | `Category` interface |
| **Server** | `src/lib/blog-server.ts` | ✓ Reads counts | `getAllCategoriesServer()` |
| **Client Lib** | `src/lib/blog-client.ts` | ✓ Fetches counts | `getAllCategoriesClient()` |
| **Page** | `src/app/page.tsx` | ✓ Passes counts | Server component |
| **Home Client** | `src/components/home-page-client.tsx` | ✓ Receives counts | `HomePageClient` |
| **Filter UI** | `src/components/category-filter-client.tsx` | **✗ Ignores counts** | `CategoryFilterClient` |
| **Filter Alt** | `src/components/category-filter.tsx` | **✗ Ignores counts** | Old component (API-based) |

---

## 11. What Needs to Change

### Primary Target: `src/components/category-filter-client.tsx`

**Current Issue** (Line 28-31):
```typescript
// Only extracts category name, ignores count
...(Array.isArray(categories) ? categories.map(({ category }) => ({
  id: category,
  label: category
})) : [])
```

**What Needs to Change**:
1. Extract both `category` AND `count` from the incoming data
2. Include count in the transformed array structure
3. Display count in the button label (e.g., "Stock (61)" or "Stock · 61")

**Example Updated Code**:
```typescript
// Extract both category and count
...(Array.isArray(categories) ? categories.map(({ category, count }) => ({
  id: category,
  label: category,
  count: count  // Add this
})) : [])

// In button rendering:
<Button>
  {category.label} ({category.count})  {/* Display count */}
</Button>
```

### Secondary Target: `src/components/category-filter.tsx` (Optional)
- This component uses API fetching instead of props
- Could be updated the same way if still in use

---

## 12. Related Components That Might Need Updates

1. **Footer Component** (`src/components/footer.tsx`)
   - Also fetches categories from `/api/categories`
   - May want to display counts as well

2. **TypeScript Type** (`src/types/blog.ts`)
   - Already has count field in interface - NO CHANGE NEEDED

3. **Styling Considerations**
   - Button width may need adjustment for count display
   - Consider responsive design for smaller screens
   - Styling already supports shadcn/ui components

---

## 13. API Route (if used)

The `/api/categories` endpoint likely reads from the same JSON file. Check:
- `src/app/api/` directory for the actual route handler
- Verify it returns count field in response

---

## Summary

✓ **Post counts are ALREADY GENERATED and available**
✓ **Data flows correctly through the system**
✓ **HomePageClient receives data with counts**
✗ **CategoryFilterClient component discards the count field**
✗ **UI does not display the counts**

**The fix is simple**: Update `CategoryFilterClient` (and optionally `CategoryFilter`) to:
1. Extract the `count` field when transforming data
2. Pass count to button rendering
3. Display count in button label

**No changes needed to**:
- Data generation scripts
- JSON files
- Server-side functions
- Data types
- Home page component
