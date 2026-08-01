'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';

import { EventCard } from './EventCard';
import type { Point, TimelineEvent } from './types';

// canvas 기반이라 정적 export에서 SSR을 끈다
const TimelineMinimap = dynamic(
  () => import('./TimelineMinimap').then((m) => m.TimelineMinimap),
  { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-gray-100 dark:bg-gray-800" /> },
);

interface Props {
  events: TimelineEvent[];
  series: Point[];
}

export function TimelinePageClient({ events, series }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(events[0]?.slug ?? null);
  const [compact, setCompact] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // 화면 상단에 가장 가까운 카드를 활성 사건으로 삼는다
  useEffect(() => {
    const cards = listRef.current?.querySelectorAll('[data-slug]');
    if (!cards || cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveSlug(visible.target.getAttribute('data-slug'));
      },
      { rootMargin: '-140px 0px -60% 0px', threshold: 0 },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [events]);

  // 모바일에서 스크롤을 내리면 미니맵을 줄인다
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 120);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSelect = useCallback((slug: string) => {
    document.getElementById(`event-${slug}`)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">투자 역사 타임라인</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        S&amp;P 500 · 1900 – 현재 (로그 스케일). 차트를 드래그하거나 확대할 수 있습니다.
      </p>

      <div
        className={`sticky top-16 z-30 mt-4 border-b border-gray-200 bg-white transition-[height] duration-200 dark:border-gray-700 dark:bg-gray-900 ${
          compact ? 'h-12 sm:h-24' : 'h-24'
        }`}
      >
        <TimelineMinimap
          series={series}
          events={events}
          activeSlug={activeSlug}
          onSelect={handleSelect}
        />
      </div>

      <div ref={listRef} className="mt-6 space-y-4">
        {events.map((event) => (
          <EventCard key={event.slug} event={event} />
        ))}
      </div>

      <p className="mt-8 text-xs text-gray-500 dark:text-gray-400">
        출처: Robert Shiller / datasets.io (S&amp;P 500, CPI, 장기금리), FRED (나스닥, 국채, 정책금리,
        한국 주가지수), LBMA (금). 1968년 이전 금은 법정 고정가입니다.
      </p>
    </div>
  );
}
