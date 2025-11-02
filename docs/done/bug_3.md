# Bug #3: sitemap.xml, rss.xml 배포 문제

## 문제 상황

로컬에서 스크립트를 실행하면 `public/` 폴더에 `sitemap.xml`과 `rss.xml`이 정상적으로 생성되지만, 실제 배포된 사이트에서는 다음과 같은 문제가 발생:

- **sitemap.xml**: https://invest.advenoh.pe.kr/sitemap.xml → **404 Not Found**
- **rss.xml**: https://invest.advenoh.pe.kr/rss.xml → 존재하지만 이전 버전 (stock.advenoh.pe.kr 도메인 사용)

## 원인 분석

### 1. Next.js Static Export 빌드 프로세스 이해

현재 `package.json`의 빌드 스크립트:

```json
{
  "scripts": {
    "prebuild": "npx tsx scripts/generateStaticData.ts",
    "build": "next build",
    "postbuild": "npx tsx scripts/generateSitemap.ts && npx tsx scripts/generateRssFeed.ts && npx tsx scripts/generateRobots.ts"
  }
}
```

**빌드 프로세스 순서**:
1. `prebuild`: `generateStaticData.ts` 실행 → `public/data/posts.json` 생성
2. `build`: `next build` 실행 → `out/` 디렉토리에 정적 사이트 빌드
   - Next.js는 이 시점에 `public/` 폴더의 모든 파일을 `out/`로 복사
3. `postbuild`: sitemap, RSS, robots.txt 생성 → **`public/`에만 생성됨**
   - ❌ 이미 Next.js 빌드가 완료되어 `out/` 디렉토리로 복사되지 않음

### 2. 문제의 핵심

**Next.js Static Export (`output: 'export'`) 동작 방식**:
- `next build` 실행 시 `public/` 폴더의 모든 파일을 `out/` 디렉토리로 복사
- `postbuild` 단계에서 생성된 파일들은 **이미 빌드가 완료된 후**라서 `out/`에 포함되지 않음
- Netlify 등의 배포 플랫폼은 `out/` 디렉토리만 배포

**결과**:
- `public/sitemap.xml`: 로컬에만 존재, 배포 사이트에는 없음
- `public/rss.xml`: 로컬에만 최신 버전 존재, 배포 사이트는 이전 버전

## 검증

### 로컬 파일 확인

```bash
# 로컬에서 생성된 파일 확인
cat public/sitemap.xml | head -10
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://invest.advenoh.pe.kr</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ...
```

✅ 로컬에서는 올바른 도메인 (`invest.advenoh.pe.kr`) 사용

### 배포된 사이트 확인

```bash
# 배포된 사이트
curl https://invest.advenoh.pe.kr/sitemap.xml
# 결과: 404 Not Found

curl https://invest.advenoh.pe.kr/rss.xml
# 결과: 존재하지만 이전 버전 (stock.advenoh.pe.kr 도메인)
```

❌ sitemap.xml이 배포되지 않음
❌ rss.xml이 업데이트되지 않음 (이전 배포 버전 그대로)

## 해결 방법

### 방법 1: prebuild에서 생성 (추천)

sitemap, RSS, robots.txt를 `prebuild` 단계로 이동하여 `next build` 실행 전에 생성:

```json
{
  "scripts": {
    "prebuild": "npx tsx scripts/generateStaticData.ts && npx tsx scripts/generateSitemap.ts && npx tsx scripts/generateRssFeed.ts && npx tsx scripts/generateRobots.ts",
    "build": "next build",
    "postbuild": ""
  }
}
```

**장점**:
- Next.js 빌드 시 자동으로 `out/`로 복사됨
- 별도의 복사 스크립트 불필요

**단점**:
- sitemap 생성 시 `public/data/posts.json`에 의존하므로 `generateStaticData.ts`가 먼저 실행되어야 함

### 방법 2: postbuild에서 out/로 직접 복사

`postbuild` 단계에서 파일 생성 후 `out/` 디렉토리로 복사:

```json
{
  "scripts": {
    "prebuild": "npx tsx scripts/generateStaticData.ts",
    "build": "next build",
    "postbuild": "npx tsx scripts/generateSitemap.ts && npx tsx scripts/generateRssFeed.ts && npx tsx scripts/generateRobots.ts && cp public/sitemap.xml public/rss.xml public/robots.txt out/"
  }
}
```

**장점**:
- 빌드 후 최신 데이터로 생성 가능

**단점**:
- 추가 복사 단계 필요
- 플랫폼별로 복사 명령어 차이 (Windows: `copy`, Unix: `cp`)

### 방법 3: 스크립트에서 직접 out/에 생성

스크립트를 수정하여 `public/`과 `out/` 두 곳에 모두 생성:

```typescript
// scripts/generateSitemap.ts
await writeFile('public/sitemap.xml', sitemap, 'utf-8');
await writeFile('out/sitemap.xml', sitemap, 'utf-8'); // 추가
```

**장점**:
- 확실하게 두 위치에 파일 생성

**단점**:
- `out/` 디렉토리가 존재하지 않으면 에러
- 중복 코드

## 권장 해결책

**방법 1 (prebuild로 이동)** 을 권장합니다:

1. sitemap, RSS, robots.txt는 정적 데이터로 빌드 시 확정 가능
2. Next.js의 자연스러운 빌드 프로세스 활용
3. 별도의 복사 로직 불필요

### 구현 예시

```json
{
  "scripts": {
    "prebuild": "npx tsx scripts/generateStaticData.ts && npx tsx scripts/generateSitemap.ts && npx tsx scripts/generateRssFeed.ts && npx tsx scripts/generateRobots.ts",
    "build": "next build",
    "postbuild": ""
  }
}
```

**실행 순서**:
1. `generateStaticData.ts` → `public/data/posts.json` 생성
2. `generateSitemap.ts` → `public/sitemap.xml` 생성 (posts.json 사용)
3. `generateRssFeed.ts` → `public/rss.xml` 생성 (posts.json 사용)
4. `generateRobots.ts` → `public/robots.txt` 생성
5. `next build` → `public/` 전체를 `out/`로 복사 및 정적 사이트 빌드

## 추가 확인사항

### Netlify 빌드 설정 확인

`netlify.toml` 또는 Netlify 대시보드에서 빌드 설정 확인:

```toml
[build]
  command = "npm run build"
  publish = "out"
```

- `publish = "out"`: 올바름 ✅
- `command = "npm run build"`: prebuild, build, postbuild 순서대로 실행됨 ✅

### 캐시 무효화

변경 후에도 이전 버전이 보인다면:
1. Netlify에서 캐시 클리어 및 재배포
2. CDN 캐시 무효화
3. 브라우저 캐시 삭제 (Ctrl+Shift+R / Cmd+Shift+R)

## 테스트 계획

1. **로컬 테스트**:
   ```bash
   npm run build
   ls -la out/sitemap.xml out/rss.xml out/robots.txt
   cat out/sitemap.xml | head -20
   ```

2. **배포 후 검증**:
   ```bash
   curl https://invest.advenoh.pe.kr/sitemap.xml
   curl https://invest.advenoh.pe.kr/rss.xml
   ```
   - sitemap.xml이 200 응답하는지 확인
   - 도메인이 `invest.advenoh.pe.kr`인지 확인
   - 최신 블로그 포스트가 포함되어 있는지 확인

## 결론

현재 문제는 **Next.js Static Export의 빌드 프로세스 타이밍**으로 인해 발생합니다. `postbuild`에서 생성된 파일들이 `out/` 디렉토리에 포함되지 않아 배포되지 않는 것이 원인입니다.

**해결**: sitemap, RSS, robots.txt 생성을 `prebuild` 단계로 이동하여 Next.js 빌드 시 자동으로 `out/`에 포함되도록 변경합니다.
