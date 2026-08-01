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
 * 여러 구간을 병합한다. 배열 뒤쪽이 더 신뢰할 수 있는 출처라고 보고,
 * 같은 월이 겹치면 뒤쪽 값이 이긴다.
 *
 * 주의: 이 함수는 앞 구간을 **끊지 않는다.** 겹치는 달만 덮어쓸 뿐이다.
 * 앞 구간이 뒤 구간의 시작보다 늦은 달까지 뻗어 있고 그 달이 뒤 구간에 없으면,
 * 앞 구간 값이 그대로 살아남는다.
 *
 * 따라서 **호출자가 앞 구간을 경계에서 미리 잘라 넘겨야 한다.**
 * 예: `spliceSeries([shillerCpi.filter(([ym]) => ym < '1913-01'), fredCpi])`
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
