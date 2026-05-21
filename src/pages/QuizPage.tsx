import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import coursesJson from '../data/courses.json';
import type { Course, QuizQuestion } from '../types/lms';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useProgress } from '../hooks/useProgress';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { InternalLinksNav } from '../components/InternalLinksNav';
import { courseDetailInternalLinks } from '../data/internalLinks';
import { ROUTES, coursePath } from '../utils/routes';

const courses = coursesJson as Course[];

const OPTION_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function QuizPage() {
  const { courseId = '' } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { getEmail } = useCurrentUser();

  const course = useMemo(
    () => courses.find((c) => c.id === courseId),
    [courseId],
  );

  const questions = course?.quiz.questions ?? [];
  const passingScore = course?.quiz.passingScore ?? 70;

  const { initProgress, saveQuizResult } = useProgress(
    courseId,
    course?.totalLectures ?? 0,
  );

  useEffect(() => {
    const email = getEmail()?.trim();
    if (!email || !courseId) return;
    initProgress(email);
  }, [courseId, getEmail, initProgress]);

  const [phase, setPhase] = useState<'quiz' | 'results'>('quiz');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const [resultPercent, setResultPercent] = useState(0);
  const [resultPassed, setResultPassed] = useState(false);
  const [displayCorrectCount, setDisplayCorrectCount] = useState(0);

  const question: QuizQuestion | undefined = questions[questionIndex];
  const totalQuestions = questions.length;
  const isLast = questionIndex >= totalQuestions - 1;

  const goToCourse = useCallback(() => {
    navigate(coursePath(courseId));
  }, [courseId, navigate]);

  const finishQuiz = useCallback(
    (lastWasCorrect: boolean) => {
      const finalCorrect = correctCount + (lastWasCorrect ? 1 : 0);
      const pct =
        totalQuestions > 0
          ? Math.round((finalCorrect / totalQuestions) * 100)
          : 0;
      const passed = pct >= passingScore;
      setDisplayCorrectCount(finalCorrect);
      setResultPercent(pct);
      setResultPassed(passed);
      saveQuizResult(pct, passed);
      setPhase('results');
    },
    [correctCount, passingScore, saveQuizResult, totalQuestions],
  );

  const handleCheckAnswer = () => {
    if (selectedOption === null || !question) return;
    setRevealed(true);
  };

  const handleNext = () => {
    if (!question || selectedOption === null) return;

    const lastWasCorrect = selectedOption === question.correctAnswer;

    if (isLast) {
      finishQuiz(lastWasCorrect);
      return;
    }

    setCorrectCount((c) => c + (lastWasCorrect ? 1 : 0));
    setQuestionIndex((i) => i + 1);
    setSelectedOption(null);
    setRevealed(false);
  };

  if (!course || totalQuestions === 0) {
    return <Navigate to={courseId ? coursePath(courseId) : ROUTES.courses} replace />;
  }

  const quizBreadcrumbs = [
    { name: 'Home', path: ROUTES.home },
    { name: 'E-Learning', path: ROUTES.courses },
    { name: course.title, path: coursePath(course.id) },
    { name: 'Quiz', path: coursePath(course.id, 'quiz') },
  ]

  if (phase === 'results') {
    return (
      <>
        <Seo
          title={`Quiz results — ${course.title}`}
          description={`You scored ${resultPercent}% on the ${course.title} quiz.`}
        />
        <Breadcrumbs items={quizBreadcrumbs} />
        <main className="lms-quiz-shell">
          <div className="lms-container-narrow lms-mt-6">
            <div className="lms-result-card">
              <p className="lms-emoji-xl" aria-hidden>
                {resultPassed ? '🎉' : '😔'}
              </p>
              <h1 className="lms-heading-lg lms-mt-6">
                {resultPassed ? 'Congratulations!' : 'Keep practicing'}
              </h1>
              <p className="lms-stat-value lms-mt-3">{resultPercent}%</p>
              <p className="lms-text-muted lms-mt-2">
                {displayCorrectCount} of {totalQuestions} correct
              </p>
              <p className="lms-text-muted lms-text-sm lms-mt-4">
                Passing score: {passingScore}%
              </p>

              <div className="lms-actions-row lms-mt-10">
                {resultPassed ? (
                  <Link
                    to={`/courses/${course.id}/certificate`}
                    className="lms-btn lms-btn--primary"
                  >
                    🏆 Get My Certificate
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={goToCourse}
                    className="lms-btn lms-btn--ghost-outline"
                  >
                    Review Course
                  </button>
                )}
              </div>
            </div>
            <InternalLinksNav
              links={courseDetailInternalLinks(course.title)}
              heading="Related pages"
              className="internal-links--compact"
            />
          </div>
        </main>
      </>
    );
  }

  const headerProgressPct =
    ((questionIndex + 1) / totalQuestions) * 100;

  if (!question) {
    return <Navigate to={coursePath(courseId)} replace />;
  }

  return (
    <>
      <Seo
        title={`Quiz — ${course.title}`}
        description={`Knowledge check for ${course.title}. Pass at ${passingScore}%.`}
      />
      <Breadcrumbs items={quizBreadcrumbs} />
      <main className="lms-quiz-shell">
        <div className="lms-quiz-topbar">
          <div className="lms-quiz-topbar-inner">
            <div className="lms-quiz-grow">
              <div className="lms-progress-head lms-progress-head--flush">
                <span>
                  Question {questionIndex + 1} of {totalQuestions}
                </span>
              </div>
              <div
                className="lms-progress-track"
                role="progressbar"
                aria-valuenow={questionIndex + 1}
                aria-valuemin={1}
                aria-valuemax={totalQuestions}
              >
                <div
                  className="lms-progress-fill"
                  style={{
                    width: `${Math.min(100, Math.max(0, headerProgressPct))}%`,
                  }}
                />
              </div>
            </div>
            <p className="lms-quiz-pass-hint">
              Pass: {passingScore}%
            </p>
          </div>
        </div>

        <div className="lms-quiz-body">
          <h2 className="lms-quiz-q">{question.question}</h2>

          <div className="lms-vstack-gap">
            {question.options.map((opt, idx) => {
              const label = OPTION_LABELS[idx] ?? String(idx + 1);
              const isSelected = selectedOption === idx;
              const isCorrect = idx === question.correctAnswer;
              const isWrongPick = revealed && isSelected && !isCorrect;

              let cls = 'lms-opt';
              if (!revealed && isSelected) cls += ' lms-opt--picked';
              if (revealed && isCorrect) cls += ' lms-opt--correct';
              if (revealed && isWrongPick) cls += ' lms-opt--wrong';

              let letterCls = 'lms-opt-letter';
              if (revealed && isCorrect) letterCls += ' lms-opt-letter--correct';
              if (revealed && isWrongPick) letterCls += ' lms-opt-letter--wrong';

              return (
                <button
                  key={`${question.id}-opt-${idx}`}
                  type="button"
                  disabled={revealed}
                  onClick={() => setSelectedOption(idx)}
                  className={cls}
                >
                  <span className={letterCls}>{label}</span>
                  <span className="lms-opt-text">{opt}</span>
                </button>
              );
            })}
          </div>

          {!revealed && selectedOption !== null ? (
            <button
              type="button"
              onClick={handleCheckAnswer}
              className="lms-btn lms-btn--primary lms-mt-6"
            >
              Check Answer
            </button>
          ) : null}

          {revealed ? (
            <>
              <div
                className={
                  selectedOption === question.correctAnswer
                    ? 'lms-feedback lms-feedback--ok lms-mt-6'
                    : 'lms-feedback lms-feedback--bad lms-mt-6'
                }
              >
                <p className="lms-feedback-title">
                  {selectedOption === question.correctAnswer ? (
                    <>✓ Correct!</>
                  ) : (
                    <>✗ Incorrect.</>
                  )}
                </p>
                <p className="lms-feedback-text">{question.explanation}</p>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="lms-btn lms-btn--outline lms-mt-6"
              >
                {isLast ? 'See Results' : 'Next Question →'}
              </button>
            </>
          ) : null}

          <p className="lms-mt-6">
            <button type="button" onClick={goToCourse} className="lms-link">
              ← Back to course
            </button>
          </p>

          <InternalLinksNav
            links={courseDetailInternalLinks(course.title)}
            heading="Related pages"
            className="internal-links--compact"
          />
        </div>
      </main>
    </>
  );
}
