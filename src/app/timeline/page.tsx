import { readFile } from 'fs/promises';
import { join } from 'path';
import type { Metadata } from 'next';

import { TimelinePageClient } from '@/components/timeline/TimelinePageClient';
import type { TimelineEvent, TimelineSeriesFile } from '@/components/timeline/types';

export const metadata: Metadata = {
  title: '투자 역사 타임라인',
  description:
    '1900년부터 현재까지 S&P 500 위에 표시한 투자 역사의 큰 사건들. 각 사건에서 지수·금·금리·채권이 어떻게 움직였는지 함께 정리했습니다.',
};

async function loadJson<T>(name: string): Promise<T> {
  return JSON.parse(await readFile(join(process.cwd(), 'public', 'data', name), 'utf-8')) as T;
}

export default async function TimelinePage() {
  const { events } = await loadJson<{ events: TimelineEvent[] }>('timeline.json');
  const seriesFile = await loadJson<TimelineSeriesFile>('timeline-series.json');

  return <TimelinePageClient events={events} series={seriesFile.series.sp500.values} />;
}
