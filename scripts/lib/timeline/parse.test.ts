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
