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
