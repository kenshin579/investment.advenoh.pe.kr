# sector-overview 산출물 검증

- 검증일: 2026-07-26
- 대상: `2026-07-26-sector-overview-raw.md` (320줄)
- 원칙: 출처를 확인하지 못한 수치는 블로그 글에 싣지 않는다
- 사용 도구: SEC EDGAR XBRL companyfacts API, EDGAR 원본 공시(10-Q / 8-K / 6-K), WebSearch, WebFetch
- 유료 커넥터(FactSet / Capital IQ / Daloopa) 미사용

## 판정 기준

| 판정 | 의미 |
|---|---|
| 일치 | 1차 또는 준1차 출처에서 동일한 값을 확인 |
| 근사 | 오차 5% 이내 또는 반올림 차이 |
| 불일치 | 출처의 값과 다르거나, 인용된 출처에 해당 수치가 존재하지 않음 |
| 출처확인불가 | 이번 검증에서 출처를 확인하지 못함 (미검증 포함) |

"항목"은 아래 검증표의 1행을 뜻한다. 한 행이 여러 개의 개별 수치를 묶는 경우가 있으므로 행 수와 개별 숫자 개수는 다르다. 각 행에 몇 개를 묶었는지는 비고에 적었다.

---

## 1. 검증 결과 — 시장 규모·성장률 (§2.1, §2.2)

| # | 항목 | 스킬이 제시한 값 | 확인된 값 | 출처 | 판정 |
|---|---|---|---|---|---|
| 1 | 2024 글로벌 반도체 매출 | $630.5B | $630.5B | SIA 2026-02 릴리스 (semiconductors.org, 검색 결과 본문) | 일치 |
| 2 | 2025 글로벌 반도체 매출 | $791.7B (+25.6%) | $791.7B, +25.6% | 동상 | 일치 |
| 3 | Q4 2025 매출 | $236.6B (+37.1% YoY, +13.6% QoQ) | $236.6B, +37.1% YoY, +13.6% QoQ | 동상 | 일치 |
| 4 | Q1 2026 매출 | +25% QoQ | +25% QoQ (SIA 릴리스 제목에 명시) | semiconductors.org/global-semiconductor-sales-increase-25-from-q4-2025-to-q1-2026/ | 일치 |
| 5 | WSTS Spring 2026 전망 | $1.51T (+90%) | USD 1.51조, "grow 90 percent in 2026" | wsts.org/76/103/ 원문 페치 | 일치 |
| 6 | WSTS 2027 전망 | ~$1.9T (+27%) | "approximately USD 1.9 trillion", 27% | 동상 | 일치 |
| 7 | WSTS Autumn 2025 전망 | $975B (+>25%) | 미확인 (PDF 원문 미검증) | — | 출처확인불가 |
| 8 | SIA 2026 전망 | "약 $1조" | "global sales in 2026 are projected to reach roughly $1 trillion" | SIA 릴리스 본문 | 일치 |
| 9 | IDC 2026 전망 | $1.29T (+52.8%) | 미확인 | — | 출처확인불가 |
| 10 | WSTS 2026 세그먼트 성장률 6종 | 메모리 +250%(>$800B), 로직 +37%, MPU +20%, 아날로그 +10%, 디스크리트 +8%, 센서·광전자 +3% | 전부 동일 | wsts.org/76/103/ 원문 페치 | 일치 (6개 수치) |
| 11 | WSTS 2026 지역별 성장률 4종 | 미주 +112%, 아태 +87%, 유럽 +58%, 일본 +28% | 전부 동일 | 동상 | 일치 (4개 수치) |

**소결.** §2.1~§2.2는 이번 검증에서 가장 상태가 좋은 구간이다. WSTS Spring 2026 원문 페이지를 직접 페치해 11개 수치가 전부 일치했다. SIA 원문은 HTTP 403이라 검색 결과 본문에 실린 인용으로 대조했고, 4개 수치가 전부 맞았다.

---

## 2. 검증 결과 — 산업 구조·점유율 (§2.4, §3.3)

| # | 항목 | 스킬이 제시한 값 | 확인된 값 | 출처 | 판정 |
|---|---|---|---|---|---|
| 12 | 파운드리 Q1 2026 상위 10사 점유율 | TSMC 72.3%, 삼성 6.5%, SMIC 5.1%, UMC 3.9%, GF 3.3%, 화홍 2.5%, Tower·Nexchip·VIS·PSMC 각 0.8% | 전부 동일 | TrendForce Q1 2026 (Semiecosystem / TelecomLead / EE Times Asia 재인용) | 일치 (10개 수치) |
| 13 | 상위 10 파운드리 Q1 2026 매출 | $47.95B (+3.7% QoQ) | US$47.95B, +3.7% QoQ | 동상 | 일치 |
| 14 | TSMC Q1 2026 파운드리 매출 | $35.86B | "nearly $35.86 billion" | Semiecosystem (TrendForce 인용) | 일치 |
| 15 | TSMC 파운드리 점유율 QoQ | 70.4% → 72.3% | 70.4% → 72.3% | 동상 | 일치 |
| 16 | **"TSMC 점유율 67.6% vs 72.3% 출처 충돌"** (`raw.md:89`) | 두 값 모두 TrendForce 인용, 차이는 "상위10사 기준 vs 전체 시장 기준"으로 추정 | **출처 충돌이 아니라 연도 오류.** 67.6%는 **Q1 2025** 수치 (TSMC 매출 $25.52B, 직전 분기 67.1%) | gulfnews.com 기사 원문 페치 | 불일치 |
| 17 | DRAM Q1 2026 매출·점유율 | 삼성 38.5%/$37.32B, SK하이닉스 28.8%/$27.98B, 마이크론 22.4%/$21.75B | 전부 동일 | TrendForce 20260601-13070 원문 페치 | 일치 (6개 수치) |
| 18 | DRAM 산업 Q1 2026 규모·성장 | +81% QoQ, 총 $97B "(+81% YoY)" | $97B, **+81% QoQ**. YoY 아님 | 동상 | 근사 (값 일치, QoQ/YoY 라벨 오류) |
| 19 | **SK하이닉스 DRAM 점유율 QoQ** | 32.9% → 28.8% (−4.1pt) | **32.1% → 28.8% (−3.3pt).** Q4 2025 SK하이닉스 $17.22B, 32.1% | TrendForce 20260226-12937 원문 페치 | 불일치 |
| 20 | 삼성 DRAM 점유율 QoQ | 36.5% → 38.5% (+2.0pt) | **36.0% → 38.5% (+2.5pt).** Q4 2025 삼성 $19.30B, 36% | 동상 | 불일치 |
| 21 | CXMT DRAM 점유율 3% → 8% | Counterpoint 인용 (X 게시물) | 미확인 | — | 출처확인불가 |

### 16번 상세 — 이번 검증의 두 번째 핵심 발견

`raw.md:89`는 이 차이를 "상위 10사만 vs IDM 파운드리 포함 전체 시장"의 정의 차이로 추정하고, 72.3%를 채택했다. **그 추정은 틀렸다.**

인용된 gulfnews 기사를 열어보면 첫 문장이 "TSMC ... growing its market share to 67.6 per cent in the first quarter of **this year**"이고, 같은 기사에 "TSMC's revenue declined by 5 per cent quarter-on-quarter to **$25.52 billion**", "market share still edged up from **67.1 per cent** in the previous quarter"가 나온다. TSMC의 Q1 2026 파운드리 매출은 $35.86B이므로 $25.52B는 Q1 2026이 아니다. **1년 전 기사다.**

문제는 이 gulfnews URL이 `raw.md`에서 세 곳의 출처로 쓰였다는 것이다.

- `raw.md:83` — §2.4 파운드리 Q1 2026 점유율 표 행
- `raw.md:193` — §3.3 "TSMC 70.4% → 72.3%" 행
- `raw.md:197` — §3.3 "China domestic — SMIC, CXMT" 행

세 곳 모두 **출처가 내용을 뒷받침하지 않는다.** 다만 72.3%라는 **값 자체는 맞다** — TrendForce Q1 2026 데이터를 인용한 별도 매체 3곳(Semiecosystem, TelecomLead, EE Times Asia)에서 교차 확인했다. 즉 수치는 살릴 수 있고 출처만 교체하면 된다.

부수적으로 정합성도 맞는다. TSMC $35.86B ÷ 72.3% = 전체 파운드리 시장 약 $49.6B이고, 상위 10사 합계 $47.95B는 그보다 작다. 모순 없다.

### 19번 상세 — "가장 놀라운 수치"의 실제 값

`raw.md:199`는 "DRAM 시장이 QoQ +81% 성장한 분기에 2위가 4.1pt를 잃었다"를 리포트에서 가장 놀라운 줄로 지목했다. 방향은 맞다. 하지만 **직전 분기 값이 틀렸다.**

- TrendForce Q1 2026 릴리스(20260601-13070)를 직접 페치했더니 **Q4 2025 점유율이 아예 실려 있지 않다.** `raw.md:194`가 이 URL을 출처로 달아둔 QoQ 비교값의 근거가 그 페이지에 없다.
- TrendForce Q4 2025 릴리스(20260226-12937)를 별도로 페치하니 SK하이닉스 Q4 2025는 **$17.22B, 점유율 32.1%**(QoQ −1.1pt), 삼성 **$19.30B, 36%**(+3.4pt), 마이크론 **$11.98B, 22.4%**(−3.3pt), 산업 전체 **$53.58B**(+29.4% QoQ)였다.
- 따라서 SK하이닉스 하락폭은 **3.3pt**(32.1 → 28.8)이지 4.1pt가 아니다. 삼성 상승폭은 **2.5pt**(36.0 → 38.5)이지 2.0pt가 아니다.

TrendForce가 공개한 Q1 2026 QoQ 성장률로 역산해도 같은 답이 나온다. 삼성 +93.4%, SK하이닉스 +62.5%, 마이크론 +81.6%, 산업 +81%를 대입하면 Q4 2025 점유율은 각각 36.0% / 32.1% / 22.3%다.

**32.9%라는 값의 출처는 끝내 찾지 못했다.** Q3 2025 SK하이닉스 점유율(33.2%)도 아니다.

블로그에 쓸 수 있는 형태로 정리하면 이렇다. **"DRAM 시장이 QoQ +81% 성장한 분기에 SK하이닉스는 +62.5% 성장에 그쳐 점유율을 3.3pt 잃었다"** — 이건 TrendForce 1차 릴리스 두 건으로 뒷받침된다. 4.1pt는 쓰면 안 된다.

---

## 3. 검증 결과 — 세속적 동인 (§2.5)

| # | 항목 | 스킬이 제시한 값 | 확인된 값 | 출처 | 판정 |
|---|---|---|---|---|---|
| 22 | **2026 하이퍼스케일러 capex** | **약 $600B (+70% YoY)**, 출처 Sourceability | **인용 출처에 해당 수치가 존재하지 않음.** 타 출처는 $630B~$725B(+77%) | 아래 상세 | **불일치** |
| 23 | 하이퍼스케일 분기 capex $100B 최초 돌파(Q3 2025) | 출처 Sourceability | 인용 출처에 없음. 별도 확인 시 Synergy Research는 Q3 2025 하이퍼스케일 capex **$142B**(+약 180% YoY) 보고 | DataCenterDynamics / TechAfrica(Synergy 인용) | 근사 |
| 24 | IDC 2026 데이터센터 반도체 매출 $477.1B | — | 미확인 | — | 출처확인불가 |
| 25 | TrendForce Q2 2026 DRAM 계약가 +58~63%, NAND +70~75% | — | 미확인 | — | 출처확인불가 |
| 26 | 2026 HBM 출하 300억 Gb 초과 | — | 미확인 | — | 출처확인불가 |
| 27 | Broadcom FY26 AI 반도체 $56B / FY27 $100B 초과 | — | $56B(전년비 약 +180%), Hock Tan "in excess of $100 billion" | Broadcom Q2 FY26 어닝콜 (Benzinga·TechTimes 등 복수 보도) | 일치 |
| 28 | TI Q2 2026 아날로그 $4.37B(+26%), 임베디드 $788M(+16%), GM +340bp QoQ | — | 미확인 | — | 출처확인불가 |
| 29 | SEMI 총 장비 매출 2026 $139B / 2027 $156B | — | SEMI 릴리스 제목에 $139B(2026), $156B(2027) 명시 | semi.org 릴리스 2건 (제목 확인, 본문은 403) | 일치 |
| 30 | **SEMI WFE 2026 +9.0% → $135.2B** | — | **총 장비 $139B와 정합 불가.** WFE는 총 장비의 부분집합인데 $135.2B는 $139B의 97%다. 나머지(조립·테스트)에 $3.8B밖에 남지 않는다 | 검색 결과 본문 대조 | 불일치 |
| 31 | SEMI 300mm 팹 장비 2026 +18% → $133B | — | 미확인 | — | 출처확인불가 |

### 22번 상세 — 이번 검증의 최대 발견

런로그가 우선순위 1번으로 지목한 항목이다. 결론부터: **인용된 출처에 그 수치가 없다.**

`raw.md:93` 원문:

> Hyperscale capex exceeded $100B in a single quarter for the first time in Q3 2025; 2026 hyperscaler capex is reported at approximately $600B, +70% YoY ([Sourceability](https://sourceability.com/post/semiconductor-industry-outlook-for-2026-shows-rebound-amid-mergers)).

이 URL을 두 가지 방법으로 확인했다.

1. WebFetch: "2026 하이퍼스케일러 capex에 대한 언급 없음"
2. curl로 원문 HTML을 직접 받아(HTTP 200, 97,823바이트) 태그 제거 후 14,353자 본문에서 `hyperscal`, `capex`, `capital expenditure`, `600`, `70%`, `100 billion` 전수 검색

본문에서 `hyperscal`은 메모리 가격 문맥에서 1회("that figure skews heavily toward high-priced memory products for AI hyperscalers"), `capex`는 정성적 서술 1회("This translates to sustained capex increases both at the leading edge of memory as well as areas like advanced packaging and power/thermal management")만 나온다. **달러 금액도, 증가율도 없다.**

값 자체도 맞지 않는다. 독립 출처들의 2026년 하이퍼스케일러 capex 추정은 이렇다.

| 출처 | 값 | 범위 정의 |
|---|---|---|
| Tom's Hardware | $725B (+77% YoY, 2025년 $410B 기준) | Google·Microsoft·Meta·Amazon |
| valueaddvc | Amazon $200B, Google $185B, Meta $125B, Microsoft $120B (합계 $630B) | 빅4 가이던스 합산 |
| datacenterrichness | $630B | 하이퍼스케일러 |
| CNBC | "approaches $700 billion" | 빅테크 |
| CreditSights 인용 | $700B~$900B | Amazon·Microsoft·Alphabet·Meta·Oracle 5사 |

관측된 범위는 **$630B~$900B**다. $600B는 이 범위 아래에 있다. 증가율도 맞지 않는다. 2025년 빅4 실적 $410B를 기준으로 하면 $600B는 +46%이지 +70%가 아니고, +70%를 적용하면 약 $697B가 나온다. 즉 **값과 증가율이 서로도 정합하지 않는다.**

23번(분기 $100B 최초 돌파)은 인용 출처에는 없지만 별도로 뒷받침된다. Synergy Research는 **Q3 2025 하이퍼스케일 운영사 capex를 $142B**로 보고했다(21개 글로벌 하이퍼스케일 사업자 기준, YoY 약 +180%). $100B 초과는 사실이나 "최초"인지는 확인하지 못했고, `raw.md`가 단 출처는 이 내용을 담고 있지 않다.

**블로그 인용 확률이 가장 높은 헤드라인 수치가, 출처를 열어보니 그 출처에 없었다.** 이것이 이번 프로젝트에서 가장 중요한 사례다.

---

## 4. 검증 결과 — 기업 재무 §3.1 (SEC EDGAR 1차 대조)

`data.sec.gov/api/xbrl/companyfacts` 로 14개 미국 신고사의 XBRL 팩트를 받아, `raw.md` 표에 적힌 분기 종료일과 정확히 일치하는 duration 팩트를 뽑아 대조했다. 이상 3건은 EDGAR 원본 10-Q 손익계산서와 주석까지 열었다.

### 4.1 재현 가능한 조회 명령

```bash
curl -s -H "User-Agent: kenshin579@gmail.com" \
  "https://data.sec.gov/api/xbrl/companyfacts/CIK0001045810.json"
```

CIK: NVDA 0001045810 / AVGO 0001730168 / MU 0000723125 / INTC 0000050863 / AMD 0000002488 / QCOM 0000804328 / AMAT 0000006951 / LRCX 0000707549 / TXN 0000097476 / ADI 0000006281 / KLAC 0000319201 / NXPI 0001413447 / MRVL 0001835632 / ON 0001097864 / TSM 0001046179 / GFS 0001709048 / MCHP 0000827054

### 4.2 결과

| # | 항목 | 스킬이 제시한 값 | 확인된 값 | 출처 | 판정 |
|---|---|---|---|---|---|
| 32 | 14개사 매출 | 표 참조 | **14개사 전부 EDGAR 값과 동일** | 각사 10-Q XBRL | 일치 (14개 수치) |
| 33 | 14개사 YoY 성장률 | 표 참조 | **14개사 전부 재계산 결과 동일** (직전 연도 동일 분기 대비) | 동상 | 일치 (14개 수치) |
| 34 | 매출총이익률 12개사 | 표 참조 | **12개사 전부 GrossProfit ÷ Revenue와 동일** | 동상 | 일치 (12개 수치) |
| 35 | 영업이익률 11개사 (NXP·ON 제외) | 표 참조 | **11개사 전부 OperatingIncomeLoss ÷ Revenue와 동일** | 동상 | 일치 (11개 수치) |
| 36 | 순이익 13개사 | 표 참조 | **13개사 전부 동일** (KLAC 1,200 → 실제 1,200.99, MRVL 34 → 34.5, ON −34 → −33.4은 반올림) | 동상 | 일치 (13개 수치) |
| 37 | ON 영업이익률 | −3.6% | **−3.5%** (−53.4 ÷ 1,513.3 = −3.529%) | ON 10-Q, accn 0001097864-26-000014 | 근사 |
| 38 | **NXP Q1 2026 영업이익률 47.3%** | 47.3% | **GAAP상 정확하나 일회성 이익 포함.** 경상 기준 **27.8%** | 아래 상세 | 일치 (단, 비교 불가) |
| 39 | **INTC 영업이익 +$1,796M / 순손실 −$11,033M** | 그대로 | **정확. 원인은 미 정부 Escrowed Shares 파생부채 평가손 $12,529M** | 아래 상세 | 일치 |
| 40 | **QCOM 순이익 $7,370M > 영업이익 $2,309M** | "대규모 영업외 이익 추정" | **정확. 원인은 영업외 이익이 아니라 이연법인세 평가충당금 환입 $5.7B** | 아래 상세 | 일치 (원인 진단은 오류) |
| 41 | AVGO 순이익 "not retrieved" | 미기재 | **$9,310M — 회수 가능했음.** XBRL `ProfitLoss` 태그, 8-K 보도자료 첫 줄에도 명시 | AVGO 8-K accn 0001730168-26-000051 EX-99.1 | 불일치(누락) |
| 42 | QCOM 매출총이익률 "not retrieved" | 미기재 | **53.8% — 계산 가능.** `CostOfRevenue` $4,900M 존재 | QCOM 10-Q accn 0000804328-26-000061 | 불일치(누락) |
| 43 | KLAC 매출총이익률·영업이익률 "not retrieved" | 미기재 | **매출총이익률 61.1% 계산 가능** (`CostOfRevenue` $1,327.672M 존재) | KLAC 10-Q accn 0000319201-26-000016 | 불일치(누락) |
| 44 | Broadcom Q2 FY26 AI 매출 $10.8B "custom AI (XPU)" | XPU 매출로 표기 | **$10.8B는 "semiconductor revenue from AI" 전체**(커스텀 가속기 + AI 네트워킹). XPU 단독 아님 | AVGO 8-K EX-99.1 | 불일치(라벨 오류) |
| 45 | NVIDIA 데이터센터 $75B(+92%), Hyperscale $38B / ACIE $37B | 그대로 | 데이터센터 **$75.2B(+92%)**, Hyperscale **$37.9B**, ACIE **$37.4B** | NVIDIA Q1 FY27 IR 릴리스 | 근사 |
| 46 | Micron FQ3 FY26 매출총이익률 84.6% / 영업이익률 80.4% | 그대로 | GrossProfit 35,056 ÷ 41,456 = 84.56%, OperatingIncome 33,318 ÷ 41,456 = 80.37% | MU 10-Q accn 0000723125-26-000015 | 일치 |

### 38번 상세 — NXP 영업이익률 47.3%

런로그 우선순위 2번. **숫자는 맞고, 해석이 위험하다.**

NXP Q1 2026 10-Q(accession `0001413447-26-000034`) 손익계산서 원문:

```
Revenue                                              3,181
Cost of revenue                                     (1,393)
Gross profit                                         1,788
Research and development                              (588)
Selling, general and administrative                   (284)
Amortization of acquisition-related intangibles        (32)
Total operating expenses                              (904)
Other income (expense)                                 621
Operating income (loss)                              1,505
```

영업이익 $1,505M은 GAAP상 정확하다. 다만 그 안에 **"Other income (expense) +$621M"**이 들어 있고, 주석(Acquisitions and Divestments)이 그 정체를 밝힌다.

> On February 2, 2026, we completed the sale of our MEMS Sensors business ... pursuant to the definitive agreement with STMicroelectronics International N.V. This resulted in a **gain on sale of $627 million** recorded in "Other income (expense)".

즉 **STMicroelectronics에 MEMS 센서 사업부를 매각한 일회성 차익 $627M**이 영업이익 라인 안에 들어가 있다.

- 매각차익 제외 시: (1,788 − 904) ÷ 3,181 = **27.8%**
- 전년 동기(Q1 2025): (1,560 − 855 + 18) ÷ 2,835 = **25.5%**

스킬의 플래그("비경상 항목이 포함됐을 수 있다")는 방향이 맞았다. 하지만 **확인하지 않았고, 표에는 47.3%를 그대로 실었다.** 이 표는 14개사 영업이익률 피어 비교표다. NXP만 매각차익이 들어간 값으로 나란히 놓이면 비교가 성립하지 않는다. NXP는 표에서 두 번째로 높은 영업이익률(마이크론 80.4% 다음)로 보이지만, 실제로는 TI 42.3% / ADI 38.1%보다 낮다.

**블로그 판정: 47.3%는 쓰지 않는다. 27.8%를 쓰거나, "일회성 매각차익 포함" 단서를 반드시 붙인다.**

### 39번 상세 — Intel 영업이익 흑자에 순손실 $11.0B

런로그 우선순위 3번. Intel Q2 2026 10-Q(accession `0000050863-26-000157`) 손익계산서 원문:

```
Net revenue                                         16,128
Gross profit                                         6,509
Operating expenses                                   4,713
Operating income (loss)                              1,796
Gains (losses) on equity investments, net              (39)
Interest and other, net                            (12,576)
Income (loss) before taxes                         (10,819)
Provision for (benefit from) taxes                      29
Net income (loss)                                  (10,848)
Less: net income (loss) attributable to NCI            185
Net income (loss) attributable to Intel            (11,033)
```

$12,576M 손실의 내역은 주석 5(Other Financial Statement Details)에 있다.

| (백만 달러) | Q2 2026 |
|---|---|
| 이자수익 | 334 |
| 이자비용 | (321) |
| **Escrowed Shares 시가평가 손익** | **(12,529)** |
| 기타, 순액 | (60) |
| 합계 | **(12,576)** |

Escrowed Shares는 주석 4에 설명돼 있다.

> Per the terms of our previously-disclosed U.S. Government Agreement that we entered into with the DOC on August 22, 2025 ... we recognized **$12.5 billion** ... of losses related to the net change in fair value of both Escrowed Shares released and Escrowed Shares still held in escrow at June 27, 2026. The fair value of the Escrowed Shares derivative liability was **$15.6 billion at June 27, 2026 and $2.7 billion at December 27, 2025**.

즉 **CHIPS Act 보조금을 미 정부 지분으로 전환하면서 에스크로에 넣어둔 주식이 파생부채로 잡혀 있고, 그 부채를 시가평가하면서 생긴 비현금 손실**이다. 부채가 Intel 주식으로 결제되는 구조이므로 **Intel 주가가 오를수록 부채가 커지고 손실이 커진다.** 6개월 만에 $2.7B → $15.6B로 불어났다.

배경도 확인했다. 2025-08-22 합의로 미 정부는 $8.9B(잔여 CHIPS 보조금 $5.7B + Secure Enclave $3.2B)를 주당 $20.47에 Intel 보통주 4억 3,330만 주로 전환해 9.9% 지분을 취득했다. 이 중 2억 7,460만 주는 상무부에 직접 교부, **1억 5,870만 주는 에스크로**에 들어가 Secure Enclave 자금 집행에 따라 순차 해제된다. 별도로 주당 $20에 5%를 추가 매수할 수 있는 워런트(10-Q 기준 2억 4,100만 주)도 부여됐다.

`raw.md`는 §2.6에서 "미 정부가 9.9% 무의결권 지분 보유"를 적고, §3.1에서 $11.0B 순손실을 따로 플래그했지만 **둘을 연결하지 못했다.** 같은 문서 안에 원인과 결과가 따로 놓여 있었다.

**블로그 판정: 수치 3개 모두 사용 가능하되, "영업은 흑자인데 미 정부 지분 관련 파생부채 평가손 $12.5B로 순손실"이라는 설명을 반드시 붙인다.** 설명 없이 "Intel 분기 순손실 $11B"만 쓰면 영업 부진으로 오독된다.

### 40번 상세 — Qualcomm 순이익이 영업이익보다 큰 이유

런로그 우선순위 4번. `raw.md:166`의 진단은 **"This implies a large below-the-line gain in FQ2 FY26"**이었다. 원본을 열어보니 **영업외 이익이 아니었다.**

QCOM FQ2 FY26 10-Q(accession `0000804328-26-000061`):

- 영업이익 $2,309M
- **세전이익 $2,232M** — 영업이익보다 **낮다**
- 법인세: **$(5,138)M — 비용이 아니라 환입**
- 순이익 $7,370M

주석 3(Income Taxes) 원문:

> In the second quarter of fiscal 2026, the U.S. Department of Treasury and the Internal Revenue Service issued Notice 2026-07, which ... allows us to reduce CAMT by certain previously capitalized domestic R&D expenditures. As a result, we no longer expect to be subject to CAMT in the foreseeable future ... we released our valuation allowance on our federal deferred tax assets resulting in a **$5.7 billion income tax benefit** in the second quarter of fiscal 2026.
>
> Our effective tax rate for the second quarter of fiscal 2026 was **230% benefit**.

FY2025 4분기에 OBBB(One Big Beautiful Bill Act) 때문에 설정했던 $5.7B 평가충당금을, IRS Notice 2026-07로 CAMT 적용이 해제되면서 환입한 것이다. **비현금 이연법인세 항목이다.**

손익계산서의 법인세 라인은 $(5,138)M이고 주석이 밝힌 평가충당금 환입은 $5.7B이다. 두 값의 차이 약 $562M은 같은 분기의 통상 법인세 비용이 환입액을 일부 상쇄한 결과다.

스킬은 이상 자체는 정확히 탐지했지만 **원인 추정이 틀렸다.** 세전이익은 오히려 영업이익보다 작았다.

**블로그 판정: 순이익 $7,370M은 사용 가능하되 반드시 "일회성 세금 환입 $5.7B 포함"을 병기한다.** 이 수치로 Qualcomm의 수익성을 논하면 안 된다.

---

## 5. 검증 결과 — TSMC Q2 2026 (§3.1)

런로그 우선순위 5번. **`raw.md:161`은 "TSMC는 IFRS 20-F 제출사라 EDGAR XBRL 엔드포인트로 분기 데이터를 얻을 수 없다"고 적었다. XBRL API에 대해서는 맞다. 하지만 결론이 틀렸다 — TSMC의 Q2 2026 실적 발표문 자체가 EDGAR에 6-K로 올라와 있다.**

- 접수번호: `0001046179-26-000451` (2026-07-16 접수, Form 6-K)
- 문서: `https://www.sec.gov/Archives/edgar/data/1046179/000104617926000451/a2q26e_withguidancexfinal.htm` (EX-99.1)

XBRL 팩트는 확인해보니 실제로 2024-12-31까지만 태깅돼 있어(연간 20-F만) 스킬의 진단대로다. 그러나 6-K 첨부문서는 완전한 실적 발표문이다.

| # | 항목 | 스킬이 제시한 값 | 확인된 값 (EDGAR 6-K 1차) | 판정 |
|---|---|---|---|---|
| 47 | Q2 2026 매출 (NT$) | ~NT$1.27T | **NT$1,270,381M** | 일치 |
| 48 | Q2 2026 매출 (US$) | **~$39.62B** | **$40.20B** ("In US dollars, second quarter revenue was $40.20 billion") | 불일치 |
| 49 | Q2 2026 매출 YoY | +36% | **+36.0%** (US$ 기준으로는 +33.7%) | 일치 |
| 50 | Q2 2026 순이익 | NT$706.56B | **NT$706,562M** | 일치 |
| 51 | Q2 2026 순이익 YoY | +77.4% | **+77.4%** | 일치 |
| 52 | 매출총이익률 "not retrieved" | 미기재 | **67.7% — 발표문에 명시** | 불일치(누락) |
| 53 | 영업이익률 "not retrieved" | 미기재 | **60.3% — 발표문에 명시** | 불일치(누락) |

발표문 원문 손익 표(단위 NT$ 백만):

```
                  2Q26        2Q25      YoY      1Q26       QoQ
Net sales      1,270,381    933,792    36.0   1,134,103    12.0
Gross profit     860,311    547,369    57.2     751,295    14.5
Income from ops  766,603    463,423    65.4     658,966    16.3
Net income       706,562    398,273    77.4     572,480    23.4
EPS (NT$)          27.25      15.36    77.4       22.08    23.4
```

**48번 상세.** $39.62B는 NT$1,270,381M ÷ 32.06으로 역산되는 값이다. 32.06은 TSMC가 **3분기 가이던스 환산에 쓰겠다고 밝힌 가정 환율**("based on the exchange rate assumption of 1 US dollar to 32 NT dollars")에 가깝다. TSMC 자신이 2분기 실적에 적용한 실제 환율은 약 31.6이다. 2차 매체가 자체 환산한 값이 그대로 들어온 것으로 보인다. 오차는 $580M, 약 −1.4%로 절대값은 크지 않지만 **회사가 직접 발표한 공식 수치와 다른 값**이라 그대로 쓸 수 없다.

**블로그 판정: TSMC 항목은 US$ 매출만 $40.20B로 교체하면 전부 사용 가능하다.** 오히려 EDGAR 6-K라는 1차 출처를 붙일 수 있어 `raw.md`보다 근거가 강해진다. 매출총이익률 67.7% / 영업이익률 60.3%도 추가할 수 있다.

---

## 6. 검증 결과 — 밸류에이션 (§4)

| # | 항목 | 스킬이 제시한 값 | 확인된 값 | 판정 |
|---|---|---|---|---|
| 54 | NVDA 행 8개 값 | $206.84 / $5.01T / $4.97T / 31.68 / 20.76 / 30.02 / 19.60 | **전부 동일**, 2026-07-24 기준 명시 | 일치 (8개 수치) |
| 55 | MU 행 8개 값 | $920.95 / $1.04T / $1.02T / 20.78 / 6.42 / 14.89 / 11.26 | **전부 동일** | 일치 (8개 수치) |
| 56 | 나머지 15개사 행 | — | 미검증 (동일 출처·동일 방식이므로 전사(轉寫)는 정확할 것으로 추정되나 확인하지 않음) | 출처확인불가 |
| 57 | SOX 지수 11,818.89 (2026-07-24, −4.25%) | — | 미확인 | 출처확인불가 |

스킬이 stockanalysis.com에서 옮겨 적은 작업 자체는 정확하다. 표본 2개사 16개 값이 전부 일치했다.

**다만 §4의 근본 한계는 전사 정확도가 아니다.** `raw.md:205`가 스스로 밝혔듯 forward P/E의 기반 컨센서스 EPS와 추정 기준일이 공개되지 않는다. 즉 **정확히 옮겨 적은 블랙박스 숫자**다. 마이크론 forward P/E 6.42배는 §4.1과 §5.2 논지 전체를 떠받치는 수치인데, 어느 시점 어느 애널리스트 추정치인지 알 수 없다. 검증 대상이 아니라 검증 불가 대상이다.

---

## 7. 검증 결과 — 정책·M&A (§2.6, §2.7)

| # | 항목 | 확인된 값 | 판정 |
|---|---|---|---|
| 58 | Intel 미 정부 약 9.9% 무의결권 지분 | **확인.** 2025-08-22 합의, $8.9B, 4억 3,330만 주 @ $20.47, 9.9%. Intel 10-Q 주석 4에서도 U.S. Government Agreement 존재 확인 | 일치 |
| 59 | BIS 2026-01-13 대중 라이선스 심사정책 변경, 2026-01-14 H200 승인 + 25% 관세 | 미확인 | 출처확인불가 |
| 60 | AI OVERWATCH Act 2026-01-22 하원 외교위 통과 | 미확인 | 출처확인불가 |
| 61 | TSMC 애리조나 $100B 추가 → 누적 $265B | 미확인 | 출처확인불가 |
| 62 | M&A 5건 (TI/Silicon Labs $7.5B, SMIC RMB 40.601B, IonQ/SkyWater $1.8B, GF/Synopsys ARC, YTD >$17B) | 미확인 (단일 2차 출처 Embedded Computing Design) | 출처확인불가 |

---

## 8. 스킬이 스스로 `UNSOURCED`로 표기한 11건 (자동 제외)

`raw.md`가 출처를 찾지 못했다고 스스로 밝힌 항목이다. 재검증 대상이 아니며 제외 목록에 그대로 포함한다.

1. WSTS 로직 2026 절대 규모 (`raw.md:46`)
2. WSTS 마이크로프로세서 2026 절대 규모 (`:47`)
3. WSTS 아날로그 2026 절대 규모 (`:48`)
4. WSTS 디스크리트 2026 절대 규모 (`:49`)
5. WSTS 센서·광전자 2026 절대 규모 (`:50`)
6. M&A 거래 멀티플 (Silicon Labs·SMIC 타깃·SkyWater EV/EBITDA, EV/Revenue) (`:133`)
7. forward P/E의 기반 컨센서스 EPS와 추정 기준일 (`:205`)
8. SOX 지수 2026 YTD 수익률 (`:248`)
9. SOX 지수 12개월 수익률 (약 127.6%, 검색 스니펫만 존재) (`:249`)
10. 섹터 히스토리컬 forward P/E 밴드 (5년/10년) (`:250`)
11. 상대비교용 S&P 500 forward P/E (`:251`)

---

## 9. 검증 결과 요약

**검증표 전체 62개 항목 중 일치 32개, 근사 4개, 불일치 12개, 출처확인불가 14개.**

| 판정 | 항목 수 | 비중 |
|---|---|---|
| 일치 | 32 | 52% |
| 근사 | 4 | 6% |
| 불일치 | 12 | 19% |
| 출처확인불가 | 14 | 23% |
| **합계** | **62** | **100%** |

여기에 스킬이 스스로 표기한 `UNSOURCED` 11건을 더하면 **제외 대상은 총 37건**이다(불일치 12 + 출처확인불가 14 + UNSOURCED 11).

### 개별 숫자 기준으로 보면

검증표의 일부 행은 여러 숫자를 묶고 있다(예: 14개사 매출 = 14개 숫자). 개별 숫자로 환산하면 이번 검증에서 **직접 값을 대조한 개별 수치는 약 150개**이고, 그 대부분(14개사 × 매출·성장률·이익률·순이익 = 약 64개, WSTS·SIA 15개, TrendForce 20개, 밸류에이션 16개)이 일치했다.

**즉 "대부분의 숫자는 맞다. 그런데 틀린 것이 하필 헤드라인 수치다."** 이것이 이번 검증의 핵심 구도다.

### 불일치 12건의 성격 분류

| 성격 | 건수 | 해당 항목 |
|---|---|---|
| 인용 출처에 수치가 없음 | 1 | 22 (하이퍼스케일러 capex $600B) |
| 출처를 잘못 읽음 (연도 오독) | 1 | 16 (TSMC 67.6%) |
| 근거 없는 직전 분기 값 | 2 | 19, 20 (SK하이닉스·삼성 DRAM 점유율 QoQ) |
| 회수 가능한 값을 누락 | 5 | 41 (AVGO 순이익), 42 (QCOM 매출총이익률), 43 (KLAC 이익률), 52·53 (TSMC 매출총이익률·영업이익률) |
| 라벨·정의 오류 | 2 | 44 (AI 매출을 XPU로 표기), 30 (SEMI WFE 정합 불가) |
| 단위 환산 오류 | 1 | 48 (TSMC US$ 매출) |

---

## 10. 블로그 글에서 제외할 항목

Task 3은 아래 목록을 그대로 배제한다.

### 10.1 절대 쓰면 안 되는 것 — 출처가 뒷받침하지 않음 (4건)

| 수치 | 위치 | 이유 |
|---|---|---|
| **2026 하이퍼스케일러 capex 약 $600B (+70% YoY)** | `raw.md:93`, `:263` | **인용된 Sourceability 기사 본문에 해당 수치가 존재하지 않는다.** 독립 출처 관측 범위는 $630B~$900B로 값 자체도 낮다. `raw.md:263`(불 케이스)에서도 재사용되므로 그 문장까지 함께 배제 |
| **TSMC 파운드리 점유율 "67.6% vs 72.3% 출처 충돌"** | `raw.md:89`, `:317` | 충돌이 아니라 **연도 오류**. 67.6%는 Q1 2025 수치다. "출처가 충돌한다"는 서술 자체가 사실이 아니므로 이 프레임을 그대로 옮기면 안 된다 |
| **SK하이닉스 DRAM 점유율 32.9% → 28.8% (−4.1pt)** | `raw.md:194`, `:199`, `:318` | Q4 2025 실제 점유율은 **32.1%**, 하락폭은 **3.3pt**. 32.9%의 출처를 찾지 못했다 |
| **삼성 DRAM 점유율 36.5% → 38.5% (+2.0pt)** | `raw.md:194` | Q4 2025 실제 점유율은 **36.0%**, 상승폭은 **2.5pt** |

### 10.2 값을 교체하면 쓸 수 있는 것 (5건)

| 잘못된 값 | 올바른 값 | 위치 |
|---|---|---|
| TSMC Q2 2026 매출 ~$39.62B | **$40.20B** (TSMC 발표문 원문) | `raw.md:159` |
| NXP Q1 2026 영업이익률 47.3% | **27.8%** (MEMS 매각차익 $627M 제외) 또는 "일회성 포함" 단서 병기 | `raw.md:156` |
| SK하이닉스 −4.1pt | **−3.3pt** | `raw.md:194`, `:199` |
| 삼성 DRAM +2.0pt | **+2.5pt** | `raw.md:194` |
| Broadcom "custom AI (XPU) revenue $10.8B" | **"AI 반도체 매출 $10.8B"** (커스텀 가속기 + AI 네트워킹 합계) | `raw.md:177`, `:195` |

### 10.3 반드시 설명을 붙여야 하는 것 (3건)

| 수치 | 필수 설명 |
|---|---|
| Intel Q2 2026 순손실 −$11,033M | 미 정부 Escrowed Shares 파생부채 시가평가손 **$12,529M**(비현금)이 원인. 영업이익은 **+$1,796M 흑자** |
| Qualcomm FQ2 FY26 순이익 $7,370M | 이연법인세 평가충당금 환입 **$5.7B**(비현금) 포함. 세전이익은 $2,232M로 영업이익($2,309M)보다 **작다** |
| Micron FQ3 FY26 매출총이익률 84.6% | 값은 정확하나 가격 급등에 따른 일시적 수치. `raw.md` 자신도 이렇게 서술함 |

### 10.4 확인하지 못해 보류 (14건)

WSTS Autumn 2025 $975B / IDC 2026 $1.29T / IDC 데이터센터 반도체 $477.1B / TrendForce Q2 DRAM·NAND 계약가 전망 / HBM 2026 출하량 / TI Q2 세그먼트 상세 / SEMI 300mm $133B / SEMI WFE $135.2B / CXMT 3%→8% / SOX 지수 레벨 / BIS 수출통제 일자 / AI OVERWATCH Act 일자 / TSMC 애리조나 $265B / M&A 5건 거래액 / 밸류에이션 표 나머지 15개사.

이 중 **SEMI WFE $135.2B는 총 장비 $139B와 산술적으로 양립할 수 없으므로**(WFE는 총 장비의 부분집합) 보류가 아니라 배제 대상에 가깝다. `raw.md:99`는 $139B vs 300mm $133B 충돌만 지적했는데, 같은 문장 안의 $139B vs WFE $135.2B가 더 명백한 모순이다.

### 10.5 스킬 자신이 `UNSOURCED`로 표기한 11건

§8 목록 전체. 특히 **섹터 히스토리컬 forward P/E 밴드**와 **S&P 500 forward P/E** 부재는, 리포트가 "지금 반도체 섹터가 비싼가"에 답하지 못한다는 뜻이므로 글에서 이 점을 한계로 서술하는 것은 가능하나 수치를 만들어 채우면 안 된다.

---

## 11. 검증하지 못한 것과 그 이유

| 미검증 영역 | 이유 |
|---|---|
| 밸류에이션 표 15개사 | 단일 출처(stockanalysis.com) 전사(轉寫) 정확도는 표본 2개사 16개 값으로 확인. 나머지는 동일 방식이라 한계효용이 낮다고 판단해 생략 |
| M&A 5건 거래액 | 단일 2차 출처만 존재. 각 딜의 1차 공시(8-K, 프레스릴리스)까지 추적하려면 별도 작업량이 필요 |
| 정책 일자 3건 (BIS, AI OVERWATCH Act, 애리조나) | 수치가 아닌 사실 관계 항목이고 블로그 글 2의 논지에서 비중이 낮다고 판단 |
| SEMI 원문 3건 | semi.org 본문이 HTTP 403. 릴리스 **제목**에 명시된 $139B / $156B만 확인 |
| SIA 원문 | HTTP 403 (런로그에 기록된 것과 동일). 검색 결과에 인용된 본문으로 대조 |
| TrendForce 가격 전망 3건 | 인용된 TrendForce 페이지에서 해당 수치를 찾지 못했으나, 다른 릴리스에 있을 가능성을 배제하지 못함. "없다"가 아니라 "확인 못 했다" |
| MCHP / GFS 커버리지 | 아래 부록 참조 |

---

## 부록 — EDGAR 커버리지에 대한 `raw.md`의 진단 정정

`raw.md:171`과 §6은 EDGAR 커버리지 공백 3건을 열거했다. 실제로 확인해보니 진단이 부분적으로 부정확하다.

| `raw.md`의 서술 | 실제 확인 결과 |
|---|---|
| "GlobalFoundries(GFS)는 두 매출 태그 모두 데이터가 없다" | **원인은 태그가 아니라 택소노미다.** GFS는 20-F/6-K를 제출하는 외국 사기업(foreign private issuer)이고 XBRL 팩트가 `us-gaap`이 아니라 **`ifrs-full`**에 들어 있다. `ifrs-full:Revenue`로 조회하면 2025-03-31 $1,585M, 2025-06-30 $1,688M, 2025-09-30 $1,688M이 나온다(전부 6-K). 다만 2026년 분기는 태깅돼 있지 않아 커버리지 공백이라는 **결론 자체는 맞다.** TSMC에 대해서는 IFRS 문제를 정확히 지적했으면서 GFS에는 같은 진단을 적용하지 못했다 |
| "Microchip(MCHP)은 조회한 태그로 2026년 기간이 나오지 않았다" | **부정확하다.** MCHP는 회계연도가 3월 말이라 **FY2026 1~3분기 데이터가 존재한다**(2025-06-30, 2025-09-30, 2025-12-31로 종료). 달력 2026년에 끝나는 분기가 없을 뿐이다. FQ4 FY26(2026-01~03)은 4분기라 연간 표기로만 존재해 조회되지 않는다 — NVDA FQ4와 같은 사유다 |
| "NVIDIA FQ4 FY26이 concept API에 별도 태깅되지 않는다" | **맞다.** 확인 결과 NVDA `Revenues`의 분기 duration 팩트는 2025-10-26 다음이 2026-04-26으로 건너뛴다 |
| "TSMC는 EDGAR XBRL 엔드포인트로 얻을 수 없다" | XBRL API에 대해서는 **맞다**(팩트가 2024-12-31까지). 하지만 **실적 발표문 전문이 6-K로 EDGAR에 있다.** §5 참조 |
| §6 "SEC EDGAR ... (primary, 15 companies)" | 런로그가 이미 지적한 대로 **14개사**가 맞다(TSMC는 2차 출처) |

이 부록의 시사점: EDGAR 무료 API는 실제로 쓸 만하지만, **"데이터가 없다"는 결론에 도달하기 전에 택소노미(us-gaap / ifrs-full)와 서식(10-Q / 6-K)을 바꿔 재시도해야 한다.** 이번 검증에서 그 재시도만으로 TSMC의 1차 자료 전체와 GFS의 과거 분기, AVGO 순이익을 추가 확보했다.

---

## 부록 — 재현 방법

이 문서의 모든 EDGAR 검증은 아래 방식으로 재현된다. SEC는 User-Agent 헤더를 요구한다.

```bash
# 1) 티커 → CIK
curl -s -H "User-Agent: kenshin579@gmail.com" \
  https://www.sec.gov/files/company_tickers.json

# 2) 기업 전체 XBRL 팩트
curl -s -H "User-Agent: kenshin579@gmail.com" \
  https://data.sec.gov/api/xbrl/companyfacts/CIK0001413447.json

# 3) 제출 목록에서 접수번호 확인
curl -s -H "User-Agent: kenshin579@gmail.com" \
  https://data.sec.gov/submissions/CIK0001413447.json

# 4) 재무제표 R 파일 목록
curl -s -H "User-Agent: kenshin579@gmail.com" \
  https://www.sec.gov/Archives/edgar/data/1413447/000141344726000034/FilingSummary.xml

# 5) 개별 재무제표 (예: NXP 손익계산서 = R2.htm)
curl -s -H "User-Agent: kenshin579@gmail.com" \
  https://www.sec.gov/Archives/edgar/data/1413447/000141344726000034/R2.htm
```

인용한 공시 접수번호:

| 기업 | 서식 | 접수번호 | 대상 기간 |
|---|---|---|---|
| NVIDIA | 10-Q | 0001045810-26-000052 | FQ1 FY27 (~2026-04-26) |
| Broadcom | 8-K (EX-99.1) | 0001730168-26-000051 | FQ2 FY26 (~2026-05-03) |
| Broadcom | 10-Q | 0001730168-26-000054 | FQ2 FY26 |
| Micron | 10-Q | 0000723125-26-000015 | FQ3 FY26 (~2026-05-28) |
| Intel | 10-Q | 0000050863-26-000157 | Q2 2026 (~2026-06-27) |
| AMD | 10-Q | 0000002488-26-000076 | Q1 2026 (~2026-03-28) |
| Qualcomm | 10-Q | 0000804328-26-000061 | FQ2 FY26 (~2026-03-29) |
| Applied Materials | 10-Q | 0001628280-26-037227 | FQ2 FY26 (~2026-04-26) |
| Lam Research | 10-Q | 0000707549-26-000022 | FQ3 FY26 (~2026-03-29) |
| Texas Instruments | 10-Q | 0000097476-26-000152 | Q2 2026 (~2026-06-30) |
| Analog Devices | 10-Q | 0000006281-26-000052 | FQ2 FY26 (~2026-05-02) |
| KLA | 10-Q | 0000319201-26-000016 | FQ3 FY26 (~2026-03-31) |
| NXP | 10-Q | 0001413447-26-000034 | Q1 2026 (~2026-03-29) |
| Marvell | 10-Q | 0001835632-26-000019 | FQ1 FY27 (~2026-05-02) |
| ON Semiconductor | 10-Q | 0001097864-26-000014 | Q1 2026 (~2026-04-03) |
| TSMC | 6-K (EX-99.1) | 0001046179-26-000451 | Q2 2026 |

웹 출처:

| 항목 | URL |
|---|---|
| WSTS Spring 2026 | https://www.wsts.org/76/103/Global-Semiconductor-Market-Surges-Beyond-15T-2026 |
| TrendForce DRAM Q1 2026 | https://www.trendforce.com/presscenter/news/20260601-13070.html |
| TrendForce DRAM Q4 2025 | https://www.trendforce.com/presscenter/news/20260226-12937.html |
| TrendForce 파운드리 Q1 2026 (재인용) | https://marklapedus.substack.com/p/tsmc-gains-foundry-share-in-q1-26 |
| gulfnews (실제로는 Q1 2025 기사) | https://gulfnews.com/technology/tsmc-market-share-rises-to-67-6-in-q1-extending-global-foundry-lead-1.500164069 |
| Sourceability (capex 수치 부재 확인 대상) | https://sourceability.com/post/semiconductor-industry-outlook-for-2026-shows-rebound-amid-mergers |
| 하이퍼스케일러 capex $725B | https://www.tomshardware.com/tech-industry/big-tech/big-techs-ai-spending-plans-reach-725-billion |
| Synergy Q3 2025 하이퍼스케일 capex $142B | https://www.datacenterdynamics.com/en/news/hyperscale-capex-and-capacity-hits-peak-in-q3-2025-synergy/ |
| NVIDIA Q1 FY27 IR | https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-First-Quarter-Fiscal-2027/default.aspx |
| stockanalysis.com NVDA | https://stockanalysis.com/stocks/nvda/statistics/ |
| stockanalysis.com MU | https://stockanalysis.com/stocks/mu/statistics/ |

---

## 12. 마무리

62개 항목 중 32개가 일치했고 4개가 근사였다. 개별 숫자로는 약 150개를 대조해 대부분이 맞았다. **SEC EDGAR로 확인 가능한 구간(§3.1의 미국 신고사 14곳)은 사실상 전부 정확했고, 협회 릴리스로 확인 가능한 구간(§2.1~§2.2의 WSTS·SIA)도 전부 정확했다.**

문제는 그 바깥이다. 불일치 12건과 출처확인불가 14건은 대부분 **2차·3차 웹 출처에 의존한 구간**에 몰려 있다. 그리고 그중 세 건은 성격이 다르다.

1. **하이퍼스케일러 capex $600B** — 인용된 출처에 그 수치가 없다. 존재하지 않는 근거에 링크가 달려 있었다.
2. **TSMC 67.6%** — 출처는 실재하지만 1년 전 기사다. 스킬은 이것을 "출처 간 충돌"로 해석하고 정의 차이를 추정하는 주석까지 달았다. 있지도 않은 방법론 차이를 설명한 것이다.
3. **SK하이닉스 32.9%** — 인용한 TrendForce 페이지에 직전 분기 점유율이 아예 없다. 값의 출처를 끝내 찾지 못했다.

세 건 모두 **스킬이 스스로 "검증 대기 목록"에 올린 항목**이라는 점은 기록해둘 만하다. 이상 탐지는 작동했다. 다만 이상을 탐지한 뒤 원본을 열어 확인하는 단계가 없었고, 그 결과 잘못된 값과 잘못된 해석이 함께 산출물에 남았다.

같은 구조가 EDGAR 쪽 이상 3건에도 나타난다. NXP·Intel·Qualcomm 모두 스킬이 정확히 이상을 지목했지만 원인 추정은 셋 중 하나만 맞았다(NXP "비경상 항목" 추정은 맞고, Qualcomm "영업외 이익" 추정은 틀렸다). **원본 10-Q를 한 번 열면 셋 다 30분 안에 풀린다.** 실제로 이번 검증에서 그렇게 풀었다.
