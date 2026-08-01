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
  /** 'daily' 면 frontmatter 의 headlineDrawdown, 'monthly' 면 자동 계산값 */
  drawdownSource: 'monthly' | 'daily';
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

/**
 * 사건 구간으로 이미 잘려 나온 계열들.
 *
 * 전체 시계열은 8,627 포인트(minify 150KB)라 클라이언트로 통째로 넘기면 안 된다.
 * 서버 컴포넌트가 사건 구간(보통 12~36개월)만 잘라 이 형태로 넘긴다 — 2KB 수준.
 */
export type WindowedSeries = Partial<Record<SeriesKey, Point[]>>;

export const SERIES_LABEL: Record<SeriesKey, string> = {
  sp500: '지수',
  nasdaq: '나스닥',
  gold: '금',
  ust10y: '美10년물',
  policyRate: '기준금리',
  cpi: '물가',
  kospi: '한국',
};
