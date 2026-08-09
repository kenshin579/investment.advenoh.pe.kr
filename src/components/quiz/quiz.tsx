'use client';

import { useState } from 'react';
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
    <div id={id} className="not-prose my-8 space-y-6 scroll-mt-8">
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
        <div className="rounded-lg border border-border bg-muted/50 p-6 text-center">
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
    <div className="rounded-lg border border-border p-5">
      <p className="font-medium text-foreground">
        <span className="mr-2 text-muted-foreground">Q{index + 1}.</span>
        {question.q}
      </p>

      {question.type === 'case' && (
        <ul className="mt-3 space-y-1 rounded-md border border-border bg-muted/50 p-4 text-sm text-foreground">
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
              'rounded-md border border-border px-4 py-2 text-left text-sm text-foreground transition-colors',
              row && 'min-w-16 text-center font-semibold',
              !done && 'hover:bg-accent hover:text-accent-foreground',
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
        className="max-w-64"
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
