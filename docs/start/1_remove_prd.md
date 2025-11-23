# AdSense 코드 정리 작업 PRD

## 📋 개요

### 목적
Auto Ads 전환 이후 남아있는 불필요한 주석 및 레거시 코드를 정리하여 코드베이스를 깔끔하게 유지

### 배경
- **2025-11-17**: AdSense Auto Ads로 전환 완료 (커밋 4f47f7d)
  - `src/components/google-adsense.tsx` 컴포넌트 제거
  - 수동 광고 배치 코드 제거
  - Auto Ads 스크립트만 유지
- **2025-11-23**: AdSense 관련 문서 8개 제거 (커밋 68e51fe)
  - docs/done/ 및 docs/start/ 하위 문서 정리 완료

### 현재 상태
✅ **정리 완료**:
- GoogleAdSense 컴포넌트 제거됨
- 수동 광고 슬롯 코드 제거됨
- AdSense 관련 문서 제거됨

⚠️ **정리 필요**:
- 불필요한 주석 남아있음
- 현재 AdSense 구현 상태 문서화 필요

---

## 🎯 작업 범위

### Phase 1: 불필요한 주석 정리 ✅ 우선순위 높음

**위치**: `src/app/[category]/[slug]/page.tsx`

**작업 내용**:
1. Line 275의 주석 제거
   ```tsx
   {/* AdSense Auto Ads will automatically insert ads here */}
   ```

**이유**:
- Auto Ads는 자동으로 광고를 삽입하므로 특정 위치에 주석을 남길 필요 없음
- 주석이 오히려 혼란을 줄 수 있음 (수동 배치로 오해 가능)

### Phase 2: AdSense 구현 상태 문서화 ⚠️ 우선순위 중간

**작업 내용**:
1. `docs/done/` 디렉토리에 최종 구현 상태 문서 작성
2. 문서 제목: `adsense_auto_ads_final.md`
3. 포함 내용:
   - Auto Ads 구현 방식 설명
   - Publisher ID: `ca-pub-8868959494983515`
   - 구현 위치: `src/app/layout.tsx` (line 91-97)
   - 적용 전략: `afterInteractive`
   - 과거 변경 이력 요약

### Phase 3: 환경 변수 확인 (선택사항) 🟢 우선순위 낮음

**작업 내용**:
1. `.env.local` 또는 `.env.example` 파일 확인
2. AdSense 관련 환경 변수가 있는지 확인
3. 필요 없는 환경 변수 제거 또는 문서화

**현재 상태**:
- Grep 결과 AdSense 관련 환경 변수 사용 없음
- Publisher ID는 하드코딩되어 있음 (보안상 문제 없음 - 공개 ID)

---

## 📋 관련 문서

- **구현 내역**: [1_remove_implementation.md](./1_remove_implementation.md)
- **작업 Todo**: [1_remove_todo.md](./1_remove_todo.md)

---

## 🚨 주의사항

### 1. Publisher ID 보호
- Publisher ID (`ca-pub-8868959494983515`)는 공개 정보이므로 하드코딩해도 무방
- 민감 정보 아님 (웹사이트 소스 코드에서도 확인 가능)

### 2. Auto Ads 작동 확인
- 주석 제거 후에도 Auto Ads가 정상 작동하는지 확인 필수
- 광고가 자동으로 표시되지 않으면 AdSense 설정 확인

### 3. 빌드 검증
- 모든 변경 후 `npm run build` 실행하여 빌드 성공 확인
- TypeScript 타입 체크: `npm run check`

### 4. 기존 광고 성능 유지
- 변경 후 광고 표시 여부 및 성능 모니터링
- AdSense 대시보드에서 수익 변화 확인 (1-2일 후)


---

## 🔗 참고 자료

- [Google AdSense Auto Ads 가이드](https://support.google.com/adsense/answer/9261805)
- [Next.js Script 컴포넌트 문서](https://nextjs.org/docs/app/api-reference/components/script)
