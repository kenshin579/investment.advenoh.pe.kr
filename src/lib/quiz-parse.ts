/**
 * 빌드 타임(서버 컴포넌트) 전용 모듈. `yaml` 을 여기서만 import 한다.
 *
 * `./quiz.ts` 는 `'use client'` 컴포넌트(`src/components/quiz/quiz.tsx`)가
 * 직접 가져다 쓰는 클라이언트 세이프 모듈이라 `yaml` import 가 있으면 안 된다.
 * 이 파일이 그 두 관심사(빌드 타임 YAML 파싱 vs 클라이언트 세이프 유틸)를
 * 분리하는 경계다. `markdown-renderer.tsx` 같은 서버 컴포넌트에서만 import
 * 할 것 — 클라이언트 컴포넌트가 이 파일을 import 하면 yaml 파서 전체가
 * 다시 번들에 실린다.
 */
import { parse } from 'yaml';
import { isValidQuestion, type QuizQuestion } from './quiz';

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
    console.warn('퀴즈 YAML 이 배열이 아니다:', raw);
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
