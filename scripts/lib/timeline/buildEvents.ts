import { changePct, deltaPP, valueAt } from './returns';
import type { Indicator, SeriesFile, SeriesKey, YearMonth } from './types';

type EventCommon = {
  label: string;
  summary: string;
  /**
   * 통상 인용되는 낙폭(일간 종가 고점→저점 기준). 생략하면 월간 데이터에서 계산한 값을 쓴다.
   *
   * Shiller S&P 500 은 월중 평균이고 구간도 월 단위라, 자동 계산값이 세상이 아는 숫자와
   * 벌어진다 (코로나: 자동 -19.07% vs 통상 -34%). 손으로 넣는 숫자는 이것 하나뿐이다.
   */
  headlineDrawdown?: number;
};

export type EventFrontMatter =
  | ({ kind: 'drawdown'; peak: YearMonth; trough: YearMonth } & EventCommon)
  | ({ kind: 'moment'; at: YearMonth } & EventCommon);

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
  /** drawdown 이 어느 기준에서 나왔는지. 'daily' 는 frontmatter 의 headlineDrawdown */
  drawdownSource: 'monthly' | 'daily';
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

  const computed = indicators.sp500.kind === 'change' ? indicators.sp500.value : null;

  // 손으로 넣은 값이 있으면 배지에 보이는 지수 지표도 그 값으로 맞춘다.
  // 그러지 않으면 카드의 배지(-19%)와 drawdown 필드(-34%)가 서로 다른 숫자를 말하게 된다.
  if (fm.headlineDrawdown !== undefined) {
    indicators.sp500 = { kind: 'change', value: fm.headlineDrawdown };
  }

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
    // 손으로 넣은 값이 있으면 그것이 이긴다. 나머지 지표는 언제나 자동 계산이다.
    drawdown: fm.headlineDrawdown ?? computed,
    drawdownSource: fm.headlineDrawdown === undefined ? 'monthly' : 'daily',
    indicators,
  };
}
