import { describe, expect, it, vi } from 'vitest';
import { parseQuiz, parseQuizRaw } from './quiz-parse';

/** 콘솔 경고를 삼킨다. 형식 오류를 일부러 넣는 테스트가 많다 */
function silent<T>(fn: () => T): T {
  const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  try {
    return fn();
  } finally {
    spy.mockRestore();
  }
}

describe('parseQuiz', () => {
  it('4유형을 모두 파싱한다', () => {
    const source = `
- type: mcq
  q: "세액공제 한도는?"
  choices: ["600만 원", "900만 원"]
  answer: 1
  explain: "연금저축 600 + IRP 300."

- type: ox
  q: "QT는 매각으로만 이뤄진다"
  answer: false
  explain: "만기 미재투자가 더 흔하다."

- type: case
  q: "공제 대상 금액은?"
  given:
    - "총급여: 6,000만 원"
    - "신용카드: 1,800만 원"
  choices: ["300만 원", "450만 원"]
  answer: 0
  explain: "최저사용금액 1,500만 원 초과분."

- type: blank
  q: "비전통적 통화정책을 ___라고 한다"
  answer: ["양적완화", "QE"]
  explain: "실효하한에서 자산을 매입한다."
`;
    const questions = parseQuiz(source);

    expect(questions).toHaveLength(4);
    expect(questions.map((q) => q.type)).toEqual(['mcq', 'ox', 'case', 'blank']);
  });

  it('형식에 맞지 않는 문항만 건너뛰고 나머지는 살린다', () => {
    const source = `
- type: mcq
  q: "정상 문항"
  choices: ["가", "나"]
  answer: 0
  explain: "설명"

- type: mcq
  q: "answer 가 범위를 벗어남"
  choices: ["가", "나"]
  answer: 5
  explain: "설명"

- type: case
  q: "given 이 없음"
  choices: ["가", "나"]
  answer: 0
  explain: "설명"

- type: blank
  q: "explain 이 없음"
  answer: ["답"]
`;
    const questions = silent(() => parseQuiz(source));

    expect(questions).toHaveLength(1);
    expect(questions[0].q).toBe('정상 문항');
  });

  it('YAML 이 깨지면 빈 배열을 준다', () => {
    const questions = silent(() => parseQuiz('- type: mcq\n  q: "따옴표가 안 닫힘\n'));
    expect(questions).toEqual([]);
  });

  it('배열이 아니면 빈 배열을 준다', () => {
    const questions = silent(() => parseQuiz('type: mcq'));
    expect(questions).toEqual([]);
  });
});

describe('parseQuizRaw', () => {
  it('형식 오류 문항도 세도록 원본 배열을 준다', () => {
    const source = `
- type: mcq
  q: "정상"
  choices: ["가", "나"]
  answer: 0
  explain: "설명"

- type: mcq
  q: "깨짐"
`;
    expect(parseQuizRaw(source)).toHaveLength(2);
    expect(silent(() => parseQuiz(source))).toHaveLength(1);
  });

  it('YAML 이 깨지면 null 을 준다', () => {
    expect(silent(() => parseQuizRaw('- "안 닫힌 따옴표\n'))).toBeNull();
  });
});
