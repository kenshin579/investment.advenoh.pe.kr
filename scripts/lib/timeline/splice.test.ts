import { describe, expect, it } from 'vitest';
import { constantMonths, spliceSeries } from './splice';

describe('constantMonths', () => {
  it('구간 전체를 같은 값으로 채운다', () => {
    expect(constantMonths('1900-01', '1900-04', 20.67)).toEqual([
      ['1900-01', 20.67],
      ['1900-02', 20.67],
      ['1900-03', 20.67],
      ['1900-04', 20.67],
    ]);
  });

  it('연도 경계를 넘어간다', () => {
    expect(constantMonths('1933-11', '1934-02', 35)).toEqual([
      ['1933-11', 35],
      ['1933-12', 35],
      ['1934-01', 35],
      ['1934-02', 35],
    ]);
  });

  it('시작이 끝보다 뒤면 빈 배열을 낸다', () => {
    expect(constantMonths('1900-05', '1900-01', 1)).toEqual([]);
  });
});

describe('spliceSeries', () => {
  it('뒤 구간이 시작되는 월부터는 뒤 구간을 쓴다', () => {
    const older: [string, number][] = [
      ['1961-11', 3.9],
      ['1961-12', 4.0],
      ['1962-01', 99],
      ['1962-02', 99],
    ];
    const newer: [string, number][] = [
      ['1962-01', 4.08],
      ['1962-02', 4.12],
    ];
    expect(spliceSeries([older, newer])).toEqual([
      ['1961-11', 3.9],
      ['1961-12', 4.0],
      ['1962-01', 4.08],
      ['1962-02', 4.12],
    ]);
  });

  it('세 구간도 순서대로 이어붙인다', () => {
    const a: [string, number][] = [['1900-01', 20.67], ['1934-01', 20.67]];
    const b: [string, number][] = [['1934-01', 35], ['1968-04', 35]];
    const c: [string, number][] = [['1968-04', 37.7]];
    expect(spliceSeries([a, b, c])).toEqual([
      ['1900-01', 20.67],
      ['1934-01', 35],
      ['1968-04', 37.7],
    ]);
  });

  it('빈 구간이 섞여 있어도 무시한다', () => {
    const a: [string, number][] = [['1990-01', 1]];
    expect(spliceSeries([a, [], []])).toEqual([['1990-01', 1]]);
  });

  it('결과는 월 오름차순이며 중복 월이 없다', () => {
    const a: [string, number][] = [['2000-02', 1], ['2000-01', 1]];
    const b: [string, number][] = [['2000-02', 2]];
    const out = spliceSeries([a, b]);
    expect(out).toEqual([['2000-01', 1], ['2000-02', 2]]);
  });
});
