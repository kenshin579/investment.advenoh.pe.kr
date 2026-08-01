import { describe, expect, it } from 'vitest';
import { toMonthly } from './resample';

describe('toMonthly', () => {
  it('각 월의 마지막 관측치를 쓴다', () => {
    const daily: [string, number][] = [
      ['2020-01-02', 10],
      ['2020-01-31', 12],
      ['2020-02-03', 20],
      ['2020-02-28', 25],
    ];
    expect(toMonthly(daily)).toEqual([
      ['2020-01', 12],
      ['2020-02', 25],
    ]);
  });

  it('월말 영업일이 없어도 그 달의 마지막 값을 쓴다', () => {
    const daily: [string, number][] = [
      ['2020-03-02', 1],
      ['2020-03-20', 2],
    ];
    expect(toMonthly(daily)).toEqual([['2020-03', 2]]);
  });

  it('입력 순서가 뒤섞여도 날짜 기준으로 정렬해 처리한다', () => {
    const daily: [string, number][] = [
      ['2020-01-31', 12],
      ['2020-01-02', 10],
    ];
    expect(toMonthly(daily)).toEqual([['2020-01', 12]]);
  });

  it('빈 입력은 빈 배열을 낸다', () => {
    expect(toMonthly([])).toEqual([]);
  });
});
