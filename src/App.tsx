import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { AboutUs } from './pages/AboutUs'
import { Packages } from './pages/Packages'
import { Work } from './pages/Work'
import ContactPage from './pages/contact'
import TeamSection from './pages/TeamSection'
import ServicesPage from './pages/services'
import ThemesStore from './pages/Themesstore'
import { Home } from './pages/Home'

import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/work" element={<Work />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/themes" element={<ThemesStore />} />
        <Route path="/team" element={<TeamSection />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
