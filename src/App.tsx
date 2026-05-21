import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PageLoader } from './components/PageLoader'
import { useWwwRedirect } from './hooks/useWwwRedirect'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { UrlNormalize } from './components/UrlNormalize'
import { AboutUs } from './pages/AboutUs'
import { Packages } from './pages/Packages'
import { Work } from './pages/Work'
import ContactPage from './pages/contact'
import TeamSection from './pages/TeamSection'
import ServicesPage from './pages/services'
const ThemesStore = lazy(() => import('./pages/Themesstore'))
import { Home } from './pages/Home'
import { CertificatePage } from './pages/CertificatePage'
import { CourseDetailPage } from './pages/CourseDetailPage'
import { CoursesPage } from './pages/CoursesPage'
import { LecturePage } from './pages/LecturePage'
import { QuizPage } from './pages/QuizPage'
import { NotFound } from './pages/NotFound'
import {
  LEGACY_SERVICE_SLUGS,
  ROUTES,
  SERVICE_SLUGS,
  servicePath,
} from './utils/routes'

import './App.css'

function LegacyCoursesRedirect() {
  const rest = window.location.pathname
    .replace(/^\/courses\/?/i, '')
    .replace(/\/+$/, '')
  const target = rest
    ? `/e-learning-courses/${rest}/`
    : ROUTES.courses
  return <Navigate to={target} replace />
}

export default function App() {
  useWwwRedirect()

  return (
    <BrowserRouter>
      <UrlNormalize />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/e-learning-courses" element={<CoursesPage />} />
        <Route path="/e-learning-courses/" element={<CoursesPage />} />
        <Route
          path="/e-learning-courses/:courseId"
          element={<CourseDetailPage />}
        />
        <Route
          path="/e-learning-courses/:courseId/"
          element={<CourseDetailPage />}
        />
        <Route
          path="/e-learning-courses/:courseId/lecture/:lectureId"
          element={<LecturePage />}
        />
        <Route
          path="/e-learning-courses/:courseId/quiz"
          element={<QuizPage />}
        />
        <Route
          path="/e-learning-courses/:courseId/certificate"
          element={<CertificatePage />}
        />

        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/about-us/" element={<AboutUs />} />
        <Route path="/portfolio" element={<Work />} />
        <Route path="/portfolio/" element={<Work />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/" element={<Packages />} />
        <Route path="/services/:slug" element={<ServicesPage />} />
        <Route path="/services/:slug/" element={<ServicesPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/" element={<ServicesPage />} />
        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="/contact-us/" element={<ContactPage />} />
        <Route
          path="/themes-store"
          element={
            <Suspense fallback={<PageLoader label="Loading themes store" />}>
              <ThemesStore />
            </Suspense>
          }
        />
        <Route
          path="/themes-store/"
          element={
            <Suspense fallback={<PageLoader label="Loading themes store" />}>
              <ThemesStore />
            </Suspense>
          }
        />
        <Route path="/our-team" element={<TeamSection />} />
        <Route path="/our-team/" element={<TeamSection />} />

        {/* Legacy URLs → canonical (client-side; Vercel 301 mirrors these) */}
        <Route path="/courses/*" element={<LegacyCoursesRedirect />} />
        <Route path="/portfolio-lahore" element={<Navigate to={ROUTES.portfolio} replace />} />
        <Route path="/portfolio-lahore/" element={<Navigate to={ROUTES.portfolio} replace />} />
        <Route path="/packages-lahore" element={<Navigate to={ROUTES.packages} replace />} />
        <Route path="/packages-lahore/" element={<Navigate to={ROUTES.packages} replace />} />
        <Route path="/themes-store-lahore" element={<Navigate to={ROUTES.themes} replace />} />
        <Route path="/themes-store-lahore/" element={<Navigate to={ROUTES.themes} replace />} />
        <Route path="/contact-us-lahore" element={<Navigate to={ROUTES.contact} replace />} />
        <Route path="/contact-us-lahore/" element={<Navigate to={ROUTES.contact} replace />} />
        <Route path="/our-team-lahore" element={<Navigate to={ROUTES.team} replace />} />
        <Route path="/our-team-lahore/" element={<Navigate to={ROUTES.team} replace />} />
        <Route path="/about" element={<Navigate to={ROUTES.about} replace />} />
        <Route path="/about/" element={<Navigate to={ROUTES.about} replace />} />
        <Route path="/work" element={<Navigate to={ROUTES.portfolio} replace />} />
        <Route path="/work/" element={<Navigate to={ROUTES.portfolio} replace />} />
        <Route path="/packages" element={<Navigate to={ROUTES.packages} replace />} />
        <Route path="/packages/" element={<Navigate to={ROUTES.packages} replace />} />
        <Route path="/themes" element={<Navigate to={ROUTES.themes} replace />} />
        <Route path="/themes/" element={<Navigate to={ROUTES.themes} replace />} />
        <Route path="/contact" element={<Navigate to={ROUTES.contact} replace />} />
        <Route path="/contact/" element={<Navigate to={ROUTES.contact} replace />} />
        <Route path="/team" element={<Navigate to={ROUTES.team} replace />} />
        <Route path="/team/" element={<Navigate to={ROUTES.team} replace />} />
        {Object.entries(LEGACY_SERVICE_SLUGS).map(([oldSlug, newSlug]) => (
          <Route
            key={oldSlug}
            path={`/services/${oldSlug}`}
            element={<Navigate to={servicePath(newSlug)} replace />}
          />
        ))}
        {SERVICE_SLUGS.map((slug) => (
          <Route
            key={`root-${slug}`}
            path={`/${slug}`}
            element={<Navigate to={servicePath(slug)} replace />}
          />
        ))}

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
