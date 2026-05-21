import { BookOpen } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'
import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { SiteLegalDisclaimer } from '@/components/layout/SiteLegalDisclaimer'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import type { SupportedLanguage } from '@/i18n/config'
import { I18nLanguageUrlSync } from '@/i18n/I18nLanguageUrlSync'
import { localizedPath } from '@/i18n/langPath'

export function AppShell() {
  const { t, i18n } = useTranslation()
  const language = i18n.language as SupportedLanguage
  const homePath = localizedPath('/', language)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <I18nLanguageUrlSync />
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            to={homePath}
            className="flex items-center gap-2 font-semibold tracking-tight hover:text-primary"
          >
            <BookOpen className="size-5 text-primary" />
            {t('site.title')}
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>
      <footer className="border-t py-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SiteLegalDisclaimer variant="site" />
        </div>
      </footer>
    </div>
  )
}
