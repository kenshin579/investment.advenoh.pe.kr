'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { isBlankCorrect, type QuizQuestion } from '@/lib/quiz';

interface QuizProps {
  questions: QuizQuestion[];
  /** 글의 첫 퀴즈에만 'quiz' 가 들어온다. /quiz 목록 카드의 앵커 대상 */
  id?: string;
}

/**
 * 문항별 응답 상태. null 이면 아직 안 풂.
 * value 의 실제 타입은 문항 유형에 종속된다 (mcq/case → number, ox → boolean,
 * blank → string). submit 호출부가 항상 문항 유형에 맞는 값을 넣는다는
 * 불변식에 기대며, QuestionCard 의 `as number` / `as boolean` 캐스팅이 이를 전제한다.
 */
type Answer = { value: number | boolean | string; correct: boolean } | null;

export function Quiz({ questions, id }: QuizProps) {
  const [answers, setAnswers] = useState<Answer[]>(() => questions.map(() => null));
  const [resetKey, setResetKey] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 이 사이트는 <body> 전체가 ClientOnly 로 감싸여 있어(src/app/layout.tsx),
    // 하이드레이션 전 정적 HTML에는 id="quiz" 앵커가 존재하지 않는다. 브라우저가
    // 최초 로드 시 URL 해시를 처리하는 시점엔 이미 지나가버려 네이티브 앵커 스크롤이
    // 동작하지 않으므로, 마운트 후 해시가 실제로 이 퀴즈를 가리킬 때만 한 번 직접
    // 스크롤한다. 클라이언트 사이드 네비게이션(Link 클릭)에서는 네이티브 스크롤이
    // 이미 정상 동작하지만, 같은 위치로 다시 스크롤하는 것은 무해하다.
    if (typeof window === 'undefined' || id !== 'quiz' || window.location.hash !== '#quiz') {
      return;
    }
    rootRef.current?.scrollIntoView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const answeredCount = answers.filter((a) => a !== null).length;
  const score = answers.filter((a) => a?.correct).length;
  const finished = answeredCount === questions.length;

  const submit = (index: number, value: number | boolean | string, correct: boolean) => {
    setAnswers((prev) => {
      if (prev[index] !== null) return prev; // 답 변경 불가
      const next = [...prev];
      next[index] = { value, correct };
      return next;
    });
  };

  const reset = () => {
    setAnswers(questions.map(() => null));
    setResetKey((k) => k + 1); // 전 문항 리마운트 → BlankInput 로컬 상태도 초기화
  };

  return (
    // 섹션 틴트로 "여기부터 퀴즈" 를 알린다. 색은 --primary(hsl 207 90% 54%)를 옮긴
    // rgba(32,148,243,…) 리터럴이다. 이 저장소의 Tailwind 색상은 <alpha-value>
    // 플레이스홀더 없이 var(--primary) 로만 정의돼 있어 bg-primary/5 같은 투명도
    // 수식이 먹지 않는다(기존 bg-muted/50 도 실제로는 불투명하게 렌더된다).
    // 다크의 알파가 더 큰 이유는 어두운 배경에서 같은 농도면 보이지 않기 때문이다.
    <div
      id={id}
      ref={rootRef}
      className="not-prose my-8 scroll-mt-8 space-y-4 rounded-xl border border-[rgba(32,148,243,0.18)] bg-[rgba(32,148,243,0.045)] p-4 dark:border-[rgba(32,148,243,0.25)] dark:bg-[rgba(32,148,243,0.07)] md:p-6"
    >
      {questions.map((question, i) => (
        <QuestionCard
          key={`${resetKey}-${i}`}
          index={i}
          question={question}
          answer={answers[i]}
          onSubmit={submit}
        />
      ))}

      {finished && (
        <div className="rounded-lg border border-border bg-muted p-6 text-center">
          <p className="text-lg font-semibold text-foreground">
            {score} / {questions.length} 맞았습니다
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={reset}>
            다시 풀기
          </Button>
        </div>
      )}
    </div>
  );
}

interface QuestionCardProps {
  index: number;
  question: QuizQuestion;
  answer: Answer;
  onSubmit: (index: number, value: number | boolean | string, correct: boolean) => void;
}

function QuestionCard({ index, question, answer, onSubmit }: QuestionCardProps) {
  const done = answer !== null;

  return (
    // bg-background 를 명시해야 한다. 배경 클래스가 없으면 투명이라 섹션 틴트가
    // 카드 안까지 비친다. 다크에서는 --card 와 --background 가 같은 값이라
    // bg-card 로는 이 문제가 해결되지 않는다.
    <div className="rounded-lg border border-border bg-background p-5">
      <p className="font-medium text-foreground">
        <span className="mr-2 text-muted-foreground">Q{index + 1}.</span>
        {question.q}
      </p>

      {question.type === 'case' && (
        <ul className="mt-3 space-y-1 rounded-md border border-border bg-muted p-4 text-sm text-foreground">
          {question.given.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        {(question.type === 'mcq' || question.type === 'case') && (
          <ChoiceList
            choices={question.choices}
            correctIndex={question.answer}
            selected={done ? (answer.value as number) : null}
            onSelect={(choice) => onSubmit(index, choice, choice === question.answer)}
            numbered
          />
        )}

        {question.type === 'ox' && (
          <ChoiceList
            choices={['O', 'X']}
            correctIndex={question.answer ? 0 : 1}
            selected={done ? ((answer.value as boolean) ? 0 : 1) : null}
            onSelect={(choice) => onSubmit(index, choice === 0, (choice === 0) === question.answer)}
            row
          />
        )}

        {question.type === 'blank' && (
          <BlankInput
            label={question.q}
            done={done}
            value={done ? String(answer.value) : ''}
            onSubmit={(input) => onSubmit(index, input, isBlankCorrect(input, question.answer))}
          />
        )}
      </div>

      {done && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            'mt-4 rounded-md border p-3 text-sm text-foreground',
            answer.correct
              ? 'border-green-600/40 bg-green-500/10 dark:border-green-500/40'
              : 'border-red-600/40 bg-red-500/10 dark:border-red-500/40'
          )}
        >
          <p className="flex items-center gap-1.5 font-semibold">
            {answer.correct ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" /> 정답
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" /> 오답
              </>
            )}
          </p>
          {!answer.correct && question.type === 'blank' && (
            <p className="mt-1 text-muted-foreground">정답: {question.answer[0]}</p>
          )}
          <p className="mt-1.5">{question.explain}</p>
        </div>
      )}
    </div>
  );
}

interface ChoiceListProps {
  choices: string[];
  correctIndex: number;
  selected: number | null; // null 이면 미응답
  onSelect: (index: number) => void;
  row?: boolean;
  /** 보기 앞에 번호를 붙인다. O/X 처럼 보기가 자명한 유형에는 쓰지 않는다 */
  numbered?: boolean;
}

function ChoiceList({ choices, correctIndex, selected, onSelect, row, numbered }: ChoiceListProps) {
  const done = selected !== null;
  return (
    <div className={cn('gap-2', row ? 'flex' : 'flex flex-col')}>
      {choices.map((choice, i) => {
        const isCorrect = done && i === correctIndex;
        const isWrongPick = done && i === selected && i !== correctIndex;
        const label = (
          <>
            {choice}
            {isCorrect && (
              <>
                <CheckCircle2 className="ml-1 inline h-3.5 w-3.5" />
                <span className="sr-only">(정답)</span>
              </>
            )}
          </>
        );
        return (
          <button
            key={i}
            type="button"
            aria-disabled={done}
            onClick={() => {
              if (!done) onSelect(i);
            }}
            className={cn(
              'rounded-md border border-border bg-background px-4 py-2 text-left text-sm text-foreground transition-colors',
              row && 'min-w-16 text-center font-semibold',
              // hover:bg-accent 를 쓰지 않는 이유: 이 저장소는 --accent 와 --muted 가
              // 같은 값(hsl 60 4.8% 95.9%)이라 마우스를 올려도 사실상 변화가 없다.
              // 토큰을 고치면 사이트 전역 hover 가 바뀌므로 퀴즈 안에서만 색을 지정한다.
              !done && 'hover:border-[#2094f3] hover:bg-[rgba(32,148,243,0.08)]',
              isCorrect && 'border-green-600 bg-green-500/10 dark:border-green-500',
              isWrongPick && 'border-red-600 bg-red-500/10 dark:border-red-500',
              done && !isCorrect && !isWrongPick && 'opacity-60',
              done && 'cursor-default'
            )}
          >
            {numbered ? (
              // 보기가 두 줄로 접힐 때 둘째 줄이 번호 아래로 흐르지 않도록 flex 로 건다
              <span className="flex items-start gap-2">
                <span className="shrink-0 tabular-nums text-muted-foreground">{i + 1}.</span>
                <span>{label}</span>
              </span>
            ) : (
              label
            )}
          </button>
        );
      })}
    </div>
  );
}

interface BlankInputProps {
  /** 스크린 리더용 접근 가능한 레이블. 문항 텍스트(question.q)를 그대로 쓴다 */
  label: string;
  done: boolean;
  value: string;
  onSubmit: (input: string) => void;
}

function BlankInput({ label, done, value, onSubmit }: BlankInputProps) {
  const [input, setInput] = useState('');
  const submit = () => {
    const trimmed = input.trim();
    if (trimmed) onSubmit(trimmed);
  };
  return (
    <div className="flex gap-2">
      <Input
        value={done ? value : input}
        readOnly={done}
        aria-label={label}
        placeholder="답을 입력하세요"
        className={cn('max-w-64', done && 'cursor-default bg-muted text-foreground')}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
      />
      {!done && (
        <Button variant="secondary" size="sm" onClick={submit}>
          확인
        </Button>
      )}
    </div>
  );
}
