# 이미지 로딩 실패 버그

## 증상 요약

개별 블로그 포스트 페이지에서 이미지가 "이미지를 불러올 수 없습니다" 오류 메시지와 함께 표시되지 않음

### 재현
- 포스트 상세 페이지(`/stock/essential-corporate-news-analysis-for-investors/`) 접근
- 마크다운 내 이미지 렌더링 실패
- 오류 메시지: "이미지를 불러올 수 없습니다"
- 실제 경로: `/contents/stock/essential-corporate-news-analysis-for-investors/image-20250927202615775.png`
- HTTP 상태: 404 Not Found

## 근본 원인 분석

### 1. 이미지 파일 위치

**원본 파일 존재 확인**:
```bash
# contents/ (마크다운 원본)
✅ contents/stock/essential-corporate-news-analysis-for-investors/image-*.png

# public/contents/ (Next.js 서빙용)
❌ public/contents/stock/essential-corporate-news-analysis-for-investors/image-*.png

# 결론: 이미지가 복사되지 않음
```

**실제 파일 구조**:
- `contents/stock/essential-corporate-news-analysis-for-investors/image-*.png` (원본 존재)
- 브라우저 요청 경로: `/contents/stock/essential-corporate-news-analysis-for-investors/image-*.png`
- 실제 서빙 경로: `public/` 디렉토리

### 2. Next.js Static Export 동작

**Next.js 빌드 과정**:
```
빌드 프로세스:
1. public/ 디렉토리 내용을 out/ 디렉토리로 복사
2. 정적 페이지 빌드 및 HTML 생성
3. out/ 디렉토리를 웹 서버로 제공
```

**현재 문제점**:
- Next.js는 `public/` 디렉토리만 정적 파일로 서빙
- `contents/` 디렉토리는 빌드 프로세스에 포함되지 않음
- 따라서 이미지가 `public/contents/`에 복사되어야 접근 가능

### 3. 이미지 경로 처리 로직

**MarkdownImage 컴포넌트** ([src/components/markdown-image.tsx:13-45](src/components/markdown-image.tsx#L13-L45)):
```typescript
export function MarkdownImage({ src, alt, title, slug, category }: MarkdownImageProps) {
  const [currentSrc, setCurrentSrc] = useState(() => {
    let imageSrc = src;
    
    // 상대 경로 이미지 처리
    if (slug && !src.startsWith('/') && !src.startsWith('http')) {
      let categoryDir = 'stock'; // default
      if (category) {
        // category에 따라 디렉토리 결정
        categoryDir = category.toLowerCase();
      }
      
      // /contents/{category}/{slug}/{image} 형태로 변환
      imageSrc = `/contents/${categoryDir}/${slug}/${src}`;
    }
    
    return imageSrc;
  });
  
  // 오류 발생 시 대체 경로 시도
  const handleError = () => {
    // 다른 카테고리 경로들을 순차적으로 시도
    const alternatives = [
      ...otherCategories.map(cat => `/contents/${cat}/${slug}/${src}`),
      `/contents/${src}`,
    ];
    // ...
  };
}
```

**동작 방식**:
1. 마크다운에서 `![alt](image.png)` 형태로 상대 경로 이미지 참조
2. MarkdownImage가 `/contents/{category}/{slug}/image.png` 경로로 변환
3. 브라우저가 해당 경로 요청
4. **문제**: `public/contents/` 디렉토리에 파일이 없어 404 오류

### 4. 빌드 스크립트 구조

**package.json scripts** ([package.json:6-14](package.json#L6-L14)):
```json
{
  "scripts": {
    "dev": "next dev",
    "prebuild": "npx tsx scripts/generateStaticData.ts",
    "build": "next build",
    "postbuild": "npx tsx scripts/generateSitemap.ts && ...",
    "start": "npx serve out"
  }
}
```

**generateStaticData.ts** ([scripts/generateStaticData.ts:278-328](scripts/generateStaticData.ts#L278-L328)):
```typescript
async function copyImages(contentDir: string = 'contents'): Promise<void> {
  console.log('\n📸 Copying images from contents/ to public/contents/...\n');
  
  const imageExtensions = /\.(png|jpe?g|gif|webp|svg|ico)$/i;
  
  // contents/ 디렉토리를 순회하며 이미지 파일 복사
  for (const category of categories) {
    for (const folder of folders) {
      const files = await readdir(folderPath);
      const imageFiles = files.filter(file => imageExtensions.test(file));
      
      if (imageFiles.length > 0) {
        const targetDir = join('public', 'contents', category, folder);
        await mkdir(targetDir, { recursive: true });
        
        for (const imageFile of imageFiles) {
          const sourcePath = join(folderPath, imageFile);
          const targetPath = join(targetDir, imageFile);
          await copyFile(sourcePath, targetPath);
        }
      }
    }
  }
}
```

### 5. 근본 원인

**🔴 핵심 문제**:
```
npm run dev는 prebuild 훅을 실행하지 않음
→ generateStaticData.ts의 copyImages() 함수가 실행되지 않음
→ public/contents/ 디렉토리에 이미지가 복사되지 않음
→ 브라우저가 이미지 요청 시 404 오류
```

**실행 흐름 비교**:
```
# 프로덕션 빌드 (정상 동작)
npm run build
→ prebuild 실행 (generateStaticData.ts)
→ copyImages() 실행
→ public/contents/에 이미지 복사
→ next build
→ out/contents/에 이미지 포함
→ ✅ 이미지 정상 로딩

# 개발 서버 (문제 발생)
npm run dev
→ prebuild 실행 안 됨
→ copyImages() 실행 안 됨
→ public/contents/에 이미지 없음
→ next dev 실행
→ ❌ 404 Not Found
```

## 해결 방법

### 방법 1: 개발 서버 시작 전 수동 실행 (즉시 해결)

```bash
# 이미지 복사 스크립트 수동 실행
npx tsx scripts/generateStaticData.ts

# 개발 서버 시작
npm run dev
```

**장점**:
- 즉시 해결 가능
- package.json 수정 불필요

**단점**:
- 매번 개발 시작 시 수동 실행 필요
- 새 이미지 추가 시 다시 실행 필요

### 방법 2: predev 스크립트 추가 (권장)

**package.json 수정**:
```json
{
  "scripts": {
    "predev": "npx tsx scripts/generateStaticData.ts",
    "dev": "next dev",
    "prebuild": "npx tsx scripts/generateStaticData.ts",
    "build": "next build",
    "postbuild": "npx tsx scripts/generateSitemap.ts && npx tsx scripts/generateRssFeed.ts && npx tsx scripts/generateRobots.ts",
    "start": "npx serve out"
  }
}
```

**장점**:
- `npm run dev` 실행 시 자동으로 이미지 복사
- 개발자 경험 향상
- 일관된 워크플로우

**단점**:
- 개발 서버 시작 시간 증가 (약 1-2초)
- 이미지가 많을 경우 복사 시간 증가

### 방법 3: Watch 모드 구현 (고급)

**scripts/watchImages.ts** (새 파일 생성):
```typescript
import { watch } from 'fs';
import { copyFile } from 'fs/promises';
import { join } from 'path';

// contents/ 디렉토리 감시
watch('contents', { recursive: true }, async (eventType, filename) => {
  if (filename && /\.(png|jpe?g|gif|webp|svg)$/i.test(filename)) {
    // 이미지 파일 변경 감지 시 public/contents/로 복사
    const sourcePath = join('contents', filename);
    const targetPath = join('public', 'contents', filename);
    
    try {
      await copyFile(sourcePath, targetPath);
      console.log(`📸 Copied: ${filename}`);
    } catch (error) {
      console.error(`Failed to copy ${filename}:`, error);
    }
  }
});
```

**package.json**:
```json
{
  "scripts": {
    "predev": "npx tsx scripts/generateStaticData.ts",
    "dev": "npx tsx scripts/watchImages.ts & next dev",
    "prebuild": "npx tsx scripts/generateStaticData.ts",
    "build": "next build"
  }
}
```

**장점**:
- 이미지 변경 시 자동 복사
- 최적의 개발 경험
- Hot reload와 잘 동작

**단점**:
- 추가 파일 생성 필요
- Watch 프로세스 관리 필요

### 방법 4: 심볼릭 링크 사용 (개발 전용, 비권장)

```bash
# public/contents를 contents로 심볼릭 링크
ln -s ../../contents public/contents
```

**경고**: 
- ❌ 프로덕션 배포 시 문제 발생 가능
- ❌ Windows 환경 호환성 문제
- ❌ Git 저장소에 커밋 시 혼란 야기
- **사용하지 말 것**

## 권장 해결책

**✅ 최종 권장 방안**: **방법 2 (predev 스크립트 추가)**

**적용 순서**:
1. package.json에 `predev` 스크립트 추가
2. 기존 public/contents/ 디렉토리 삭제 (선택사항)
3. `npm run dev` 실행하여 자동 복사 확인
4. 브라우저에서 이미지 로딩 확인

**구현 코드**:
```json
{
  "scripts": {
    "predev": "npx tsx scripts/generateStaticData.ts",
    "dev": "next dev",
    "prebuild": "npx tsx scripts/generateStaticData.ts",
    "build": "next build",
    "postbuild": "npx tsx scripts/generateSitemap.ts && npx tsx scripts/generateRssFeed.ts && npx tsx scripts/generateRobots.ts",
    "start": "npx serve out"
  }
}
```

## 검증 방법

### 1. 이미지 복사 확인

```bash
# 스크립트 실행
npx tsx scripts/generateStaticData.ts

# 복사된 이미지 확인
ls -la public/contents/stock/essential-corporate-news-analysis-for-investors/

# 예상 출력:
# image-20250927202615775.png
# image-20250927202633959.png
```

### 2. 개발 서버 테스트

```bash
# 개발 서버 시작
npm run dev

# 브라우저에서 접근
# http://localhost:3000/stock/essential-corporate-news-analysis-for-investors/

# 이미지 URL 직접 접근 테스트
# http://localhost:3000/contents/stock/essential-corporate-news-analysis-for-investors/image-20250927202615775.png
```

### 3. 프로덕션 빌드 테스트

```bash
# 프로덕션 빌드
npm run build

# out/ 디렉토리 확인
ls -la out/contents/stock/essential-corporate-news-analysis-for-investors/

# 로컬 서버 시작
npm run start

# 브라우저에서 확인
# http://localhost:3000/stock/essential-corporate-news-analysis-for-investors/
```

## 추가 개선사항

### 1. 이미지 최적화 고려

**현재**: 원본 이미지를 그대로 복사
**개선**: 빌드 시 이미지 최적화 (WebP 변환, 압축)

```typescript
// scripts/generateStaticData.ts에 추가
import sharp from 'sharp';

async function optimizeImages() {
  // PNG/JPEG → WebP 변환
  // 이미지 압축
  // Responsive 이미지 생성 (1x, 2x)
}
```

### 2. 캐싱 전략

**netlify.toml**:
```toml
[[headers]]
  for = "/contents/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 3. 이미지 경로 검증

**MarkdownImage 개선**:
```typescript
// 개발 모드에서 경로 문제 조기 감지
if (process.env.NODE_ENV === 'development') {
  if (!imageSrc.startsWith('/contents/')) {
    console.warn(`⚠️ Unexpected image path: ${imageSrc}`);
  }
}
```

## 참고 자료

- [Next.js Static Export 문서](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [npm scripts hooks](https://docs.npmjs.com/cli/v10/using-npm/scripts#pre--post-scripts)
- [scripts/generateStaticData.ts](../scripts/generateStaticData.ts)
- [src/components/markdown-image.tsx](../src/components/markdown-image.tsx)

---

**작성일**: 2025-10-19  
**문서 버전**: 1.0  
**상태**: ✅ 해결 방법 확인됨  
**우선순위**: High  
**카테고리**: Bug / Development Experience
