export const SUPPORTED_LANGUAGES = ['uk', 'en', 'pl'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: SupportedLanguage = 'uk'

export const LANGUAGE_STORAGE_KEY = 'guides.language'

export function isSupportedLanguage(
  value: string | null | undefined,
): value is SupportedLanguage {
  return (
    value != null && (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
  )
}
