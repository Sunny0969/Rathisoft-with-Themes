import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useWwwRedirect } from './hooks/useWwwRedirect'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { AboutUs } from './pages/AboutUs'
import { Packages } from './pages/Packages'
import { Work } from './pages/Work'
import ContactPage from './pages/contact'
import TeamSection from './pages/TeamSection'
import ServicesPage, { SERVICE_SLUGS } from './pages/services'
import ThemesStore from './pages/Themesstore'
import { Home } from './pages/Home'
import { CertificatePage } from './pages/CertificatePage'
import { CourseDetailPage } from './pages/CourseDetailPage'
import { CoursesPage } from './pages/CoursesPage'
import { LecturePage } from './pages/LecturePage'
import { QuizPage } from './pages/QuizPage'
import { NotFound } from './pages/NotFound'

import './App.css'

export default function App() {
  useWwwRedirect()

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        <Route
          path="/courses/:courseId/lecture/:lectureId"
          element={<LecturePage />}
        />
        <Route path="/courses/:courseId/quiz" element={<QuizPage />} />
        <Route
          path="/courses/:courseId/certificate"
          element={<CertificatePage />}
        />

        <Route path="/about" element={<AboutUs />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/work" element={<Work />} />
        <Route path="/services/:slug" element={<ServicesPage />} />
        <Route path="/services" element={<ServicesPage />} />
        {SERVICE_SLUGS.map((slug) => (
          <Route
            key={slug}
            path={`/${slug}`}
            element={<Navigate to={`/services/${slug}`} replace />}
          />
        ))}
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/themes" element={<ThemesStore />} />
        <Route path="/team" element={<TeamSection />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
