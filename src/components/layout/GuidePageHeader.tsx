import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import { localizedPath } from '@/i18n/langPath'

type GuidePageHeaderProps = {
  title: string
  subtitle?: string
}

export function GuidePageHeader({ title, subtitle }: GuidePageHeaderProps) {
  const { t, i18n } = useTranslation()
  const home = localizedPath('/', i18n.language as 'uk' | 'en')

  return (
    <div className="mb-8 space-y-4">
      <Link
        to={home}
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        {t('layout.backToGuides')}
      </Link>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
