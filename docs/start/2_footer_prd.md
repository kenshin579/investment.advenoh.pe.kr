# Footer 카테고리 표시 문제

## 문제
- Footer에 "카테고리가 없습니다" 표시됨
- 원인: 정적 사이트인데 `/api/categories` API 엔드포인트 호출 (동작 안 함)

## 해결 방안
- 빌드 시 생성된 정적 JSON 파일(`/data/categories.json`) 직접 사용
- API Routes 호출을 정적 파일 fetch로 변경

## 수정 대상
- `src/lib/blog-client.ts` - getAllCategoriesClient() 함수
- `src/components/footer.tsx` - fetch 로직
- `src/components/category-filter.tsx` - useQuery fetch URL

## 예상 결과
Footer에 실제 카테고리 표시:
- Stock (61)
- Weekly (14)
- ETF (11)
- Etc (9)
