import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import App from '@/App'
import { initI18n } from '@/i18n'
import '@/index.css'

const I18N_INIT_ERROR_MESSAGE =
  'Failed to load the app. Please refresh the page.'

const root = document.getElementById('root')!

initI18n(window.location.pathname.replace(/^\/guides/, '') || '/')
  .then(() => {
    createRoot(root).render(
      <StrictMode>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <BrowserRouter basename="/guides">
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </StrictMode>,
    )
  })
  .catch((err: unknown) => {
    console.error('i18n init failed', err)
    createRoot(root).render(
      <StrictMode>
        <p className="flex min-h-screen items-center justify-center p-6 text-center text-sm">
          {I18N_INIT_ERROR_MESSAGE}
        </p>
      </StrictMode>,
    )
  })
