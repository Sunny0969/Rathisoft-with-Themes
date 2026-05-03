import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { AboutUs } from './pages/AboutUs'
import { Packages } from './pages/Packages'
import { Work } from './pages/Work'
import ContactPage from './pages/contact'
import ServicesPage from './pages/services'
import ThemesStore from './pages/Themesstore';

import './App.css'
  
function HomeMain() {
  return <main className="app-main" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomeMain />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/work" element={<Work />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/themes" element={<ThemesStore />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
