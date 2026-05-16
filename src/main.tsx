import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/lms-pages.css'
import App from './App.tsx'

if (
  typeof window !== 'undefined' &&
  window.location.hostname === 'rathisoft.com'
) {
  window.location.replace(
    'https://www.rathisoft.com' +
      window.location.pathname +
      window.location.search +
      window.location.hash,
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
