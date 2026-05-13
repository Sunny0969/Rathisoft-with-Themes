import type { EnrollmentForm, LocalProgress } from '../types/lms';

function enrollmentStorageKey(email: string, courseId: string): string {
  return `enrollment_${email}_${courseId}`;
}

function progressStorageKey(email: string, courseId: string): string {
  return `progress_${email}_${courseId}`;
}

export async function submitEnrollment(data: EnrollmentForm): Promise<boolean> {
  try {
    const key = enrollmentStorageKey(data.email, data.courseId);
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function checkEnrollment(email: string, courseId: string): boolean {
  const key = enrollmentStorageKey(email, courseId);
  return localStorage.getItem(key) !== null;
}

export function saveProgress(progress: LocalProgress): void {
  const key = progressStorageKey(progress.enrolledUserEmail, progress.courseId);
  localStorage.setItem(key, JSON.stringify(progress));
}

export function getProgress(email: string, courseId: string): LocalProgress | null {
  const raw = localStorage.getItem(progressStorageKey(email, courseId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LocalProgress;
  } catch {
    return null;
  }
}
