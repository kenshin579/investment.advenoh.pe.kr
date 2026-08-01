import { SERIES_LABEL, type Indicator, type SeriesKey } from './types';

const BASE =
  'inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap';

function toneClass(kind: Indicator['kind'], value: number): string {
  if (kind === 'fixed' || kind === 'unavailable') {
    return 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400';
  }
  if (value > 0) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
  if (value < 0) return 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300';
  return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
}

function body(indicator: Indicator): string {
  switch (indicator.kind) {
    case 'change':
      return `${indicator.value > 0 ? '+' : ''}${indicator.value}%`;
    case 'delta':
      return `${indicator.value > 0 ? '+' : ''}${indicator.value}%p`;
    case 'fixed':
      return indicator.note;
    case 'unavailable':
      return indicator.note;
  }
}

export function IndicatorBadge({
  seriesKey,
  indicator,
}: {
  seriesKey: SeriesKey;
  indicator: Indicator;
}) {
  const value = indicator.kind === 'change' || indicator.kind === 'delta' ? indicator.value : 0;

  return (
    <span className={`${BASE} ${toneClass(indicator.kind, value)}`}>
      <span className="opacity-70">{SERIES_LABEL[seriesKey]}</span>
      <span>{body(indicator)}</span>
    </span>
  );
}
