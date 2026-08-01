# Timeline 페이지 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 1900년부터의 S&P 500 로그 차트에 투자 역사 사건 14개를 마커로 표시하고, 각 사건에서 지수·금·금리·채권이 어떻게 움직였는지 보여주는 `/timeline` 페이지를 추가한다.

**Architecture:** 외부 데이터는 수동 실행 스크립트가 수집해 `data/timeline/series.json`으로 저장소에 커밋한다. 빌드 시 `generateStaticData.ts`가 이 파일과 `contents/history/*/index.md`의 frontmatter를 결합해 `public/data/timeline.json`을 만든다. 페이지는 정적 프리렌더되고 차트만 클라이언트에서 동작한다. 백엔드는 없다.

**Tech Stack:** Next.js 16 (App Router, `output: 'export'`), TypeScript, lightweight-charts v5, vitest, tsx

**설계 문서:** `docs/superpowers/specs/2026-08-01-timeline-page-design.md`

---

## 파일 구조

**신규 — 데이터 파이프라인 (순수 함수, 테스트 대상)**

| 파일 | 책임 |
|---|---|
| `scripts/lib/timeline/types.ts` | 공용 타입만. 로직 없음 |
| `scripts/lib/timeline/parse.ts` | FRED CSV / Shiller CSV / LBMA JSON → 날짜-값 배열. `0`·`.`·`null` 결측 처리 |
| `scripts/lib/timeline/resample.ts` | 일별 → 월간(월말 관측치) 집계 |
| `scripts/lib/timeline/splice.ts` | 구간 이어붙이기, 고정가 구간 생성 |
| `scripts/lib/timeline/returns.ts` | 구간 변동률(`change`)·퍼센트포인트 변화(`delta`)·시점 조회 |
| `scripts/fetchTimelineData.ts` | 위 함수들을 조립해 네트워크 수집 → `data/timeline/series.json` 출력 |

**신규 — UI**

| 파일 | 책임 |
|---|---|
| `src/app/timeline/page.tsx` | Server Component. JSON 읽어 클라이언트로 전달 |
| `src/components/timeline/types.ts` | UI 쪽 타입 (파이프라인 타입과 분리) |
| `src/components/timeline/TimelineMinimap.tsx` | lightweight-charts 로그 라인 + 마커 + hover 팝오버 + 줌 |
| `src/components/timeline/EventCard.tsx` | 사건 카드 하나 |
| `src/components/timeline/IndicatorBadge.tsx` | 지표 배지 하나 (4가지 `kind` 렌더링) |
| `src/components/timeline/TimelinePageClient.tsx` | 스크롤 ↔ 미니맵 조율 |
| `src/components/timeline/RebasedChart.tsx` | 사건 시작=100 리베이스 다지표 차트 |
| `src/components/timeline/RateChart.tsx` | 금리·수익률(%p) 소형 차트 |

**수정**

| 파일 | 변경 |
|---|---|
| `package.json` | recharts 제거, lightweight-charts·vitest 추가, 스크립트 2개 추가 |
| `scripts/generateStaticData.ts` | `timeline.json` 생성, `stub` 전파 |
| `scripts/generateRssFeed.ts` | `stub !== true` 필터 |
| `scripts/generateSitemap.ts` | `stub !== true` 필터 |
| `src/components/header.tsx` | Timeline 링크 |
| `src/components/category-filter-client.tsx` | 홈 필터에서 History 숨김 |
| `src/app/[category]/[slug]/page.tsx` | History 글에 차트 자동 삽입 |

**삭제**: `src/components/ui/chart.tsx`

---

## 검증된 외부 데이터 형식

플랜 전체가 이 형식을 전제로 한다. 2026-08-01에 실제 다운로드로 확인했다.

**FRED** — `https://fred.stlouisfed.org/graph/fredgraph.csv?id=<ID>` (키 불필요)
```
observation_date,DGS10
1962-01-02,4.06
```
결측은 `.` 로 표기된다.

**Shiller 파생 CSV** — `https://raw.githubusercontent.com/datasets/s-and-p-500/main/data/data.csv`
```
Date,SP500,Dividend,Earnings,Consumer Price Index,Long Interest Rate,Real Price,Real Dividend,Real Earnings,PE10
1900-01-01,6.1,...,7.9,3.15,...
2026-07-01,7481.34,0.0,0.0,0.0,0.0,...
```
날짜는 항상 `YYYY-MM-01`. **마지막 몇 행은 CPI와 Long Interest Rate가 `0.0`으로 들어온다 — 이를 결측으로 처리해야 한다.**
SP500 컬럼은 월중 평균이지 월말 종가가 아니다.

**LBMA** — `https://prices.lbma.org.uk/json/gold_pm.json`
```json
[{"is_cms_locked":0,"d":"1968-04-01","v":[37.7,15.68,null]}]
```
`v` = `[USD, GBP, EUR]`. USD는 결측 0건이지만 EUR은 초기 구간이 `null`이다.

**참조값** (테스트에 사용):
- 1900-01 SP500 = 6.1, CPI = 7.9, GS10 = 3.15
- 1929-09 SP500 = 31.3, GS10 = 3.39
- 1932-06 SP500 = 4.77, GS10 = 3.53
- 대공황 변동률 = `4.77/31.3 - 1` = **-84.76%**, GS10 델타 = **+0.14%p**

---

### Task 1: 의존성 정리와 vitest 셋업

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Delete: `src/components/ui/chart.tsx`

- [ ] **Step 1: recharts가 정말 미사용인지 재확인**

Run:
```bash
cd /Users/user/src/workspace_investment/investment.advenoh.pe.kr
grep -rn "recharts" --include="*.tsx" --include="*.ts" src/ scripts/
grep -rn "components/ui/chart" --include="*.tsx" --include="*.ts" src/
```
Expected: 첫 명령은 `src/components/ui/chart.tsx` 한 줄만 출력. 두 번째 명령은 아무것도 출력하지 않음.
둘 중 하나라도 다른 결과가 나오면 중단하고 보고할 것.

- [ ] **Step 2: chart.tsx 삭제**

```bash
rm src/components/ui/chart.tsx
```

- [ ] **Step 3: 의존성 교체**

`package.json`의 `dependencies`에서 `"recharts": "^2.15.2",` 줄을 삭제하고, 같은 블록에 알파벳 순서를 맞춰 추가:
```json
"lightweight-charts": "^5.2.0",
```

`devDependencies`에 추가:
```json
"vitest": "^3.2.4"
```

`scripts`에 두 줄 추가:
```json
"test": "vitest run",
"timeline:fetch": "npx tsx scripts/fetchTimelineData.ts"
```

- [ ] **Step 4: vitest 설정 생성**

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['scripts/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 5: 설치하고 타입 검사**

Run:
```bash
npm install
npm run check
```
Expected: 둘 다 에러 없이 종료. `chart.tsx`를 지웠으므로 참조 에러가 나면 Step 1의 확인이 틀린 것이다.

- [ ] **Step 6: 커밋**

```bash
git add package.json package-lock.json vitest.config.ts
git rm --cached src/components/ui/chart.tsx 2>/dev/null || true
git add -A src/components/ui/
git commit -m "[feature/timeline-page] chore: recharts 제거하고 lightweight-charts·vitest 추가

* 아무도 import하지 않던 src/components/ui/chart.tsx(365줄) 삭제
* 타임라인 차트는 시간축 줌이 필요해 lightweight-charts를 사용한다
* 데이터 파이프라인 순수 함수 테스트를 위해 vitest 도입"
```

---

### Task 2: 공용 타입 정의

**Files:**
- Create: `scripts/lib/timeline/types.ts`

이 파일에는 로직이 없으므로 테스트하지 않는다. 이후 모든 태스크가 여기 정의된 이름을 그대로 쓴다.

- [ ] **Step 1: 타입 파일 작성**

`scripts/lib/timeline/types.ts`:
```ts
/** "YYYY-MM" 형식의 월 식별자 */
export type YearMonth = string;

/** "YYYY-MM-DD" 형식의 일자 식별자 */
export type IsoDate = string;

/** 일별 관측치 */
export type DatedPoint = [IsoDate, number];

/** 월별 관측치 */
export type Point = [YearMonth, number];

export type SeriesKey =
  | 'sp500'
  | 'nasdaq'
  | 'gold'
  | 'ust10y'
  | 'policyRate'
  | 'cpi'
  | 'kospi';

export type SeriesUnit = 'index' | 'percent' | 'usdPerOz';

/** 계열 안에서 출처나 성격이 바뀌는 구간 */
export interface Segment {
  /** 이 구간의 마지막 월. null이면 계열 끝까지 */
  to: YearMonth | null;
  /** fixed = 법정 고정가처럼 시장가격이 아닌 구간 */
  kind: 'fixed' | 'market';
  /** kind가 fixed일 때의 고정값 */
  value?: number;
  /** 예: "fred:DGS10", "lbma", "shiller" */
  source?: string;
  note?: string;
}

export interface Series {
  unit: SeriesUnit;
  /** 데이터가 시작되는 월. 생략하면 파일 meta.from과 같다 */
  from?: YearMonth;
  source?: string;
  segments?: Segment[];
  values: Point[];
}

export interface SeriesFile {
  meta: {
    generatedAt: IsoDate;
    resolution: 'monthly';
    from: YearMonth;
  };
  series: Record<SeriesKey, Series>;
}

/** 사건 구간에서 계산된 지표 하나의 표현 */
export type Indicator =
  | { kind: 'change'; value: number }
  | { kind: 'delta'; value: number; unit: '%p' }
  | { kind: 'fixed'; note: string }
  | { kind: 'unavailable'; note: string };
```

- [ ] **Step 2: 타입 검사**

Run: `npm run check:scripts`
Expected: 에러 없음, exit 0

`npm run check`가 아니다 — 그쪽은 `scripts/`를 보지 않으므로 이 파일을 검증하지 못한다.

- [ ] **Step 3: 커밋**

```bash
git add scripts/lib/timeline/types.ts
git commit -m "[feature/timeline-page] feat: 타임라인 데이터 파이프라인 공용 타입 정의"
```

---

### Task 3: parse.ts — 원본 포맷 파싱

**Files:**
- Create: `scripts/lib/timeline/parse.ts`
- Test: `scripts/lib/timeline/parse.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`scripts/lib/timeline/parse.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { parseFredCsv, parseLbmaJson, parseShillerCsv } from './parse';

describe('parseFredCsv', () => {
  it('헤더를 건너뛰고 날짜-값 쌍을 뽑는다', () => {
    const csv = 'observation_date,DGS10\n1962-01-02,4.06\n1962-01-03,4.03\n';
    expect(parseFredCsv(csv)).toEqual([
      ['1962-01-02', 4.06],
      ['1962-01-03', 4.03],
    ]);
  });

  it("결측 표기 '.' 를 제외한다", () => {
    const csv = 'observation_date,DGS10\n1962-01-02,4.06\n1962-01-04,.\n1962-01-05,4.10\n';
    expect(parseFredCsv(csv)).toEqual([
      ['1962-01-02', 4.06],
      ['1962-01-05', 4.1],
    ]);
  });

  it('빈 줄과 후행 개행을 무시한다', () => {
    const csv = 'observation_date,X\n1990-01-01,1\n\n';
    expect(parseFredCsv(csv)).toEqual([['1990-01-01', 1]]);
  });
});

describe('parseShillerCsv', () => {
  const csv = [
    'Date,SP500,Dividend,Earnings,Consumer Price Index,Long Interest Rate,Real Price,Real Dividend,Real Earnings,PE10',
    '1900-01-01,6.1,0.2,0.4,7.9,3.15,1,1,1,1',
    '1929-09-01,31.3,0.9,1.6,17.3,3.39,1,1,1,1',
    '2026-07-01,7481.34,0.0,0.0,0.0,0.0,0,0,0,0',
  ].join('\n');

  it('SP500·CPI·10년물을 월 단위로 분리한다', () => {
    const out = parseShillerCsv(csv);
    expect(out.sp500).toContainEqual(['1900-01', 6.1]);
    expect(out.cpi).toContainEqual(['1900-01', 7.9]);
    expect(out.ust10y).toContainEqual(['1929-09', 3.39]);
  });

  it('0을 결측으로 처리해 CPI와 10년물에서 제외한다', () => {
    const out = parseShillerCsv(csv);
    expect(out.cpi.map((p) => p[0])).not.toContain('2026-07');
    expect(out.ust10y.map((p) => p[0])).not.toContain('2026-07');
  });

  it('SP500이 0이 아니면 마지막 행도 유지한다', () => {
    const out = parseShillerCsv(csv);
    expect(out.sp500).toContainEqual(['2026-07', 7481.34]);
  });
});

describe('parseLbmaJson', () => {
  it('USD(v[0])만 뽑는다', () => {
    const json = JSON.stringify([
      { is_cms_locked: 0, d: '1968-04-01', v: [37.7, 15.68, null] },
      { is_cms_locked: 0, d: '1968-04-02', v: [37.3, 37.3, null] },
    ]);
    expect(parseLbmaJson(json)).toEqual([
      ['1968-04-01', 37.7],
      ['1968-04-02', 37.3],
    ]);
  });

  it('USD가 null인 항목은 제외한다', () => {
    const json = JSON.stringify([
      { d: '1968-04-01', v: [null, 1, 1] },
      { d: '1968-04-02', v: [37.3, 1, 1] },
    ]);
    expect(parseLbmaJson(json)).toEqual([['1968-04-02', 37.3]]);
  });
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npm test -- parse`
Expected: FAIL — `Failed to resolve import "./parse"`

- [ ] **Step 3: 구현**

`scripts/lib/timeline/parse.ts`:
```ts
import type { DatedPoint, Point } from './types';

/** "1962-01-02" → "1962-01" */
function toYearMonth(isoDate: string): string {
  return isoDate.slice(0, 7);
}

/**
 * FRED의 fredgraph.csv 응답을 파싱한다.
 * 형식: `observation_date,<SERIES_ID>` 헤더 + `YYYY-MM-DD,<value>` 행.
 * 결측은 "." 으로 표기된다.
 */
export function parseFredCsv(text: string): DatedPoint[] {
  const out: DatedPoint[] = [];
  const lines = text.split('\n');

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) continue;

    const [date, raw] = line.split(',');
    if (!date || raw === undefined) continue;

    const value = Number(raw);
    if (raw === '.' || !Number.isFinite(value)) continue;

    out.push([date, value]);
  }

  return out;
}

export interface ShillerSeries {
  sp500: Point[];
  cpi: Point[];
  ust10y: Point[];
}

/**
 * datasets/s-and-p-500 의 data.csv 를 파싱한다.
 * 날짜는 항상 YYYY-MM-01 이므로 그대로 월 단위로 쓴다.
 *
 * 최근 몇 행은 SP500만 채워지고 CPI·Long Interest Rate가 0.0 으로 들어온다.
 * 이 계열들에서 0은 실제 관측값일 수 없으므로 결측으로 간주한다.
 */
export function parseShillerCsv(text: string): ShillerSeries {
  const out: ShillerSeries = { sp500: [], cpi: [], ust10y: [] };
  const lines = text.split('\n');

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(',');
    if (cols.length < 6) continue;

    const ym = toYearMonth(cols[0]);
    const push = (target: Point[], raw: string) => {
      const value = Number(raw);
      if (!Number.isFinite(value) || value === 0) return;
      target.push([ym, value]);
    };

    push(out.sp500, cols[1]);
    push(out.cpi, cols[4]);
    push(out.ust10y, cols[5]);
  }

  return out;
}

interface LbmaRow {
  d: string;
  v: (number | null)[];
}

/**
 * LBMA gold_pm.json 을 파싱한다.
 * v = [USD, GBP, EUR]. USD만 사용한다.
 */
export function parseLbmaJson(text: string): DatedPoint[] {
  const rows = JSON.parse(text) as LbmaRow[];
  const out: DatedPoint[] = [];

  for (const row of rows) {
    const usd = row.v?.[0];
    if (typeof usd !== 'number' || !Number.isFinite(usd)) continue;
    out.push([row.d, usd]);
  }

  return out;
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test -- parse`
Expected: PASS, 8 tests

- [ ] **Step 5: 커밋**

```bash
git add scripts/lib/timeline/parse.ts scripts/lib/timeline/parse.test.ts
git commit -m "[feature/timeline-page] feat: 타임라인 원본 데이터 파서 추가

* FRED CSV의 '.' 결측, Shiller CSV의 0 결측, LBMA JSON의 null을 각각 제외한다"
```

---

### Task 4: resample.ts — 일별을 월간으로

**Files:**
- Create: `scripts/lib/timeline/resample.ts`
- Test: `scripts/lib/timeline/resample.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`scripts/lib/timeline/resample.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { toMonthly } from './resample';

describe('toMonthly', () => {
  it('각 월의 마지막 관측치를 쓴다', () => {
    const daily: [string, number][] = [
      ['2020-01-02', 10],
      ['2020-01-31', 12],
      ['2020-02-03', 20],
      ['2020-02-28', 25],
    ];
    expect(toMonthly(daily)).toEqual([
      ['2020-01', 12],
      ['2020-02', 25],
    ]);
  });

  it('월말 영업일이 없어도 그 달의 마지막 값을 쓴다', () => {
    const daily: [string, number][] = [
      ['2020-03-02', 1],
      ['2020-03-20', 2],
    ];
    expect(toMonthly(daily)).toEqual([['2020-03', 2]]);
  });

  it('입력 순서가 뒤섞여도 날짜 기준으로 정렬해 처리한다', () => {
    const daily: [string, number][] = [
      ['2020-01-31', 12],
      ['2020-01-02', 10],
    ];
    expect(toMonthly(daily)).toEqual([['2020-01', 12]]);
  });

  it('빈 입력은 빈 배열을 낸다', () => {
    expect(toMonthly([])).toEqual([]);
  });
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npm test -- resample`
Expected: FAIL — `Failed to resolve import "./resample"`

- [ ] **Step 3: 구현**

`scripts/lib/timeline/resample.ts`:
```ts
import type { DatedPoint, Point } from './types';

/**
 * 일별 관측치를 월간으로 줄인다. 각 월의 마지막 관측치를 그 달의 값으로 쓴다.
 * 월말이 휴장이어도 그 달에 존재하는 마지막 값이 선택된다.
 */
export function toMonthly(daily: DatedPoint[]): Point[] {
  const sorted = [...daily].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  const byMonth = new Map<string, number>();

  for (const [date, value] of sorted) {
    byMonth.set(date.slice(0, 7), value);
  }

  return [...byMonth.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1));
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test -- resample`
Expected: PASS, 4 tests

- [ ] **Step 5: 커밋**

```bash
git add scripts/lib/timeline/resample.ts scripts/lib/timeline/resample.test.ts
git commit -m "[feature/timeline-page] feat: 일별 시계열을 월말 관측치로 집계"
```

---

### Task 5: splice.ts — 구간 이어붙이기

금·정책금리·10년물 세 계열은 출처가 중간에 바뀐다. 뒤 구간이 시작되면 앞 구간은 그 직전 월에서 끊는다.

**Files:**
- Create: `scripts/lib/timeline/splice.ts`
- Test: `scripts/lib/timeline/splice.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`scripts/lib/timeline/splice.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { constantMonths, spliceSeries } from './splice';

describe('constantMonths', () => {
  it('구간 전체를 같은 값으로 채운다', () => {
    expect(constantMonths('1900-01', '1900-04', 20.67)).toEqual([
      ['1900-01', 20.67],
      ['1900-02', 20.67],
      ['1900-03', 20.67],
      ['1900-04', 20.67],
    ]);
  });

  it('연도 경계를 넘어간다', () => {
    expect(constantMonths('1933-11', '1934-02', 35)).toEqual([
      ['1933-11', 35],
      ['1933-12', 35],
      ['1934-01', 35],
      ['1934-02', 35],
    ]);
  });

  it('시작이 끝보다 뒤면 빈 배열을 낸다', () => {
    expect(constantMonths('1900-05', '1900-01', 1)).toEqual([]);
  });
});

describe('spliceSeries', () => {
  it('뒤 구간이 시작되는 월부터는 뒤 구간을 쓴다', () => {
    const older: [string, number][] = [
      ['1961-11', 3.9],
      ['1961-12', 4.0],
      ['1962-01', 99],
      ['1962-02', 99],
    ];
    const newer: [string, number][] = [
      ['1962-01', 4.08],
      ['1962-02', 4.12],
    ];
    expect(spliceSeries([older, newer])).toEqual([
      ['1961-11', 3.9],
      ['1961-12', 4.0],
      ['1962-01', 4.08],
      ['1962-02', 4.12],
    ]);
  });

  it('세 구간도 순서대로 이어붙인다', () => {
    const a: [string, number][] = [['1900-01', 20.67], ['1934-01', 20.67]];
    const b: [string, number][] = [['1934-01', 35], ['1968-04', 35]];
    const c: [string, number][] = [['1968-04', 37.7]];
    expect(spliceSeries([a, b, c])).toEqual([
      ['1900-01', 20.67],
      ['1934-01', 35],
      ['1968-04', 37.7],
    ]);
  });

  it('빈 구간이 섞여 있어도 무시한다', () => {
    const a: [string, number][] = [['1990-01', 1]];
    expect(spliceSeries([a, [], []])).toEqual([['1990-01', 1]]);
  });

  it('결과는 월 오름차순이며 중복 월이 없다', () => {
    const a: [string, number][] = [['2000-02', 1], ['2000-01', 1]];
    const b: [string, number][] = [['2000-02', 2]];
    const out = spliceSeries([a, b]);
    expect(out).toEqual([['2000-01', 1], ['2000-02', 2]]);
  });
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npm test -- splice`
Expected: FAIL — `Failed to resolve import "./splice"`

- [ ] **Step 3: 구현**

`scripts/lib/timeline/splice.ts`:
```ts
import type { Point, YearMonth } from './types';

/** "1900-01" → 22800 처럼 비교 가능한 정수로 */
function monthIndex(ym: YearMonth): number {
  const year = Number(ym.slice(0, 4));
  const month = Number(ym.slice(5, 7));
  return year * 12 + (month - 1);
}

function fromMonthIndex(index: number): YearMonth {
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;
  return `${year}-${String(month).padStart(2, '0')}`;
}

/**
 * 법정 고정가 구간처럼 값이 변하지 않는 구간을 월별 시계열로 만든다.
 * from, to 모두 포함한다.
 */
export function constantMonths(from: YearMonth, to: YearMonth, value: number): Point[] {
  const start = monthIndex(from);
  const end = monthIndex(to);
  if (start > end) return [];

  const out: Point[] = [];
  for (let i = start; i <= end; i += 1) {
    out.push([fromMonthIndex(i), value]);
  }
  return out;
}

/**
 * 여러 구간을 이어붙인다. 배열 뒤쪽이 더 신뢰할 수 있는 출처라고 보고,
 * 같은 월이 겹치면 뒤쪽 값이 이긴다.
 */
export function spliceSeries(parts: Point[][]): Point[] {
  const merged = new Map<YearMonth, number>();

  for (const part of parts) {
    for (const [ym, value] of part) {
      merged.set(ym, value);
    }
  }

  return [...merged.entries()].sort((a, b) => monthIndex(a[0]) - monthIndex(b[0]));
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test -- splice`
Expected: PASS, 7 tests

- [ ] **Step 5: 커밋**

```bash
git add scripts/lib/timeline/splice.ts scripts/lib/timeline/splice.test.ts
git commit -m "[feature/timeline-page] feat: 계열 구간 이어붙이기와 고정가 구간 생성

* 금(1934/1968), 정책금리(1954), 10년물(1962) 세 곳의 출처 전환을 처리한다"
```

---

### Task 6: returns.ts — 구간 변동률 계산

**Files:**
- Create: `scripts/lib/timeline/returns.ts`
- Test: `scripts/lib/timeline/returns.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`scripts/lib/timeline/returns.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { changePct, deltaPP, valueAt } from './returns';

const sp500: [string, number][] = [
  ['1929-09', 31.3],
  ['1930-01', 21.7],
  ['1932-06', 4.77],
];

const gs10: [string, number][] = [
  ['1929-09', 3.39],
  ['1932-06', 3.53],
];

describe('valueAt', () => {
  it('정확히 일치하는 월의 값을 낸다', () => {
    expect(valueAt(sp500, '1930-01')).toBe(21.7);
  });

  it('없는 월은 null을 낸다', () => {
    expect(valueAt(sp500, '1931-01')).toBeNull();
  });
});

describe('changePct', () => {
  it('대공황 구간 변동률을 소수점 둘째 자리까지 계산한다', () => {
    expect(changePct(sp500, '1929-09', '1932-06')).toBe(-84.76);
  });

  it('상승 구간은 양수를 낸다', () => {
    const s: [string, number][] = [['2000-01', 100], ['2000-02', 125]];
    expect(changePct(s, '2000-01', '2000-02')).toBe(25);
  });

  it('한쪽이라도 없으면 null을 낸다', () => {
    expect(changePct(sp500, '1800-01', '1932-06')).toBeNull();
  });

  it('시작값이 0이면 null을 낸다', () => {
    const s: [string, number][] = [['2000-01', 0], ['2000-02', 5]];
    expect(changePct(s, '2000-01', '2000-02')).toBeNull();
  });
});

describe('deltaPP', () => {
  it('퍼센트포인트 차이를 낸다', () => {
    expect(deltaPP(gs10, '1929-09', '1932-06')).toBe(0.14);
  });

  it('하락은 음수를 낸다', () => {
    const s: [string, number][] = [['2007-10', 5.25], ['2009-03', 0.25]];
    expect(deltaPP(s, '2007-10', '2009-03')).toBe(-5);
  });

  it('한쪽이라도 없으면 null을 낸다', () => {
    expect(deltaPP(gs10, '1929-09', '2100-01')).toBeNull();
  });
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npm test -- returns`
Expected: FAIL — `Failed to resolve import "./returns"`

- [ ] **Step 3: 구현**

`scripts/lib/timeline/returns.ts`:
```ts
import type { Point, YearMonth } from './types';

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** 해당 월의 값. 없으면 null */
export function valueAt(series: Point[], ym: YearMonth): number | null {
  const hit = series.find(([month]) => month === ym);
  return hit ? hit[1] : null;
}

/**
 * 구간 변동률(%). 지수나 가격처럼 비율이 의미 있는 계열에 쓴다.
 * 시작값이 0이면 계산할 수 없으므로 null.
 */
export function changePct(series: Point[], from: YearMonth, to: YearMonth): number | null {
  const start = valueAt(series, from);
  const end = valueAt(series, to);
  if (start === null || end === null || start === 0) return null;
  return round2((end / start - 1) * 100);
}

/**
 * 퍼센트포인트 변화. 금리·수익률처럼 이미 % 단위인 계열에 쓴다.
 */
export function deltaPP(series: Point[], from: YearMonth, to: YearMonth): number | null {
  const start = valueAt(series, from);
  const end = valueAt(series, to);
  if (start === null || end === null) return null;
  return round2(end - start);
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test -- returns`
Expected: PASS, 9 tests

- [ ] **Step 5: 전체 테스트 확인**

Run: `npm test`
Expected: PASS, 4 files / 28 tests

- [ ] **Step 6: 커밋**

```bash
git add scripts/lib/timeline/returns.ts scripts/lib/timeline/returns.test.ts
git commit -m "[feature/timeline-page] feat: 구간 변동률과 퍼센트포인트 변화 계산

* 지수·가격은 changePct, 금리·수익률은 deltaPP로 구분한다"
```

---

### Task 7: fetchTimelineData.ts — 실제 수집

**Files:**
- Create: `scripts/fetchTimelineData.ts`
- Create (실행 결과): `data/timeline/series.json`, `data/timeline/sources.json`

- [ ] **Step 1: 수집 스크립트 작성**

`scripts/fetchTimelineData.ts`:
```ts
/**
 * 타임라인용 장기 시계열을 수집해 data/timeline/series.json 으로 저장한다.
 *
 * 수동 실행 전용: npm run timeline:fetch
 * 빌드는 이 스크립트를 부르지 않고, 커밋된 series.json 만 읽는다.
 *
 * 소스 하나가 실패해도 나머지는 갱신한다. 실패한 계열은 기존 파일의 값을
 * 그대로 유지하고 경고만 남긴다. (FRED의 GOLDPMGBD228NLBM 이 실제로 폐지된 전례가 있다.)
 */
import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import { parseFredCsv, parseLbmaJson, parseShillerCsv } from './lib/timeline/parse';
import { toMonthly } from './lib/timeline/resample';
import { constantMonths, spliceSeries } from './lib/timeline/splice';
import type { Point, SeriesFile, SeriesKey } from './lib/timeline/types';

const START = '1900-01';
const OUT_DIR = join('data', 'timeline');
const OUT_FILE = join(OUT_DIR, 'series.json');
const SOURCES_FILE = join(OUT_DIR, 'sources.json');

const SHILLER_URL =
  'https://raw.githubusercontent.com/datasets/s-and-p-500/main/data/data.csv';
const LBMA_URL = 'https://prices.lbma.org.uk/json/gold_pm.json';
const fredUrl = (id: string) => `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}`;

const warnings: string[] = [];

async function fetchText(url: string, label: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'investment.advenoh.pe.kr timeline fetcher' },
    });
    if (!res.ok) {
      warnings.push(`${label}: HTTP ${res.status}`);
      return null;
    }
    return await res.text();
  } catch (error) {
    warnings.push(`${label}: ${(error as Error).message}`);
    return null;
  }
}

/** START 이전 데이터를 잘라낸다 */
function clampFrom(points: Point[], from = START): Point[] {
  return points.filter(([ym]) => ym >= from);
}

async function loadPrevious(): Promise<SeriesFile | null> {
  try {
    return JSON.parse(await readFile(OUT_FILE, 'utf-8')) as SeriesFile;
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  const previous = await loadPrevious();
  const keep = (key: SeriesKey): Point[] => {
    const kept = previous?.series?.[key]?.values ?? [];
    if (kept.length > 0) warnings.push(`${key}: 기존 커밋 값을 유지한다 (${kept.length}개월)`);
    return kept;
  };

  // ---- S&P 500 / CPI / 10년물(1961년까지) ----
  const shillerText = await fetchText(SHILLER_URL, 'shiller');
  const shiller = shillerText ? parseShillerCsv(shillerText) : null;

  const sp500 = shiller ? clampFrom(shiller.sp500) : keep('sp500');
  const cpi = shiller ? clampFrom(shiller.cpi) : keep('cpi');
  const ust10yOld = shiller ? clampFrom(shiller.ust10y).filter(([ym]) => ym < '1962-01') : [];

  // ---- 나스닥 ----
  const nasdaqText = await fetchText(fredUrl('NASDAQCOM'), 'fred:NASDAQCOM');
  const nasdaq = nasdaqText ? toMonthly(parseFredCsv(nasdaqText)) : keep('nasdaq');

  // ---- 10년물(1962년 이후) ----
  const dgs10Text = await fetchText(fredUrl('DGS10'), 'fred:DGS10');
  const ust10yNew = dgs10Text ? toMonthly(parseFredCsv(dgs10Text)) : [];
  const ust10y =
    ust10yOld.length || ust10yNew.length
      ? spliceSeries([ust10yOld, ust10yNew])
      : keep('ust10y');

  // ---- 정책금리: 재할인율(1914-11~1954-06) → Fed Funds(1954-07~) ----
  const discountText = await fetchText(fredUrl('M13009USM156NNBR'), 'fred:M13009USM156NNBR');
  const discount = discountText
    ? toMonthly(parseFredCsv(discountText)).filter(([ym]) => ym < '1954-07')
    : [];
  const fedFundsText = await fetchText(fredUrl('FEDFUNDS'), 'fred:FEDFUNDS');
  const fedFunds = fedFundsText ? toMonthly(parseFredCsv(fedFundsText)) : [];
  const policyRate =
    discount.length || fedFunds.length ? spliceSeries([discount, fedFunds]) : keep('policyRate');

  // ---- 금: 고정가 두 구간 → LBMA 시장가 ----
  const lbmaText = await fetchText(LBMA_URL, 'lbma');
  const lbma = lbmaText ? toMonthly(parseLbmaJson(lbmaText)) : [];
  const gold = lbma.length
    ? spliceSeries([
        constantMonths(START, '1933-12', 20.67),
        constantMonths('1934-01', '1968-03', 35.0),
        lbma,
      ])
    : keep('gold');

  // ---- 한국 주가지수 ----
  const kospiText = await fetchText(fredUrl('SPASTT01KRM661N'), 'fred:SPASTT01KRM661N');
  const kospi = kospiText ? toMonthly(parseFredCsv(kospiText)) : keep('kospi');

  const generatedAt = new Date().toISOString().slice(0, 10);

  const file: SeriesFile = {
    meta: { generatedAt, resolution: 'monthly', from: START },
    series: {
      sp500: { unit: 'index', source: 'shiller', values: sp500 },
      nasdaq: { unit: 'index', from: '1971-02', source: 'fred:NASDAQCOM', values: nasdaq },
      gold: {
        unit: 'usdPerOz',
        segments: [
          { to: '1933-12', kind: 'fixed', value: 20.67, note: '금본위제 고정' },
          { to: '1968-03', kind: 'fixed', value: 35.0, note: '브레튼우즈 고정' },
          { to: null, kind: 'market', source: 'lbma' },
        ],
        values: gold,
      },
      ust10y: {
        unit: 'percent',
        segments: [
          { to: '1961-12', kind: 'market', source: 'shiller' },
          { to: null, kind: 'market', source: 'fred:DGS10' },
        ],
        values: ust10y,
      },
      policyRate: {
        unit: 'percent',
        from: '1914-11',
        segments: [
          { to: '1954-06', kind: 'market', source: 'fred:M13009USM156NNBR', note: 'NY연은 재할인율' },
          { to: null, kind: 'market', source: 'fred:FEDFUNDS' },
        ],
        values: policyRate,
      },
      cpi: { unit: 'index', source: 'shiller', values: cpi },
      kospi: {
        unit: 'index',
        from: '1981-01',
        source: 'fred:SPASTT01KRM661N',
        values: kospi,
      },
    },
  };

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, `${JSON.stringify(file, null, 2)}\n`, 'utf-8');

  const sources = {
    generatedAt,
    note: '각 차트 하단에 출처를 표기한다.',
    entries: [
      { key: 'sp500', name: 'Robert Shiller / datasets.io s-and-p-500', url: SHILLER_URL, license: 'PDDL' },
      { key: 'nasdaq', name: 'FRED NASDAQCOM', url: fredUrl('NASDAQCOM') },
      { key: 'gold', name: 'LBMA Gold PM (1968-04~), 이전은 법정 고정가', url: LBMA_URL },
      { key: 'ust10y', name: 'Shiller GS10 (~1961), FRED DGS10 (1962~)', url: fredUrl('DGS10') },
      { key: 'policyRate', name: 'NY연은 재할인율 (~1954-06), FRED FEDFUNDS (1954-07~)', url: fredUrl('FEDFUNDS') },
      { key: 'cpi', name: 'Shiller CPI', url: SHILLER_URL },
      { key: 'kospi', name: 'OECD Share Prices Korea (FRED)', url: fredUrl('SPASTT01KRM661N') },
    ],
  };
  await writeFile(SOURCES_FILE, `${JSON.stringify(sources, null, 2)}\n`, 'utf-8');

  for (const [key, series] of Object.entries(file.series)) {
    const values = series.values;
    const range = values.length ? `${values[0][0]} ~ ${values[values.length - 1][0]}` : '(비어 있음)';
    console.log(`${key.padEnd(11)} ${String(values.length).padStart(5)}개월  ${range}`);
  }

  if (warnings.length > 0) {
    console.warn('\n경고:');
    for (const w of warnings) console.warn(`  - ${w}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

- [ ] **Step 2: 실행**

Run:
```bash
npm run timeline:fetch
```

Expected: 아래와 비슷한 표가 출력되고 경고 없음. 개월 수는 실행 시점에 따라 조금 다를 수 있다.
```
sp500        1519개월  1900-01 ~ 2026-07
nasdaq        666개월  1971-02 ~ 2026-07
gold         1516개월  1900-01 ~ 2026-07
ust10y       1519개월  1900-01 ~ 2026-07
policyRate   1341개월  1914-11 ~ 2026-06
cpi          1518개월  1900-01 ~ 2026-06
kospi         546개월  1981-01 ~ 2026-06
```

어떤 계열이든 `(비어 있음)`이 나오면 중단하고 경고 메시지를 보고할 것.

- [ ] **Step 3: 생성된 데이터의 참조값 검증**

Run:
```bash
npx tsx -e "
const f = require('./data/timeline/series.json');
const at = (k, ym) => (f.series[k].values.find(p => p[0] === ym) || [,null])[1];
console.log('1900-01 sp500 =', at('sp500','1900-01'), '(기대 6.1)');
console.log('1929-09 sp500 =', at('sp500','1929-09'), '(기대 31.3)');
console.log('1932-06 sp500 =', at('sp500','1932-06'), '(기대 4.77)');
console.log('1900-01 gold  =', at('gold','1900-01'), '(기대 20.67)');
console.log('1940-01 gold  =', at('gold','1940-01'), '(기대 35)');
console.log('1971-02 nasdaq=', at('nasdaq','1971-02'), '(기대 100 근처)');
"
```
Expected: 각 줄의 값이 괄호 안 기대값과 일치. 하나라도 어긋나면 중단하고 보고할 것.

- [ ] **Step 4: 파일 크기 확인**

Run: `ls -lh data/timeline/`
Expected: `series.json`이 300KB 이하. 크게 초과하면 보고할 것.

- [ ] **Step 5: 커밋**

```bash
git add scripts/fetchTimelineData.ts data/timeline/series.json data/timeline/sources.json
git commit -m "[feature/timeline-page] feat: 타임라인 시계열 수집 스크립트와 데이터 커밋

* FRED·LBMA·Shiller 파생 CSV에서 7개 계열을 1900년부터 월간으로 수집
* 소스 하나가 실패해도 나머지는 갱신하고 실패 계열은 기존 값을 유지한다
* 빌드는 이 커밋된 JSON만 읽으므로 외부 API 장애에 영향받지 않는다"
```

---

### Task 8: contents/history/ 사건 14개

`stub: true`인 글은 본문이 비어 있어도 된다. 상세 페이지는 `summary`와 자동 삽입되는 차트로 성립한다.

**이 태스크를 시작하기 전에 `content-heading-style` 스킬을 호출한다.** 이 저장소에는
`contents/` 아래 `index.md`를 쓸 때 적용되는 목차 heading 번호 규칙이 있고, 그 스킬이 규칙을 알려준다.

콘텐츠 작성 규칙 (저장소 CLAUDE.md):
- 이모지를 쓰지 않는다
- 다이어그램은 ASCII art가 아니라 Mermaid 코드 블록을 쓴다
- 마지막 본문 섹션 제목은 "정리"가 아니라 **"마무리"** 로 한다

**Files:**
- Create: `contents/history/{slug}/index.md` × 14

- [ ] **Step 1: 본문을 쓸 4개 중 대공황 작성**

`contents/history/1929-great-depression/index.md`:
```markdown
---
title: "대공황 - 신용으로 부풀린 시장이 무너지기까지"
description: "1929년 대공황에서 S&P 500이 어떻게 85% 가까이 하락했고, 그동안 금·금리·채권은 어떻게 움직였는지 정리한다."
date: 2026-08-01
category: History
tags:
  - 대공황
  - 금본위제
  - 연준
event:
  kind: drawdown
  peak: 1929-09
  trough: 1932-06
  label: 대공황
  summary: 신용으로 부풀린 주식시장이 3년 가까이 하락했고, 고점 회복에는 25년이 걸렸다.
stub: false
---

## 무슨 일이 있었나

(본문은 이후 별도 작업으로 채운다. 이 태스크에서는 frontmatter 검증이 목적이다.)

## 마무리
```

- [ ] **Step 2: 나머지 3개 본문 글의 frontmatter 작성**

Step 1과 같은 형식으로 세 파일을 만든다. 본문은 동일하게 `## 무슨 일이 있었나` / `## 마무리` 골격만 둔다.

`contents/history/2000-dotcom-bubble/index.md` frontmatter:
```yaml
---
title: "닷컴 버블 붕괴 - 실적 없는 성장 서사가 값을 치른 시간"
description: "2000년 닷컴 버블 붕괴에서 나스닥이 78% 하락하는 동안 지수·금·금리·채권이 어떻게 움직였는지 정리한다."
date: 2026-08-01
category: History
tags:
  - 닷컴버블
  - 나스닥
  - 밸류에이션
event:
  kind: drawdown
  peak: 2000-03
  trough: 2002-10
  label: 닷컴 버블
  summary: 기술주 밸류에이션이 무너지며 나스닥이 78% 하락했다. 실적 없는 성장 서사가 처음으로 값을 치렀다.
stub: false
---
```

`contents/history/2008-financial-crisis/index.md` frontmatter:
```yaml
---
title: "글로벌 금융위기 - 신용이 얼어붙은 18개월"
description: "2008년 글로벌 금융위기에서 S&P 500이 고점 대비 57% 하락하는 동안 금·기준금리·국채가 어떻게 움직였는지 정리한다."
date: 2026-08-01
category: History
tags:
  - 금융위기
  - 리먼브라더스
  - 서브프라임
event:
  kind: drawdown
  peak: 2007-10
  trough: 2009-03
  label: 금융위기
  summary: 서브프라임 부실이 리먼 파산으로 번지며 전 세계 신용이 얼어붙었다.
stub: false
---
```

`contents/history/2020-covid-pandemic/index.md` frontmatter:
```yaml
---
title: "코로나 팬데믹 - 33일 만의 폭락과 그보다 빠른 회복"
description: "2020년 코로나 팬데믹에서 S&P 500이 33일 만에 34% 하락한 뒤 회복하는 동안 금·금리·채권이 어떻게 움직였는지 정리한다."
date: 2026-08-01
category: History
tags:
  - 코로나
  - 팬데믹
  - 양적완화
event:
  kind: drawdown
  peak: 2020-02
  trough: 2020-03
  label: 코로나
  summary: 팬데믹 봉쇄로 33일 만에 34% 하락했으나, 전례 없는 통화·재정 대응으로 5개월 만에 고점을 되찾았다.
stub: false
---
```

- [ ] **Step 3: 스텁 10개 작성**

각 파일은 frontmatter만 있고 본문은 비운다. `stub: true`로 둔다.
`title`·`description`은 아래 `label`과 `summary`를 참고해 한 문장으로 쓰고, `date`는 모두 `2026-08-01`,
`category: History`, `tags`는 각 2~3개를 적절히 붙인다.

| slug | kind | 날짜 | label | summary |
|---|---|---|---|---|
| `1907-bankers-panic` | drawdown | peak 1906-09 / trough 1907-11 | 1907 은행 공황 | 최종 대부자가 없던 시절의 신용 경색. 이 사건이 연방준비제도를 만드는 계기가 됐다. |
| `1937-roosevelt-recession` | drawdown | peak 1937-03 / trough 1938-03 | 1937 불황 | 회복이 끝나기 전에 재정과 통화를 동시에 조인 결과, 시장이 다시 절반 가까이 빠졌다. |
| `1941-pearl-harbor-wwii` | drawdown | peak 1941-12 / trough 1942-04 | 2차 세계대전 | 진주만 공습 직후 시장은 넉 달을 더 빠졌지만, 전쟁 후반부터는 오히려 상승했다. |
| `1971-nixon-shock` | moment | at 1971-08 | 닉슨 쇼크 | 달러의 금 태환이 정지되며 브레튼우즈 체제가 끝났다. 금이 처음으로 시장가격을 갖게 됐다. |
| `1973-oil-shock` | drawdown | peak 1973-01 / trough 1974-10 | 오일쇼크 | 유가 급등과 물가 상승이 겹치며, 주식과 채권이 함께 무너지는 스태그플레이션이 시작됐다. |
| `1980-volcker-shock` | drawdown | peak 1980-02 / trough 1982-08 | 볼커 쇼크 | 물가를 잡기 위해 기준금리를 20%까지 올렸다. 두 번의 침체를 치르고 인플레이션이 꺾였다. |
| `1987-black-monday` | drawdown | peak 1987-08 / trough 1987-11 | 블랙먼데이 | 하루에 22.6% 빠졌다. 뚜렷한 촉발 사건 없이 프로그램 매매가 하락을 증폭시켰다. |
| `1997-asian-financial-crisis` | drawdown | peak 1997-07 / trough 1998-06 | IMF 외환위기 | 아시아 통화가 연쇄적으로 무너지며 한국은 IMF 구제금융을 받았다. |
| `2011-european-debt-crisis` | drawdown | peak 2011-05 / trough 2011-10 | 유럽 재정위기 | 그리스발 국가부채 위기와 미국 신용등급 강등이 겹쳤다. |
| `2022-inflation-tightening` | drawdown | peak 2022-01 / trough 2022-10 | 인플레이션·긴축 | 40년 만의 물가 상승에 맞선 급격한 긴축으로, 주식과 채권이 동시에 하락했다. |

`moment` 사건(`1971-nixon-shock`)의 frontmatter는 `peak`/`trough` 대신 `at` 하나만 쓴다:
```yaml
event:
  kind: moment
  at: 1971-08
  label: 닉슨 쇼크
  summary: 달러의 금 태환이 정지되며 브레튼우즈 체제가 끝났다. 금이 처음으로 시장가격을 갖게 됐다.
stub: true
```

- [ ] **Step 4: 파일 수와 인코딩 확인**

Run:
```bash
ls -d contents/history/*/ | wc -l
file -I contents/history/*/index.md | grep -v "charset=utf-8" || echo "전부 UTF-8"
```
Expected: `14`, 그리고 `전부 UTF-8`

- [ ] **Step 5: 커밋**

```bash
git add contents/history/
git commit -m "[feature/timeline-page] feat: 투자 역사 사건 14개 콘텐츠 추가

* 본문 4개(대공황·닷컴·금융위기·코로나)와 스텁 10개
* 스텁은 frontmatter의 summary와 자동 삽입 차트만으로 성립한다"
```

---

### Task 9: generateStaticData.ts 확장 — timeline.json 생성

**Files:**
- Modify: `scripts/generateStaticData.ts`
- Create: `scripts/lib/timeline/buildEvents.ts`
- Test: `scripts/lib/timeline/buildEvents.test.ts`

계산 로직은 테스트 가능한 별도 파일로 분리하고, `generateStaticData.ts`는 이를 호출만 한다.

- [ ] **Step 1: 실패하는 테스트 작성**

`scripts/lib/timeline/buildEvents.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { buildEvent } from './buildEvents';
import type { SeriesFile } from './types';

const seriesFile = {
  meta: { generatedAt: '2026-08-01', resolution: 'monthly', from: '1900-01' },
  series: {
    sp500: { unit: 'index', values: [['1929-09', 31.3], ['1932-06', 4.77]] },
    nasdaq: { unit: 'index', from: '1971-02', values: [['1971-02', 100]] },
    gold: {
      unit: 'usdPerOz',
      segments: [
        { to: '1933-12', kind: 'fixed', value: 20.67, note: '금본위제 고정' },
        { to: null, kind: 'market', source: 'lbma' },
      ],
      values: [['1929-09', 20.67], ['1932-06', 20.67]],
    },
    ust10y: { unit: 'percent', values: [['1929-09', 3.39], ['1932-06', 3.53]] },
    policyRate: { unit: 'percent', from: '1914-11', values: [['1929-09', 6], ['1932-06', 2.5]] },
    cpi: { unit: 'index', values: [['1929-09', 17.3], ['1932-06', 13.6]] },
    kospi: { unit: 'index', from: '1981-01', values: [] },
  },
} as unknown as SeriesFile;

const frontMatter = {
  kind: 'drawdown' as const,
  peak: '1929-09',
  trough: '1932-06',
  label: '대공황',
  summary: '신용으로 부풀린 주식시장이 3년 가까이 하락했다.',
};

describe('buildEvent', () => {
  it('drawdown 사건의 지수 변동률을 계산한다', () => {
    const e = buildEvent('1929-great-depression', '대공황', frontMatter, false, seriesFile);
    expect(e.drawdown).toBe(-84.76);
    expect(e.indicators.sp500).toEqual({ kind: 'change', value: -84.76 });
  });

  it('금리·수익률은 퍼센트포인트로 낸다', () => {
    const e = buildEvent('x', 'x', frontMatter, false, seriesFile);
    expect(e.indicators.ust10y).toEqual({ kind: 'delta', value: 0.14, unit: '%p' });
    expect(e.indicators.policyRate).toEqual({ kind: 'delta', value: -3.5, unit: '%p' });
  });

  it('고정가 구간의 금은 fixed로 표시한다', () => {
    const e = buildEvent('x', 'x', frontMatter, false, seriesFile);
    expect(e.indicators.gold).toEqual({ kind: 'fixed', note: '고정 $20.67/oz' });
  });

  it('데이터가 없는 계열은 unavailable로 표시한다', () => {
    const e = buildEvent('x', 'x', frontMatter, false, seriesFile);
    expect(e.indicators.nasdaq.kind).toBe('unavailable');
    expect(e.indicators.kospi.kind).toBe('unavailable');
  });

  it('href와 stub을 담는다', () => {
    const e = buildEvent('1929-great-depression', '대공황', frontMatter, true, seriesFile);
    expect(e.href).toBe('/history/1929-great-depression');
    expect(e.stub).toBe(true);
  });

  it('moment 사건은 at 기준 전후 12개월로 계산한다', () => {
    const momentSeries = {
      ...seriesFile,
      series: {
        ...seriesFile.series,
        sp500: { unit: 'index', values: [['1970-08', 80], ['1971-08', 99], ['1972-08', 111]] },
      },
    } as unknown as SeriesFile;

    const e = buildEvent(
      '1971-nixon-shock',
      '닉슨 쇼크',
      { kind: 'moment', at: '1971-08', label: '닉슨 쇼크', summary: 's' },
      true,
      momentSeries,
    );
    expect(e.peak).toBe('1970-08');
    expect(e.trough).toBe('1972-08');
    expect(e.indicators.sp500).toEqual({ kind: 'change', value: 38.75 });
  });
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npm test -- buildEvents`
Expected: FAIL — `Failed to resolve import "./buildEvents"`

- [ ] **Step 3: 구현**

`scripts/lib/timeline/buildEvents.ts`:
```ts
import { changePct, deltaPP, valueAt } from './returns';
import type { Indicator, SeriesFile, SeriesKey, YearMonth } from './types';

export type EventFrontMatter =
  | { kind: 'drawdown'; peak: YearMonth; trough: YearMonth; label: string; summary: string }
  | { kind: 'moment'; at: YearMonth; label: string; summary: string };

export interface TimelineEvent {
  slug: string;
  title: string;
  label: string;
  summary: string;
  kind: 'drawdown' | 'moment';
  /** 마커가 찍히는 월 */
  markerAt: YearMonth;
  /** 지표 계산 구간의 시작 */
  peak: YearMonth;
  /** 지표 계산 구간의 끝 */
  trough: YearMonth;
  href: string;
  stub: boolean;
  drawdown: number | null;
  indicators: Record<SeriesKey, Indicator>;
}

/** "1971-08" 에서 12개월 이동 */
function shiftMonths(ym: YearMonth, months: number): YearMonth {
  const year = Number(ym.slice(0, 4));
  const month = Number(ym.slice(5, 7));
  const index = year * 12 + (month - 1) + months;
  const y = Math.floor(index / 12);
  const m = (index % 12) + 1;
  return `${y}-${String(m).padStart(2, '0')}`;
}

/** 퍼센트포인트로 표현해야 하는 계열 */
const RATE_KEYS: SeriesKey[] = ['ust10y', 'policyRate'];

/** 사건 구간이 고정가 구간 안에 들어가는지 보고, 그렇다면 안내 문구를 만든다 */
function fixedNote(file: SeriesFile, key: SeriesKey, from: YearMonth): string | null {
  const segments = file.series[key].segments;
  if (!segments) return null;

  for (const segment of segments) {
    const covers = segment.to === null || from <= segment.to;
    if (!covers) continue;
    if (segment.kind === 'fixed' && segment.value !== undefined) {
      return `고정 $${segment.value}/oz`;
    }
    return null;
  }
  return null;
}

function indicatorFor(
  file: SeriesFile,
  key: SeriesKey,
  from: YearMonth,
  to: YearMonth,
): Indicator {
  const series = file.series[key];
  const note = fixedNote(file, key, from);
  if (note) return { kind: 'fixed', note };

  if (valueAt(series.values, from) === null || valueAt(series.values, to) === null) {
    const startsAt = series.from ?? file.meta.from;
    return { kind: 'unavailable', note: `${startsAt.slice(0, 4)}년 이후` };
  }

  if (RATE_KEYS.includes(key)) {
    const value = deltaPP(series.values, from, to);
    return value === null
      ? { kind: 'unavailable', note: '데이터 없음' }
      : { kind: 'delta', value, unit: '%p' };
  }

  const value = changePct(series.values, from, to);
  return value === null
    ? { kind: 'unavailable', note: '데이터 없음' }
    : { kind: 'change', value };
}

const ALL_KEYS: SeriesKey[] = [
  'sp500',
  'nasdaq',
  'gold',
  'ust10y',
  'policyRate',
  'cpi',
  'kospi',
];

/**
 * frontmatter의 event 블록과 시계열을 결합해 타임라인 사건 하나를 만든다.
 *
 * drawdown 사건은 peak~trough 구간으로,
 * moment 사건은 at 기준 전후 12개월 구간으로 지표를 계산한다.
 */
export function buildEvent(
  slug: string,
  title: string,
  fm: EventFrontMatter,
  stub: boolean,
  file: SeriesFile,
): TimelineEvent {
  const markerAt = fm.kind === 'drawdown' ? fm.peak : fm.at;
  const from = fm.kind === 'drawdown' ? fm.peak : shiftMonths(fm.at, -12);
  const to = fm.kind === 'drawdown' ? fm.trough : shiftMonths(fm.at, 12);

  const indicators = {} as Record<SeriesKey, Indicator>;
  for (const key of ALL_KEYS) {
    indicators[key] = indicatorFor(file, key, from, to);
  }

  const sp500 = indicators.sp500;

  return {
    slug,
    title,
    label: fm.label,
    summary: fm.summary,
    kind: fm.kind,
    markerAt,
    peak: from,
    trough: to,
    href: `/history/${slug}`,
    stub,
    drawdown: sp500.kind === 'change' ? sp500.value : null,
    indicators,
  };
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test -- buildEvents`
Expected: PASS, 6 tests

- [ ] **Step 5: generateStaticData.ts에서 호출**

`scripts/generateStaticData.ts`의 import 블록에 추가:
```ts
import { buildEvent, type EventFrontMatter, type TimelineEvent } from './lib/timeline/buildEvents';
import type { SeriesFile } from './lib/timeline/types';
```

같은 파일 하단, 기존 `main()`(또는 최상위 실행부)에서 `posts.json`을 쓴 뒤에 아래 함수를 호출하도록 추가한다.
먼저 함수를 정의한다:
```ts
/**
 * contents/history/ 의 frontmatter와 data/timeline/series.json 을 결합해
 * public/data/timeline.json 을 만든다.
 */
async function generateTimeline(posts: BlogPost[]): Promise<void> {
  const raw = await readFile(join('data', 'timeline', 'series.json'), 'utf-8');
  const seriesFile = JSON.parse(raw) as SeriesFile;

  const events: TimelineEvent[] = posts
    .filter((post) => post.event !== undefined)
    .map((post) =>
      buildEvent(
        post.slug,
        post.title,
        post.event as EventFrontMatter,
        post.stub === true,
        seriesFile,
      ),
    )
    .sort((a, b) => (a.markerAt < b.markerAt ? -1 : 1));

  await writeFile(
    join('public', 'data', 'timeline.json'),
    `${JSON.stringify({ events }, null, 2)}\n`,
    'utf-8',
  );
  await writeFile(
    join('public', 'data', 'timeline-series.json'),
    `${JSON.stringify(seriesFile)}\n`,
    'utf-8',
  );

  console.log(`timeline.json 생성: 사건 ${events.length}개`);
}
```

- [ ] **Step 6: BlogPost 인터페이스에 필드 추가**

`scripts/generateStaticData.ts` 상단의 `BlogPost` 인터페이스에 두 필드를 추가:
```ts
  event?: EventFrontMatter;
  stub?: boolean;
```

그리고 마크다운을 파싱해 `BlogPost`를 만드는 부분(`importMarkdownFiles` 안, `finalCategory`를 계산하는 근처)에서 두 필드를 frontmatter로부터 옮겨 담는다:
```ts
              event: frontMatter.event,
              stub: frontMatter.stub === true,
```

- [ ] **Step 7: 실행 확인**

Run:
```bash
npx tsx scripts/generateStaticData.ts
npx tsx -e "
const t = require('./public/data/timeline.json');
console.log('사건 수:', t.events.length, '(기대 14)');
const gd = t.events.find(e => e.slug === '1929-great-depression');
console.log('대공황 drawdown:', gd.drawdown, '(기대 -84.76)');
console.log('대공황 금:', JSON.stringify(gd.indicators.gold));
console.log('대공황 나스닥:', JSON.stringify(gd.indicators.nasdaq));
console.log('첫 사건:', t.events[0].slug, '마지막:', t.events[t.events.length-1].slug);
"
```
Expected:
```
사건 수: 14 (기대 14)
대공황 drawdown: -84.76 (기대 -84.76)
대공황 금: {"kind":"fixed","note":"고정 $20.67/oz"}
대공황 나스닥: {"kind":"unavailable","note":"1971년 이후"}
첫 사건: 1907-bankers-panic 마지막: 2022-inflation-tightening
```

- [ ] **Step 8: 커밋**

```bash
git add scripts/generateStaticData.ts scripts/lib/timeline/buildEvents.ts scripts/lib/timeline/buildEvents.test.ts
git commit -m "[feature/timeline-page] feat: 사건 frontmatter와 시계열을 결합해 timeline.json 생성

* 지표 변동률은 frontmatter의 날짜만으로 자동 계산한다
* 금 고정가 구간은 fixed로, 데이터가 없는 구간은 unavailable로 표시한다"
```

---

### Task 10: 타임라인 UI 타입과 지표 배지

**Files:**
- Create: `src/components/timeline/types.ts`
- Create: `src/components/timeline/IndicatorBadge.tsx`

- [ ] **Step 1: UI 타입 정의**

`src/components/timeline/types.ts`:
```ts
export type SeriesKey =
  | 'sp500'
  | 'nasdaq'
  | 'gold'
  | 'ust10y'
  | 'policyRate'
  | 'cpi'
  | 'kospi';

export type Indicator =
  | { kind: 'change'; value: number }
  | { kind: 'delta'; value: number; unit: '%p' }
  | { kind: 'fixed'; note: string }
  | { kind: 'unavailable'; note: string };

export interface TimelineEvent {
  slug: string;
  title: string;
  label: string;
  summary: string;
  kind: 'drawdown' | 'moment';
  markerAt: string;
  peak: string;
  trough: string;
  href: string;
  stub: boolean;
  drawdown: number | null;
  indicators: Record<SeriesKey, Indicator>;
}

export type Point = [string, number];

export interface SeriesData {
  unit: string;
  from?: string;
  values: Point[];
}

export interface TimelineSeriesFile {
  meta: { generatedAt: string; resolution: string; from: string };
  series: Record<SeriesKey, SeriesData>;
}

export const SERIES_LABEL: Record<SeriesKey, string> = {
  sp500: '지수',
  nasdaq: '나스닥',
  gold: '금',
  ust10y: '美10년물',
  policyRate: '기준금리',
  cpi: '물가',
  kospi: '한국',
};
```

- [ ] **Step 2: 지표 배지 컴포넌트**

`src/components/timeline/IndicatorBadge.tsx`:
```tsx
import { SERIES_LABEL, type Indicator, type SeriesKey } from './types';

const BASE =
  'inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap';

function toneClass(kind: Indicator['kind'], value: number): string {
  if (kind === 'fixed' || kind === 'unavailable') {
    return 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400';
  }
  if (value > 0) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
  if (value < 0) return 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300';
  return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
}

function body(indicator: Indicator): string {
  switch (indicator.kind) {
    case 'change':
      return `${indicator.value > 0 ? '+' : ''}${indicator.value}%`;
    case 'delta':
      return `${indicator.value > 0 ? '+' : ''}${indicator.value}%p`;
    case 'fixed':
      return indicator.note;
    case 'unavailable':
      return indicator.note;
  }
}

export function IndicatorBadge({
  seriesKey,
  indicator,
}: {
  seriesKey: SeriesKey;
  indicator: Indicator;
}) {
  const value = indicator.kind === 'change' || indicator.kind === 'delta' ? indicator.value : 0;

  return (
    <span className={`${BASE} ${toneClass(indicator.kind, value)}`}>
      <span className="opacity-70">{SERIES_LABEL[seriesKey]}</span>
      <span>{body(indicator)}</span>
    </span>
  );
}
```

- [ ] **Step 3: 타입 검사**

Run: `npm run check`
Expected: 에러 없음

- [ ] **Step 4: 커밋**

```bash
git add src/components/timeline/types.ts src/components/timeline/IndicatorBadge.tsx
git commit -m "[feature/timeline-page] feat: 타임라인 UI 타입과 지표 배지 컴포넌트"
```

---

### Task 11: 미니맵 차트

**Files:**
- Create: `src/components/timeline/TimelineMinimap.tsx`

lightweight-charts v5는 `addSeries(LineSeries, ...)` 형태를 쓴다.
마커는 `createSeriesMarkers` 플러그인이고, hover 팝오버는 `subscribeCrosshairMove` + DOM 오버레이로 만든다.

- [ ] **Step 1: 컴포넌트 작성**

`src/components/timeline/TimelineMinimap.tsx`:
```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  createSeriesMarkers,
  LineSeries,
  PriceScaleMode,
  type IChartApi,
  type ISeriesApi,
  type MouseEventParams,
  type Time,
} from 'lightweight-charts';

import { useTheme } from '@/components/theme-provider';
import type { Point, TimelineEvent } from './types';

interface Props {
  series: Point[];
  events: TimelineEvent[];
  /** 현재 스크롤 위치에 해당하는 사건 slug */
  activeSlug: string | null;
  onSelect: (slug: string) => void;
}

interface HoverState {
  event: TimelineEvent;
  x: number;
  y: number;
}

/** "1929-09" → "1929-09-01" (lightweight-charts의 business day 문자열) */
function toTime(ym: string): Time {
  return `${ym}-01` as Time;
}

export function TimelineMinimap({ series, events, activeSlug, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const lineRef = useRef<ISeriesApi<'Line'> | null>(null);
  const [hover, setHover] = useState<HoverState | null>(null);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // 차트 생성 — 마운트 시 1회
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      height: containerRef.current.clientHeight,
      layout: {
        background: { color: 'transparent' },
        textColor: isDark ? '#d1d5db' : '#374151',
        attributionLogo: false,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      rightPriceScale: { visible: false, mode: PriceScaleMode.Logarithmic },
      timeScale: { borderVisible: false, timeVisible: false },
      crosshair: { mode: 1 },
      handleScroll: true,
      handleScale: true,
    });

    const line = chart.addSeries(LineSeries, {
      color: '#4f46e5',
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    chartRef.current = chart;
    lineRef.current = line;

    const onResize = () => {
      if (!containerRef.current) return;
      chart.applyOptions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    };
    onResize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      chart.remove();
      chartRef.current = null;
      lineRef.current = null;
    };
    // 테마는 아래 별도 effect에서 반영한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 테마 변경 반영
  useEffect(() => {
    chartRef.current?.applyOptions({
      layout: { textColor: isDark ? '#d1d5db' : '#374151' },
    });
  }, [isDark]);

  // 데이터와 마커 반영
  useEffect(() => {
    const line = lineRef.current;
    const chart = chartRef.current;
    if (!line || !chart) return;

    line.setData(series.map(([ym, value]) => ({ time: toTime(ym), value })));

    createSeriesMarkers(
      line,
      events.map((event) => ({
        time: toTime(event.markerAt),
        position: 'aboveBar' as const,
        color: event.slug === activeSlug ? '#ef4444' : '#9ca3af',
        shape: 'circle' as const,
        size: event.slug === activeSlug ? 2 : 1,
      })),
    );

    chart.timeScale().fitContent();
  }, [series, events, activeSlug]);

  // 마커 hover 팝오버
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const handler = (param: MouseEventParams) => {
      if (!param.time || !param.point) {
        setHover(null);
        return;
      }

      const ym = String(param.time).slice(0, 7);
      // 마커에서 가장 가까운 사건을 찾되, 3개월 이상 떨어지면 무시한다
      const near = events.find((event) => {
        const diff = Math.abs(monthDistance(event.markerAt, ym));
        return diff <= 3;
      });

      setHover(near ? { event: near, x: param.point.x, y: param.point.y } : null);
    };

    chart.subscribeCrosshairMove(handler);
    return () => chart.unsubscribeCrosshairMove(handler);
  }, [events]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />

      {hover && (
        <button
          type="button"
          onClick={() => onSelect(hover.event.slug)}
          style={{ left: Math.min(hover.x + 12, 320), top: 8 }}
          className="absolute z-10 max-w-xs rounded-md border border-indigo-300 bg-white p-2 text-left shadow-lg dark:border-indigo-500 dark:bg-gray-800"
        >
          <span className="block text-xs font-semibold text-gray-900 dark:text-gray-100">
            {hover.event.label}
          </span>
          <span className="mt-0.5 block text-[11px] leading-snug text-gray-600 dark:text-gray-300">
            {hover.event.summary}
          </span>
        </button>
      )}
    </div>
  );
}

/** 두 "YYYY-MM" 사이의 개월 수 차이 */
function monthDistance(a: string, b: string): number {
  const toIndex = (ym: string) => Number(ym.slice(0, 4)) * 12 + Number(ym.slice(5, 7));
  return toIndex(a) - toIndex(b);
}
```

- [ ] **Step 2: 타입 검사**

Run: `npm run check`
Expected: 에러 없음. `createSeriesMarkers`나 `PriceScaleMode`를 찾지 못한다는 에러가 나면
`node_modules/lightweight-charts/dist/typings.d.ts`에서 실제 export 이름을 확인해 맞춘 뒤 진행할 것.

- [ ] **Step 3: 커밋**

```bash
git add src/components/timeline/TimelineMinimap.tsx
git commit -m "[feature/timeline-page] feat: 로그 스케일 미니맵 차트와 마커 hover 팝오버

* 시간축 줌으로 마커가 겹치는 4개 구간(1971·1997·2008·2020 부근)을 해소한다"
```

---

### Task 12: 사건 카드와 페이지 조립

**Files:**
- Create: `src/components/timeline/EventCard.tsx`
- Create: `src/components/timeline/TimelinePageClient.tsx`
- Create: `src/app/timeline/page.tsx`

- [ ] **Step 1: 사건 카드**

`src/components/timeline/EventCard.tsx`:
```tsx
import Link from 'next/link';

import { IndicatorBadge } from './IndicatorBadge';
import type { SeriesKey, TimelineEvent } from './types';

/** 카드에 노출할 지표와 순서 */
const SHOWN: SeriesKey[] = ['sp500', 'nasdaq', 'gold', 'ust10y', 'policyRate', 'kospi'];

function periodText(event: TimelineEvent): string {
  if (event.kind === 'moment') return event.markerAt.replace('-', '.');
  return `${event.peak.replace('-', '.')} – ${event.trough.replace('-', '.')}`;
}

export function EventCard({ event }: { event: TimelineEvent }) {
  return (
    <article
      id={`event-${event.slug}`}
      data-slug={event.slug}
      className="scroll-mt-32 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
    >
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
        {event.label}
        <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
          {periodText(event)}
        </span>
      </h2>

      <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {event.summary}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {SHOWN.map((key) => (
          <IndicatorBadge key={key} seriesKey={key} indicator={event.indicators[key]} />
        ))}
      </div>

      <Link
        href={event.href}
        className="mt-3 inline-block text-sm text-primary underline underline-offset-2"
      >
        {event.stub ? '지표 자세히 보기 →' : '상세 글 읽기 →'}
      </Link>
    </article>
  );
}
```

- [ ] **Step 2: 페이지 클라이언트 — 스크롤과 미니맵 조율**

`src/components/timeline/TimelinePageClient.tsx`:
```tsx
'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';

import { EventCard } from './EventCard';
import type { Point, TimelineEvent } from './types';

// canvas 기반이라 정적 export에서 SSR을 끈다
const TimelineMinimap = dynamic(
  () => import('./TimelineMinimap').then((m) => m.TimelineMinimap),
  { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-gray-100 dark:bg-gray-800" /> },
);

interface Props {
  events: TimelineEvent[];
  series: Point[];
}

export function TimelinePageClient({ events, series }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(events[0]?.slug ?? null);
  const [compact, setCompact] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // 화면 상단에 가장 가까운 카드를 활성 사건으로 삼는다
  useEffect(() => {
    const cards = listRef.current?.querySelectorAll('[data-slug]');
    if (!cards || cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveSlug(visible.target.getAttribute('data-slug'));
      },
      { rootMargin: '-140px 0px -60% 0px', threshold: 0 },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [events]);

  // 모바일에서 스크롤을 내리면 미니맵을 줄인다
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 120);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSelect = useCallback((slug: string) => {
    document.getElementById(`event-${slug}`)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">투자 역사 타임라인</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        S&amp;P 500 · 1900 – 현재 (로그 스케일). 차트를 드래그하거나 확대할 수 있습니다.
      </p>

      <div
        className={`sticky top-16 z-30 mt-4 border-b border-gray-200 bg-white transition-[height] duration-200 dark:border-gray-700 dark:bg-gray-900 ${
          compact ? 'h-12 sm:h-24' : 'h-24'
        }`}
      >
        <TimelineMinimap
          series={series}
          events={events}
          activeSlug={activeSlug}
          onSelect={handleSelect}
        />
      </div>

      <div ref={listRef} className="mt-6 space-y-4">
        {events.map((event) => (
          <EventCard key={event.slug} event={event} />
        ))}
      </div>

      <p className="mt-8 text-xs text-gray-500 dark:text-gray-400">
        출처: Robert Shiller / datasets.io (S&amp;P 500, CPI, 장기금리), FRED (나스닥, 국채, 정책금리,
        한국 주가지수), LBMA (금). 1968년 이전 금은 법정 고정가입니다.
      </p>
    </div>
  );
}
```

- [ ] **Step 3: 페이지 라우트**

`src/app/timeline/page.tsx`:
```tsx
import { readFile } from 'fs/promises';
import { join } from 'path';
import type { Metadata } from 'next';

import { TimelinePageClient } from '@/components/timeline/TimelinePageClient';
import type { TimelineEvent, TimelineSeriesFile } from '@/components/timeline/types';

export const metadata: Metadata = {
  title: '투자 역사 타임라인',
  description:
    '1900년부터 현재까지 S&P 500 위에 표시한 투자 역사의 큰 사건들. 각 사건에서 지수·금·금리·채권이 어떻게 움직였는지 함께 정리했습니다.',
};

async function loadJson<T>(name: string): Promise<T> {
  return JSON.parse(await readFile(join(process.cwd(), 'public', 'data', name), 'utf-8')) as T;
}

export default async function TimelinePage() {
  const { events } = await loadJson<{ events: TimelineEvent[] }>('timeline.json');
  const seriesFile = await loadJson<TimelineSeriesFile>('timeline-series.json');

  return <TimelinePageClient events={events} series={seriesFile.series.sp500.values} />;
}
```

- [ ] **Step 4: 타입 검사와 빌드**

Run:
```bash
npm run check
npm run build
```
Expected: 둘 다 성공. 빌드 로그에 `/timeline`이 정적 페이지로 나타나야 한다.

- [ ] **Step 5: 커밋**

```bash
git add src/components/timeline/EventCard.tsx src/components/timeline/TimelinePageClient.tsx src/app/timeline/page.tsx
git commit -m "[feature/timeline-page] feat: /timeline 페이지 — 고정 미니맵과 사건 카드 목록

* IntersectionObserver로 스크롤 위치와 미니맵 마커를 동기화한다
* 모바일에서 스크롤 시 미니맵 높이를 줄인다"
```

---

### Task 13: 사건 상세 글의 리베이스 차트

지수·금·물가는 사건 시작을 100으로 리베이스해 한 축에 올리고, 금리·수익률은 %p 단위 그대로 별도 차트에 그린다.

**Files:**
- Create: `src/components/timeline/RebasedChart.tsx`
- Create: `src/components/timeline/RateChart.tsx`
- Modify: `src/app/[category]/[slug]/page.tsx`

- [ ] **Step 1: 리베이스 차트**

`src/components/timeline/RebasedChart.tsx`:
```tsx
'use client';

import { useEffect, useRef } from 'react';
import {
  createChart,
  LineSeries,
  type IChartApi,
  type Time,
} from 'lightweight-charts';

import { useTheme } from '@/components/theme-provider';
import type { Point, SeriesKey, TimelineSeriesFile } from './types';

const LINES: { key: SeriesKey; label: string; color: string }[] = [
  { key: 'sp500', label: 'S&P 500', color: '#4f46e5' },
  { key: 'nasdaq', label: '나스닥', color: '#0ea5e9' },
  { key: 'gold', label: '금', color: '#f59e0b' },
  { key: 'cpi', label: '물가', color: '#6b7280' },
];

interface Props {
  seriesFile: TimelineSeriesFile;
  from: string;
  to: string;
}

/** 구간을 잘라 시작값 100으로 환산한다. 시작값이 없으면 빈 배열 */
function rebase(values: Point[], from: string, to: string): Point[] {
  const window = values.filter(([ym]) => ym >= from && ym <= to);
  const base = window[0]?.[1];
  if (!base) return [];
  return window.map(([ym, value]) => [ym, Math.round((value / base) * 1000) / 10]);
}

export function RebasedChart({ seriesFile, from, to }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      height: 260,
      width: containerRef.current.clientWidth,
      layout: {
        background: { color: 'transparent' },
        textColor: isDark ? '#d1d5db' : '#374151',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: isDark ? '#374151' : '#f3f4f6' },
        horzLines: { color: isDark ? '#374151' : '#f3f4f6' },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false },
    });
    chartRef.current = chart;

    for (const { key, color } of LINES) {
      const data = rebase(seriesFile.series[key].values, from, to);
      if (data.length === 0) continue;

      const line = chart.addSeries(LineSeries, {
        color,
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      line.setData(data.map(([ym, value]) => ({ time: `${ym}-01` as Time, value })));
    }

    chart.timeScale().fitContent();

    const onResize = () => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth });
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      chart.remove();
      chartRef.current = null;
    };
  }, [seriesFile, from, to, isDark]);

  return (
    <figure className="my-6">
      <div ref={containerRef} />
      <div className="mt-2 flex flex-wrap gap-3">
        {LINES.map(({ key, label, color }) => (
          <span key={key} className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
            <span className="inline-block h-0.5 w-4" style={{ backgroundColor: color }} />
            {label}
          </span>
        ))}
      </div>
      <figcaption className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        사건 시작({from.replace('-', '.')}) = 100 으로 환산. 출처: Shiller / datasets.io, FRED, LBMA.
      </figcaption>
    </figure>
  );
}
```

- [ ] **Step 2: 금리 차트**

`src/components/timeline/RateChart.tsx`:
```tsx
'use client';

import { useEffect, useRef } from 'react';
import { createChart, LineSeries, type IChartApi, type Time } from 'lightweight-charts';

import { useTheme } from '@/components/theme-provider';
import type { SeriesKey, TimelineSeriesFile } from './types';

const LINES: { key: SeriesKey; label: string; color: string }[] = [
  { key: 'ust10y', label: '美 10년물', color: '#059669' },
  { key: 'policyRate', label: '정책금리', color: '#dc2626' },
];

interface Props {
  seriesFile: TimelineSeriesFile;
  from: string;
  to: string;
}

export function RateChart({ seriesFile, from, to }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      height: 180,
      width: containerRef.current.clientWidth,
      layout: {
        background: { color: 'transparent' },
        textColor: isDark ? '#d1d5db' : '#374151',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: isDark ? '#374151' : '#f3f4f6' },
        horzLines: { color: isDark ? '#374151' : '#f3f4f6' },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false },
    });
    chartRef.current = chart;

    for (const { key, color } of LINES) {
      const data = seriesFile.series[key].values.filter(([ym]) => ym >= from && ym <= to);
      if (data.length === 0) continue;

      const line = chart.addSeries(LineSeries, {
        color,
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      line.setData(data.map(([ym, value]) => ({ time: `${ym}-01` as Time, value })));
    }

    chart.timeScale().fitContent();

    const onResize = () => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth });
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      chart.remove();
      chartRef.current = null;
    };
  }, [seriesFile, from, to, isDark]);

  return (
    <figure className="my-6">
      <div ref={containerRef} />
      <div className="mt-2 flex flex-wrap gap-3">
        {LINES.map(({ key, label, color }) => (
          <span key={key} className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
            <span className="inline-block h-0.5 w-4" style={{ backgroundColor: color }} />
            {label}
          </span>
        ))}
      </div>
      <figcaption className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        단위: 연 %. 출처: Shiller / datasets.io, FRED.
      </figcaption>
    </figure>
  );
}
```

- [ ] **Step 3: 상세 페이지에서 자동 삽입**

`src/app/[category]/[slug]/page.tsx`에 import를 추가한다:
```tsx
import { readFile } from 'fs/promises';
import { join } from 'path';

import { RebasedChart } from '@/components/timeline/RebasedChart';
import { RateChart } from '@/components/timeline/RateChart';
import type { TimelineEvent, TimelineSeriesFile } from '@/components/timeline/types';
```

같은 파일에 헬퍼를 추가한다:
```tsx
/** History 카테고리 글이면 해당 사건과 시계열을 읽어 온다 */
async function loadTimelineFor(slug: string): Promise<{
  event: TimelineEvent;
  seriesFile: TimelineSeriesFile;
} | null> {
  try {
    const dir = join(process.cwd(), 'public', 'data');
    const { events } = JSON.parse(
      await readFile(join(dir, 'timeline.json'), 'utf-8'),
    ) as { events: TimelineEvent[] };
    const event = events.find((e) => e.slug === slug);
    if (!event) return null;

    const seriesFile = JSON.parse(
      await readFile(join(dir, 'timeline-series.json'), 'utf-8'),
    ) as TimelineSeriesFile;
    return { event, seriesFile };
  } catch {
    return null;
  }
}
```

`CategorySlugPage` 안에서 `const post = await getBlogPost(slug)` 직후에 아래를 추가한다.
`slug`는 이미 그 스코프에 있는 지역 변수다 (`params.slug`가 아니다):
```tsx
  const timeline =
    post.categories?.[0]?.toLowerCase() === 'history' ? await loadTimelineFor(slug) : null;

  const timelineBlock = timeline ? (
    <section className="not-prose">
      <RebasedChart
        seriesFile={timeline.seriesFile}
        from={timeline.event.peak}
        to={timeline.event.trough}
      />
      <RateChart
        seriesFile={timeline.seriesFile}
        from={timeline.event.peak}
        to={timeline.event.trough}
      />
    </section>
  ) : null;
```

그리고 `<MarkdownRenderer` 를 렌더링하는 JSX(현재 259번째 줄 부근) **바로 위**에 `{timelineBlock}` 을 넣는다.

- [ ] **Step 4: 빌드로 확인**

Run:
```bash
npm run build
```
Expected: 성공. 빌드 로그에 `/history/1929-great-depression` 등 14개 경로가 생성돼야 한다.

- [ ] **Step 5: 커밋**

```bash
git add src/components/timeline/RebasedChart.tsx src/components/timeline/RateChart.tsx "src/app/[category]/[slug]/page.tsx"
git commit -m "[feature/timeline-page] feat: 사건 상세 글에 리베이스 차트 자동 삽입

* 지수·나스닥·금·물가는 사건 시작=100으로 환산해 한 축에 올린다
* 금리·수익률은 %p 단위이므로 별도 차트로 분리한다
* 마크다운을 건드리지 않고 category가 History일 때 페이지가 삽입한다"
```

---

### Task 14: 헤더, RSS, 사이트맵, 홈 필터 반영

**Files:**
- Modify: `src/components/header.tsx`
- Modify: `scripts/generateRssFeed.ts`
- Modify: `scripts/generateSitemap.ts`
- Modify: `src/components/category-filter-client.tsx`
- 건드리지 않음: `src/components/category-filter.tsx` (죽은 레거시 코드 — 아래 Step 4 참고)

- [ ] **Step 1: 헤더에 Timeline 추가**

`src/components/header.tsx`의 데스크톱 네비게이션 블록에서, `navItems.map(...)`이 끝난 직후에
구분선과 Timeline 링크를 추가한다. 기존 `</div>` 앞에 삽입:
```tsx
            <span className="h-4 w-px bg-gray-300 dark:bg-gray-600" aria-hidden="true" />
            <Link
              href="/timeline"
              className={`text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors ${
                pathname.startsWith('/timeline') ? 'text-primary' : ''
              }`}
            >
              Timeline
            </Link>
```

모바일 메뉴에서도 `navItems.map(...)` 직후에 추가:
```tsx
              <Link
                href="/timeline"
                className={`block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors ${
                  pathname.startsWith('/timeline') ? 'text-primary' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Timeline
              </Link>
```

- [ ] **Step 2: RSS에서 스텁 제외**

`scripts/generateRssFeed.ts`의 `BlogPost` 인터페이스에 `stub?: boolean;`을 추가하고,
`const sortedPosts = posts` 다음 줄의 체이닝 맨 앞에 필터를 넣는다:
```ts
  const sortedPosts = posts
    .filter((post) => post.stub !== true)
```

- [ ] **Step 3: 사이트맵에서 스텁 제외**

`scripts/generateSitemap.ts`의 `BlogPost` 인터페이스에 `stub?: boolean;`을 추가하고,
`const postUrls = posts.map(...)` 를 아래로 바꾼다:
```ts
  const postUrls = posts
    .filter((post) => post.stub !== true)
    .map((post) => {
```

`/timeline`을 정적 경로에도 추가한다. 같은 파일 39~42번째 줄의 `staticPages` 배열에 한 줄 추가한다.
**필드 이름은 `loc`이 아니라 `url`이다** — 기존 두 항목과 형식을 맞춘다:
```ts
  const staticPages = [
    { url: baseUrl, changefreq: determineChangefreq(baseUrl), priority: '1.0' },
    { url: `${baseUrl}/series`, changefreq: determineChangefreq(`${baseUrl}/series`), priority: '0.7' },
    { url: `${baseUrl}/timeline`, changefreq: determineChangefreq(`${baseUrl}/timeline`), priority: '0.8' },
  ];
```

- [ ] **Step 4: 홈 카테고리 필터에서 History 숨김**

**`src/components/category-filter.tsx`는 건드리지 않는다.** 이 파일은 설치되어 있지도 않은 `wouter`를
import하고 있고 아무도 import하지 않는 죽은 레거시 코드다. 살아 있는 것은 `category-filter-client.tsx`
하나뿐이며, `home-page-client.tsx`가 이것만 쓴다.

`src/components/category-filter-client.tsx`의 `allCategories` 구성을 아래로 바꾼다.
`totalCount`도 History를 뺀 값으로 계산해야 "전체" 개수가 맞는다:
```tsx
  // History는 헤더의 Timeline이 진입점이므로 홈 필터에서는 감춘다
  const visibleCategories = Array.isArray(categories)
    ? categories.filter((cat) => cat.category.toLowerCase() !== 'history')
    : []

  // Calculate total count for "전체" category
  const totalCount = visibleCategories.reduce((sum, cat) => sum + cat.count, 0)

  const allCategories: CategoryOption[] = [
    { id: "all", label: "전체", count: totalCount },
    ...visibleCategories.map(({ category, count }) => ({
      id: category,
      label: category,
      count: count
    }))
  ]
```
기존의 `totalCount` 선언과 `allCategories` 선언을 이 블록으로 통째로 대체한다.
아래쪽 `allCategories.map(...)` 렌더링 부분은 그대로 둔다.

- [ ] **Step 5: 검증**

Run:
```bash
npm run build
npx tsx -e "
const fs = require('fs');
const rss = fs.readFileSync('out/rss.xml','utf-8');
const sm = fs.readFileSync('out/sitemap.xml','utf-8');
const stubs = ['1907-bankers-panic','1971-nixon-shock','2022-inflation-tightening'];
console.log('RSS에 스텁 포함?', stubs.some(s => rss.includes(s)), '(기대 false)');
console.log('사이트맵에 스텁 포함?', stubs.some(s => sm.includes(s)), '(기대 false)');
console.log('사이트맵에 /timeline 포함?', sm.includes('/timeline'), '(기대 true)');
console.log('사이트맵에 본문글 포함?', sm.includes('1929-great-depression'), '(기대 true)');
"
```
Expected:
```
RSS에 스텁 포함? false (기대 false)
사이트맵에 스텁 포함? false (기대 false)
사이트맵에 /timeline 포함? true (기대 true)
사이트맵에 본문글 포함? true (기대 true)
```

`out/rss.xml` 또는 `out/sitemap.xml` 경로가 다르면 실제 빌드 산출물 위치를 확인해 맞출 것.

- [ ] **Step 6: 커밋**

```bash
git add src/components/header.tsx scripts/generateRssFeed.ts scripts/generateSitemap.ts src/components/category-filter-client.tsx
git commit -m "[feature/timeline-page] feat: 헤더에 Timeline 추가하고 스텁 글을 RSS·사이트맵에서 제외

* generateStaticData가 contents 하위를 전부 카테고리로 수집하므로
  History가 홈 필터에 노출되는 것을 막는다
* RSS는 최신 20개를 무필터로 뽑기 때문에 스텁 10개가 피드를 덮어쓸 수 있었다"
```

---

### Task 15: 최종 검증

**Files:** 없음 (검증만)

- [ ] **Step 1: 전체 테스트**

Run: `npm test`
Expected: PASS, 5 files / 34 tests

- [ ] **Step 2: 타입 검사와 빌드**

Run:
```bash
npm run check
npm run lint
npm run build
```
Expected: 셋 다 에러 없이 종료

- [ ] **Step 3: 로컬 서빙**

Run: `npm run start`
Expected: `http://localhost:3000`에서 서빙 시작

- [ ] **Step 4: Playwright로 화면 검증**

다른 터미널에서 MCP Playwright로 아래를 확인한다.

1. `http://localhost:3000/timeline` 이동 → 스크린샷
   - 미니맵 라인이 그려지고 마커가 14개 보이는지
   - 사건 카드 14개가 세로로 나열되는지
   - 한글이 깨지지 않는지
2. 미니맵의 마커 근처에 hover → 팝오버에 사건명과 요약이 뜨는지
3. 미니맵을 마우스 휠로 확대 → 겹쳐 있던 마커가 벌어지는지
4. 카드의 "상세 글 읽기" 클릭 → `/history/1929-great-depression`으로 이동하는지
   - 본문 위에 리베이스 차트와 금리 차트가 뜨는지
5. 헤더의 Timeline 링크가 데스크톱·모바일 폭 양쪽에서 보이는지
6. 다크모드 토글 → 차트 텍스트 색이 따라 바뀌는지
7. 홈(`http://localhost:3000`)의 카테고리 필터에 `History`가 **없는지**
8. 브라우저 콘솔에 에러가 없는지

- [ ] **Step 5: 인코딩 최종 확인**

Run:
```bash
file -I contents/history/*/index.md docs/superpowers/plans/2026-08-01-timeline-page.md | grep -v "charset=utf-8" || echo "전부 UTF-8"
```
Expected: `전부 UTF-8`

- [ ] **Step 6: PR 생성**

```bash
git push -u origin feature/timeline-page
gh pr create --title "Timeline 페이지 추가" --body "$(cat <<'EOF'
## Summary
- 1900년부터의 S&P 500 로그 차트에 투자 역사 사건 14개를 마커로 표시하는 `/timeline` 페이지 추가
- 각 사건에서 지수·나스닥·금·美10년물·정책금리·한국 주가지수가 어떻게 움직였는지 자동 계산해 함께 표시
- 사건 상세 글에는 사건 시작=100 리베이스 차트와 금리 차트를 자동 삽입
- 미사용 상태였던 recharts와 `src/components/ui/chart.tsx` 제거, lightweight-charts 도입

## 데이터
- 백엔드 없이 `data/timeline/series.json`을 저장소에 커밋하고 빌드는 이 파일만 읽는다
- 출처는 모두 API 키가 필요 없다 — Shiller 파생 CSV(datasets.io), FRED, LBMA
- 갱신은 `npm run timeline:fetch` 수동 실행

## Test plan
- [ ] `npm test` — 파이프라인 순수 함수 34개 통과
- [ ] `npm run check` / `npm run lint` / `npm run build`
- [ ] `/timeline`에서 마커 hover 팝오버, 줌, 스크롤 동기화 확인
- [ ] 사건 상세 글에 차트 2종이 삽입되는지 확인
- [ ] 홈 카테고리 필터에 History가 없고, RSS·사이트맵에 스텁이 없는지 확인
- [ ] 다크모드에서 차트 색상 확인

설계 문서: `docs/superpowers/specs/2026-08-01-timeline-page-design.md`
EOF
)"
```

---

## 알아둘 것

- **`npm run dev` / `npm run build`는 `generateStaticData.ts`를 먼저 돌린다.** `data/timeline/series.json`이 없으면 Task 9 이후로는 빌드가 깨진다. Task 7을 반드시 먼저 끝낼 것.
- **`npm run timeline:fetch`는 빌드가 부르지 않는다.** 수동 실행 전용이다.
- **프로덕션 빌드는 TypeScript 에러를 무시한다** (`ignoreBuildErrors: true`). `npm run build`가 통과해도 `npm run check`를 따로 돌려야 한다.
- **`npm run check`는 기존 에러 11개 때문에 원래 실패한다.** Task 1 완료 시점(커밋 `5956704`)에 측정한 베이스라인이며, 이번 작업과 무관한 레거시 코드다. 각 태스크의 "`npm run check` 에러 없음"은 **"이 목록보다 늘지 않았음"** 으로 읽어야 한다.

  | 파일 | 개수 | 원인 |
  |---|---|---|
  | `src/lib/search.ts` | 3 | 미설치 `fuse.js`, `@shared/schema` |
  | `src/lib/queryClient.ts` | 2 | `ImportMeta.env` |
  | `src/lib/user-analytics.ts` | 1 | 암묵적 any |
  | `src/lib/seo.ts` | 1 | 미설치 `@shared/schema` |
  | `src/lib/blog-client.ts` | 1 | `BlogPost` export |
  | `src/components/series-navigation.tsx` | 1 | 미설치 `wouter` |
  | `src/components/markdown-renderer.tsx` | 1 | `Blob` 타입 |
  | `src/components/category-filter.tsx` | 1 | 미설치 `wouter` (죽은 코드) |

  확인 방법: `npm run check 2>&1 | grep -cE "error TS"` → **11이면 정상**, 12 이상이면 이번 변경이 에러를 추가한 것이다.
- **`npm run check`는 `scripts/` 를 아예 보지 않는다.** `tsconfig.json`의 `include`가 `src`/`shared`/`server`만 담고 있어서,
  `scripts/` 아래에 타입 에러를 심어도 검출되지 않는 것을 실측으로 확인했다. vitest도 esbuild로 타입을 지울 뿐 검사하지 않는다.
  그래서 `tsconfig.scripts.json`과 **`npm run check:scripts`** 를 추가했다 (커밋 `1f18610`).

  | 대상 | 명령 | 합격 기준 |
  |---|---|---|
  | `scripts/**` (Task 2~9) | `npm run check:scripts` | **에러 0, exit 0** |
  | `src/**` (Task 10~14) | `npm run check` | 기존 11개보다 늘지 않음 |

  `scripts/` 아래 코드를 만지는 태스크는 반드시 `npm run check:scripts`를 돌려야 한다. `npm run check`만으로는 아무것도 검증되지 않는다.
- **`package-lock.json`은 이 저장소에서 gitignore 대상이다** (`.gitignore:72`). 커밋 명령에 들어 있어도 스테이징되지 않는 게 정상이다.
- **`npm test`는 테스트 파일이 생기기 전(Task 3 이전)까지 "No test files found"로 exit 1** 한다. 정상이다.
- **이 저장소의 GitHub Actions는 대부분 `.disabled` 상태다.** CI가 검증해 줄 거라 가정하지 말 것.
- **lightweight-charts v5의 export 이름**(`createSeriesMarkers`, `PriceScaleMode`, `LineSeries`)이 설치된 버전과 다르면, `node_modules/lightweight-charts/dist/typings.d.ts`에서 확인해 맞출 것. 참고 구현이 `moneyflow.advenoh.pe.kr/frontend/components/chart/StockChart.tsx`에 있다.
