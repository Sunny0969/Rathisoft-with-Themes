import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { submitEnrollment } from '../services/api';
import type { EnrollmentForm } from '../types/lms';
import { useCurrentUser } from '../hooks/useCurrentUser';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Other',
] as const;

const OCCUPATIONS = [
  'Student',
  'Fresh Graduate',
  'Working Professional',
  'Freelancer',
  'Business Owner',
  'Other',
] as const;

export type EnrollmentModalProps = {
  courseId: string;
  courseTitle: string;
  initProgress: (email: string) => void;
  onSuccess: () => void;
  onClose: () => void;
};

function normalizePhoneDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Pakistani mobile-style: starts with 03, total length 10–15 digits */
function isValidPhoneDigits(digits: string): boolean {
  if (digits.length < 10 || digits.length > 15) return false;
  return /^03\d+$/.test(digits);
}

export function EnrollmentModal({
  courseId,
  courseTitle,
  initProgress,
  onSuccess,
  onClose,
}: EnrollmentModalProps) {
  const { setEmail, setName } = useCurrentUser();
  const [fullName, setFullName] = useState('');
  const [email, setEmailField] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [occupation, setOccupation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [nameErr, setNameErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [phoneErr, setPhoneErr] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  function validate(): boolean {
    let ok = true;
    setNameErr('');
    setEmailErr('');
    setPhoneErr('');
    setFormError(null);

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setNameErr('Full name is required.');
      ok = false;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailErr('Email is required.');
      ok = false;
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      setEmailErr('Enter a valid email address.');
      ok = false;
    }

    const phoneDigits = normalizePhoneDigits(phone);
    if (!phoneDigits) {
      setPhoneErr('Phone number is required.');
      ok = false;
    } else if (!isValidPhoneDigits(phoneDigits)) {
      setPhoneErr(
        'Use a Pakistani mobile number starting with 03 (10–15 digits total).',
      );
      ok = false;
    }

    return ok;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const phoneDigits = normalizePhoneDigits(phone);
    const payload: EnrollmentForm = {
      name: fullName.trim(),
      email: email.trim(),
      phone: phoneDigits,
      city: city.trim(),
      occupation: occupation.trim(),
      courseId,
      courseTitle,
      enrolledAt: new Date().toISOString(),
    };

    setSubmitting(true);
    setFormError(null);
    try {
      const saved = await submitEnrollment(payload);
      if (!saved) {
        setFormError('Could not save enrollment. Please try again.');
        return;
      }
      setEmail(payload.email);
      setName(payload.name);
      initProgress(payload.email);
      onSuccess();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="lms-modal-overlay"
      role="presentation"
      onMouseDown={(ev) => {
        if (ev.target === ev.currentTarget) onClose();
      }}
    >
      <div
        className="lms-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enrollment-modal-title"
      >
        <header className="lms-modal-head">
          <button
            type="button"
            className="lms-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
          <h2 id="enrollment-modal-title" className="lms-modal-title">
            {courseTitle}
          </h2>
          <p className="lms-modal-sub">Enroll for free</p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="lms-modal-form"
        >
          {formError ? (
            <p className="lms-modal-banner">{formError}</p>
          ) : null}

          <label className="lms-modal-label">
            Full Name<span className="lms-modal-req">*</span>
            <input
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(ev) => setFullName(ev.target.value)}
              className="lms-modal-input"
            />
            {nameErr ? (
              <span className="lms-modal-field-error">{nameErr}</span>
            ) : null}
          </label>

          <label className="lms-modal-label">
            Email Address<span className="lms-modal-req">*</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(ev) => setEmailField(ev.target.value)}
              className="lms-modal-input"
            />
            {emailErr ? (
              <span className="lms-modal-field-error">{emailErr}</span>
            ) : null}
          </label>

          <label className="lms-modal-label">
            Phone Number<span className="lms-modal-req">*</span>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="03XXXXXXXXX"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
              className="lms-modal-input"
            />
            {phoneErr ? (
              <span className="lms-modal-field-error">{phoneErr}</span>
            ) : null}
          </label>

          <label className="lms-modal-label">
            City
            <select
              value={city}
              onChange={(ev) => setCity(ev.target.value)}
              className="lms-modal-select"
            >
              <option value="">Select city</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="lms-modal-label">
            Occupation
            <select
              value={occupation}
              onChange={(ev) => setOccupation(ev.target.value)}
              className="lms-modal-select"
            >
              <option value="">Select occupation</option>
              {OCCUPATIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="lms-btn lms-btn--primary lms-btn--block"
          >
            {submitting ? 'Saving…' : '✓ Enroll for Free'}
          </button>

          <p className="lms-modal-foot">
            🔒 Your information is safe. We never share your data.
          </p>
        </form>
      </div>
    </div>
  );
}
