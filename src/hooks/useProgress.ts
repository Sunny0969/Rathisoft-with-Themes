import { useCallback, useEffect, useState } from 'react';
import { checkEnrollment, getProgress, saveProgress } from '../services/api';
import type { LocalProgress } from '../types/lms';
import { useCurrentUser } from './useCurrentUser';

export function useProgress(courseId: string, totalLectures: number) {
  const { getEmail } = useCurrentUser();
  const [progress, setProgress] = useState<LocalProgress | null>(null);

  const initProgress = useCallback(
    (email: string) => {
      const normalized = email.trim();
      if (!normalized) return;

      const stored = getProgress(normalized, courseId);
      if (stored) {
        setProgress(stored);
        return;
      }

      if (!checkEnrollment(normalized, courseId)) {
        setProgress(null);
        return;
      }

      const fresh: LocalProgress = {
        courseId,
        enrolledUserEmail: normalized,
        completedLectures: [],
        enrolledAt: new Date().toISOString(),
      };
      saveProgress(fresh);
      setProgress(fresh);
    },
    [courseId],
  );

  useEffect(() => {
    const email = getEmail()?.trim();
    if (!email || !courseId) {
      setProgress(null);
      return;
    }
    const saved = getProgress(email, courseId);
    if (saved) {
      setProgress(saved);
      return;
    }
    if (checkEnrollment(email, courseId)) {
      initProgress(email);
    } else {
      setProgress(null);
    }
  }, [courseId, getEmail, initProgress]);

  const markLectureComplete = useCallback((lectureId: string) => {
    setProgress((prev) => {
      if (!prev) return prev;
      if (prev.completedLectures.includes(lectureId)) return prev;
      const next: LocalProgress = {
        ...prev,
        completedLectures: [...prev.completedLectures, lectureId],
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const saveQuizResult = useCallback(
    (score: number, passed: boolean) => {
      setProgress((prev) => {
        const email = getEmail()?.trim();
        let base = prev;
        if (!base && email && checkEnrollment(email, courseId)) {
          base =
            getProgress(email, courseId) ??
            ({
              courseId,
              enrolledUserEmail: email,
              completedLectures: [],
              enrolledAt: new Date().toISOString(),
            } satisfies LocalProgress);
        }
        if (!base) return prev;
        const next: LocalProgress = {
          ...base,
          quizScore: score,
          quizPassed: passed,
        };
        saveProgress(next);
        return next;
      });
    },
    [courseId, getEmail],
  );

  const isLectureComplete = useCallback(
    (lectureId: string): boolean => {
      return progress?.completedLectures.includes(lectureId) ?? false;
    },
    [progress],
  );

  const completionPercent = useCallback((): number => {
    if (!totalLectures || totalLectures < 1) return 0;
    const done = progress?.completedLectures.length ?? 0;
    return Math.round((done / totalLectures) * 100);
  }, [progress, totalLectures]);

  const isEnrolled = progress !== null;

  return {
    progress,
    initProgress,
    markLectureComplete,
    saveQuizResult,
    isLectureComplete,
    completionPercent,
    isEnrolled,
  };
}
