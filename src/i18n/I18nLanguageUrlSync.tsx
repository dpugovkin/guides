import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { DEFAULT_LANGUAGE, isSupportedLanguage } from '@/i18n/config'
import i18n, { changeAppLanguage } from '@/i18n'
import { getLangFromPath } from '@/i18n/langPath'

/** Keeps i18n language in sync with `/uk`, `/en`, or `/pl` URL prefix. */
export function I18nLanguageUrlSync() {
  const { pathname } = useLocation()
  const { i18n: i18nInstance } = useTranslation()

  useEffect(() => {
    const languageFromUrl = getLangFromPath(pathname)
    if (!languageFromUrl) return
    const currentLanguage = isSupportedLanguage(i18nInstance.language)
      ? i18nInstance.language
      : DEFAULT_LANGUAGE
    if (languageFromUrl !== currentLanguage) {
      void changeAppLanguage(i18n, languageFromUrl)
    }
  }, [pathname, i18nInstance.language])

  return null
}
