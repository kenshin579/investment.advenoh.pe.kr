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
