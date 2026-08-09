/**
 * 퀴즈 세트 검증. validateContent.ts 가 파일별로 호출한다.
 *
 * 여기 규칙은 blog-v2 에서 실제로 겪은 결함에서 나왔다. 특히 규칙 2(blank 정답 노출)는
 * 그 저장소 문서에 5편 중 4편에서 발생했다고 기록돼 있다. 작성자는 문항을 하나씩 쓰는데
 * UI 는 세트 전체를 한 화면에 렌더하기 때문에 눈으로 잘 안 잡힌다.
 */
import { isValidQuestion, normalizeBlankAnswer, type QuizQuestion } from '../../src/lib/quiz';
import { parseQuizRaw } from '../../src/lib/quiz-parse';

export interface QuizProblem {
  rule: string;
  detail: string;
  severity: 'error' | 'warn';
}

/** 정답 보기가 나머지 평균의 몇 배를 넘으면 경고할지 */
const LENGTH_RATIO_LIMIT = 1.6;

/** 문항에서 "다른 문항이 읽을 수 있는" 텍스트를 모은다. explain 은 푼 뒤에만 보이므로 뺀다 */
function visibleText(question: QuizQuestion): string[] {
  const parts: string[] = [question.q];
  if (question.type === 'mcq' || question.type === 'case') parts.push(...question.choices);
  if (question.type === 'case') parts.push(...question.given);
  return parts;
}

function checkFormat(source: string, problems: QuizProblem[]): QuizQuestion[] | null {
  const raw = parseQuizRaw(source);
  if (raw === null) {
    problems.push({
      rule: 'YAML 파싱 실패',
      detail: '블록 전체가 코드 블록으로 노출된다. YAML 문법을 확인할 것',
      severity: 'error',
    });
    return null;
  }

  const valid = raw.filter(isValidQuestion);
  if (valid.length !== raw.length) {
    const broken = raw
      .map((item, i) => (isValidQuestion(item) ? null : i + 1))
      .filter((n): n is number => n !== null);
    problems.push({
      rule: '형식 오류 문항',
      detail: `${raw.length}개 중 ${valid.length}개만 유효하다. ${broken.join(', ')}번 문항이 조용히 빠진다`,
      severity: 'error',
    });
  }
  return valid;
}

function checkBlankLeak(questions: QuizQuestion[], problems: QuizProblem[]): void {
  questions.forEach((question, index) => {
    if (question.type !== 'blank') return;

    const others = questions
      .filter((_, i) => i !== index)
      .flatMap(visibleText)
      .join(' ');
    const haystack = normalizeBlankAnswer(others);

    for (const accepted of question.answer) {
      const needle = normalizeBlankAnswer(accepted);
      if (needle && haystack.includes(needle)) {
        problems.push({
          rule: 'blank 정답 노출',
          detail: `${index + 1}번 문항의 정답 "${accepted}" 가 같은 세트의 다른 문항 지문·보기·조건에 나온다`,
          severity: 'error',
        });
      }
    }
  });
}

function checkAnswerSkew(questions: QuizQuestion[], problems: QuizProblem[]): void {
  const indexed = questions.filter(
    (q): q is Extract<QuizQuestion, { choices: string[] }> => q.type === 'mcq' || q.type === 'case',
  );
  if (indexed.length < 4) return; // 문항이 적으면 쏠림을 논할 수 없다

  const counts = new Map<number, number>();
  for (const q of indexed) counts.set(q.answer, (counts.get(q.answer) ?? 0) + 1);

  for (const [answer, count] of counts) {
    if (count * 2 >= indexed.length) {
      problems.push({
        rule: '정답 쏠림',
        detail: `mcq·case ${indexed.length}문항 중 ${count}개의 정답이 보기 ${answer + 1}번이다. 분산할 것`,
        severity: 'warn',
      });
    }
  }
}

function checkChoiceLength(questions: QuizQuestion[], problems: QuizProblem[]): void {
  questions.forEach((question, index) => {
    if (question.type !== 'mcq' && question.type !== 'case') return;

    const correct = question.choices[question.answer].length;
    const others = question.choices.filter((_, i) => i !== question.answer);
    const average = others.reduce((sum, c) => sum + c.length, 0) / others.length;

    if (average > 0 && correct > average * LENGTH_RATIO_LIMIT) {
      problems.push({
        rule: '정답 보기 길이',
        detail: `${index + 1}번 문항의 정답 보기가 나머지 평균(${average.toFixed(0)}자)의 ${(correct / average).toFixed(1)}배다. 길이만으로 답이 티 난다`,
        severity: 'warn',
      });
    }
  });
}

/** 퀴즈 블록 하나를 검사한다 */
export function checkQuizBlock(source: string): QuizProblem[] {
  const problems: QuizProblem[] = [];

  const questions = checkFormat(source, problems);
  if (questions === null) return problems;

  checkBlankLeak(questions, problems);
  checkAnswerSkew(questions, problems);
  checkChoiceLength(questions, problems);

  return problems;
}
