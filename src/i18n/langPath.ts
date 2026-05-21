import { isSupportedLanguage, type SupportedLanguage } from '@/i18n/config'

/** Path is relative to React Router basename (`/guides`). */
export function getLangFromPath(pathname: string): SupportedLanguage | null {
  const segment = pathname.split('/').filter(Boolean)[0]
  return isSupportedLanguage(segment) ? segment : null
}

/** Path without language prefix, e.g. `/` or `/ukraine-property-sale-poland`. */
export function stripLangPrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && isSupportedLanguage(segments[0])) {
    const rest = segments.slice(1).join('/')
    return rest ? `/${rest}` : '/'
  }
  return pathname || '/'
}

/** Always includes language: `/uk`, `/en`, `/uk/slug`, `/en/slug`. */
export function localizedPath(path: string, lang: SupportedLanguage): string {
  const normalized = path.replace(/^\/+/, '').replace(/\/+$/, '')
  return normalized ? `/${lang}/${normalized}` : `/${lang}`
}
