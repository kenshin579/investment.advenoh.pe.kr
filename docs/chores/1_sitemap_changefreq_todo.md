# Sitemap Changefreq 구현 TODO

## Phase 1: 코드 수정
- [x] `scripts/generateSitemap.ts` 파일 열기
- [x] `determineChangefreq()` 함수 추가
- [x] `staticPages` 배열의 changefreq를 함수 호출로 변경
- [x] `postUrls` 매핑에서 changefreq를 함수 호출로 변경
- [x] TypeScript 타입 체크 (`npm run check`)

## Phase 2: 테스트
- [x] `npm run build` 실행
- [x] `public/sitemap.xml` 파일 생성 확인
- [x] 홈페이지 changefreq가 `daily`인지 확인
- [x] Weekly 포스트 changefreq가 `weekly`인지 확인
- [x] 기타 포스트 changefreq가 `monthly`인지 확인
- [x] XML 포맷 유효성 검증

## Phase 3: 배포
- [ ] Git 커밋 (Korean commit message 형식)
- [ ] Git 푸시
- [ ] 배포 후 실제 사이트 sitemap.xml 확인
