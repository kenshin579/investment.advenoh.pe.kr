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

  it('headlineDrawdown 이 있으면 자동 계산값 대신 그것을 쓴다', () => {
    const e = buildEvent(
      'x',
      'x',
      { ...frontMatter, headlineDrawdown: -86 },
      false,
      seriesFile,
    );
    expect(e.drawdown).toBe(-86);
    expect(e.drawdownSource).toBe('daily');
    // 카드 배지도 같은 값을 말해야 한다
    expect(e.indicators.sp500).toEqual({ kind: 'change', value: -86 });
    // 나머지 지표는 그대로 자동 계산이다
    expect(e.indicators.ust10y).toEqual({ kind: 'delta', value: 0.14, unit: '%p' });
  });

  it('headlineDrawdown 이 없으면 자동 계산값과 monthly 를 쓴다', () => {
    const e = buildEvent('x', 'x', frontMatter, false, seriesFile);
    expect(e.drawdown).toBe(-84.76);
    expect(e.drawdownSource).toBe('monthly');
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
