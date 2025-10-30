# Sitemap Changefreq 최적화

## 개요
sitemap.xml의 changefreq 값을 콘텐츠 특성에 맞게 최적화하여 검색 엔진 크롤링 효율성을 개선합니다.

## 배경
현재 모든 블로그 포스트가 `changefreq: weekly`로 설정되어 있으나, 실제 콘텐츠 업데이트 빈도와 맞지 않습니다. 콘텐츠 유형에 따라 적절한 changefreq를 설정하여 검색 엔진에게 더 정확한 크롤링 힌트를 제공해야 합니다.

## 요구사항

### 변경 규칙
sitemap.xml의 각 URL에 대해 다음 규칙을 적용합니다:

1. **홈페이지** (`https://investment.advenoh.pe.kr`)
   - changefreq: `daily`
   - 이유: 최신 포스트 목록이 자주 업데이트되는 메인 페이지

2. **Weekly 카테고리** (URL path에 `/weekly/` 포함)
   - changefreq: `weekly`
   - 예시: `https://investment.advenoh.pe.kr/weekly/2024-investment-summary`
   - 이유: 주간 단위로 정기적으로 발행되는 콘텐츠

3. **기타 모든 페이지** (etc, etf, stock, series 등)
   - changefreq: `monthly`
   - 예시:
     - `https://investment.advenoh.pe.kr/etc/asset-management-abbreviations`
     - `https://investment.advenoh.pe.kr/stock/apple-stock-analysis`
     - `https://investment.advenoh.pe.kr/etf/spy-overview`
     - `https://investment.advenoh.pe.kr/series`
   - 이유: 한 번 작성 후 수정이 드문 정적 콘텐츠

### 기대 효과
- 검색 엔진이 중요한 페이지(홈페이지)를 더 자주 크롤링
- Weekly 콘텐츠는 적절한 주기로 재크롤링
- 정적 콘텐츠는 불필요한 크롤링 감소로 크롤링 버킷 최적화

## 관련 문서
- 구현 가이드: [1_sitemap_changefreq_implementation.md](1_sitemap_changefreq_implementation.md)
- 작업 체크리스트: [1_sitemap_changefreq_todo.md](1_sitemap_changefreq_todo.md)

## 참고사항

### Changefreq 값의 의미
- `daily`: 매일 업데이트되는 페이지
- `weekly`: 주간 단위로 업데이트되는 페이지
- `monthly`: 월간 단위로 업데이트되는 페이지

### 검색 엔진 동작
- changefreq는 힌트일 뿐, 검색 엔진이 반드시 따라야 하는 것은 아님
- 실제 콘텐츠 변경 빈도와 일치하는 것이 중요
- lastmod 날짜와 함께 크롤링 우선순위 결정에 활용

### Priority 값 (현재 유지)
- 홈페이지: 1.0
- 최근 포스트 (30일 이내): 0.9
- 일반 포스트: 0.8
- Series 페이지: 0.7
