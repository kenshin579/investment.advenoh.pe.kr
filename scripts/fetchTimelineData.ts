/**
 * 타임라인용 장기 시계열을 수집해 data/timeline/series.json 으로 저장한다.
 *
 * 수동 실행 전용: npm run timeline:fetch
 * 빌드는 이 스크립트를 부르지 않고, 커밋된 series.json 만 읽는다.
 *
 * 소스 하나가 실패해도 나머지는 갱신한다. 실패한 계열은 기존 파일의 값을
 * 그대로 유지하고 경고만 남긴다. (FRED의 GOLDPMGBD228NLBM 이 실제로 폐지된 전례가 있다.)
 */
import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import { parseFredCsv, parseLbmaJson, parseShillerCsv } from './lib/timeline/parse';
import { toMonthly } from './lib/timeline/resample';
import { constantMonths, spliceSeries } from './lib/timeline/splice';
import type { Point, SeriesFile, SeriesKey } from './lib/timeline/types';

const START = '1900-01';
const OUT_DIR = join('data', 'timeline');
const OUT_FILE = join(OUT_DIR, 'series.json');
const SOURCES_FILE = join(OUT_DIR, 'sources.json');

const SHILLER_URL =
  'https://raw.githubusercontent.com/datasets/s-and-p-500/main/data/data.csv';
const LBMA_URL = 'https://prices.lbma.org.uk/json/gold_pm.json';
const fredUrl = (id: string) => `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}`;

const warnings: string[] = [];

async function fetchText(url: string, label: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'investment.advenoh.pe.kr timeline fetcher' },
    });
    if (!res.ok) {
      warnings.push(`${label}: HTTP ${res.status}`);
      return null;
    }
    return await res.text();
  } catch (error) {
    warnings.push(`${label}: ${(error as Error).message}`);
    return null;
  }
}

/**
 * 파싱을 감싼다. 원본이 CSV/JSON 이 아니면 파서가 예외를 던질 수 있는데,
 * 그게 전체 수집을 중단시키면 안 된다.
 *
 * 이건 가정이 아니다 — 이 프로젝트를 조사하는 동안 Stooq 가 실제로 HTTP 200 과 함께
 * JS 챌린지 HTML 을 반환했다. LBMA·FRED 도 같은 방식으로 죽을 수 있다.
 */
function parseSafe<T>(parse: () => T, fallback: T, label: string): T {
  try {
    return parse();
  } catch (error) {
    warnings.push(`${label}: 파싱 실패 — ${(error as Error).message}`);
    return fallback;
  }
}

/**
 * 파싱 결과가 명백히 부족하면 소스가 깨진 것으로 본다.
 *
 * HTTP 200 으로 HTML 이 오면 CSV 파서는 예외를 던지지 않고 **조용히 빈 배열**을 낸다.
 * 그 값을 그대로 쓰면 커밋되어 있던 정상 데이터를 빈 배열로 덮어써 버린다.
 * 그래서 개수 하한을 두고, 미달이면 null 을 돌려 호출자가 기존 값을 유지하게 한다.
 */
function sane(points: Point[], minCount: number, label: string): Point[] | null {
  if (points.length >= minCount) return points;
  warnings.push(
    `${label}: 파싱 결과가 ${points.length}개뿐이다 (최소 ${minCount} 기대) — 소스가 깨졌을 가능성`,
  );
  return null;
}

/** START 이전 데이터를 잘라낸다 */
function clampFrom(points: Point[], from = START): Point[] {
  return points.filter(([ym]) => ym >= from);
}

async function loadPrevious(): Promise<SeriesFile | null> {
  try {
    return JSON.parse(await readFile(OUT_FILE, 'utf-8')) as SeriesFile;
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  const previous = await loadPrevious();
  const keep = (key: SeriesKey): Point[] => {
    const kept = previous?.series?.[key]?.values ?? [];
    if (kept.length > 0) warnings.push(`${key}: 기존 커밋 값을 유지한다 (${kept.length}개월)`);
    return kept;
  };

  /** FRED 계열 하나를 받아 월간으로 집계한다. 실패하면 빈 배열 */
  const fred = async (id: string): Promise<Point[]> => {
    const text = await fetchText(fredUrl(id), `fred:${id}`);
    if (!text) return [];
    return parseSafe(() => toMonthly(parseFredCsv(text)), [], `fred:${id}`);
  };

  // ---- S&P 500 / CPI / 10년물(1961년까지) ----
  const shillerText = await fetchText(SHILLER_URL, 'shiller');
  const shiller = shillerText
    ? parseSafe(() => parseShillerCsv(shillerText), null, 'shiller')
    : null;

  const sp500 = sane(clampFrom(shiller?.sp500 ?? []), 1400, 'sp500') ?? keep('sp500');
  const ust10yOld = clampFrom(shiller?.ust10y ?? []).filter(([ym]) => ym < '1962-01');

  // ---- 물가: Shiller(1900-01~1912-12) → FRED CPIAUCNS(1913-01~) ----
  // Shiller CSV의 CPI 컬럼은 2023-09에서 끊기고 이후 34개월이 0으로 채워져 온다.
  // FRED가 같은 지수(CPI-U)를 1913년부터 최신까지 주므로 그쪽으로 이어붙인다.
  const cpiOld = clampFrom(shiller?.cpi ?? []).filter(([ym]) => ym < '1913-01');
  const cpi =
    sane(spliceSeries([cpiOld, await fred('CPIAUCNS')]), 1400, 'cpi') ?? keep('cpi');

  // ---- 나스닥 ----
  const nasdaq = sane(await fred('NASDAQCOM'), 600, 'nasdaq') ?? keep('nasdaq');

  // ---- 10년물: Shiller(~1961-12) → FRED DGS10(1962-01~) ----
  const ust10y =
    sane(spliceSeries([ust10yOld, await fred('DGS10')]), 1400, 'ust10y') ?? keep('ust10y');

  // ---- 정책금리: NY연은 재할인율(1914-11~1954-06) → Fed Funds(1954-07~) ----
  const discount = (await fred('M13009USM156NNBR')).filter(([ym]) => ym < '1954-07');
  const policyRate =
    sane(spliceSeries([discount, await fred('FEDFUNDS')]), 1200, 'policyRate') ??
    keep('policyRate');

  // ---- 금: 고정가 두 구간 → LBMA 시장가 ----
  const lbmaText = await fetchText(LBMA_URL, 'lbma');
  const lbma = lbmaText ? parseSafe(() => toMonthly(parseLbmaJson(lbmaText)), [], 'lbma') : [];
  const gold =
    sane(
      lbma.length
        ? spliceSeries([
            constantMonths(START, '1933-12', 20.67),
            constantMonths('1934-01', '1968-03', 35.0),
            lbma,
          ])
        : [],
      1400,
      'gold',
    ) ?? keep('gold');

  // ---- 한국 주가지수 ----
  const kospi = sane(await fred('SPASTT01KRM661N'), 500, 'kospi') ?? keep('kospi');

  const generatedAt = new Date().toISOString().slice(0, 10);

  const file: SeriesFile = {
    meta: { generatedAt, resolution: 'monthly', from: START },
    series: {
      sp500: { unit: 'index', source: 'shiller', values: sp500 },
      nasdaq: { unit: 'index', from: '1971-02', source: 'fred:NASDAQCOM', values: nasdaq },
      gold: {
        unit: 'usdPerOz',
        segments: [
          { to: '1933-12', kind: 'fixed', value: 20.67, note: '금본위제 고정' },
          { to: '1968-03', kind: 'fixed', value: 35.0, note: '브레튼우즈 고정' },
          { to: null, kind: 'market', source: 'lbma' },
        ],
        values: gold,
      },
      ust10y: {
        unit: 'percent',
        segments: [
          { to: '1961-12', kind: 'market', source: 'shiller' },
          { to: null, kind: 'market', source: 'fred:DGS10' },
        ],
        values: ust10y,
      },
      policyRate: {
        unit: 'percent',
        from: '1914-11',
        segments: [
          { to: '1954-06', kind: 'market', source: 'fred:M13009USM156NNBR', note: 'NY연은 재할인율' },
          { to: null, kind: 'market', source: 'fred:FEDFUNDS' },
        ],
        values: policyRate,
      },
      cpi: {
        unit: 'index',
        segments: [
          { to: '1912-12', kind: 'market', source: 'shiller' },
          { to: null, kind: 'market', source: 'fred:CPIAUCNS' },
        ],
        values: cpi,
      },
      kospi: {
        unit: 'index',
        from: '1981-01',
        source: 'fred:SPASTT01KRM661N',
        values: kospi,
      },
    },
  };

  // 빈 계열이 하나라도 있으면 파일을 쓰지 않는다.
  // 첫 실행에서 소스가 죽었거나(keep 할 이전 값도 없음) sane 게이트에 전부 걸린 경우다.
  // 반쪽짜리 series.json 을 남기면 이후 빌드가 조용히 잘못된 화면을 만든다.
  const empty = (Object.keys(file.series) as SeriesKey[]).filter(
    (key) => file.series[key].values.length === 0,
  );
  if (empty.length > 0) {
    console.error(`빈 계열: ${empty.join(', ')}`);
    for (const w of warnings) console.error(`  - ${w}`);
    throw new Error('빈 계열이 있어 series.json 을 쓰지 않았다. 위 경고를 확인할 것.');
  }

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, `${JSON.stringify(file, null, 2)}\n`, 'utf-8');

  const sources = {
    generatedAt,
    note: '각 차트 하단에 출처를 표기한다.',
    entries: [
      { key: 'sp500', name: 'Robert Shiller / datasets.io s-and-p-500', url: SHILLER_URL, license: 'PDDL' },
      { key: 'nasdaq', name: 'FRED NASDAQCOM', url: fredUrl('NASDAQCOM') },
      { key: 'gold', name: 'LBMA Gold PM (1968-04~), 이전은 법정 고정가', url: LBMA_URL },
      { key: 'ust10y', name: 'Shiller GS10 (~1961), FRED DGS10 (1962~)', url: fredUrl('DGS10') },
      { key: 'policyRate', name: 'NY연은 재할인율 (~1954-06), FRED FEDFUNDS (1954-07~)', url: fredUrl('FEDFUNDS') },
      { key: 'cpi', name: 'Shiller CPI (~1912), FRED CPIAUCNS (1913~)', url: fredUrl('CPIAUCNS') },
      { key: 'kospi', name: 'OECD Share Prices Korea (FRED)', url: fredUrl('SPASTT01KRM661N') },
    ],
  };
  await writeFile(SOURCES_FILE, `${JSON.stringify(sources, null, 2)}\n`, 'utf-8');

  for (const [key, series] of Object.entries(file.series)) {
    const values = series.values;
    const range = values.length ? `${values[0][0]} ~ ${values[values.length - 1][0]}` : '(비어 있음)';
    console.log(`${key.padEnd(11)} ${String(values.length).padStart(5)}개월  ${range}`);
  }

  if (warnings.length > 0) {
    console.warn('\n경고:');
    for (const w of warnings) console.warn(`  - ${w}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
