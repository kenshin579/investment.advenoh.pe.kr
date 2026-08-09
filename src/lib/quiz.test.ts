import { describe, expect, it } from 'vitest';
import { extractQuizBlocks, isBlankCorrect } from './quiz';

describe('isBlankCorrect', () => {
  it('앞뒤 공백과 대소문자를 무시한다', () => {
    expect(isBlankCorrect('  qe  ', ['양적완화', 'QE'])).toBe(true);
  });

  it('허용 답에 없으면 오답이다', () => {
    expect(isBlankCorrect('양적긴축', ['양적완화', 'QE'])).toBe(false);
  });
});

describe('extractQuizBlocks', () => {
  it('본문의 quiz 펜스를 순서대로 뽑는다', () => {
    const markdown = [
      '# 1. 개요',
      '',
      '```quiz',
      '- type: ox',
      '```',
      '',
      '```ts',
      'const a = 1;',
      '```',
      '',
      '```quiz',
      '- type: mcq',
      '```',
    ].join('\n');

    const blocks = extractQuizBlocks(markdown);

    expect(blocks).toHaveLength(2);
    expect(blocks[0]).toContain('type: ox');
    expect(blocks[1]).toContain('type: mcq');
  });

  it('quiz 블록이 없으면 빈 배열이다', () => {
    expect(extractQuizBlocks('# 제목\n\n본문')).toEqual([]);
  });

  it('더 긴 펜스 안에 중첩된 quiz 블록은 뽑지 않는다', () => {
    const markdown = [
      '# 제목',
      '',
      '```` markdown',
      '```quiz',
      '- type: mcq',
      '  q: "문서용 예시일 뿐"',
      '```',
      '````',
    ].join('\n');

    expect(extractQuizBlocks(markdown)).toEqual([]);
  });

  it('다른 언어 펜스 안의 quiz 는 뽑지 않는다', () => {
    const markdown = ['```ts', '```quiz', '- type: mcq', '```'].join('\n');

    expect(extractQuizBlocks(markdown)).toEqual([]);
  });

  it('info string 에 여분 텍스트가 붙어도 첫 토큰이 quiz 면 뽑는다', () => {
    // remark 는 info string 의 첫 공백 구분 토큰만 lang 으로 본다
    const markdown = ['```quiz extra text here', '- type: ox', '```'].join('\n');

    const blocks = extractQuizBlocks(markdown);

    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toContain('type: ox');
  });

  it('문서 끝에서 안 닫힌 quiz 펜스도 뽑는다 (EOF 암묵적 닫힘)', () => {
    // remark 는 EOF 에서 열린 펜스를 암묵적으로 닫고 lang: 'quiz' 로 렌더한다
    const markdown = ['```quiz', '- type: ox', '  q: "닫는 펜스가 아예 없음"'].join('\n');

    const blocks = extractQuizBlocks(markdown);

    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toContain('닫는 펜스가 아예 없음');
  });

  it('안 닫힌 quiz 펜스가 다른 블록의 닫는 펜스에 걸려 내용이 잘리지 않는다', () => {
    const markdown = [
      '```quiz',
      '- type: mcq',
      '  q: "닫는 펜스가 없다"',
      '',
      '# 다른 섹션',
      '',
      '본문 문단이다.',
      '',
      '```ts',
      'const a = 1;',
      '```',
    ].join('\n');

    const blocks = extractQuizBlocks(markdown);

    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toContain('type: mcq');
    expect(blocks[0]).toContain('다른 섹션');
    expect(blocks[0]).toContain('const a = 1;');
  });
});
