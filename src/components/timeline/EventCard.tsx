import Link from 'next/link';

import { IndicatorBadge } from './IndicatorBadge';
import type { SeriesKey, TimelineEvent } from './types';

/** 카드에 노출할 지표와 순서 */
const SHOWN: SeriesKey[] = ['sp500', 'nasdaq', 'gold', 'ust10y', 'policyRate', 'kospi'];

function periodText(event: TimelineEvent): string {
  if (event.kind === 'moment') return event.markerAt.replace('-', '.');
  return `${event.peak.replace('-', '.')} – ${event.trough.replace('-', '.')}`;
}

export function EventCard({ event }: { event: TimelineEvent }) {
  return (
    <article
      id={`event-${event.slug}`}
      data-slug={event.slug}
      className="scroll-mt-32 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
    >
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
        {event.label}
        <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
          {periodText(event)}
        </span>
      </h2>

      <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {event.summary}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {SHOWN.map((key) => (
          <IndicatorBadge key={key} seriesKey={key} indicator={event.indicators[key]} />
        ))}
      </div>

      <Link
        href={event.href}
        className="mt-3 inline-block text-sm text-primary underline underline-offset-2"
      >
        {event.stub ? '지표 자세히 보기 →' : '상세 글 읽기 →'}
      </Link>
    </article>
  );
}
