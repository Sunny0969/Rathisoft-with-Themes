import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { EnrollmentModal } from '../components/EnrollmentModal';
import { TeraboxLecturePlayer } from '../components/TeraboxLecturePlayer';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Seo } from '../components/Seo';
import { JsonLd } from '../components/JsonLd';
import { SCHEMA_CONTEXT, buildCourseSchema } from '../data/schemaMarkup';
import { ROUTES, coursePath } from '../utils/routes';
import coursesJson from '../data/courses.json';
import type { Course, Lecture } from '../types/lms';
import { useProgress } from '../hooks/useProgress';
import {
  getLectureFallbackUrl,
  getLectureVideoSrc,
  isExternalLectureUrl,
  isTeraboxLecture,
} from '../utils/lectureVideo';

const courses = coursesJson as Course[];

export function CourseDetailPage() {
  const { courseId = '' } = useParams<{ courseId: string }>();

  const course = useMemo(
    () => courses.find((c) => c.id === courseId),
    [courseId],
  );

  const sortedLectures = useMemo(() => {
    if (!course) return [];
    return [...course.lectures].sort((a, b) => a.order - b.order);
  }, [course]);

  const {
    progress,
    initProgress,
    markLectureComplete,
    isLectureComplete,
    completionPercent,
    isEnrolled,
  } = useProgress(courseId, course?.totalLectures ?? 0);

  const [showEnrollment, setShowEnrollment] = useState(false);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);

  useEffect(() => {
    if (!sortedLectures.length) return;

    if (!isEnrolled) {
      setActiveLecture(null);
      return;
    }

    setActiveLecture((prev) => {
      if (prev && sortedLectures.some((l) => l.id === prev.id)) {
        return prev;
      }
      const completed = progress?.completedLectures ?? [];
      const firstIncomplete = sortedLectures.find(
        (l) => !completed.includes(l.id),
      );
      return (
        firstIncomplete ?? sortedLectures[sortedLectures.length - 1] ?? null
      );
    });
  }, [isEnrolled, sortedLectures, progress?.completedLectures]);

  const handleEnrollSuccess = () => {
    const email = localStorage.getItem('lms_user_email');
    if (email) {
      initProgress(email);
    }
    setShowEnrollment(false);
    if (sortedLectures.length) {
      setActiveLecture(sortedLectures[0]);
    }
  };

  const pct = completionPercent();
  const quizPassed = progress?.quizPassed === true;

  const completedCount = sortedLectures.filter((l) =>
    isLectureComplete(l.id),
  ).length;

  const allLecturesComplete =
    sortedLectures.length > 0 &&
    sortedLectures.every((l) => isLectureComplete(l.id));

  const activeIndex = activeLecture
    ? sortedLectures.findIndex((l) => l.id === activeLecture.id)
    : -1;

  const hasNext =
    activeIndex >= 0 && activeIndex < sortedLectures.length - 1;

  const handleMarkComplete = () => {
    if (!activeLecture || !isEnrolled) return;
    if (isLectureComplete(activeLecture.id)) return;

    markLectureComplete(activeLecture.id);

    if (hasNext) {
      setActiveLecture(sortedLectures[activeIndex + 1]);
    }
  };

  const handleNextLecture = () => {
    if (!hasNext) return;
    setActiveLecture(sortedLectures[activeIndex + 1]);
  };

  if (!course) {
    return <Navigate to={ROUTES.courses} replace />;
  }

  const descriptionPlain =
    course.description.length > 320
      ? `${course.description.slice(0, 317)}…`
      : course.description;

  const currentComplete =
    activeLecture != null && isLectureComplete(activeLecture.id);

  const lectureVideoSrc = activeLecture
    ? getLectureVideoSrc(activeLecture.driveFileId)
    : '';
  const lectureFallbackUrl = activeLecture
    ? getLectureFallbackUrl(activeLecture.driveFileId)
    : null;
  const lectureIsGenericExternal = activeLecture
    ? isExternalLectureUrl(activeLecture.driveFileId)
    : false;
  const lectureIsTerabox = activeLecture
    ? isTeraboxLecture(activeLecture.driveFileId)
    : false;

  return (
    <>
      <Seo
        title={`${course.title} — RathiSoft`}
        description={descriptionPlain}
        keywords={[course.category, ...course.tags].join(', ')}
      />
      <JsonLd
        data={{
          '@context': SCHEMA_CONTEXT,
          '@graph': [buildCourseSchema(course)],
        }}
      />

      {showEnrollment ? (
        <EnrollmentModal
          courseId={course.id}
          courseTitle={course.title}
          initProgress={initProgress}
          onClose={() => setShowEnrollment(false)}
          onSuccess={handleEnrollSuccess}
        />
      ) : null}

      <main className="app-main">
      <Breadcrumbs
        items={[
          { name: 'Home', path: ROUTES.home },
          { name: 'E-Learning', path: ROUTES.courses },
          { name: course.title, path: coursePath(course.id) },
        ]}
      />

      <div className="lms-page lms-page--flush-top">
        <section className="lms-hero">
          <div className="lms-container">
            <p className="lms-hero-pill">{course.category}</p>
            <h1 className="lms-hero-title">
              {course.title} — Free Online Course | RathiSoft
            </h1>
            <p className="lms-hero-desc">{course.description}</p>

            <dl className="lms-hero-dl">
              <div>
                <dt>Instructor</dt>
                <dd>{course.instructor}</dd>
              </div>
              <div>
                <dt>Lectures</dt>
                <dd>{course.totalLectures}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{course.duration}</dd>
              </div>
              <div>
                <dt>Level</dt>
                <dd>{course.level}</dd>
              </div>
            </dl>
          </div>
        </section>

        <div className="lms-player-shell">
          <div className="lms-player-main">
            <div className="lms-player-video-wrap">
              {activeLecture && isEnrolled ? (
                lectureIsGenericExternal && lectureFallbackUrl ? (
                  <div className="lms-player-placeholder lms-player-placeholder--external">
                    <span className="lms-player-placeholder-icon" aria-hidden>
                      ▶
                    </span>
                    <span>This lecture opens on an external site.</span>
                    <a
                      href={lectureFallbackUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="lms-btn lms-btn--primary lms-mt-4"
                    >
                      Watch lecture →
                    </a>
                  </div>
                ) : lectureIsTerabox ? (
                  <TeraboxLecturePlayer
                    key={activeLecture.id}
                    shareUrl={activeLecture.driveFileId}
                    title={activeLecture.title}
                    fallbackUrl={lectureFallbackUrl}
                  />
                ) : (
                  <iframe
                    key={activeLecture.id}
                    src={lectureVideoSrc}
                    width="100%"
                    title={activeLecture.title}
                    allow="autoplay; fullscreen; encrypted-media"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )
              ) : (
                <div className="lms-player-placeholder">
                  <span className="lms-player-placeholder-icon" aria-hidden>
                    ▶
                  </span>
                  <span>Select a lecture to begin</span>
                </div>
              )}
            </div>

            {activeLecture && isEnrolled ? (
              <div className="lms-mt-6">
                <h2
                  className="lms-heading-lg"
                  style={{ fontWeight: 700, marginBottom: '0.5rem' }}
                >
                  {activeLecture.title}
                </h2>
                <p className="lms-text-muted" style={{ lineHeight: 1.65 }}>
                  {activeLecture.description}
                </p>
                <span className="lms-duration-badge">{activeLecture.duration}</span>

                <div
                  className="lms-mt-6"
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    alignItems: 'center',
                  }}
                >
                  {currentComplete ? (
                    <span
                      className="lms-duration-badge"
                      style={{
                        borderColor: 'var(--color-primary, #0f6e56)',
                        color: 'var(--color-primary, #0f6e56)',
                        background: 'rgba(15, 110, 86, 0.15)',
                      }}
                    >
                      ✓ Completed
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="lms-btn lms-btn--primary"
                      onClick={handleMarkComplete}
                    >
                      ✓ Mark as Complete
                    </button>
                  )}
                  <button
                    type="button"
                    className="lms-btn lms-btn--outline"
                    onClick={handleNextLecture}
                    disabled={!hasNext}
                  >
                    Next Lecture →
                  </button>
                </div>
              </div>
            ) : null}

            <p className="lms-mt-6">
              <Link to={ROUTES.courses} className="lms-link">
                ← All courses
              </Link>
            </p>
          </div>

          <aside className="lms-player-sidebar">
            {!isEnrolled ? (
              <button
                type="button"
                onClick={() => setShowEnrollment(true)}
                className="lms-btn lms-btn--primary lms-btn--block"
              >
                Enroll for Free →
              </button>
            ) : (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span className="lms-text-sm lms-text-muted">Your Progress</span>
                  <span className="lms-progress-pct-strong lms-tabular">
                    {pct}%
                  </span>
                </div>
                <div
                  className="lms-progress-track"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="lms-progress-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="lms-text-sm lms-text-muted lms-mt-2">
                  Completed {completedCount} of {sortedLectures.length}{' '}
                  {sortedLectures.length === 1 ? 'lecture' : 'lectures'}
                </p>
              </div>
            )}

            <h3 className="lms-heading-lg lms-mt-6" style={{ fontSize: '1rem' }}>
              Course Content
            </h3>
            <div className="lms-mt-4" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {sortedLectures.map((lec, index) => {
                const complete = isEnrolled && isLectureComplete(lec.id);
                const active = activeLecture?.id === lec.id;

                return (
                  <button
                    key={lec.id}
                    type="button"
                    className={`lms-curriculum-row${active ? ' lms-curriculum-row--active' : ''}`}
                    onClick={() => {
                      if (!isEnrolled) {
                        setShowEnrollment(true);
                        return;
                      }
                      setActiveLecture(lec);
                    }}
                  >
                    <span
                      className={`lms-curriculum-num${complete ? ' lms-curriculum-num--done' : ''}`}
                    >
                      {complete ? '✓' : index + 1}
                    </span>
                    <span className="lms-curriculum-body">
                      <span
                        className={
                          complete
                            ? 'lms-curriculum-title lms-curriculum-title--muted'
                            : 'lms-curriculum-title'
                        }
                      >
                        {lec.title}
                      </span>
                      <span className="lms-curriculum-meta">{lec.duration}</span>
                    </span>
                    {active && isEnrolled ? (
                      <span style={{ color: '#0F6E56', fontSize: 18 }} aria-hidden>
                        ▶
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {isEnrolled && allLecturesComplete && !quizPassed ? (
              <Link
                to={coursePath(course.id, 'quiz')}
                className="lms-btn lms-btn--primary lms-btn--block lms-mt-6"
              >
                📝 Take Final Quiz →
              </Link>
            ) : null}

            {isEnrolled && quizPassed ? (
              <Link
                to={coursePath(course.id, 'certificate')}
                className="lms-btn lms-btn--primary lms-btn--block lms-mt-6"
              >
                🏆 Download Certificate
              </Link>
            ) : null}

          </aside>
        </div>
      </div>
      </main>
    </>
  );
}
