import { describe, expect, it } from 'vitest';
import { checkQuizBlock, type QuizProblem } from './quiz-checks';

const rules = (problems: QuizProblem[]) => problems.map((p) => p.rule);

describe('checkQuizBlock — 규칙 1: 형식 오류 문항', () => {
  it('정상 세트는 문제가 없다', () => {
    const source = `
- type: mcq
  q: "한도는?"
  choices: ["600만 원", "900만 원"]
  answer: 1
  explain: "설명"
`;
    expect(checkQuizBlock(source)).toEqual([]);
  });

  it('형식 오류로 빠진 문항이 있으면 잡는다', () => {
    const source = `
- type: mcq
  q: "정상"
  choices: ["가", "나"]
  answer: 0
  explain: "설명"

- type: mcq
  q: "answer 가 범위 밖"
  choices: ["가", "나"]
  answer: 9
  explain: "설명"
`;
    const problems = checkQuizBlock(source);

    expect(rules(problems)).toContain('형식 오류 문항');
    expect(problems[0].detail).toContain('2개 중 1개');
  });

  it('YAML 이 깨지면 잡는다', () => {
    const problems = checkQuizBlock('- type: mcq\n  q: "안 닫힌 따옴표\n');
    expect(rules(problems)).toContain('YAML 파싱 실패');
  });
});

describe('checkQuizBlock — 규칙 2: blank 정답 노출', () => {
  it('다른 문항의 q 에 정답이 나오면 잡는다', () => {
    const source = `
- type: blank
  q: "비전통적 통화정책을 ___라고 한다"
  answer: ["양적완화"]
  explain: "설명"

- type: ox
  q: "양적완화는 자산 매입을 수반한다"
  answer: true
  explain: "설명"
`;
    const problems = checkQuizBlock(source);

    expect(rules(problems)).toContain('blank 정답 노출');
    expect(problems[0].detail).toContain('양적완화');
  });

  it('다른 문항의 choices 에 정답이 나오면 잡는다', () => {
    const source = `
- type: blank
  q: "___ 방식이라 한다"
  answer: ["테이퍼링"]
  explain: "설명"

- type: mcq
  q: "무엇인가?"
  choices: ["테이퍼링", "양적완화"]
  answer: 0
  explain: "설명"
`;
    expect(rules(checkQuizBlock(source))).toContain('blank 정답 노출');
  });

  it('다른 문항의 given 에 정답이 나오면 잡는다', () => {
    const source = `
- type: blank
  q: "___ 를 뜻한다"
  answer: ["IRP"]
  explain: "설명"

- type: case
  q: "공제액은?"
  given:
    - "IRP 납입: 300만 원"
  choices: ["가", "나"]
  answer: 0
  explain: "설명"
`;
    expect(rules(checkQuizBlock(source))).toContain('blank 정답 노출');
  });

  it('대소문자와 공백을 무시하고 비교한다', () => {
    const source = `
- type: blank
  q: "___ 라고 부른다"
  answer: ["QE"]
  explain: "설명"

- type: ox
  q: "qe 는 자산 매입이다"
  answer: true
  explain: "설명"
`;
    expect(rules(checkQuizBlock(source))).toContain('blank 정답 노출');
  });

  it('자기 자신의 explain 은 노출로 보지 않는다', () => {
    const source = `
- type: blank
  q: "___ 라고 한다"
  answer: ["양적완화"]
  explain: "양적완화는 자산 매입이다"
`;
    expect(checkQuizBlock(source)).toEqual([]);
  });
});

describe('checkQuizBlock — 규칙 3: 정답 쏠림 (경고)', () => {
  it('정답이 한 인덱스에 절반 이상 몰리면 경고한다', () => {
    const item = (q: string, answer: number) => `
- type: mcq
  q: "${q}"
  choices: ["가", "나", "다", "라"]
  answer: ${answer}
  explain: "설명"
`;
    const source = [item('1', 0), item('2', 0), item('3', 0), item('4', 1)].join('');
    const problems = checkQuizBlock(source);

    expect(rules(problems)).toContain('정답 쏠림');
    expect(problems.every((p) => p.severity === 'warn')).toBe(true);
  });

  it('고르게 흩어져 있으면 경고하지 않는다', () => {
    const item = (q: string, answer: number) => `
- type: mcq
  q: "${q}"
  choices: ["가", "나", "다", "라"]
  answer: ${answer}
  explain: "설명"
`;
    const source = [item('1', 0), item('2', 1), item('3', 2), item('4', 3)].join('');
    expect(rules(checkQuizBlock(source))).not.toContain('정답 쏠림');
  });
});

describe('checkQuizBlock — 규칙 4: 정답 보기 길이 (경고)', () => {
  it('정답만 유독 길면 경고한다', () => {
    const source = `
- type: mcq
  q: "무엇인가?"
  choices:
    - "짧다"
    - "짧다"
    - "정답만 유독 길게 늘여 쓴 설명형 보기라서 길이만 보고도 답을 고를 수 있다"
    - "짧다"
  answer: 2
  explain: "설명"
`;
    const problems = checkQuizBlock(source);

    expect(rules(problems)).toContain('정답 보기 길이');
    expect(problems.every((p) => p.severity === 'warn')).toBe(true);
  });

  it('길이가 비슷하면 경고하지 않는다', () => {
    const source = `
- type: mcq
  q: "무엇인가?"
  choices: ["300만 원", "450만 원", "600만 원", "900만 원"]
  answer: 2
  explain: "설명"
`;
    expect(rules(checkQuizBlock(source))).not.toContain('정답 보기 길이');
  });
});
