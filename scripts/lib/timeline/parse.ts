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
 * CPI·Long Interest Rate 컬럼은 SP500보다 몇 년까지 뒤처져 갱신되며, 그 구간은 0.0 으로 채워져 온다.
 * (2026-08-01 기준으로 두 계열은 2023-09 에서 끊긴다 — 34개월치다. 이 격차는 원본이 갱신될 때마다 달라진다.)
 * 그래서 이 두 계열은 호출자가 다른 소스로 이어붙여야 한다: CPI 는 FRED CPIAUCNS, 장기금리는 FRED DGS10.
 *
 * 0 은 세 계열 모두에서 동일하게 결측으로 처리한다. 주가지수와 장기금리는 0 이 될 수 없으므로 안전하다.
 * 0 이 실제 관측값일 수 있는 계열(예: ZIRP 구간의 정책금리)에는 이 함수를 쓰면 안 된다.
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
