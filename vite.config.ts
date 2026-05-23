import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { teraboxMediaDevPlugin } from './vite-plugins/teraboxMediaDev'
import { themesStoreClicksDevPlugin } from './vite-plugins/themesStoreClicksDev'

/** Collapse HTML whitespace in production builds (smaller index.html). */
function htmlMinifyPlugin() {
  return {
    name: 'rathisoft-html-minify',
    enforce: 'post' as const,
    transformIndexHtml(html: string) {
      if (process.env.NODE_ENV !== 'production') return html
      return html
        .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
        .replace(/\n\s+/g, '\n')
        .replace(/>\s+</g, '><')
        .trim()
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    teraboxMediaDevPlugin(),
    themesStoreClicksDevPlugin(),
    htmlMinifyPlugin(),
  ],
  build: {
    target: 'es2020',
    cssMinify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('html2canvas') || id.includes('jspdf')) return 'pdf-tools'
          if (id.includes('gsap')) return 'gsap'
          if (id.includes('react-router')) return 'router'
          if (id.includes('react-dom') || id.includes('/react/')) return 'react-vendor'
        },
      },
    },
  },
})
