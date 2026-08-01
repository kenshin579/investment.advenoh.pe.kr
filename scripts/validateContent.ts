/**
 * contents/history/ 의 사건 글을 검사한다.
 *
 *   npm run check:content
 *
 * 이 검사들은 전부 "실제로 겪은 오류"에서 나왔다. 추상적인 린트가 아니다.
 * 각 규칙 위에 어떤 사고를 막는 것인지 적어 뒀다.
 *
 * 판단이 필요한 오류(예: 1차 출처를 봐야 아는 사실 오류)는 여기서 잡을 수 없다.
 * 그건 .claude/skills/history-article 의 절차가 담당한다.
 */
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const HISTORY_DIR = join('contents', 'history');
const TIMELINE_JSON = join('public', 'data', 'timeline.json');

interface Indicator {
  kind: 'change' | 'delta' | 'fixed' | 'unavailable';
  value?: number;
  note?: string;
}

interface TimelineEvent {
  slug: string;
  label: string;
  summary: string;
  kind: 'drawdown' | 'moment';
  peak: string;
  trough: string;
  drawdown: number | null;
  indicators: Record<string, Indicator>;
}

interface Problem {
  slug: string;
  rule: string;
  detail: string;
}

const problems: Problem[] = [];
const add = (slug: string, rule: string, detail: string) => problems.push({ slug, rule, detail });

/** frontmatter 와 본문을 나눈다 */
function split(raw: string): { front: string; body: string } {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return m ? { front: m[1], body: m[2] } : { front: '', body: raw };
}

/** "YYYY-MM" 사이 개월 수 */
function monthsBetween(a: string, b: string): number {
  const p = (s: string) => Number(s.slice(0, 4)) * 12 + Number(s.slice(5, 7));
  return p(b) - p(a);
}

// ---------------------------------------------------------------------------
// 규칙 1 — frontmatter 의 summary 에 쓴 퍼센트가 그 사건 배지와 어긋나면 안 된다
//
// 실제 사고: 닷컴 summary 가 "나스닥 78% 하락" 인데 배지는 -70.9% 였다.
//            IMF summary 는 "한국 60% 가까이" 인데 배지는 -42.1% 였다.
//            summary 와 배지는 사건 카드에서 위아래로 붙어 나오므로,
//            어긋나면 독자가 같은 화면에서 다른 숫자 두 개를 본다.
//
// 본문 전체를 훑지 않는 이유: 본문은 다른 사건 수치(대공황 -84.8%),
// 다른 출처(다우 -89%), 다른 기간(NBER 18개월)을 정당하게 인용한다.
// 전부 대조하면 오탐만 쏟아진다. summary 는 이 사건만 말하는 자리라 안전하다.
// ---------------------------------------------------------------------------
function checkSummaryAgainstBadges(slug: string, summary: string, event: TimelineEvent) {
  const badge = Object.values(event.indicators)
    .filter((i) => typeof i.value === 'number')
    .map((i) => Math.abs(i.value as number));
  if (event.drawdown !== null) badge.push(Math.abs(event.drawdown));
  if (badge.length === 0) return;

  for (const m of summary.matchAll(/(\d+(?:\.\d+)?)\s*%/g)) {
    const n = Number(m[1]);
    const near = badge.some((b) => Math.abs(b - n) < 1.5);
    if (!near) {
      add(
        slug,
        'summary 숫자가 배지와 불일치',
        `summary 의 "${n}%" 와 가까운 배지 값이 없다 (배지: ${badge
          .map((b) => b.toFixed(1))
          .join(', ')}) — "${summary.trim()}"`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// 규칙 2 — 강조가 문장부호로 끝나고 조사가 바로 붙으면 별표가 리터럴로 남는다
//
// 실제 사고: `**1.75%**까지` 가 화면에 별표째로 나왔다.
//            `**1954년 9월**이` 처럼 한글로 끝나면 정상이라 눈치채기 어렵다.
// ---------------------------------------------------------------------------
function checkBoldBeforeParticle(slug: string, body: string) {
  for (const m of body.matchAll(/\*\*[^*\n]*[%"'”’)\]][*]{2}[가-힣]/g)) {
    add(slug, '강조 뒤 조사로 별표가 리터럴이 됨', `${m[0]} — 조사를 강조 안으로 넣을 것`);
  }
}

// ---------------------------------------------------------------------------
// 규칙 3 — 한 줄에 물결표가 둘이면 GFM 취소선이 된다
//
// 실제 사고: `2008년 1~3월, 그리고 2008년 9~12월` 이 통째로 취소선이 됐다.
//            범위 표기는 이 저장소 관례라 관례를 바꾸는 대신 문장을 고쳐야 한다.
// ---------------------------------------------------------------------------
function checkTildeStrikethrough(slug: string, body: string) {
  const lines = body.replace(/```[\s\S]*?```/g, '').split('\n');
  for (const [i, line] of lines.entries()) {
    const bare = line.replace(/\[[^\]]*\]\([^)]*\)/g, ''); // URL 안의 ~ 는 제외
    if (/~[^\s~][^~\n]*~/.test(bare)) {
      add(slug, '한 줄 물결표 2개 → 취소선', `${i + 1}행: ${line.trim().slice(0, 70)}`);
    }
  }
}

// ---------------------------------------------------------------------------
// 규칙 4 — 링크 URL 에 괄호가 있으면 링크가 잘린다
//
// 실제 사고: 위키백과의 `Irrational_Exuberance_(book)` 이 `(book)` 에서 끊겼다.
// ---------------------------------------------------------------------------
function checkParenInLinkUrl(slug: string, body: string) {
  for (const m of body.matchAll(/\]\(([^)\s]*\([^)]*\)[^)\s]*)\)/g)) {
    add(slug, 'URL 안의 괄호로 링크가 잘림', `${m[1]} — %28 %29 로 인코딩할 것`);
  }
}

// ---------------------------------------------------------------------------
// 규칙 5 — 참고 자료 항목에 링크가 있어야 한다
//
// 실제 사고: 책 세 권이 제목만 적혀 있어 독자가 찾아갈 수가 없었다.
// ---------------------------------------------------------------------------
function checkReferenceLinks(slug: string, body: string) {
  const sec = body.split(/^#+\s*\d*\.?\s*참고\s*자료\s*$/m)[1];
  if (sec === undefined) {
    add(slug, '참고 자료 섹션 없음', '본문이 있는 글에는 출처를 남길 것');
    return;
  }
  for (const line of sec.split('\n')) {
    if (!line.trim().startsWith('- ')) continue;
    if (!/\]\(https?:\/\//.test(line)) {
      add(slug, '참고 자료에 링크 없음', line.trim().slice(0, 70));
    }
  }
}

// ---------------------------------------------------------------------------
// 규칙 6 — 사건 구간 길이를 눈으로 대조할 수 있게 출력한다
//
// 실제 사고: 대공황 글이 "34개월" 이라고 했는데 1929-09 ~ 1932-06 은 33개월이다.
//
// 자동 판정하지 않는 이유: 본문은 다른 기간도 정당하게 말한다.
// 닷컴 글의 "2001년 침체는 8개월", 금융위기 글의 "1973년 침체 16개월" 이 그렇다.
// 전부 사건 구간과 대조하면 오탐이 된다.
// 그래서 실제 개월 수를 옆에 찍어 주고 판단은 사람이 한다.
// ---------------------------------------------------------------------------
function reportPeriod(slug: string, body: string, event: TimelineEvent): string {
  if (event.kind !== 'drawdown') return `${slug}  (moment, at ${event.peak} 기준 ±12개월)`;
  const actual = monthsBetween(event.peak, event.trough);
  const mentioned = [...body.matchAll(/(\d+)\s*개월/g)].map((m) => Number(m[1]));
  const uniq = [...new Set(mentioned)];
  return (
    `${slug}  구간 ${event.peak}~${event.trough} = ${actual}개월` +
    (uniq.length ? `  |  본문이 말하는 개월: ${uniq.join(', ')}` : '')
  );
}

// ---------------------------------------------------------------------------
// 규칙 7 — 저장소 콘텐츠 규칙 (CLAUDE.md)
// ---------------------------------------------------------------------------
function checkRepoRules(slug: string, body: string) {
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(body)) {
    add(slug, '이모지 사용', 'AI가 쓴 느낌을 주므로 쓰지 않는다');
  }
  if (/^#+\s*\d*\.?\s*정리\s*$/m.test(body)) {
    add(slug, '마지막 섹션 제목', '"정리" 가 아니라 "마무리" 를 쓴다');
  }
  // ASCII 다이어그램 금지 — 박스 그리기 문자가 코드블록에 있으면 의심한다
  for (const m of body.matchAll(/```(?!mermaid)[\s\S]*?```/g)) {
    if (/[┌└├─│+|]{3,}/.test(m[0])) {
      add(slug, 'ASCII 다이어그램', 'Mermaid 코드블록을 쓴다');
    }
  }
}

async function main(): Promise<void> {
  let events: TimelineEvent[] = [];
  try {
    events = JSON.parse(await readFile(TIMELINE_JSON, 'utf-8')).events;
  } catch {
    console.error(`${TIMELINE_JSON} 이 없다. 먼저 npx tsx scripts/generateStaticData.ts 를 실행할 것.`);
    process.exit(1);
  }
  const byslug = new Map(events.map((e) => [e.slug, e]));

  const slugs = (await readdir(HISTORY_DIR, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const periods: string[] = [];
  let checked = 0;
  for (const slug of slugs) {
    const raw = await readFile(join(HISTORY_DIR, slug, 'index.md'), 'utf-8');
    const { front, body } = split(raw);
    const event = byslug.get(slug);

    if (!event) {
      add(slug, 'timeline.json 에 사건이 없음', 'frontmatter 의 event 블록을 확인할 것');
      continue;
    }

    // 본문 없는 스텁은 마크다운·참고 자료 검사를 건너뛴다
    const isStub = /^stub:\s*true\s*$/m.test(front);
    if (isStub) {
      if (body.trim().length > 0) {
        add(slug, 'stub 인데 본문이 있음', 'stub: false 로 바꾸거나 본문을 비울 것');
      }
      continue;
    }

    checked += 1;
    const summary = (front.match(/^\s*summary:\s*(.+)$/m) || [, ''])[1];
    checkSummaryAgainstBadges(slug, summary, event);
    checkBoldBeforeParticle(slug, body);
    checkTildeStrikethrough(slug, body);
    checkParenInLinkUrl(slug, body);
    checkReferenceLinks(slug, body);
    checkRepoRules(slug, body);
    periods.push(reportPeriod(slug, body, event));
  }

  console.log(`검사: 사건 ${slugs.length}개 중 본문 있는 글 ${checked}개\n`);
  console.log('구간 길이 — 본문 서술과 눈으로 대조할 것:');
  for (const line of periods) console.log(`  ${line}`);
  console.log('');

  if (problems.length === 0) {
    console.log('문제 없음');
    return;
  }

  console.error(`\n문제 ${problems.length}건:\n`);
  let last = '';
  for (const p of problems) {
    if (p.slug !== last) {
      console.error(`  ${p.slug}`);
      last = p.slug;
    }
    console.error(`    [${p.rule}] ${p.detail}`);
  }
  console.error('\n이 검사로 잡히지 않는 사실 오류가 있다. 1차 출처 확인은 여전히 사람 몫이다.');
  process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
