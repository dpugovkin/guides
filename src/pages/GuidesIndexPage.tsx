import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { usePageMeta } from '@/hooks/usePageMeta'
import { guides } from '@/guides/registry'
import type { SupportedLanguage } from '@/i18n/config'
import { localizedPath } from '@/i18n/langPath'

export function GuidesIndexPage() {
  const { t, i18n } = useTranslation()
  const language = i18n.language as SupportedLanguage
  const canonicalPath = localizedPath('/', language)

  usePageMeta({
    title: t('index.metaTitle'),
    description: t('site.metaDescription'),
    canonicalPath,
    pathWithoutLanguage: '/',
  })

  const available = guides.filter((g) => g.available)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {t('index.title')}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl text-base">
          {t('index.subtitle')}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {available.map((guide) => (
          <Link
            key={guide.slug}
            to={localizedPath(`/${guide.slug}`, language)}
            className="group block"
          >
            <Card className="h-full transition-colors hover:border-primary/40 hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2 text-lg">
                  {t(guide.titleKey)}
                  <ArrowRight className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {t(guide.descriptionKey)}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {available.length === 1 && (
        <p className="text-muted-foreground text-center text-sm">
          {t('index.emptyHint')}
        </p>
      )}
    </div>
  )
}
