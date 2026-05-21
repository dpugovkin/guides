import i18n from '@/i18n'

function numberLocale(): string {
  if (i18n.language === 'en') return 'en-US'
  if (i18n.language === 'pl') return 'pl-PL'
  return 'uk-UA'
}

export function fmt(n: number): string {
  return new Intl.NumberFormat(numberLocale()).format(Math.round(n))
}

/** i18next plural form: pass base key (e.g. `guides.poland.verdict.banks`) and count. */
export function plural(n: number, key: string): string {
  return String(i18n.t(key, { count: n } as never))
}
