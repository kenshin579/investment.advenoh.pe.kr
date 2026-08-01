# Timeline 페이지 설계

- 작성일: 2026-08-01
- 대상 저장소: `investment.advenoh.pe.kr`
- 상태: 설계 확정

## 1. 목적과 범위

투자 역사의 큰 사건(대공황, 닷컴 버블, 금융위기, 코로나 등)을 대표 지수 하나에 마커로 표시하고,
각 사건에서 지수·금·금리·채권이 어떻게 움직였는지를 함께 보여주는 페이지를 추가한다.

- 메인 화면(`/timeline`): 상단에 고정된 지수 미니맵 + 세로로 이어지는 사건 카드
- 미니맵 마커에 마우스를 올리면 해당 사건의 요약 팝오버
- 각 사건 카드에서 상세 글로 이동
- 상세 글에는 여러 지표를 함께 그린 차트를 자동 삽입

**범위에서 제외**: 실시간 시세, 사용자별 기능, 백엔드 서버.

## 2. 핵심 결정 사항

| 항목 | 결정 | 근거 |
|---|---|---|
| 레이아웃 | 상단 고정 미니맵 + 세로 스크롤 스토리 카드 | 사건 목록과 지표 배지가 스크롤만으로 한눈에 들어온다 |
| 대표 지수 | S&P 500 단일 | 메인 차트를 하나로 유지. KOSPI는 사건 글 지표에만 병기 |
| 시작 연도 | 1900년 | 1907년 은행 공황(연준 탄생 계기)부터 서사가 열린다. 1871년까지 가면 왼쪽 20%가 빈 구간 |
| 스케일 | 로그 스케일 | 선형이면 1970년 이전이 바닥에 뭉개진다. 대공황 -86%와 코로나 -34%의 차이가 눈으로 구분된다 |
| 백엔드 | **만들지 않는다** | 데이터 총량 100KB 남짓의 불변 과거 데이터. 정적 사이트의 서버 비용 0을 유지 |
| 데이터 관리 | 저장소에 커밋 + 수동 갱신 스크립트 | 빌드가 결정론적. 외부 API 장애가 배포를 깨지 않는다 |
| 차트 라이브러리 | `lightweight-charts` 도입, `recharts` 제거 | 시간축 줌/팬이 네이티브. 마커 겹침 해소에 필수 |
| 콘텐츠 구조 | `contents/history/` 새 카테고리 + frontmatter 확장 | 글과 사건 메타데이터가 한 파일에 붙어 있다 |
| 시계열 해상도 | 전 계열 월간 통일 | S&P 500 장기 데이터가 월간뿐. 혼용하면 리베이스 비교가 어긋난다 |

## 3. 데이터 소스 (실측 검증 완료)

모두 **API 키가 필요 없다.** 2026-08-01 기준으로 실제 다운로드를 확인했다.

| 지표 | 소스 | 확인된 구간 |
|---|---|---|
| S&P 500 (월간) | `https://raw.githubusercontent.com/datasets/s-and-p-500/main/data/data.csv` | 1871-01 ~ 2026-07 |
| 나스닥 종합 (일별) | FRED `NASDAQCOM` | 1971-02-05(=100) ~ 2026-07-31 |
| 금 현물 (일별) | `https://prices.lbma.org.uk/json/gold_pm.json` | 1968-04-01 ~ 2026-07-31 |
| 美 10년물 | 위 CSV의 `Long Interest Rate`(월간 1871~) / FRED `DGS10`(일별 1962~) | 1871 ~ |
| 연준 정책금리 | FRED `M13009USM156NNBR`(NY연은 재할인율 1914-11~1969-07) + `FEDFUNDS`(1954-07~) | 1914 ~ |
| CPI | 위 CSV의 CPI(1871~) / FRED `CPIAUCNS`(1913~) | 1871 ~ |
| 한국 주가지수 | FRED `SPASTT01KRM661N` (OECD, 월간) | 1981-01 ~ 2026-06 |

FRED는 키 없이 `https://fred.stlouisfed.org/graph/fredgraph.csv?id=<SERIES_ID>`로 받는다.

### 쓰지 않기로 한 소스와 그 이유

| 소스 | 결과 |
|---|---|
| FRED `SP500` | 2016-08부터만 제공. S&P DJI 라이선스로 10년 제한 |
| FRED `GOLDPMGBD228NLBM` | **404. 폐지됨.** LBMA 직접 호출로 대체 |
| Stooq | 봇 차단(JS 챌린지). HTML만 반환 |
| Yahoo Finance | `^GSPC`/`^IXIC`/`^KS11`/`GC=F` 전부 실패 |
| `econ.yale.edu/~shiller/data/ie_data.xls` | shillerdata.com으로 이전. HTML 페이지만 반환 |
| `fmp-go` + charts의 `FMP_API_KEY` | `Limit Reach . Please upgrade your plan`. 전 기간 거부. moneyflow 프로덕션과 쿼터를 공유하므로 경쟁하게 된다 |
| charts의 `KRX_API_KEY` | `{"respMsg":"Unauthorized API Call","respCode":"401"}`. 지수 API 권한 없음 |
| `korea-investment-stock` | 실계좌·토큰 필요, 호출당 건수 제한으로 페이징 100회+, 재배포 약관 리스크. KOSPI는 메인 차트에 없으므로 과잉 |

### 이어붙이기(splice)가 필요한 3곳

1. **금**: 1900-01~1933-12 고정 $20.67 → 1934-01~1968-03 고정 $35.00 → 1968-04~ LBMA 시장가
2. **정책금리**: 1914-11~1954-06 NY연은 재할인율 → 1954-07~ Fed Funds
3. **10년물**: 1900-01~1961-12 Shiller 계열 → 1962-01~ FRED `DGS10` 월말값

각 구간에는 `kind`와 `note`를 붙여 데이터가 스스로 성격을 설명하게 한다.
금의 고정가 구간은 숨기지 않고 "고정 $35/oz"로 표시하며, 이는 콘텐츠의 소재가 된다.

## 4. 아키텍처

```
scripts/fetchTimelineData.ts          ← 수동 실행 (npm run timeline:fetch)
    │  FRED CSV · LBMA JSON · GitHub CSV 수집 → 정규화 → splice → 월간 집계
    ▼
data/timeline/series.json             ← 저장소에 커밋 (~100KB)
data/timeline/sources.json            ← 출처·라이선스·구간별 provenance
    │
    ▼
scripts/generateStaticData.ts         ← 빌드 시 (기존 파일 확장)
    │  contents/history/*/index.md 의 frontmatter.event 읽기
    │  + series.json 에서 peak→trough 변동률 자동 계산
    ▼
public/data/timeline.json             ← 빌드 산출물 (gitignored)
public/data/timeline-series.json
    │
    ▼
src/app/timeline/page.tsx  (Server Component, 정적 프리렌더)
    └ src/components/timeline/*  ('use client')
```

빌드는 커밋된 `series.json`만 읽는다. 외부 네트워크에 의존하지 않으므로 Netlify 빌드가 API 장애로 깨지지 않는다.

## 5. 데이터 스키마

### `data/timeline/series.json`

```jsonc
{
  "meta": { "generatedAt": "2026-08-01", "resolution": "monthly", "from": "1900-01" },
  "series": {
    "sp500":  { "unit": "index", "values": [["1900-01", 6.15], ["1900-02", 6.20]] },
    "nasdaq": { "unit": "index", "from": "1971-02", "values": [] },
    "gold": {
      "unit": "usdPerOz",
      "segments": [
        { "to": "1933-12", "kind": "fixed",  "value": 20.67, "note": "금본위제 고정" },
        { "to": "1968-03", "kind": "fixed",  "value": 35.00, "note": "브레튼우즈 고정" },
        { "to": null,      "kind": "market", "source": "lbma" }
      ],
      "values": []
    },
    "ust10y": {
      "unit": "percent",
      "segments": [
        { "to": "1961-12", "kind": "market", "source": "shiller" },
        { "to": null,      "kind": "market", "source": "fred:DGS10" }
      ],
      "values": []
    },
    "policyRate": {
      "unit": "percent", "from": "1914-11",
      "segments": [
        { "to": "1954-06", "kind": "market", "source": "fred:M13009USM156NNBR", "note": "NY연은 재할인율" },
        { "to": null,      "kind": "market", "source": "fred:FEDFUNDS" }
      ],
      "values": []
    },
    "cpi":   { "unit": "index", "values": [] },
    "kospi": { "unit": "index", "from": "1981-01", "source": "fred:SPASTT01KRM661N", "values": [] }
  }
}
```

`values`는 `[["YYYY-MM", number], ...]` 형태의 월간 시계열이다.
결측은 배열에서 제외한다 — 특히 원본 CSV의 마지막 행은 SP500만 있고 CPI·금리가 `0`으로 들어오므로,
**`0`을 결측으로 처리하는 로직이 필요하다.**

### `contents/history/{slug}/index.md` frontmatter

```yaml
---
title: 대공황
description: 신용으로 부풀린 시장이 무너지고, 회복에 25년이 걸렸다
date: 2026-08-15
category: History
tags: [대공황, 금본위제, 연준]
event:
  kind: drawdown
  peak: 1929-09
  trough: 1932-06
  label: 대공황
  summary: 신용으로 부풀린 주식시장이 3년간 86% 하락했고, 고점 회복에 25년이 걸렸다.
stub: false
---
```

사람이 쓰는 것은 `kind`, 날짜, `label`, `summary`뿐이다. 나머지는 파이프라인이 계산한다.

- `kind`: `drawdown` 또는 `moment`
  - `drawdown` — 하락 구간을 가진 사건. `peak`와 `trough`가 모두 필요하다
  - `moment` — 제도 전환처럼 하락 구간이 없는 사건. `at` 하나만 쓴다 (예: 1971 닉슨 쇼크).
    이 경우 지표는 `at` 기준 전후 12개월 변화로 계산한다
- `label`: 차트 마커에 붙는 짧은 라벨
- `summary`: 미니맵 hover 팝오버와 사건 카드에 쓰이는 1~2줄
- `stub`: `true`면 홈 목록·RSS·사이트맵에서 제외한다. 타임라인에는 정상 노출된다

**미니맵 마커의 x 좌표**는 `drawdown`이면 `peak`, `moment`면 `at` 시점이다.
사건 구간(`peak`~`trough`)은 차트에 옅은 음영으로 함께 표시한다.

**스텁 글의 본문**은 비어 있어도 된다. 상세 페이지는 frontmatter의 `summary`와
자동 삽입되는 `RebasedChart`·`RateChart`만으로도 성립한다.
본문을 채운 뒤 `stub: true`를 지우면 홈 목록과 RSS에 자동으로 등장한다.

### `public/data/timeline.json` (빌드 산출물)

`generateStaticData.ts`가 frontmatter와 `series.json`을 결합해 생성한다.

```jsonc
{
  "events": [
    {
      "slug": "1929-great-depression",
      "label": "대공황",
      "title": "대공황",
      "summary": "신용으로 부풀린 주식시장이 3년간 86% 하락했고, 고점 회복에 25년이 걸렸다.",
      "kind": "drawdown", "peak": "1929-09", "trough": "1932-06",
      "href": "/history/1929-great-depression",
      "stub": false,
      "drawdown": -86.2,
      "indicators": {
        "sp500":      { "kind": "change", "value": -86.2 },
        "nasdaq":     { "kind": "unavailable", "note": "1971년 이후" },
        "gold":       { "kind": "fixed", "note": "고정 $20.67/oz" },
        "ust10y":     { "kind": "delta", "value": -1.42, "unit": "%p" },
        "policyRate": { "kind": "delta", "value": -3.50, "unit": "%p" },
        "kospi":      { "kind": "unavailable", "note": "1981년 이후" }
      }
    }
  ]
}
```

지표 종류에 따라 표현이 다르다.

- `change`: 퍼센트 변동률 (지수, 금 시장가)
- `delta`: 퍼센트포인트 변화 (금리, 수익률)
- `fixed`: 고정가 구간
- `unavailable`: 해당 시점에 데이터가 존재하지 않음

## 6. 사건 목록 (14개)

먼저 본문을 쓸 4개는 **굵게** 표시했다. 나머지 10개는 frontmatter만 채운 스텁으로 시작한다.

| # | 사건 | 구간 |
|---|---|---|
| 1 | 1907 은행 공황 — 연준이 생긴 계기 | 1906-09 ~ 1907-11 |
| 2 | **1929 대공황** — -86%, 회복에 25년 | 1929-09 ~ 1932-06 |
| 3 | 1937 루즈벨트 불황 — 성급한 긴축의 대가 | 1937-03 ~ 1938-03 |
| 4 | 1941 진주만과 2차 세계대전 | 1941-12 ~ 1942-04 |
| 5 | 1971 닉슨 쇼크 — 금 시장가격의 시작 | 1971-08 (`moment`) |
| 6 | 1973 오일쇼크와 스태그플레이션 | 1973-01 ~ 1974-10 |
| 7 | 1980 볼커 쇼크 — 기준금리 20% | 1980-02 ~ 1982-08 |
| 8 | 1987 블랙먼데이 — 하루 -22.6% | 1987-08 ~ 1987-11 |
| 9 | 1997 아시아 외환위기 · IMF | 1997-07 ~ 1998-06 |
| 10 | **2000 닷컴 버블 붕괴** — 나스닥 -78% | 2000-03 ~ 2002-10 |
| 11 | **2008 글로벌 금융위기** — -57% | 2007-10 ~ 2009-03 |
| 12 | 2011 유럽 재정위기 · 미국 신용등급 강등 | 2011-05 ~ 2011-10 |
| 13 | **2020 코로나 팬데믹** — 33일 만에 -34% | 2020-02 ~ 2020-03 |
| 14 | 2022 인플레이션과 긴축 — 주식·채권 동반 하락 | 2022-01 ~ 2022-10 |

9·11은 별도 사건으로 두지 않고 닷컴 구간에 흡수한다.

## 7. UI 컴포넌트

| 파일 | 역할 |
|---|---|
| `src/components/timeline/TimelineMinimap.tsx` | lightweight-charts 로그 라인 + 사건 마커 + hover 팝오버 + 줌. `next/dynamic` `ssr:false` |
| `src/components/timeline/EventCard.tsx` | 세로 스토리 카드 — 제목·기간·요약·지표 배지·상세 링크 |
| `src/components/timeline/TimelinePageClient.tsx` | 스크롤 위치 ↔ 미니맵 하이라이트 양방향 조율 |
| `src/components/timeline/RebasedChart.tsx` | 사건 글 본문용. 사건 시작 = 100 리베이스 다지표 비교 |
| `src/components/timeline/RateChart.tsx` | 금리·수익률(%p) 전용 소형 차트 |

### 마커 겹침과 줌

사건 14개를 1900~2026 선형 시간축에 찍으면 네 구간에서 마커가 겹친다.
1971 닉슨쇼크와 1973 오일쇼크가 약 10px, 1997 IMF와 2000 닷컴이 15px,
2008과 2011이 20px, 2020과 2022가 13px 간격인데 마커 지름은 12px이다.
시간축은 선형인데 사건은 최근으로 올수록 촘촘해져 구조적으로 발생한다.
**시간축 줌으로 해결한다** — 1995~2026을 확대하면 같은 마커들이 넉넉히 벌어진다.

### 줌의 해상도 한계

무료로 구할 수 있는 S&P 500 장기 데이터는 월간뿐이므로, **줌을 해도 해상도는 올라가지 않는다.**
시간 범위만 넓어지고 월간 계단은 유지된다. 이는 의도된 제약이며, 줌의 목적은 마커 겹침 해소다.
"블랙먼데이 하루 -22.6%" 같은 일중 사건은 차트가 아니라 본문 텍스트로 다룬다.

### 리베이스 차트

지수(6,900), 금($4,000), 10년물(4.7%)은 단위가 달라 한 축에 올릴 수 없다.
**사건 시작 시점을 100으로 리베이스**하면 축 하나에 모두 올라가고,
"금융위기 동안 지수는 43까지 빠졌는데 금은 125까지 올랐다"가 직관적으로 읽힌다.
금리·수익률은 이미 %p 단위라 리베이스가 무의미하므로 `RateChart`로 아래에 분리한다.

### 사건 글에 차트를 넣는 방식

마크다운 안에 컴포넌트를 심지 않는다.
`src/app/[category]/[slug]/page.tsx`가 `category === 'History'`일 때 frontmatter의 `event`를 읽어
본문 상단에 `RebasedChart`와 `RateChart`를 자동 삽입한다.
마크다운은 순수하게 유지되고, 글쓴이는 차트를 신경 쓸 필요가 없다.

### 모바일

미니맵 90px 고정은 작은 화면을 많이 차지하므로, 스크롤을 내리면 48px로 축소한다.

## 8. 기존 코드 변경점

| 파일 | 변경 |
|---|---|
| `src/components/header.tsx` | Timeline 링크 추가. 데스크톱 navItems 끝에 구분선과 함께, 모바일 메뉴에도 동일하게 |
| `scripts/generateStaticData.ts` | History 특수 처리, event 지표 계산, `timeline.json` 생성, `stub` 플래그 전파 |
| `scripts/generateRssFeed.ts` | `stub !== true` 필터 추가. 현재는 최신 20개를 무필터로 뽑으므로 스텁이 RSS를 덮어쓴다 |
| `scripts/generateSitemap.ts` | 스텁 제외 |
| `src/components/category-filter.tsx`, `category-filter-client.tsx` | 홈 카테고리 필터에서만 History 숨김. `/history/{slug}` 라우트와 `[category]` 동적 페이지는 정상 동작해야 한다 |
| `src/components/ui/chart.tsx` | **삭제.** 365줄이며 아무도 import하지 않는다 |
| `package.json` | `recharts` 제거 / `lightweight-charts`·`vitest` 추가 / `timeline:fetch` 스크립트 |
| `.gitignore` | `.superpowers/` 추가 (완료됨) |

`generateStaticData.ts`는 `contents/` 하위 디렉토리를 전부 카테고리로 자동 수집하므로,
`contents/history/`를 만들면 History 카테고리가 자동으로 생성된다. 위 필터링이 없으면
홈 카테고리 필터에 `History (14)`가 뜨고 RSS에 스텁 10개가 밀려 들어간다.

## 9. 테스트

`vitest`를 새로 도입한다. 이 저장소에는 현재 테스트 인프라가 전혀 없으나,
이번에 들어오는 파이프라인 로직은 순수 함수이고 눈으로 검증하기 어렵다.

테스트 대상 (`scripts/lib/timeline/`):

- `splice.ts` — 금·정책금리·10년물 3곳의 구간 이어붙이기. 경계 월의 중복·누락 없음
- `resample.ts` — 일별 → 월간(월말 종가) 집계
- `returns.ts` — peak→trough 변동률(`change`), 퍼센트포인트 변화(`delta`)
- `parse.ts` — CSV/JSON 파싱, **`0`을 결측으로 처리**

UI는 기존 관례대로 빌드 후 Playwright로 수동 확인한다.

## 10. 갱신 운영

`npm run timeline:fetch`를 수동 실행한다 (새 글을 쓸 때 정도의 빈도).

소스 하나가 실패해도 나머지는 갱신하고, 실패한 계열은 기존 커밋 파일을 유지한 채 경고만 낸다.
`GOLDPMGBD228NLBM`이 이미 폐지된 전례가 있으므로 전부 실패로 되돌리는 것보다 부분 성공이 낫다.

각 차트 하단에 출처를 표기한다. 라이선스상 안전하고 신뢰도에도 도움이 된다.

## 11. 작업 순서

1. 의존성 정리 — `recharts` 제거, `src/components/ui/chart.tsx` 삭제, `lightweight-charts`·`vitest` 추가
2. 데이터 파이프라인 — `scripts/lib/timeline/` 순수 함수 + 테스트 → `fetchTimelineData.ts` → `series.json` 생성·커밋
3. `generateStaticData.ts` 확장 → `timeline.json` 생성
4. `contents/history/` 14개 작성 (본문 4개 + 스텁 10개)
5. `/timeline` 페이지 — 미니맵 + 사건 카드
6. 사건 글 상세의 리베이스 차트 자동 삽입
7. 헤더 · RSS · 사이트맵 · 홈 필터 반영
8. `npm run check` · `npm run build` · Playwright 검증

## 12. 별도 처리 필요 (이번 범위 밖)

`charts/charts/moneyflow-be/values.yaml`에 KIS appSecret, DB 비밀번호,
Google/Naver OAuth 시크릿이 평문으로 커밋되어 있다. sealed-secrets나 external-secrets가 적용되어 있지 않다.
이번 작업 범위는 아니지만 별도로 처리하는 것이 좋다.
