# 구글 검색 결과 개선 - TODO

## Phase 1: Favicon 준비

- [x] 투자 관련 아이콘 디자인 방향 결정
  - 기존 favicon.ico 유지 (향후 업데이트 예정)
- [x] Favicon 파일 생성
  - [x] `favicon.ico` (기존 파일 유지)
  - [ ] `icon.png` (192x192 이상) - 향후 추가 예정
  - [ ] `apple-touch-icon.png` (180x180) - 향후 추가 예정
- [x] 파일을 `public/` 디렉토리에 배치

## Phase 2: 코드 구현

- [x] `src/app/layout.tsx` 수정
  - [x] metadata.title.default = "Frank's Investment Blog" 설정
  - [x] metadata.openGraph.siteName 설정
  - [x] metadata.icons 설정 (favicon, apple-touch-icon)
- [x] `src/lib/json-ld-schema.ts` 수정
  - [x] generateWebSiteSchema() 함수 업데이트
  - [x] name: "Frank's Investment Blog" 설정
  - [x] alternateName: "Frank's Investment Insights" 설정
- [x] `src/app/layout.tsx`에 WebSite schema 적용
  - [x] JSON-LD script 태그 추가

## Phase 3: 로컬 테스트

- [x] 빌드 및 실행
  - [x] `npm run build` 실행 - 성공
  - [x] `npm run start` 실행 - 성공
- [x] 브라우저 테스트
  - [x] og:site_name = "Frank's Investment Blog" 확인 완료
  - [x] JSON-LD Schema 확인 완료
- [x] 개발자 도구 확인
  - [x] 페이지 소스에서 JSON-LD 확인 - WebSite schema 정상
  - [x] metadata 태그 확인 - og:site_name 정상

## Phase 4: Google 검증

- [ ] Rich Results Test 실행
  - URL: https://search.google.com/test/rich-results
  - [ ] WebSite schema 인식 확인
  - [ ] 오류 없음 확인
- [ ] HTML 검증
  - [ ] favicon 경로 정상 확인
  - [ ] meta tags 정상 확인

## Phase 5: 배포 및 모니터링

- [ ] 프로덕션 배포
  - [ ] 코드 커밋 및 푸시
  - [ ] CI/CD 빌드 성공 확인
- [ ] 배포 후 확인
  - [ ] 실제 사이트에서 파비콘 확인
  - [ ] 페이지 소스 확인
- [ ] Google Search Console 모니터링
  - [ ] 1-2주 후 검색 결과 확인
  - [ ] `site:investment.advenoh.pe.kr` 검색으로 사이트 이름 확인

## 참고사항

- **예상 작업 시간**: 2-3시간 (Google 반영 시간 제외)
- **Google 반영 시간**: 1-2주 소요 가능
- **우선순위**: Phase 1-3 (High), Phase 4-5 (Medium-Low)
