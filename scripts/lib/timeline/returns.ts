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
