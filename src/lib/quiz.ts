/**
 * 클라이언트 세이프 모듈. `yaml` import 금지 — load-bearing, 코스메틱 아님.
 *
 * `src/components/quiz/quiz.tsx` 는 `'use client'` 컴포넌트로 이 파일에서
 * `isBlankCorrect` 와 `QuizQuestion` 타입을 가져온다. 이 파일에 `yaml` 의
 * top-level import 가 하나라도 들어오면, 트리쉐이킹으로 걷어내지지 않고
 * yaml 파서 전체(Composer, Scalar, parseDocument, lineCounter 등)가 모든
 * 글 페이지의 클라이언트 번들에 실려 나간다. 빌드 시점 YAML 파싱
 * (`parseQuizRaw`/`parseQuiz`)은 반드시 `./quiz-parse.ts` 에만 둔다.
 * "정리한다"며 두 파일을 다시 합치지 말 것 — 그게 바로 이 분리가 막는 버그다.
 */

/** 객관식. answer 는 0부터 세는 정답 인덱스 */
export interface McqQuestion {
  type: 'mcq';
  q: string;
  choices: string[];
  answer: number;
  explain: string;
}

/** OX. answer 가 true 면 O 가 정답 */
export interface OxQuestion {
  type: 'ox';
  q: string;
  answer: boolean;
  explain: string;
}

/** 사례 판단. 조건 목록(given)이 붙은 객관식 */
export interface CaseQuestion {
  type: 'case';
  q: string;
  given: string[];
  choices: string[];
  answer: number;
  explain: string;
}

/** 빈칸 채우기. q 의 빈칸은 ___(밑줄 3개). answer 는 허용 답 배열 */
export interface BlankQuestion {
  type: 'blank';
  q: string;
  answer: string[];
  explain: string;
}

export type QuizQuestion = McqQuestion | OxQuestion | CaseQuestion | BlankQuestion;

/** blank 답 비교용 정규화: 앞뒤 공백 제거 + 소문자화 */
export function normalizeBlankAnswer(value: string): string {
  return value.trim().toLowerCase();
}

/** blank 입력이 허용 답 중 하나와 일치하는가 */
export function isBlankCorrect(input: string, accepted: string[]): boolean {
  const normalized = normalizeBlankAnswer(input);
  return accepted.some((a) => normalizeBlankAnswer(a) === normalized);
}

function isStringArray(value: unknown, minLength: number): value is string[] {
  return (
    Array.isArray(value) &&
    value.length >= minLength &&
    value.every((item) => typeof item === 'string')
  );
}

/** choices 와 answer 인덱스의 짝이 맞는가 (mcq·case 공통) */
function hasValidChoiceAnswer(it: Record<string, unknown>): boolean {
  if (!isStringArray(it.choices, 2)) return false;
  return (
    typeof it.answer === 'number' &&
    Number.isInteger(it.answer) &&
    it.answer >= 0 &&
    it.answer < it.choices.length
  );
}

export function isValidQuestion(item: unknown): item is QuizQuestion {
  if (typeof item !== 'object' || item === null) return false;
  const it = item as Record<string, unknown>;
  if (typeof it.q !== 'string' || !it.q) return false;
  if (typeof it.explain !== 'string' || !it.explain) return false;

  switch (it.type) {
    case 'mcq':
      return hasValidChoiceAnswer(it);
    case 'ox':
      return typeof it.answer === 'boolean';
    case 'case':
      return isStringArray(it.given, 1) && hasValidChoiceAnswer(it);
    case 'blank':
      return isStringArray(it.answer, 1);
    default:
      return false;
  }
}

/**
 * 펜스 여는/닫는 줄: 앞에 공백 0~3칸, 백틱(또는 물결) 3개 이상, 그 뒤는 info string.
 * 물결(~~~) 펜스도 CommonMark 상 유효한 펜스 문자라 `~{3,}`로 함께 잡는다 — 백틱
 * 펜스만 추적하면 `~~~` 로 열린 블록 안의 ```quiz 텍스트를 오탐할 수 있다.
 */
const FENCE_LINE_RE = /^ {0,3}(`{3,}|~{3,})[ \t]*(.*)$/;
/** 닫는 펜스는 info string 없이 공백만 허용된다 (CommonMark 규칙) */
const ONLY_WHITESPACE_RE = /^[ \t]*$/;

/**
 * 마크다운 본문에서 ```quiz 블록의 YAML 원문을 순서대로 뽑는다.
 *
 * 정규식 대신 줄 단위 펜스 스캐너를 쓰는 이유: remark(react-markdown이 쓰는
 * 마크다운 파서)는 CommonMark 펜스 규칙을 따른다 — 닫는 펜스는 여는 펜스
 * 이상의 길이여야 하고, 이미 펜스가 열려 있는 동안에는 그 안의 어떤 줄도
 * 새 펜스를 열지 못하며, info string 은 첫 공백 구분 토큰만 lang 으로 본다.
 * 정규식만으로는 이 상태를 추적할 수 없어서 백틱 4개짜리 펜스 안에 설명용으로
 * 중첩된 ```quiz 예시를 실제 퀴즈로 잘못 뽑아내거나(remark는 절대 렌더링하지
 * 않는데도), 안 닫힌 펜스 뒤에 나오는 무관한 블록의 닫는 펜스에 걸려 내용이
 * 잘리는 등 remark 와 다르게 동작한다. 이 스캐너는 remark가 실제로 인식하는
 * 펜스와 같은 규칙으로 상태를 추적해 "빌드가 센 문항 수"와 "페이지가 렌더한
 * 문항 수"가 어긋나지 않게 한다.
 *
 * 펜스 줄의 들여쓰기(공백 0~3칸)는 걷어내지 않고 그대로 YAML에 넘긴다.
 * YAML은 블록 전체가 균일하게 들여쓰기 되어 있는 한 파싱에 지장이 없어
 * 실무상 무해하다.
 */
export function extractQuizBlocks(markdown: string): string[] {
  const blocks: string[] = [];
  const lines = markdown.split(/\r?\n/);

  let inFence = false;
  let fenceChar = '';
  let fenceLength = 0;
  let isQuiz = false;
  let quizLines: string[] = [];

  const closeQuizFence = () => {
    blocks.push(quizLines.map((l) => `${l}\n`).join(''));
  };

  for (const line of lines) {
    const fenceMatch = line.match(FENCE_LINE_RE);

    if (!inFence) {
      if (fenceMatch) {
        const fence = fenceMatch[1];
        const info = fenceMatch[2].trim();
        const lang = info.split(/\s+/)[0];
        inFence = true;
        fenceChar = fence[0];
        fenceLength = fence.length;
        isQuiz = fenceLength === 3 && fenceChar === '`' && lang === 'quiz';
        quizLines = [];
      }
      continue;
    }

    const isClosing =
      fenceMatch !== null &&
      fenceMatch[1][0] === fenceChar &&
      fenceMatch[1].length >= fenceLength &&
      ONLY_WHITESPACE_RE.test(fenceMatch[2]);

    if (isClosing) {
      if (isQuiz) closeQuizFence();
      inFence = false;
      isQuiz = false;
      continue;
    }

    if (isQuiz) {
      quizLines.push(line);
    }
  }

  // remark 는 EOF 에서 열려 있는 펜스를 암묵적으로 닫는다(CommonMark 규칙).
  // 그래서 문서 끝까지 안 닫힌 quiz 펜스도 거기서 닫힌 것으로 보고 뽑는다.
  if (inFence && isQuiz) closeQuizFence();

  return blocks;
}
