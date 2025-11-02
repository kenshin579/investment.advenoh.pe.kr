# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Korean investment insights blog built with Next.js 15 (App Router) as a **fully static site**. All content is generated at build time and deployed to CDN/static hosting without requiring a backend server.

## Development Commands

### Running the Application
```bash
# Development (auto-generates static data, then starts Next.js dev server)
npm run dev

# Production build (generates static data, builds site, generates sitemap/RSS/robots)
npm run build

# Preview production build locally
npm run start
# Note: Uses 'npx serve out' to serve static files from the out/ directory
```

### Code Quality
```bash
# Type checking
npm run check

# Linting
npm run lint
```

### Performance Testing
```bash
# Run Lighthouse CI performance tests
npm run test:performance
```

### README Generation
```bash
# Generate README.md file locally using Docker
make generate-readme

# View available Makefile commands
make help
```

**Requirements**:
- Docker must be installed and running
- Uses the same Docker image as GitHub Actions (`kenshin579/readme-generator:latest`)
- Generates README.md based on blog post content in `contents/` directory

**Error Scenarios**:
- **Docker not installed**: Install Docker Desktop for Mac/Windows or Docker Engine for Linux
- **Docker daemon not running**: Start Docker Desktop or run `sudo systemctl start docker`

### Local Testing with Playwright
After running `npm run start`, use MCP Playwright to verify the build:

**Basic Navigation Test**:
- Navigate to `http://localhost:3000`
- Click through category pages
- Verify blog post detail pages
- Test search and filter functionality

**Visual Verification**:
- Take screenshots of key pages
- Verify responsive design
- Check Korean text rendering (UTF-8 encoding)

**Accessibility Testing**:
- Run automated accessibility checks
- Verify keyboard navigation
- Check ARIA labels and roles

**Example Playwright Commands**:
```typescript
// Navigate and verify homepage
await mcp_playwright.navigate({ url: 'http://localhost:3000' })
await mcp_playwright.screenshot({ name: 'homepage', fullPage: true })

// Test blog post page
await mcp_playwright.click({ selector: 'a[href*="/stock/"]' })
await mcp_playwright.screenshot({ name: 'blog-post' })

// Verify search functionality
await mcp_playwright.fill({ selector: 'input[type="search"]', value: '투자' })
```

## Architecture Overview

### Static Site Architecture

This application uses **Next.js Static Export** (`output: 'export'`):

- **Build-Time Data Generation** (`scripts/`):
  - `generateStaticData.ts`: Converts markdown files to JSON data files
  - `generateSitemap.ts`: Generates sitemap.xml
  - `generateRssFeed.ts`: Generates RSS feed
  - `generateRobots.ts`: Generates robots.txt

- **Next.js Static Generation** (`src/app/`):
  - All pages pre-rendered as HTML at build time
  - No server-side runtime required
  - Deployed to CDN/static hosting (Netlify)

- **Build Output** (`out/`):
  - Static HTML files for all pages
  - JSON data files in `public/data/`
  - All assets bundled and optimized

This architecture provides:
- Zero server costs (no Node.js server required)
- Infinite scalability via CDN
- Fast loading times (static files)
- Simple deployment process

### Content Management System

Blog posts are **markdown-based** with frontmatter:
- Location: `contents/{category}/{slug}/index.md`
- Categories: `etc/`, `etf/`, `stock/`, `weekly/`
- Frontmatter fields:
  ```yaml
  title: string
  description: string
  date: YYYY-MM-DD
  update: YYYY-MM-DD (optional)
  category: string
  tags: array
  series: string (optional)
  ```

**Build-Time Data Generation Flow**:
1. `npm run dev` or `npm run build` triggers `scripts/generateStaticData.ts`
2. Script scans `contents/` directory for all markdown files
3. Markdown files parsed via `gray-matter`
4. Content transformed to JSON and saved to `public/data/`:
   - `posts.json`: All blog posts with metadata and content
   - `categories.json`: Category list with post counts
   - `series.json`: Series information with related posts
   - `tags.json`: Tag cloud data
5. Pages access data by importing JSON files or using fetch in client components

### Path Aliases

TypeScript path resolution:
- `@/*` → `./src/*`

### Data Layer

**Static JSON Files** (no database required):
- Generated at build time by `scripts/generateStaticData.ts`
- Stored in `public/data/` directory
- Accessed via direct imports or fetch() in client components
- Files:
  - `posts.json`: All blog posts (~103 posts)
  - `categories.json`: Category metadata
  - `series.json`: Series information
  - `tags.json`: Tag metadata

### UI Components

**shadcn/ui** components in `src/components/ui/`:
- Pre-built Radix UI primitives with Tailwind styling
- DO NOT modify these files manually
- Use `npx shadcn@latest add {component}` to add new components

**Custom Components** in `src/components/`:
- `blog-post-card.tsx`: Blog post preview cards
- `markdown-renderer.tsx`: Renders markdown with syntax highlighting
- `series-navigation.tsx`: Series post navigation
- `related-posts.tsx`: Related content suggestions

### Data Access Pattern

**No API routes** - all data is static:

**Static Files** (generated at build time):
- `/data/posts.json` - All blog posts with metadata
- `/data/categories.json` - Category information
- `/data/series.json` - Series information
- `/data/tags.json` - Tag metadata
- `/rss.xml` - RSS feed (via `scripts/generateRssFeed.ts`)
- `/sitemap.xml` - Sitemap (via `scripts/generateSitemap.ts`)
- `/robots.txt` - Robots.txt (via `scripts/generateRobots.ts`)

**Data Access Methods**:
- Server Components: Direct file system access via `src/lib/blog-server.ts`
- Client Components: Fetch JSON files or import directly
- All filtering/searching done client-side

### Key Libraries in `src/lib/`

- `blog-server.ts`: Server-side data fetching from file system
- `blog-client.ts`: Client-side data fetching from JSON files
- `markdown.ts`: Markdown processing with remark/rehype
- `json-ld-schema.ts`: Structured data for SEO
- `content-management.ts`: Content utilities
- `image-utils.ts`: Image optimization helpers
- `date-utils.ts`: Date formatting utilities
- `error-handling.ts` / `error-boundary.tsx`: Error management

### Build Scripts in `scripts/`

- `generateStaticData.ts`: Main script that converts markdown to JSON
- `generateSitemap.ts`: Generates sitemap.xml for SEO
- `generateRssFeed.ts`: Generates RSS feed
- `generateRobots.ts`: Generates robots.txt

## Git Commit Conventions

**IMPORTANT**: All commits MUST follow Korean commit message format from `.github/git-commit-instructions.md`:

```
[#이슈번호] <간결한 설명>

* 추가 세부 정보 (선택사항)
* 변경 사항의 동기나 맥락 설명
```

**Commit Types** (optional):
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅 (코드 변경 없음)
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드
- `chore`: 빌드/도구 변경, 의존성 관리

**Examples**:
```
[#3000] 주식 가격 조회 API 구현

* REST API 엔드포인트 `/api/v1/stocks/{symbol}/price` 추가
* KIS API 연동하여 실시간 주식 가격 데이터 조회 기능 구현
```

```
[#3001] fix: 주식 정보 조회 시 발생하는 NullPointerException 수정
```

## Important Considerations

### TypeScript Configuration
- Build errors and TypeScript errors are **ignored** in production builds (`ignoreBuildErrors: true`)
- Still run `npm run check` during development to catch issues early

### Content Updates
- Markdown files are converted to JSON at **build time only**
- To see content changes:
  - **Development**: Restart `npm run dev` to regenerate JSON files
  - **Production**: Run `npm run build` to rebuild the entire site
- Content updates require a full rebuild and redeployment

### Image Optimization
- Images in `public/contents/` are served with 1-year cache headers
- Next.js Image component has `unoptimized: true`
- WebP/AVIF formats preferred

### Environment Variables
Optional variables (create `.env.local` if needed):
```bash
SITE_URL=https://investment.advenoh.pe.kr # Used for SEO/sitemap generation (defaults to localhost)
```

**Note**: No database or backend configuration needed - this is a fully static site.

### SEO & Analytics
- Structured data: JSON-LD schemas in `src/lib/json-ld-schema.ts`
- Google Analytics: Tag ID `G-9LNH27K1YS`
- Open Graph tags configured per page
- Sitemap auto-generated from blog posts

### Performance Optimizations
- Package imports optimized for Radix UI and icon libraries
- Static asset caching (1 year for `/contents` and `/_next/static`)
- Security headers configured in `next.config.ts`
- Compression enabled

### Text Encoding (Korean Content)

**Encoding Standard**: All files MUST be UTF-8 encoded (한글 콘텐츠 필수)

**When creating Korean/emoji content with Claude Code**:

1. **Verify encoding after file creation**:
   ```bash
   file -I path/to/file.md
   # Expected: text/plain; charset=utf-8 ✅
   # Problem:  application/octet-stream; charset=binary ❌
   ```

2. **If encoding is broken (charset=binary)**:
   ```bash
   # Option 1: Use Bash heredoc (most reliable)
   cat > file.md << 'EOF'
   한글 내용...
   EOF

   # Option 2: Re-create with Write tool
   # (usually works, but verify with file -I afterward)
   ```

3. **Prevention tips**:
   - Write tool generally handles UTF-8 correctly
   - For very large files (>5000 lines), verify encoding
   - If using Cursor/VSCode, default encoding should be UTF-8
   - System locale (`.zshrc` settings) don't affect Claude Code tools

4. **Quick encoding check**:
   ```bash
   # Check encoding
   file -I docs/**/*.md

   # View Korean content
   cat file.md | head -20
   ```

**Note**: This project contains Korean content in:
- Documentation (`docs/`)
- Markdown blog posts (`contents/`)
- Code comments and commit messages

## File Structure Notes

```
/
├── src/                   # Next.js source
│   ├── app/              # App Router pages
│   │   ├── [category]/  # Dynamic category pages
│   │   └── series/      # Series pages
│   ├── components/       # React components
│   │   └── ui/          # shadcn/ui components (DO NOT edit manually)
│   ├── lib/             # Utilities and helpers
│   └── middleware.ts    # Next.js middleware
├── scripts/              # Build-time scripts
│   ├── generateStaticData.ts  # Markdown → JSON conversion
│   ├── generateSitemap.ts     # Sitemap generation
│   ├── generateRssFeed.ts     # RSS feed generation
│   └── generateRobots.ts      # robots.txt generation
├── contents/             # Markdown blog posts
│   ├── etc/
│   ├── etf/
│   ├── stock/
│   └── weekly/
├── public/               # Static assets
│   ├── contents/        # Blog post images
│   └── data/            # Generated JSON files (gitignored)
│       ├── posts.json
│       ├── categories.json
│       ├── series.json
│       └── tags.json
└── out/                  # Build output (gitignored)
    └── (static HTML files)
```

**Note**: `server/`, `shared/`, and `src/app/api/` directories have been removed in the static site conversion.

## Development Workflow

1. **Adding Blog Posts**:
   - Create `contents/{category}/{slug}/index.md` with frontmatter
   - Restart `npm run dev` or run build to regenerate JSON data

2. **Adding Components**:
   - Create in `src/components/` or add shadcn component via CLI

3. **Modifying Build Scripts**:
   - Edit files in `scripts/` directory
   - Test with `npm run build` to verify output

4. **Type Checking**:
   - Run `npm run check` before committing

5. **Testing**:
   - Run `npm run build` to generate static site
   - Run `npm run start` to preview locally (serves on http://localhost:3000)
   - **Verify with Playwright**: Use MCP Playwright to test the local build
     - Navigate to pages and verify rendering
     - Test interactive features (search, filters, navigation)
     - Capture screenshots for visual validation
     - Check accessibility and performance

6. **Deployment**:
   - Push to main branch
   - CI/CD automatically builds and deploys to Netlify

## Common Tasks

### Adding a New Blog Post Category
1. Create directory: `contents/{new-category}/`
2. Add markdown files with proper frontmatter
3. Run `npm run dev` or `npm run build` to regenerate data
4. Categories are auto-discovered from content

### Modifying Build Scripts
1. Edit scripts in `scripts/` directory
2. Common scripts to modify:
   - `generateStaticData.ts`: Data generation logic
   - `generateSitemap.ts`: Sitemap generation rules
   - `generateRssFeed.ts`: RSS feed customization
3. Test with `npm run build`

### Working with Series
1. Add `series: "series-name"` to post frontmatter
2. All posts with same series name are automatically grouped
3. Series data generated in `public/data/series.json`
4. Access via `src/lib/blog-server.ts` or `blog-client.ts`

### Updating Static Data Structure
1. Modify `scripts/generateStaticData.ts`
2. Update TypeScript types if needed
3. Update components that consume the data
4. Test with full rebuild: `npm run build`

### Local Testing Workflow with Playwright
1. **Build and serve**:
   ```bash
   npm run build
   npm run start  # Serves on http://localhost:3000
   ```

2. **Automated testing with Playwright**:
   - Navigate to key pages and verify content rendering
   - Test interactive features (search, filters, category navigation)
   - Capture screenshots for visual regression testing
   - Verify Korean text encoding (UTF-8)
   - Check accessibility compliance

3. **Common test scenarios**:
   ```typescript
   // Homepage verification
   navigate → screenshot → verify Korean text

   // Blog post page
   navigate → click post link → verify content → screenshot

   // Category filtering
   navigate → select category → verify filtered results

   // Search functionality
   navigate → fill search input → verify results

   // Series navigation
   navigate to series post → verify prev/next links
   ```

4. **Performance validation**:
   - Use Playwright to measure page load times
   - Check for console errors or warnings
   - Verify all images load correctly
