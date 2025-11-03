# 콘텐츠 맞춤법 및 오타 수정 PRD

## 문서 정보
- **작성일**: 2025-11-04
- **작성자**: Claude Code Quality Analysis
- **문서 버전**: 1.0
- **대상 범위**: `contents/` 디렉토리 내 전체 마크다운 파일 (95개)

---

## 1. 프로젝트 개요

### 목적
투자 블로그 콘텐츠의 맞춤법, 문법, 띄어쓰기 오류를 체계적으로 수정하여 전문성과 신뢰도를 향상시킨다.

### 배경
- 총 95개의 마크다운 파일 분석 결과, **체계적인 오타**와 **띄어쓰기 오류** 발견
- 특히 세금 관련 전문 용어의 오타가 심각 (예: "원청징수" → "원천징수")
- 일관성 없는 띄어쓰기로 인한 가독성 저하

### 목표
1. **Critical 오류 100% 수정** (세금·금융 전문 용어)
2. **High Priority 오류 90% 이상 수정** (명확한 오타)
3. **Medium Priority 오류 70% 이상 수정** (띄어쓰기 일관성)
4. **장기적 품질 관리 체계 구축**

---

## 2. 발견된 이슈 분류

### 2.1 🔴 CRITICAL (즉시 수정 필요)

#### 세금 용어 오타
| 잘못된 표현 | 올바른 표현 | 영향도 | 발생 빈도 |
|------------|-----------|-------|---------|
| 원청징수 | 원천징수 | 매우 높음 | 7+ 회 |
| 금기 | 금리 | 매우 높음 | 2회 |

**영향 분석**:
- "원청징수"는 세금 관련 핵심 용어로 잘못 표기 시 전문성 신뢰도 하락
- "금기"는 "금리"와 완전히 다른 의미 (금기 = taboo, 금리 = interest rate)
- 재무 분야 독자에게 치명적인 신뢰도 손상 가능

**영향 받는 파일**:
```
etc/google-adsense-us-tax-info-entry/index.md (Line 74, 94)
stock/about-financial-investment-income-tax/index.md (Multiple lines)
weekly/2025-mar-week3-weekly-stock-sector-trend/index.md (Line 114 - 2 instances)
```

#### 기타 Critical 오타
| 잘못된 표현 | 올바른 표현 | 위치 | 우선순위 |
|------------|-----------|------|---------|
| 변동서이 | 변동성이 | weekly/2025-mar-week3-weekly-stock-sector-trend/index.md:112 | CRITICAL |
| 수진 | 수신 | etc/google-adsense-us-tax-info-entry/index.md:94 | HIGH |
| 수진중이 | 수신 중지 | etc/google-adsense-us-tax-info-entry/index.md:94 | HIGH |

---

### 2.2 🟡 HIGH Priority (빠른 수정 권장)

#### 명확한 오타
| 잘못된 표현 | 올바른 표현 | 위치 | 수정 난이도 |
|------------|-----------|------|-----------|
| 있따 | 있다면 | etc/investment-quotes/index.md:24 | 쉬움 |
| 놓지지 | 놓치지 | etf/2024-etf-regular-investing-summary/index.md:50 | 쉬움 |
| 않아도된다 | 않아도 된다 | stock/isa-maturity-extension-or-termination-guide/index.md:89 | 쉬움 |

#### 띄어쓰기 오류 (고빈도)
| 패턴 | 올바른 표현 | 발생 빈도 | 영향 |
|------|-----------|---------|------|
| 것같다 | 것 같다 | 다수 | 가독성 저하 |
| 하지않 | 하지 않 | 다수 | 가독성 저하 |

---

### 2.3 🟢 MEDIUM Priority (점진적 개선)

#### 문체 일관성
| 이슈 | 현황 | 권장 사항 |
|------|------|---------|
| 존댓말/반말 혼용 | 블로그 전체에서 불일치 | 투자 블로그 특성상 존댓말 통일 권장 |
| 전문 용어 번역 | 일부 불일치 | 용어집 작성 및 표준화 |

#### 띄어쓰기 표준화
- "것 같다" (띄어쓰기 O) - 표준
- "하지 않다" (띄어쓰기 O) - 표준
- "때문이다" (붙여쓰기 O) - 현대 한국어에서 허용
- "할까요" (붙여쓰기 O) - 현대 한국어에서 허용

---

## 3. 수정 전략

### 3.1 단계별 접근

#### Phase 1: 긴급 수정 (1-2시간)
**목표**: Critical 오류 100% 제거

**작업 항목**:
1. **전역 Find & Replace**
   ```
   "원청징수" → "원천징수"
   "금기 발표" → "금리 발표"
   "금기는" → "금리는"
   "금기가" → "금리가"
   ```

2. **개별 파일 Critical 수정**
   - `weekly/2025-mar-week3-weekly-stock-sector-trend/index.md`
     - Line 112: "변동서이" → "변동성이"
     - Line 114: "금기" → "금리" (2곳)

   - `etc/google-adsense-us-tax-info-entry/index.md`
     - Line 74: "원청징수" → "원천징수"
     - Line 94: "우편 수진 중이에" → "우편 수신 중지에"

**검증 방법**:
```bash
# 수정 후 검증
grep -r "원청징수" contents/
grep -r "금기 " contents/ | grep -v "금기야"
grep -r "변동서이" contents/
```

---

#### Phase 2: 고우선순위 수정 (1일)
**목표**: High Priority 오류 90% 이상 수정

**작업 항목**:
1. **개별 오타 수정**
   - `etc/investment-quotes/index.md:24`: "있따면" → "있다면"
   - `etf/2024-etf-regular-investing-summary/index.md:50`: "놓지지" → "놓치지"
   - `stock/isa-maturity-extension-or-termination-guide/index.md:89`: "않아도된다" → "않아도 된다"

2. **고빈도 띄어쓰기 표준화**
   - 전역 검색 및 수정: "것같다" → "것 같다"
   - 전역 검색 및 수정: "하지않" → "하지 않"

**검증 스크립트**:
```bash
# 띄어쓰기 검증
grep -r "것같다" contents/
grep -r "하지않" contents/
```

---

#### Phase 3: 중장기 품질 개선 (1주일)
**목표**: 재발 방지 체계 구축

**작업 항목**:
1. **스타일 가이드 작성**
   - 문체 통일 방침 (존댓말/반말)
   - 띄어쓰기 규칙 정리
   - 예외 사항 문서화

2. **용어집 작성**
   - 한영 혼용 전문 용어 표준화
   - ETF, ISA, IRP 등 약어 정의
   - 일관된 번역 기준

3. **품질 관리 프로세스**
   - 발행 전 체크리스트 작성
   - 맞춤법 검사 도구 통합 (hunspell-ko 등)
   - 동료 리뷰 프로세스 구축

---

### 3.2 자동화 도구 활용

#### 권장 도구
1. **맞춤법 검사**: `hunspell-ko` (한국어 맞춤법 검사기)
2. **띄어쓰기 검사**: `py-hanspell` (네이버 맞춤법 검사기 API)
3. **린트 통합**: Pre-commit hook으로 자동 검사

#### 자동화 스크립트 예시
```bash
#!/bin/bash
# scripts/spell-check.sh

# 한국어 맞춤법 검사
find contents -name "*.md" -exec hunspell -d ko_KR -l {} \;

# 특정 오타 패턴 검사
grep -r "원청징수\|것같다\|하지않" contents/ && echo "오타 발견!"
```

---

## 4. 수정 상세 계획

### 4.1 Critical 수정 목록

| 순번 | 파일 경로 | 라인 | 현재 텍스트 | 수정 텍스트 | 비고 |
|-----|---------|-----|-----------|-----------|------|
| 1 | etc/google-adsense-us-tax-info-entry/index.md | 74 | 원청징수 | 원천징수 | 전역 치환 가능 |
| 2 | stock/about-financial-investment-income-tax/index.md | Multiple | 원청징수 | 원천징수 | 전역 치환 가능 |
| 3 | weekly/2025-mar-week3-weekly-stock-sector-trend/index.md | 112 | 변동서이 | 변동성이 | 개별 수정 |
| 4 | weekly/2025-mar-week3-weekly-stock-sector-trend/index.md | 114 | 금기 | 금리 | 개별 수정 (2곳) |
| 5 | etc/google-adsense-us-tax-info-entry/index.md | 94 | 수진 중이 | 수신 중지 | 개별 수정 |

### 4.2 High Priority 수정 목록

| 순번 | 파일 경로 | 라인 | 현재 텍스트 | 수정 텍스트 | 난이도 |
|-----|---------|-----|-----------|-----------|--------|
| 1 | etc/investment-quotes/index.md | 24 | 있따 | 있다면 | 쉬움 |
| 2 | etf/2024-etf-regular-investing-summary/index.md | 50 | 놓지지 | 놓치지 | 쉬움 |
| 3 | stock/isa-maturity-extension-or-termination-guide/index.md | 89 | 않아도된다 | 않아도 된다 | 쉬움 |

---

## 5. 품질 메트릭

### 5.1 현재 상태
| 카테고리 | 점수 | 평가 |
|---------|------|------|
| 인코딩 품질 | 100% | ✅ 모든 파일 UTF-8 |
| Critical 오류 | ~10개 | ❌ 세금/금융 용어 오타 |
| High 오류 | ~15-20개 | ⚠️ 띄어쓰기, 오타 |
| 전체 가독성 | 85% | 🟡 양호하나 교정 필요 |
| 기술적 정확성 | 90% | ✅ 투자 개념 잘 설명됨 |

### 5.2 목표 상태 (수정 후)
| 카테고리 | 목표 | 기대 효과 |
|---------|------|----------|
| Critical 오류 | 0개 | 전문성 신뢰도 향상 |
| High 오류 | <5개 | 가독성 크게 개선 |
| 전체 가독성 | 95%+ | 독자 만족도 증가 |
| 일관성 | 90%+ | 브랜드 이미지 강화 |

---

## 6. 리스크 및 고려사항

### 6.1 수정 시 주의사항
1. **의미 변경 방지**
   - 오타 수정 시 문맥상 의미가 바뀌지 않도록 주의
   - 특히 전문 용어는 원저자 의도 확인 필요

2. **일괄 치환 검증**
   - "금기" → "금리" 전역 치환 시 "금기야", "금기사항" 등 오검출 주의
   - 정규식 사용: `\b금기\s` (단어 경계 고려)

3. **백업 및 버전 관리**
   - 수정 전 git branch 생성
   - 수정 후 diff 검토

### 6.2 False Positive 가능성
| 패턴 | 주의사항 |
|------|---------|
| "것 같다" | "그것 같다"는 붙여쓰기 가능 (명사+같다) |
| "때문이다" | 현대 한국어에서 붙여쓰기 허용 |
| "할까요" | 의문형 어미는 붙여쓰기 표준 |

---

## 7. 실행 체크리스트

### Phase 1: 긴급 수정 (오늘)
- [ ] Git branch 생성: `fix/critical-spelling-errors`
- [ ] 전역 치환: "원청징수" → "원천징수"
- [ ] 개별 수정: weekly/2025-mar-week3 (변동서이, 금기)
- [ ] 개별 수정: etc/google-adsense (수진 → 수신)
- [ ] 검증 스크립트 실행
- [ ] Git commit 및 PR 생성

### Phase 2: 고우선순위 수정 (내일)
- [ ] 개별 오타 3건 수정 (있따, 놓지지, 않아도된다)
- [ ] 띄어쓰기 표준화: "것같다" → "것 같다"
- [ ] 띄어쓰기 표준화: "하지않" → "하지 않"
- [ ] 전체 파일 재검증
- [ ] Git commit 및 병합

### Phase 3: 장기 개선 (이번 주)
- [ ] 스타일 가이드 초안 작성
- [ ] 용어집 초안 작성 (상위 20개 전문 용어)
- [ ] 맞춤법 검사 도구 선정 및 테스트
- [ ] Pre-commit hook 스크립트 작성
- [ ] 문서화: docs/style-guide.md
- [ ] 문서화: docs/glossary.md

---

## 8. 성공 기준

### 정량적 기준
1. **Critical 오류**: 0건 (100% 수정)
2. **High Priority 오류**: ≤5건 (90%+ 수정)
3. **Medium Priority 오류**: ≤10건 (70%+ 수정)
4. **자동화 커버리지**: 상위 10개 오타 패턴 자동 검출

### 정성적 기준
1. **가독성**: 독자 피드백 긍정적 변화
2. **전문성**: 세금/금융 용어 정확도 100%
3. **일관성**: 문체 및 용어 사용 통일
4. **유지보수성**: 신규 콘텐츠 발행 전 자동 검사 가능

---

## 9. 타임라인

| 단계 | 기간 | 완료 기준 | 담당 |
|-----|------|----------|------|
| Phase 1: 긴급 수정 | 오늘 (2시간) | Critical 오류 0건 | Developer |
| Phase 2: 고우선순위 | 내일 (1일) | High Priority 90%+ 수정 | Developer |
| Phase 3: 체계 구축 | 이번 주 (5일) | 자동화 도구 통합 완료 | Developer + Editor |
| 모니터링 | 지속적 | 월간 품질 리포트 | Editor |

---

## 10. 참고 자료

### 한국어 맞춤법 기준
- 국립국어원 표준국어대사전: https://stdict.korean.go.kr/
- 한글 맞춤법: https://kornorms.korean.go.kr/

### 도구 및 라이브러리
- hunspell-ko: 한국어 맞춤법 검사기
- py-hanspell: 네이버 맞춤법 검사 API 래퍼
- VS Code Extension: Korean Spell Checker

### 금융 용어 참고
- 한국은행 경제금융용어: https://www.bok.or.kr/portal/singl/termSer/termSerList.do
- 금융감독원 금융용어사전

---

## 부록: 자주 틀리는 표현

### A. 세금 관련
| 잘못된 표현 | 올바른 표현 | 의미 |
|------------|-----------|------|
| 원청징수 | 원천징수 | Withholding tax |
| 양도세 | 양도소득세 | Capital gains tax |
| 배당세 | 배당소득세 | Dividend tax |

### B. 투자 관련
| 잘못된 표현 | 올바른 표현 | 의미 |
|------------|-----------|------|
| 금기 | 금리 | Interest rate |
| 변동서 | 변동성 | Volatility |
| 수진 | 수신 | Reception |

### C. 띄어쓰기
| 잘못된 표현 | 올바른 표현 | 규칙 |
|------------|-----------|------|
| 것같다 | 것 같다 | 의존명사 + 용언 |
| 하지않다 | 하지 않다 | 부정문 띄어쓰기 |
| 않아도된다 | 않아도 된다 | 보조용언 띄어쓰기 |

---

**문서 끝**

**다음 단계**: 이 PRD를 기반으로 실제 수정 작업 착수
