# Google Search Console 최적화 작업

## 작업 개요
robots.txt에서 구글 검색엔진이 인식하지 못하는 비표준 규칙 제거

## 문제점
- `Crawl-delay: 1` 속성이 robots.txt에 포함되어 있음
- Google은 Crawl-delay 지시어를 인식하지 못함 (Yandex, Bing 등 일부 검색엔진만 지원)
- 불필요한 규칙으로 인한 혼란 방지 필요

## 수행 작업

### 1. generateRobots.ts 스크립트 수정
**파일**: `scripts/generateRobots.ts`

**변경 내용**:
- `Crawl-delay: 1` 라인 제거
- 나머지 robots.txt 규칙은 유지

**변경 전**:
```typescript
const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Crawl-delay: 1

Sitemap: ${baseUrl}/sitemap.xml
...`;
```

**변경 후**:
```typescript
const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/

Sitemap: ${baseUrl}/sitemap.xml
...`;
```

### 2. robots.txt 재생성
**명령어**: `npx tsx scripts/generateRobots.ts`

**결과**: `public/robots.txt` 파일이 업데이트됨

### 3. 최종 robots.txt 내용
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/

Sitemap: https://investment.advenoh.pe.kr/sitemap.xml

# Host
Host: https://investment.advenoh.pe.kr

# Investment Insights Blog
# Professional financial blog about stocks, ETFs, bonds, and funds
```

## 검증 방법
1. Google Search Console에서 robots.txt 테스트
2. `https://investment.advenoh.pe.kr/robots.txt` 직접 확인
3. 크롤링 로그에서 에러 메시지 확인

## 참고 자료
- [Google robots.txt 사양](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt)
- [Crawl-delay는 Google에서 지원하지 않음](https://developers.google.com/search/blog/2008/03/how-to-change-crawl-rate)

## 후속 작업
- [ ] 배포 후 Google Search Console에서 robots.txt 재검증
- [ ] 크롤링 통계 모니터링 (크롤 속도 변화 확인)
