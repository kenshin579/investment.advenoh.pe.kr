# Quick Reference: Adding Post Counts to Category Buttons

## The Problem
Category buttons show only labels: "Stock", "Weekly", "ETF", "Etc"
Need to show post counts: "Stock (61)", "Weekly (14)", "ETF (11)", "Etc (9)"

## The Solution
**File to modify**: `/src/components/category-filter-client.tsx`
**Effort**: 30-45 minutes
**Risk**: LOW (UI-only change)

## Changes Required

### Change #1: Extract Count Field (Line 28)
```typescript
// BEFORE
categories.map(({ category }) => ({

// AFTER  
categories.map(({ category, count }) => ({
  // ...
  count: count
}))
```

### Change #2: Display Count in Button (Line 67)
```typescript
// BEFORE
{category.label}

// AFTER
{category.label} {category.count && `(${category.count})`}
```

## That's It!
The data is already generated, already flows through the system, already reaches the component.
You just need to use it.

## Files to Reference
- **Data source**: `/public/data/categories.json` (already has counts)
- **Data generation**: `/scripts/generateStaticData.ts` (already working)
- **Server data flow**: `/src/app/page.tsx` → `/src/components/home-page-client.tsx` → `/src/components/category-filter-client.tsx`

## Testing
```bash
npm run check   # TypeScript check
npm run lint    # ESLint check
npm run dev     # Visual verification
```

## Before/After Comparison

**BEFORE:**
```
┌─────┐ ┌───────┐ ┌─────┐ ┌─────┐
│全部 │ │ Stock │ │Weekly│ │ ETF │
└─────┘ └───────┘ └─────┘ └─────┘
```

**AFTER:**
```
┌─────┐ ┌──────────┐ ┌─────────┐ ┌─────────┐ ┌─────┐
│全部 │ │Stock (61)│ │Weekly(14)│ │ ETF (11) │ │ Etc │
└─────┘ └──────────┘ └─────────┘ └─────────┘ └─────┘
         (9)
```

---

**📚 Full documentation**: See `CODEBASE_EXPLORATION.md` and `CATEGORY_BUTTON_COUNTS_ANALYSIS.md`
