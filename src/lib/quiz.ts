import { parse } from 'yaml';

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
 * quiz 코드펜스의 YAML 원문을 배열 그대로 파싱한다.
 * 유효성은 보지 않는다. 검증기가 "쓴 문항 수"와 "통과한 문항 수"를
 * 비교하려면 형식 오류 문항도 세어야 하기 때문이다.
 * YAML 자체가 깨졌거나 배열이 아니면 null 을 준다.
 */
export function parseQuizRaw(source: string): unknown[] | null {
  let raw: unknown;
  try {
    raw = parse(source);
  } catch (error) {
    console.warn('퀴즈 YAML 파싱 실패:', error);
    return null;
  }
  if (!Array.isArray(raw)) {
    console.warn('퀴즈 YAML 이 배열이 아니다:', typeof raw);
    return null;
  }
  return raw;
}

/**
 * quiz 코드펜스의 YAML 원문을 유효한 문항 배열로 파싱한다.
 * YAML 전체가 깨졌으면 빈 배열을 반환한다(호출부가 원래 코드 블록을 유지).
 * 개별 문항이 깨졌으면 그 문항만 건너뛰고 콘솔 경고를 남긴다.
 */
export function parseQuiz(source: string): QuizQuestion[] {
  const raw = parseQuizRaw(source);
  if (raw === null) return [];

  const valid: QuizQuestion[] = [];
  raw.forEach((item, index) => {
    if (isValidQuestion(item)) {
      valid.push(item);
    } else {
      console.warn(`퀴즈 ${index + 1}번 문항이 형식에 맞지 않아 건너뛴다:`, item);
    }
  });
  return valid;
}

/** 마크다운 본문에서 ```quiz 블록의 YAML 원문을 순서대로 뽑는다 */
export function extractQuizBlocks(markdown: string): string[] {
  const blocks: string[] = [];
  for (const match of markdown.matchAll(/```quiz\r?\n([\s\S]*?)```/g)) {
    blocks.push(match[1]);
  }
  return blocks;
}
