# 구글 검색 결과 개선 PRD

## 프로젝트 개요

구글 검색 결과에서 investment.advenoh.pe.kr 사이트가 더 전문적이고 식별하기 쉽게 표시되도록 개선

## 현재 문제점

스크린샷 분석 결과:
- 사이트 이름: "advenoh.pe.kr"로 표시 (도메인 이름 그대로)
- 아이콘: 기본 파비콘 사용 (투자 블로그임을 나타내지 못함)
- 브랜딩: 사이트의 정체성이 명확하지 않음

## 목표

구글 검색 결과에서:
1. **사이트 이름**: "Frank's Investment Blog"로 표시
2. **아이콘**: 투자/금융 관련 커스텀 파비콘 표시
3. **브랜딩**: 전문적이고 식별 가능한 사이트 이미지 구축

## 요구사항

### 1. Favicon 변경
- **현재**: 기본 파비콘 또는 도메인 기본 아이콘
- **목표**: 투자/금융 관련 커스텀 아이콘
- **아이콘 디자인 옵션**:
  - 차트/그래프 심볼
  - 상승 화살표
  - 달러/원화 심볼
  - 주식 티커 심볼
- **기술 요구사항**:
  - 다양한 크기 지원 (16x16, 32x32, 192x192, 512x512)
  - Apple Touch Icon 지원
  - SVG 포맷 지원 (선택사항)

### 2. 사이트 이름 변경
- **현재**: "advenoh.pe.kr"
- **목표**: "Frank's Investment Blog"
- **적용 위치**:
  - 구글 검색 결과
  - 브라우저 탭
  - 소셜 미디어 공유
  - 북마크

### 3. Structured Data (JSON-LD) 구현
- WebSite schema 추가
- Organization schema 추가 (선택사항)
- 사이트 이름 명시적 정의

## 구현 및 진행사항

**구현 가이드**: [1_google_search_implementation.md](1_google_search_implementation.md)
**TODO 체크리스트**: [1_google_search_todo.md](1_google_search_todo.md)

## 성공 기준

**검색 결과에서 확인**:
- `site:investment.advenoh.pe.kr` 검색 시:
  - 사이트 이름: "Frank's Investment Blog" 표시
  - 커스텀 파비콘 표시
- 반영 시간: 구글 재크롤링 후 1-2주 소요

## 참고 자료

- [Google Search Central - Site Names](https://developers.google.com/search/docs/appearance/site-names)
- [Next.js Metadata - Icons](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons)
- [Schema.org WebSite](https://schema.org/WebSite)
- [Favicon Generator](https://realfavicongenerator.net/)
