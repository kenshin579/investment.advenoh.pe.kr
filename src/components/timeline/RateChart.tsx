'use client';

import { useEffect, useRef } from 'react';
import { createChart, LineSeries, type IChartApi, type Time } from 'lightweight-charts';

import { useTheme } from '@/components/theme-provider';
import type { SeriesKey, WindowedSeries } from './types';

const LINES: { key: SeriesKey; label: string; color: string }[] = [
  { key: 'ust10y', label: '美 10년물', color: '#059669' },
  { key: 'policyRate', label: '정책금리', color: '#dc2626' },
];

interface Props {
  /** 이미 사건 구간으로 잘린 계열들. 서버에서 잘라 넘긴다 */
  series: WindowedSeries;
}

export function RateChart({ series }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      height: 180,
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
      const data = series[key] ?? [];
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
  }, [series, isDark]);

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
        단위: 연 %. 출처: Shiller / datasets.io, FRED.
      </figcaption>
    </figure>
  );
}
