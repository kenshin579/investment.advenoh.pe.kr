'use client';

import { useEffect, useRef } from 'react';
import {
  createChart,
  LineSeries,
  type IChartApi,
  type Time,
} from 'lightweight-charts';

import { useTheme } from '@/components/theme-provider';
import type { Point, SeriesKey, WindowedSeries } from './types';

const LINES: { key: SeriesKey; label: string; color: string }[] = [
  { key: 'sp500', label: 'S&P 500', color: '#4f46e5' },
  { key: 'nasdaq', label: '나스닥', color: '#0ea5e9' },
  { key: 'gold', label: '금', color: '#f59e0b' },
  { key: 'cpi', label: '물가', color: '#6b7280' },
];

interface Props {
  /**
   * 차트에 그릴 계열들. 서버가 잘라서 넘긴다.
   * 짧은 사건은 최소 24개월이 되도록 앞뒤로 늘어나 있으므로,
   * 이 배열의 첫 달이 사건 시작(from)과 다를 수 있다.
   */
  series: WindowedSeries;
  /** 사건 시작. 리베이스 기준점이다 */
  from: string;
  to: string;
}

/**
 * 사건 시작(from) 시점을 100으로 환산한다.
 *
 * 창의 첫 값이 아니라 from 을 기준으로 삼는 이유: 짧은 사건은 창이 앞뒤로 늘어나 있어서
 * 첫 값이 사건 시작보다 몇 달 앞선다. 그걸 100으로 잡으면 "사건 시작 = 100" 이 거짓이 된다.
 * from 을 기준으로 하면 사건 이전 구간은 100 위로, 이후는 아래로 그려져 흐름이 그대로 읽힌다.
 */
function rebase(values: Point[], from: string): Point[] {
  const base = (values.find(([ym]) => ym >= from) ?? values[0])?.[1];
  if (!base) return [];
  return values.map(([ym, value]) => [ym, Math.round((value / base) * 1000) / 10]);
}

export function RebasedChart({ series, from, to }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      height: 260,
      width: containerRef.current.clientWidth,
      layout: {
        background: { color: 'transparent' },
        textColor: isDark ? '#d1d5db' : '#374151',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: isDark ? '#374151' : '#f3f4f6' },
        horzLines: { color: isDark ? '#374151' : '#f3f4f6' },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false },
    });
    chartRef.current = chart;

    for (const { key, color } of LINES) {
      const data = rebase(series[key] ?? [], from);
      if (data.length === 0) continue;

      const line = chart.addSeries(LineSeries, {
        color,
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      line.setData(data.map(([ym, value]) => ({ time: `${ym}-01` as Time, value })));
    }

    chart.timeScale().fitContent();

    const onResize = () => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth });
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      chart.remove();
      chartRef.current = null;
    };
  }, [series, from, isDark]);

  return (
    <figure className="my-6">
      <div ref={containerRef} />
      <div className="mt-2 flex flex-wrap gap-3">
        {LINES.map(({ key, label, color }) => (
          <span key={key} className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
            <span className="inline-block h-0.5 w-4" style={{ backgroundColor: color }} />
            {label}
          </span>
        ))}
      </div>
      <figcaption className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        사건 시작({from.replace('-', '.')}) = 100 으로 환산. 짧은 사건은 앞뒤 흐름이 보이도록 구간을 넓혔다.
        지수는 월중 평균, 그 외는 월말 값 기준.
        출처: Shiller / datasets.io, FRED, LBMA.
      </figcaption>
    </figure>
  );
}
