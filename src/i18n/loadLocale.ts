import type { i18n as I18nInstance } from 'i18next'

import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  LANGUAGE_STORAGE_KEY,
  type SupportedLanguage,
} from '@/i18n/config'
import { getLangFromPath } from '@/i18n/langPath'

const loadedLanguages = new Set<SupportedLanguage>()

const lazyLoaders = {
  en: {
    common: () => import('@/i18n/locales/en/common.json'),
    tax: () => import('@/i18n/locales/en/tax.json'),
    poland: () => import('@/i18n/locales/en/poland.json'),
  },
  pl: {
    common: () => import('@/i18n/locales/pl/common.json'),
    tax: () => import('@/i18n/locales/pl/tax.json'),
    poland: () => import('@/i18n/locales/pl/poland.json'),
  },
} as const

type LazyLanguage = keyof typeof lazyLoaders
type Namespace = keyof (typeof lazyLoaders)[LazyLanguage]

const LAZY_NAMESPACES: Namespace[] = ['common', 'tax', 'poland']

export function markLanguageLoaded(lng: SupportedLanguage) {
  loadedLanguages.add(lng)
}

export async function ensureLanguageLoaded(
  i18n: I18nInstance,
  lng: SupportedLanguage,
): Promise<void> {
  if (loadedLanguages.has(lng)) return

  if (lng === 'uk') {
    markLanguageLoaded('uk')
    return
  }

  const loaders = lazyLoaders[lng as LazyLanguage]
  const bundles = await Promise.all(
    LAZY_NAMESPACES.map(async (ns) => {
      const mod = await loaders[ns]()
      return [ns, mod.default] as const
    }),
  )

  for (const [ns, data] of bundles) {
    i18n.addResourceBundle(lng, ns, data, true, true)
  }

  markLanguageLoaded(lng)
}

export function readStoredLanguage(): SupportedLanguage {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return isSupportedLanguage(stored) ? stored : DEFAULT_LANGUAGE
}

/** URL language prefix wins over localStorage; bare paths fall back to stored/default. */
export function readInitialLanguage(pathname: string): SupportedLanguage {
  return getLangFromPath(pathname) ?? readStoredLanguage()
}

export async function changeAppLanguage(
  i18n: I18nInstance,
  lng: SupportedLanguage,
): Promise<void> {
  await ensureLanguageLoaded(i18n, lng)
  await i18n.changeLanguage(lng)
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lng)
  document.documentElement.lang = lng
}
