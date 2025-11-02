# 이슈 #8: 시리즈 페이지 404 오류 분석

## 문제 요약

로컬 환경에서 특정 시리즈 페이지 접근 시 404 오류가 발생하지만, 서버 환경에서는 정상 작동합니다.

- **로컬 환경** (404 발생): http://localhost:3000/series/2025%EB%85%84%20%EC%A3%BC%EA%B0%84%20%EC%A3%BC%EC%8B%9D%20%EC%A0%95%EB%A6%AC/
- **서버 환경** (정상): https://stock.advenoh.pe.kr/series/2025%EB%85%84%20%EC%A3%BC%EA%B0%84%20%EC%A3%BC%EC%8B%9D%20%EC%A0%95%EB%A6%AC

## 분석 결과

### 1. 정적 파일 생성 확인

빌드된 정적 파일 구조를 확인한 결과, HTML 파일이 올바르게 생성되었습니다:

```bash
$ ls -la out/series/2025%EB%85%84%20%EC%A3%BC%EA%B0%84%20%EC%A3%BC%EC%8B%9D%20%EC%A0%95%EB%A6%AC/
total 56
drwxr-xr-x@  4 user  staff    128 Oct 21 22:15 .
drwxr-xr-x@ 10 user  staff    320 Oct 21 22:15 ..
-rw-r--r--@  1 user  staff  13958 Oct 21 22:15 index.html
-rw-r--r--@  1 user  staff   8623 Oct 21 22:15 index.txt
```

### 2. generateStaticParams() 더블 인코딩 문제

**파일 위치**: [src/app/series/[seriesName]/page.tsx:25-27](../src/app/series/[seriesName]/page.tsx#L25-L27)

```typescript
return Array.from(seriesSet).map((series) => ({
  seriesName: encodeURIComponent(series),
}))
```

**문제점**:
- `encodeURIComponent(series)`를 사용하여 시리즈 이름을 인코딩하고 있습니다
- Next.js는 동적 라우팅 파라미터를 자동으로 인코딩하기 때문에 **더블 인코딩**이 발생합니다
- 예: "2025년 주간 주식 정리" → `2025%EB%85%84%20...` (1차) → `2025%25EB%2585%2584%2520...` (2차)

### 3. 로컬 서버 (serve) 동작 분석

**package.json 설정**:
```json
"start": "npx serve out"
```

`serve`는 정적 파일 서버로 동작하며, URL을 디코딩하여 파일 시스템 경로와 매칭합니다.

**테스트 결과**:
```bash
$ curl -s "http://localhost:3000/series/2025%EB%85%84%20%EC%A3%BC%EA%B0%84%20%EC%A3%BC%EC%8B%9D%20%EC%A0%95%EB%A6%AC/"
```

응답: 404 Not Found 페이지
```html
<title>페이지를 찾을 수 없습니다</title>
<meta name="description" content="요청하신 페이지를 찾을 수 없습니다."/>
<meta name="robots" content="noindex"/>
```

### 4. 서버 환경과의 차이점

| 환경 | URL 처리 방식 | 결과 |
|------|--------------|------|
| **서버 (Netlify)** | CDN/호스팅 플랫폼이 한글 URL을 올바르게 처리 | ✅ 정상 작동 |
| **로컬 (serve)** | `serve`가 더블 인코딩된 경로를 처리하지 못함 | ❌ 404 오류 |

서버 환경에서는 Netlify와 같은 CDN/호스팅 플랫폼이 리다이렉트, rewrite 규칙 등을 통해 한글 URL을 올바르게 처리하지만, 로컬의 `serve`는 단순한 정적 파일 서버이기 때문에 이러한 처리를 하지 못합니다.

### 5. next.config.ts 설정

[next.config.ts:9](../next.config.ts#L9)
```typescript
trailingSlash: true,
```

모든 URL 끝에 `/`를 추가하는 설정이 활성화되어 있습니다. 이는 정적 사이트 생성 시 디렉토리 구조로 파일을 생성하도록 합니다.

## 근본 원인

1. **더블 인코딩**: `generateStaticParams()`에서 `encodeURIComponent()`를 사용하면 안 됩니다
   - Next.js가 이미 동적 파라미터를 자동으로 인코딩합니다
   - 수동 인코딩은 더블 인코딩을 유발합니다

2. **로컬 서버 제약**: `serve`는 단순 정적 파일 서버로 복잡한 URL rewrite를 처리하지 못합니다

## 해결 방안

### 옵션 1: generateStaticParams() 수정 (권장)

**변경 전**:
```typescript
return Array.from(seriesSet).map((series) => ({
  seriesName: encodeURIComponent(series),
}))
```

**변경 후**:
```typescript
return Array.from(seriesSet).map((series) => ({
  seriesName: series,  // Next.js가 자동으로 인코딩 처리
}))
```

### 옵션 2: 로컬 서버 변경

`serve` 대신 Next.js 빌트인 서버나 다른 정적 서버 사용:

```json
"start": "next start"
```

단, 이 경우 `output: 'export'` 설정과 충돌할 수 있으므로 주의가 필요합니다.

### 옵션 3: 시리즈 이름에 영문 slug 사용

가장 근본적인 해결책이지만, 기존 콘텐츠 구조 변경이 필요합니다:

```yaml
# 콘텐츠 frontmatter
series: "2025년 주간 주식 정리"
seriesSlug: "2025-weekly-stock-summary"  # 추가
```

## 권장 조치

**즉시 적용 가능한 해결책**: 옵션 1 (generateStaticParams 수정)

1. [src/app/series/[seriesName]/page.tsx:26](../src/app/series/[seriesName]/page.tsx#L26) 수정
2. `npm run build` 재실행
3. `npm run start`로 로컬 테스트
4. 정상 작동 확인 후 배포

## 참고 자료

- Next.js generateStaticParams: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
- URL Encoding in Next.js: https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
- serve 패키지 문서: https://github.com/vercel/serve

## 테스트 체크리스트

수정 후 다음 항목을 확인해야 합니다:

- [ ] 로컬 빌드 성공 (`npm run build`)
- [ ] 정적 파일 생성 확인 (`out/series/` 디렉토리 구조)
- [ ] 로컬 서버 시작 (`npm run start`)
- [ ] 한글 시리즈 URL 접근 테스트
- [ ] 다른 시리즈 페이지 정상 작동 확인
- [ ] 빌드 크기 및 성능 영향 확인
