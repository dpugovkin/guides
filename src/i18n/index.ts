import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  SUPPORTED_LANGUAGES,
} from '@/i18n/config'
import {
  changeAppLanguage,
  ensureLanguageLoaded,
  markLanguageLoaded,
  readInitialLanguage,
} from '@/i18n/loadLocale'
import ukCommon from '@/i18n/locales/uk/common.json'
import ukPoland from '@/i18n/locales/uk/poland.json'
import ukTax from '@/i18n/locales/uk/tax.json'

const NAMESPACES = ['common', 'tax', 'poland'] as const

const ukResources = {
  common: ukCommon,
  tax: ukTax,
  poland: ukPoland,
}

let initPromise: Promise<void> | null = null

export async function initI18n(pathname = '/'): Promise<void> {
  if (initPromise) return initPromise

  initPromise = (async () => {
    const initialLng = readInitialLanguage(pathname)

    await i18n.use(initReactI18next).init({
      resources: { uk: ukResources },
      lng: initialLng,
      supportedLngs: [...SUPPORTED_LANGUAGES],
      fallbackLng: DEFAULT_LANGUAGE,
      load: 'languageOnly',
      nonExplicitSupportedLngs: true,
      ns: [...NAMESPACES],
      defaultNS: 'common',
      fallbackNS: ['tax', 'poland'],
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    })

    markLanguageLoaded('uk')
    await ensureLanguageLoaded(i18n, initialLng)

    const lang = isSupportedLanguage(i18n.language)
      ? i18n.language
      : DEFAULT_LANGUAGE
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang
    }
  })()

  return initPromise
}

if (typeof document !== 'undefined') {
  i18n.on('languageChanged', (lng) => {
    const lang = isSupportedLanguage(lng) ? lng : DEFAULT_LANGUAGE
    document.documentElement.lang = lang
  })
}

export { changeAppLanguage, ensureLanguageLoaded, readInitialLanguage }
export default i18n
