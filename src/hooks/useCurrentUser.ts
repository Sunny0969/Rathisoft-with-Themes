import { useCallback } from 'react';

const LMS_USER_EMAIL = 'lms_user_email';
const LMS_USER_NAME = 'lms_user_name';

export function useCurrentUser() {
  const getEmail = useCallback((): string | null => {
    return localStorage.getItem(LMS_USER_EMAIL);
  }, []);

  const setEmail = useCallback((email: string) => {
    localStorage.setItem(LMS_USER_EMAIL, email);
  }, []);

  const getName = useCallback((): string | null => {
    return localStorage.getItem(LMS_USER_NAME);
  }, []);

  const setName = useCallback((name: string) => {
    localStorage.setItem(LMS_USER_NAME, name);
  }, []);

  const isKnownUser = useCallback((): boolean => {
    const email = localStorage.getItem(LMS_USER_EMAIL);
    return Boolean(email?.trim());
  }, []);

  return { getEmail, setEmail, getName, setName, isKnownUser };
}
