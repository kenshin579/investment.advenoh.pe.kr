import { describe, expect, it } from 'vitest';
import { changePct, deltaPP, valueAt } from './returns';

const sp500: [string, number][] = [
  ['1929-09', 31.3],
  ['1930-01', 21.7],
  ['1932-06', 4.77],
];

const gs10: [string, number][] = [
  ['1929-09', 3.39],
  ['1932-06', 3.53],
];

describe('valueAt', () => {
  it('정확히 일치하는 월의 값을 낸다', () => {
    expect(valueAt(sp500, '1930-01')).toBe(21.7);
  });

  it('없는 월은 null을 낸다', () => {
    expect(valueAt(sp500, '1931-01')).toBeNull();
  });
});

describe('changePct', () => {
  it('대공황 구간 변동률을 소수점 둘째 자리까지 계산한다', () => {
    expect(changePct(sp500, '1929-09', '1932-06')).toBe(-84.76);
  });

  it('상승 구간은 양수를 낸다', () => {
    const s: [string, number][] = [['2000-01', 100], ['2000-02', 125]];
    expect(changePct(s, '2000-01', '2000-02')).toBe(25);
  });

  it('한쪽이라도 없으면 null을 낸다', () => {
    expect(changePct(sp500, '1800-01', '1932-06')).toBeNull();
  });

  it('시작값이 0이면 null을 낸다', () => {
    const s: [string, number][] = [['2000-01', 0], ['2000-02', 5]];
    expect(changePct(s, '2000-01', '2000-02')).toBeNull();
  });
});

describe('deltaPP', () => {
  it('퍼센트포인트 차이를 낸다', () => {
    expect(deltaPP(gs10, '1929-09', '1932-06')).toBe(0.14);
  });

  it('하락은 음수를 낸다', () => {
    const s: [string, number][] = [['2007-10', 5.25], ['2009-03', 0.25]];
    expect(deltaPP(s, '2007-10', '2009-03')).toBe(-5);
  });

  it('한쪽이라도 없으면 null을 낸다', () => {
    expect(deltaPP(gs10, '1929-09', '2100-01')).toBeNull();
  });
});
