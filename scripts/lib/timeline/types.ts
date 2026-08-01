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
