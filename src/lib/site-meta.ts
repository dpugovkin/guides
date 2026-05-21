import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from '@/i18n/config'
import { localizedPath } from '@/i18n/langPath'

export const SITE_ORIGIN = 'https://dpugovkin.github.io'
export const SITE_BASE = `${SITE_ORIGIN}/guides`
export const OG_IMAGE_URL = `${SITE_BASE}/og-cover.svg`

export function absoluteGuideUrl(
  pathWithoutLanguage: string,
  lang: SupportedLanguage,
): string {
  const path = localizedPath(pathWithoutLanguage, lang)
  return `${SITE_BASE}${path === '/' ? '' : path}`
}

const HREFLANG_SELECTOR = 'link[data-site-meta="hreflang"]'

export function syncHreflangAlternates(pathWithoutLanguage: string): void {
  document.querySelectorAll(HREFLANG_SELECTOR).forEach((el) => el.remove())

  for (const lang of SUPPORTED_LANGUAGES) {
    const link = document.createElement('link')
    link.rel = 'alternate'
    link.hreflang = lang
    link.href = absoluteGuideUrl(pathWithoutLanguage, lang)
    link.setAttribute('data-site-meta', 'hreflang')
    document.head.appendChild(link)
  }

  const defaultLink = document.createElement('link')
  defaultLink.rel = 'alternate'
  defaultLink.hreflang = 'x-default'
  defaultLink.href = absoluteGuideUrl(pathWithoutLanguage, DEFAULT_LANGUAGE)
  defaultLink.setAttribute('data-site-meta', 'hreflang')
  document.head.appendChild(defaultLink)
}
