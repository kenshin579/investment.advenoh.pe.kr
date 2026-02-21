# JEPI vs JEPQ 차이점 블로그 포스트 작성 PRD

## 1. 개요

### 1.1 목적

JEPI(JPMorgan Equity Premium Income ETF)와 JEPQ(JPMorgan Nasdaq Equity Premium Income ETF)의 차이점을 체계적으로 비교 분석하는 블로그 포스트를 작성한다. 월배당 커버드콜 ETF에 관심 있는 한국 투자자가 자신에게 맞는 ETF를 선택할 수 있도록 돕는다.

### 1.2 배경

- JEPI와 JEPQ는 세계 1, 2위 커버드콜 ETF로, 합산 AUM이 약 780억 달러에 달함
- 월배당 인컴 ETF에 대한 한국 투자자의 관심이 지속적으로 증가하는 추세
- 두 ETF가 동일한 JP모건 ELN(Equity-Linked Notes) 전략을 사용하지만, 기초 자산과 포트폴리오 구성이 크게 달라 성과와 리스크 특성이 상이함
- 투자자들이 JEPI에서 JEPQ로 자금을 이동하는 트렌드가 뚜렷하여 비교 분석의 시의성이 높음

---

## 2. 작업 범위

### 2.1 생성 파일

| 파일 경로 | 설명 |
|-----------|------|
| `contents/etf/jepi-vs-jepq-comparison/index.md` | 블로그 포스트 본문 |

### 2.2 이미지 (선택)

필요 시 `public/contents/etf/jepi-vs-jepq-comparison/` 경로에 이미지를 추가한다.

---

## 3. Frontmatter 정의

```yaml
---
title: "JEPI vs JEPQ 완벽 비교 — 월배당 커버드콜 ETF, 어떤 것을 선택할까?"
description: "세계 1, 2위 커버드콜 ETF인 JEPI와 JEPQ의 투자 전략, 포트폴리오 구성, 배당수익률, 총수익률, 리스크를 비교 분석하고 투자자 유형별 선택 가이드를 제시합니다."
date: 2026-02-21
update: 2026-02-21
category: ETF
tags:
  - JEPI
  - JEPQ
  - 커버드콜
  - 월배당
  - ETF
  - 배당투자
  - ELN
  - 옵션프리미엄
  - S&P500
  - 나스닥100
  - 인컴투자
  - JP모건
---
```

---

## 4. 콘텐츠 목차 구조

### 4.1 최종 목차

```markdown
# 1. 개요
- JEPI와 JEPQ란 무엇인가
- 왜 이 두 ETF를 비교해야 하는가
- 이 글에서 다루는 범위

# 2. 기본 정보 비교
## 2.1 ETF 개요 (설정일, AUM, 보수율, 벤치마크)
## 2.2 운용사와 상품 구조

# 3. 투자 전략 — ELN 기반 커버드콜
## 3.1 커버드콜 전략이란
## 3.2 ELN(Equity-Linked Notes) 구조
## 3.3 일반 커버드콜 ETF(QYLD 등)와의 차이
## 3.4 옵션 프리미엄과 배당금의 관계

# 4. 포트폴리오 구성 차이
## 4.1 JEPI — S&P 500 기반 균등 분산
## 4.2 JEPQ — Nasdaq-100 기반 빅테크 집중
## 4.3 섹터 배분 비교
## 4.4 상위 보유 종목 비교
(비교표)

# 5. 배당 수익률 비교
## 5.1 현재 배당수익률 (후행 12개월, 30일 SEC)
## 5.2 월배당 내역 분석 (2025년 기준)
## 5.3 배당금 변동성과 예측 가능성
(비교표, 월배당 추이)

# 6. 총수익률 비교
## 6.1 연도별 수익률 (2022~2025)
## 6.2 연환산 수익률 (1년, 3년, 설정 이후)
## 6.3 벤치마크(VOO, QQQ) 대비 성과
(비교표)

# 7. 리스크 비교
## 7.1 변동성 (월간 표준편차)
## 7.2 최대 낙폭(MDD)
## 7.3 벤치마크 대비 변동성 감소 효과
## 7.4 커버드콜 전략의 구조적 리스크
(비교표)

# 8. 한국 투자자를 위한 세금 가이드
## 8.1 배당소득세 (미국 원천징수 + 국내 과세)
## 8.2 금융소득종합과세 주의사항
## 8.3 양도소득세
## 8.4 절세 전략 (ISA, 연금저축, IRP)

# 9. 국내 상장 커버드콜 ETF와 비교
## 9.1 JEPI/JEPQ 대안 — 주요 국내 상장 커버드콜 ETF
## 9.2 세금 구조 비교 (국내 상장 vs 미국 직접 투자)
## 9.3 국내 상장 ETF의 장단점
## 9.4 어떤 방식이 유리한가 — 투자 규모별 판단 기준
(비교표)

# 10. JEPI vs JEPQ 핵심 비교 요약
(종합 비교표)

# 11. 투자자 유형별 선택 가이드
## 11.1 JEPI가 적합한 투자자
## 11.2 JEPQ가 적합한 투자자
## 11.3 두 ETF 조합 전략
(Mermaid 다이어그램 — 투자자 유형별 의사결정 플로우)

# 12. 마무리

# 13. 참고
```

---

## 5. 핵심 데이터 (리서치 결과)

### 5.1 기본 정보

| 항목 | JEPI | JEPQ |
|------|------|------|
| 정식명칭 | JPMorgan Equity Premium Income ETF | JPMorgan Nasdaq Equity Premium Income ETF |
| 설정일 | 2020년 5월 20일 | 2022년 5월 3일 |
| 운용자산(AUM) | 약 441.5억 달러 | 약 339.3억 달러 |
| 총보수 | 0.35% | 0.35% |
| 벤치마크 | S&P 500 Total Return Index | Nasdaq-100 Index |
| 보유 종목 수 | 약 126개 | 약 108개 |
| 현재 주가 | 약 $59.49 | 약 $58.15 |

### 5.2 배당 수익률

| 항목 | JEPI | JEPQ |
|------|------|------|
| 후행 12개월 배당수익률 | 7.97% | 10.56% |
| 30일 SEC 수익률 | 8.13% | 11.58% |
| 월배당 범위 (2025년) | $0.33~$0.54 | $0.44~$0.62 |

### 5.3 총수익률 (배당 재투자 포함)

| 연도 | JEPI | JEPQ |
|------|------|------|
| 2023 | 9.83% | 36.25% |
| 2024 | 12.56% | 24.85% |
| 설정 이후 연환산 | 12.26% | 15.96% |

### 5.4 리스크 지표

| 항목 | JEPI | JEPQ |
|------|------|------|
| 변동성(월간 표준편차) | 2.64~3.1% | 4.2~4.63% |
| 최대 낙폭(MDD) | -13.71% | -20.07% |
| 벤치마크 대비 변동성 감소 | 약 34% | 약 26% |

### 5.5 섹터 배분

| 섹터 | JEPI | JEPQ |
|------|------|------|
| 정보기술(IT) | 13.8% | 41.8% |
| 산업재 | 13.1~15.4% | 2.8% |
| 헬스케어 | 12.1% | 4.1% |
| 금융 | 14.4% | 0.5% |
| 커뮤니케이션서비스 | - | 12.7% |
| 임의소비재 | - | 11.2% |

### 5.6 국내 상장 커버드콜 ETF (9장 데이터)

#### JEPI 대안 — S&P 500/배당주 기반

| ETF명 | 종목코드 | 운용사 | 기초지수 | 총보수 | 목표 분배율 | 분배주기 |
|-------|---------|--------|---------|--------|-----------|---------|
| TIGER 미국배당+7%프리미엄다우존스 | 458760 | 미래에셋 | DJ US Dividend 100 7% Premium CC | 0.39% | 연 ~10% | 월배당 |
| TIGER 미국배당다우존스타겟데일리커버드콜 | 0008S0 | 미래에셋 | DJ US Dividend 100 10% Daily Premium CC | 0.25% | 연 12% | 월배당 |
| KODEX 미국S&P500배당귀족커버드콜(합성 H) | 276970 | 삼성자산운용 | S&P 500 Dividend Aristocrats CC (7.2%) | 0.30% | 연 7.2% | 분기배당 |
| ACE 미국500 15%프리미엄분배(합성) | 480030 | 한국투자신탁운용 | Bloomberg US 500 Decrement 15% | 0.45% | 연 15% | 월배당 |

#### JEPQ 대안 — 나스닥/테크 기반

| ETF명 | 종목코드 | 운용사 | 기초지수 | 총보수 | 목표 분배율 | 분배주기 |
|-------|---------|--------|---------|--------|-----------|---------|
| TIGER 미국나스닥100커버드콜(합성) | 441680 | 미래에셋 | Cboe NASDAQ-100 BuyWrite V2 | 0.37% | 연 ~12% | 월배당 |
| TIGER 미국테크TOP10+10%프리미엄 | 474220 | 미래에셋 | Bloomberg US Tech Top10+10% Premium CC | 0.50% | 연 10% | 월배당 |
| ACE 미국빅테크7+15%프리미엄분배(합성) | 480020 | 한국투자신탁운용 | 매그니피센트7 기반 CC | 0.45% | 연 15% | 월배당 |

#### 국내 상장 vs 미국 직접 투자 — 세금 구조 비교

| 구분 | 국내 상장 해외주식형 ETF | 미국 상장 ETF (JEPI/JEPQ) |
|------|----------------------|--------------------------|
| 매매차익 과세 | 배당소득세 15.4% | 양도소득세 22% (250만원 공제) |
| 분배금 과세 | 배당소득세 15.4% | 미국 원천징수 15% |
| 금융소득종합과세 | 해당 (2,000만원 초과 시) | 해당 없음 (분리과세) |
| ISA 계좌 | 가능 (비과세/9.9% 분리과세) | 불가 |
| 연금저축/IRP | 가능 (3.3~5.5% 연금소득세) | 불가 |

#### 커버드콜 전략 유형 분류

- **월간 ATM 커버드콜**: 매월 ATM 콜옵션 100% 매도. 가장 높은 프리미엄, 상승 수혜 제한 (예: TIGER 441680)
- **타겟 커버드콜**: 연간 목표 프리미엄만큼만 옵션 매도. 기초자산 상승 일부 참여 가능 (예: TIGER 458760, KODEX 483290)
- **데일리 커버드콜**: 매일 단기 옵션 매도로 프리미엄 누적 (예: ACE 480030, TIGER 0008S0)

---

## 6. 논의사항

### 6.1 블로그 글 톤앤매너

- 투자 초보자도 이해할 수 있는 수준으로 작성하되, 데이터와 수치를 근거로 제시
- ELN/커버드콜 같은 전문 용어는 처음 등장 시 쉽게 풀어서 설명

### 6.2 데이터 시점

- 주가, 배당금 등 수치 데이터는 "2026년 2월 기준"으로 명시
- 데이터 출처를 참고 섹션에 기재

### 6.3 다이어그램 활용

- **ELN 구조**: 커버드콜 전략의 작동 흐름 (Mermaid flowchart)
- **섹터 비교**: JEPI vs JEPQ 섹터 배분 차이 (표 또는 Mermaid pie chart)
- **투자자 의사결정 플로우**: 투자자 유형에 따른 JEPI/JEPQ 선택 가이드 (Mermaid flowchart)

### 6.4 추가 검토 필요 사항

- [x] ~~한국에서 JEPI/JEPQ를 직접 매수하는 방법~~ → 제외 (증권사에서 매수하면 되므로 별도 설명 불필요)
- [x] 국내 상장 커버드콜 ETF 비교 → **포함** (9장에 추가)
- [x] 2026년 세법 변경사항 → 제외 (JEPI/JEPQ 관련 2026년 특별한 세법 변경 없음. 기존 과세 체계 유지)

---

## 7. 콘텐츠 작성 규칙

### 7.1 Heading 스타일

프로젝트 규칙에 따라 `#`(H1)부터 시작하는 계층 구조를 따른다.

```markdown
# 1. 대제목
## 1.1 중제목
### 1.1.1 소제목
```

### 7.2 다이어그램

ASCII art를 사용하지 않고 반드시 Mermaid 코드 블록을 사용한다. 이모지 금지.

다이어그램 삽입이 필요한 곳:
- **3장**: ELN 기반 커버드콜 전략 흐름도
- **10장**: 투자자 유형별 의사결정 플로우

### 7.3 비교표

각 장에서 JEPI vs JEPQ 데이터를 마크다운 테이블로 비교한다.

### 7.4 용어 표기

- 영문 약어를 처음 사용할 때 한글(영문) 형태로 표기: `주가연계증권(Equity-Linked Notes, ELN)`
- 이후 재등장 시 한글 또는 약어만 사용

### 7.5 인코딩

- UTF-8 인코딩 필수
- 파일 생성 후 `file -I` 명령으로 인코딩 검증

### 7.6 이모지

- 블로그 본문, 테이블, 다이어그램에 이모지 사용 금지

---

## 8. 작업 단계

### 8.1 사전 준비

- [ ] GitHub 이슈 생성
- [ ] feature 브랜치 생성: `feature/{이슈번호}-jepi-vs-jepq-comparison`

### 8.2 콘텐츠 작성

- [ ] `docs/start/jepi-vs-jepq-comparison/index.md` 초안 작성
- [ ] frontmatter 작성
- [ ] 1~3장 작성 (개요, 기본 정보, 투자 전략)
- [ ] 4~5장 작성 (포트폴리오 구성, 배당수익률)
- [ ] 6~7장 작성 (총수익률, 리스크)
- [ ] 8장 작성 (세금 가이드)
- [ ] 9장 작성 (국내 상장 커버드콜 ETF 비교)
- [ ] 10~11장 작성 (핵심 비교 요약, 투자자 선택 가이드)
- [ ] 12~13장 작성 (마무리, 참고)
- [ ] Mermaid 다이어그램 삽입 (3장, 11장)

### 8.3 검증

- [ ] UTF-8 인코딩 확인: `file -I docs/start/jepi-vs-jepq-comparison/index.md`
- [ ] heading 스타일 규칙 준수 확인
- [ ] `npm run build` 정상 동작
- [ ] `npm run start` 후 로컬에서 포스트 렌더링 확인
- [ ] Mermaid 다이어그램 정상 렌더링 확인
- [ ] 한글 텍스트 깨짐 없는지 확인
- [ ] 이모지 미사용 확인

### 8.4 PR 생성

- [ ] feature 브랜치에 커밋
- [ ] PR 생성 (reviewer: kenshin579)

---

## 9. 참고 자료

### 9.1 데이터 출처

- [Stock Analysis - JEPI vs JEPQ Comparison](https://stockanalysis.com/etf/compare/jepi-vs-jepq/)
- [JP Morgan JEPI Fact Sheet](https://am.jpmorgan.com/content/dam/jpm-am-aem/americas/us/en/literature/fact-sheet/etfs/FS-JEPI.PDF)
- [JP Morgan JEPQ Fact Sheet](https://am.jpmorgan.com/content/dam/jpm-am-aem/americas/us/en/literature/fact-sheet/etfs/FS-JEPQ.PDF)
- [PortfoliosLab - JEPI vs JEPQ](https://portfolioslab.com/tools/stock-comparison/JEPI/JEPQ)
- [Stock Analysis - JEPI Dividend History](https://stockanalysis.com/etf/jepi/dividend/)
- [Stock Analysis - JEPQ Dividend History](https://stockanalysis.com/etf/jepq/dividend/)
- [FinanceCharts - JEPI Total Return](https://www.financecharts.com/etfs/JEPI/performance/total-return)
- [FinanceCharts - JEPQ Total Return](https://www.financecharts.com/etfs/JEPQ/performance/total-return)
- [ETF.com - Investors Pivot to JEPQ](https://www.etf.com/sections/features/investors-pivot-jepq-returns-outpace-jepi)

### 9.2 프로젝트 내부 참고

- 콘텐츠 heading 스타일 규칙: `docs/done/2_content_prd.md`
- Mermaid 다이어그램 지원: `docs/done/2_mermaid_prd.md`
- 기존 ETF 블로그 포스트: `contents/etf/` 디렉토리 참고
