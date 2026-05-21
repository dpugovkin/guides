import { Navigate, Outlet, Route, Routes, useParams } from 'react-router-dom'
import { Suspense } from 'react'
import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import { AppShell } from '@/components/layout/AppShell'
import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  type SupportedLanguage,
} from '@/i18n/config'
import { guides } from '@/guides/registry'
import { GuidesIndexPage } from '@/pages/GuidesIndexPage'

function LazyGuideRouteLoadingFallback() {
  const { t } = useTranslation()
  return (
    <div
      className="text-muted-foreground flex min-h-[40vh] items-center justify-center text-sm"
      role="status"
      aria-live="polite"
    >
      {t('app.loading')}
    </div>
  )
}

function SupportedLanguageRouteLayout() {
  const { lang } = useParams()
  if (!isSupportedLanguage(lang)) {
    return <Navigate to={`/${DEFAULT_LANGUAGE}`} replace />
  }
  return <Outlet />
}

function UnknownGuideSlugRedirect() {
  const { lang } = useParams()
  const language: SupportedLanguage = isSupportedLanguage(lang)
    ? lang
    : DEFAULT_LANGUAGE
  return <Navigate to={`/${language}`} replace />
}

function guideRoutes() {
  return guides.map((guide) => {
    const GuidePage = guide.component
    return (
      <Route
        key={guide.slug}
        path={guide.slug}
        element={
          <Suspense fallback={<LazyGuideRouteLoadingFallback />}>
            <GuidePage />
          </Suspense>
        }
      />
    )
  })
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route
          index
          element={<Navigate to={`/${DEFAULT_LANGUAGE}`} replace />}
        />
        <Route path=":lang" element={<SupportedLanguageRouteLayout />}>
          <Route index element={<GuidesIndexPage />} />
          {guideRoutes()}
          <Route path="*" element={<UnknownGuideSlugRedirect />} />
        </Route>
        <Route
          path="*"
          element={<Navigate to={`/${DEFAULT_LANGUAGE}`} replace />}
        />
      </Route>
    </Routes>
  )
}
