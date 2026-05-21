import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import i18n, { changeAppLanguage } from '@/i18n'
import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from '@/i18n/config'
import { localizedPath, stripLangPrefix } from '@/i18n/langPath'

export function LanguageSwitcher() {
  const { i18n: i18nInstance, t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [pending, setPending] = useState(false)
  const current = isSupportedLanguage(i18nInstance.language)
    ? i18nInstance.language
    : DEFAULT_LANGUAGE

  const setLanguage = async (lng: SupportedLanguage) => {
    if (lng === current || pending) return
    setPending(true)
    try {
      const bare = stripLangPrefix(pathname)
      await changeAppLanguage(i18n, lng)
      navigate(localizedPath(bare, lng))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <ToggleGroup
        type="single"
        value={current}
        onValueChange={(v) => v && void setLanguage(v as SupportedLanguage)}
        variant="outline"
        size="sm"
        aria-label={t('language.label')}
        aria-busy={pending}
        disabled={pending}
      >
        {SUPPORTED_LANGUAGES.map((lng) => (
          <ToggleGroupItem key={lng} value={lng} className="px-2.5 text-xs">
            {t(`language.${lng}`)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {pending && (
        <span className="text-muted-foreground text-[10px]" role="status">
          {t('language.switching')}
        </span>
      )}
    </div>
  )
}
