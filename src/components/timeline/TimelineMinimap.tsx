'use client';

import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  createSeriesMarkers,
  LineSeries,
  PriceScaleMode,
  type IChartApi,
  type ISeriesApi,
  type ISeriesMarkersPluginApi,
  type MouseEventParams,
  type Time,
} from 'lightweight-charts';

import { useTheme } from '@/components/theme-provider';
import type { Point, TimelineEvent } from './types';

interface Props {
  series: Point[];
  events: TimelineEvent[];
  /** 현재 스크롤 위치에 해당하는 사건 slug */
  activeSlug: string | null;
  onSelect: (slug: string) => void;
}

interface HoverState {
  event: TimelineEvent;
  x: number;
  y: number;
}

/** "1929-09" → "1929-09-01" (lightweight-charts의 business day 문자열) */
function toTime(ym: string): Time {
  return `${ym}-01` as Time;
}

export function TimelineMinimap({ series, events, activeSlug, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const lineRef = useRef<ISeriesApi<'Line'> | null>(null);
  const markersRef = useRef<ISeriesMarkersPluginApi<Time> | null>(null);
  const [hover, setHover] = useState<HoverState | null>(null);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // 차트 생성 — 마운트 시 1회
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      height: containerRef.current.clientHeight,
      layout: {
        background: { color: 'transparent' },
        textColor: isDark ? '#d1d5db' : '#374151',
        attributionLogo: false,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      rightPriceScale: {
        visible: false,
        mode: PriceScaleMode.Logarithmic,
        // 기본 여백(top 0.2 / bottom 0.1)에 aboveBar 마커 공간까지 더해지면
        // 라인이 캔버스 세로의 1/3 안으로 눌려 로그 스케일인데도 평평해 보인다.
        // 미니맵은 높이가 100px 남짓이라 여백을 최소로 줘야 대공황 낙폭이 눈에 보인다.
        scaleMargins: { top: 0.12, bottom: 0.04 },
      },
      timeScale: { borderVisible: false, timeVisible: false },
      crosshair: { mode: 1 },
      handleScroll: true,
      handleScale: true,
    });

    const line = chart.addSeries(LineSeries, {
      color: '#4f46e5',
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    chartRef.current = chart;
    lineRef.current = line;
    // 마커 프리미티브는 여기서 한 번만 붙인다. 아래 "데이터와 마커 반영" effect가
    // 매번 createSeriesMarkers를 다시 부르면 그때마다 새 프리미티브가 series에
    // 추가로 attach되어(detach 없이) 마커가 겹겹이 중복 렌더링된다.
    // 갱신은 이 인스턴스의 setMarkers()로만 한다.
    markersRef.current = createSeriesMarkers(line, []);

    const onResize = () => {
      if (!containerRef.current) return;
      chart.applyOptions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    };
    onResize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      chart.remove();
      chartRef.current = null;
      lineRef.current = null;
      markersRef.current = null;
    };
    // 테마는 아래 별도 effect에서 반영한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 테마 변경 반영
  useEffect(() => {
    chartRef.current?.applyOptions({
      layout: { textColor: isDark ? '#d1d5db' : '#374151' },
    });
  }, [isDark]);

  // 데이터와 마커 반영
  useEffect(() => {
    const line = lineRef.current;
    const chart = chartRef.current;
    if (!line || !chart) return;

    line.setData(series.map(([ym, value]) => ({ time: toTime(ym), value })));

    markersRef.current?.setMarkers(
      events.map((event) => ({
        time: toTime(event.markerAt),
        position: 'aboveBar' as const,
        color: event.slug === activeSlug ? '#ef4444' : '#9ca3af',
        shape: 'circle' as const,
        size: event.slug === activeSlug ? 2 : 1,
      })),
    );

    chart.timeScale().fitContent();
  }, [series, events, activeSlug]);

  // 마커 hover 팝오버
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const handler = (param: MouseEventParams) => {
      if (!param.time || !param.point) {
        setHover(null);
        return;
      }

      const ym = String(param.time).slice(0, 7);
      // 마커에서 가장 가까운 사건을 찾되, 3개월 이상 떨어지면 무시한다
      const near = events.find((event) => {
        const diff = Math.abs(monthDistance(event.markerAt, ym));
        return diff <= 3;
      });

      setHover(near ? { event: near, x: param.point.x, y: param.point.y } : null);
    };

    chart.subscribeCrosshairMove(handler);
    return () => chart.unsubscribeCrosshairMove(handler);
  }, [events]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />

      {hover && (
        <button
          type="button"
          onClick={() => onSelect(hover.event.slug)}
          style={{ left: Math.min(hover.x + 12, 320), top: 8 }}
          className="absolute z-10 max-w-xs rounded-md border border-indigo-300 bg-white p-2 text-left shadow-lg dark:border-indigo-500 dark:bg-gray-800"
        >
          <span className="block text-xs font-semibold text-gray-900 dark:text-gray-100">
            {hover.event.label}
          </span>
          <span className="mt-0.5 block text-[11px] leading-snug text-gray-600 dark:text-gray-300">
            {hover.event.summary}
          </span>
        </button>
      )}
    </div>
  );
}

/** 두 "YYYY-MM" 사이의 개월 수 차이 */
function monthDistance(a: string, b: string): number {
  const toIndex = (ym: string) => Number(ym.slice(0, 4)) * 12 + Number(ym.slice(5, 7));
  return toIndex(a) - toIndex(b);
}
