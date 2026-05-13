import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import coursesJson from '../data/courses.json';
import { useCurrentUser } from '../hooks/useCurrentUser';
import type { Course } from '../types/lms';

const courses = coursesJson as Course[];

function sanitizeFilePart(value: string): string {
  const cleaned = value
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return cleaned.slice(0, 72) || 'Learner';
}

function formatCompletionDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function certPaperColor(): string {
  if (typeof document === 'undefined') return '#ffffff';
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue('--lms-cert-paper')
    .trim();
  return v || '#ffffff';
}

export function CertificatePage() {
  const { courseId = '' } = useParams<{ courseId: string }>();
  const certRef = useRef<HTMLDivElement>(null);
  const { getName } = useCurrentUser();

  const course = useMemo(
    () => courses.find((c) => c.id === courseId),
    [courseId],
  );

  const [pdfBusy, setPdfBusy] = useState(false);

  const studentName = (getName()?.trim() || 'Student').trim();
  const completionDate = formatCompletionDate(new Date());

  async function downloadPDF(): Promise<void> {
    const node = certRef.current;
    if (!node || !course) return;

    setPdfBusy(true);
    try {
      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        backgroundColor: certPaperColor(),
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [794, 562],
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 794, 562);

      const coursePart = sanitizeFilePart(course.title);
      const namePart = sanitizeFilePart(studentName);
      pdf.save(`${coursePart}-Certificate-${namePart}.pdf`);
    } finally {
      setPdfBusy(false);
    }
  }

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  return (
    <>
      <Seo
        title={`Certificate — ${course.title}`}
        description={`Certificate of completion for ${course.title}.`}
      />
      <main className="lms-cert-page">
        <div className="lms-cert-page-inner">
          <h1 className="lms-heading-xl">🎉 You did it!</h1>
          <p className="lms-lead lms-lead--center lms-lead-narrow lms-mt-2">
            Your certificate is ready. Download a PDF to share your achievement,
            or keep learning with more free courses.
          </p>

          <div className="lms-cert-scroll">
            <div ref={certRef} className="lms-cert">
              <div className="lms-cert-bar" aria-hidden />
              <div className="lms-cert-frame-outer">
                <div className="lms-cert-frame-mid">
                  <div className="lms-cert-frame-inner">
                    <p className="lms-cert-brand">RATHISOFT</p>
                    <p className="lms-cert-sub">Certificate of Completion</p>
                    <p className="lms-cert-prompt">This is to certify that</p>
                    <p className="lms-cert-name">{studentName}</p>
                    <p className="lms-cert-blurb">
                      has successfully completed the course
                    </p>
                    <p className="lms-cert-course">{course.title}</p>
                    <p className="lms-cert-date">{completionDate}</p>

                    <div className="lms-cert-sigs">
                      <div className="lms-cert-sig">
                        <div className="lms-cert-sig-line">
                          RathiSoft Team / Instructor
                        </div>
                      </div>
                      <div className="lms-cert-sig">
                        <div className="lms-cert-sig-line">
                          rathisoft.com / Platform
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lms-cert-bar" aria-hidden />
            </div>
          </div>

          <div className="lms-actions-row lms-mt-10">
            <button
              type="button"
              disabled={pdfBusy}
              onClick={() => void downloadPDF()}
              className="lms-btn lms-btn--primary"
            >
              {pdfBusy ? 'Preparing PDF…' : '⬇ Download PDF Certificate'}
            </button>
            <Link to="/courses" className="lms-btn lms-btn--outline">
              Explore More Courses
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
