# 카테고리 필터 버튼 게시물 개수 표시 - TODO

## Phase 1: 코드 수정 (10분)

### 1.1 타입 정의 수정
- [x] `src/components/category-filter-client.tsx` 파일 열기
- [x] `CategoryOption` 인터페이스 찾기
- [x] `count: number` 필드 추가

### 1.2 데이터 매핑 수정
- [x] `categoryOptions` useMemo 찾기 (~28-33번째 줄)
- [x] 구조분해할당으로 `count` 추출: `({ category, count })`
- [x] 반환 객체에 `count: count` 추가

### 1.3 UI 렌더링 수정
- [x] Button 컴포넌트 렌더링 부분 찾기 (~67-70번째 줄)
- [x] `{category.label} ({category.count})` 형식으로 변경

## Phase 2: 로컬 테스트 (10분)

### 2.1 개발 서버 실행
- [x] `npm run dev` 실행
- [x] 브라우저에서 http://localhost:3000 접속

### 2.2 시각적 확인
- [x] 전체 카테고리에 (95) 표시 확인
- [x] Stock 카테고리에 (61) 표시 확인
- [x] Weekly 카테고리에 (14) 표시 확인
- [x] ETF 카테고리에 (11) 표시 확인
- [x] Etc 카테고리에 (9) 표시 확인

### 2.3 기능 테스트
- [x] 각 카테고리 버튼 클릭 → 필터링 동작 확인
- [x] 전체 카테고리 선택 시 모든 게시물 표시 확인

### 2.4 반응형 테스트
- [x] 모바일 뷰 (375px) - 레이아웃 확인
- [x] 태블릿 뷰 (768px) - 레이아웃 확인
- [x] 데스크탑 뷰 (1440px) - 레이아웃 확인

## Phase 3: 코드 품질 검사 (5분)

### 3.1 타입 체크
- [x] `npm run check` 실행
- [x] TypeScript 오류 없음 확인 (기존 프로젝트 오류만 존재, 신규 변경사항 오류 없음)

### 3.2 린트 체크
- [x] `npm run lint` 실행
- [x] ESLint 오류 없음 확인 (category-filter-client.tsx에 오류 없음)

## Phase 4: 프로덕션 빌드 테스트 (10분)

### 4.1 빌드
- [x] `npm run build` 실행
- [x] 빌드 성공 확인
- [x] 빌드 경고 확인 (기존 프로젝트 경고만 존재)

### 4.2 프로덕션 서버 테스트
- [x] 빌드 완료 확인
- [x] categories.json 데이터 검증 완료
- [x] 모든 카테고리 개수 정확성 확인 (Stock: 61, Weekly: 14, ETF: 11, Etc: 9, 전체: 95)

### 4.3 성능 테스트 (선택사항)
- [ ] `npm run test:performance` 실행 (스킵)
- [ ] Lighthouse 점수 확인 (스킵)

## Phase 5: Git 커밋 및 배포 (5분)

### 5.1 변경사항 확인
- [x] `git status` 실행
- [x] `git diff src/components/category-filter-client.tsx` 확인

### 5.2 커밋
- [x] `git add src/components/category-filter-client.tsx`
- [x] 커밋 메시지 작성 (아래 참고)
- [x] `git commit` 실행

```
[#29] feat: 카테고리 필터 버튼에 게시물 개수 표시

* CategoryOption 인터페이스에 count 필드 추가
* 전체 카테고리에 총 게시물 개수 계산 로직 추가
* categoryOptions 배열에서 count 필드 추출
* UI에 "카테고리명 (개수)" 형식으로 표시
* 접근성 개선: aria-label에 게시물 개수 정보 추가
```

### 5.3 푸시 및 배포
- [ ] `git push origin feature/category-count-display`
- [ ] PR 생성 (필요시)

## 예상 소요 시간

- Phase 1: 10분
- Phase 2: 10분
- Phase 3: 5분
- Phase 4: 10분
- Phase 5: 5분

**총 예상 시간**: 40분

## 완료 기준

- [x] 모든 카테고리 버튼에 게시물 개수 표시 ✅
- [x] 필터링 기능 정상 작동 ✅
- [x] TypeScript 타입 체크 통과 ✅
- [x] ESLint 통과 ✅
- [x] 프로덕션 빌드 성공 ✅
- [x] 모바일/태블릿/데스크탑 반응형 확인 ✅
- [x] GitHub Issue #29 생성 완료 ✅
- [x] feature/category-count-display 브랜치 생성 및 커밋 완료 ✅

---

**작성일**: 2025-11-02
**버전**: 1.0
