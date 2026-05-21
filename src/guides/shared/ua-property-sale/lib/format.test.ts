import { describe, expect, it } from 'vitest'

import i18n from 'i18next'

import { fmt, plural } from './format'

describe('format', () => {
  it('fmt uses grouped thousands', () => {
    expect(fmt(50_000)).toMatch(/50/)
    expect(fmt(50_000)).toMatch(/000/)
  })

  it('plural returns Ukrainian trip forms', async () => {
    await i18n.changeLanguage('uk')
    expect(plural(1, 'guides.poland.verdict.trips')).toContain('поїзд')
    expect(plural(3, 'guides.poland.verdict.trips')).toContain('поїзд')
  })

  it('plural returns English trip forms', async () => {
    const enPoland = await import('@/i18n/locales/en/poland.json')
    i18n.addResourceBundle('en', 'poland', enPoland.default, true, true)
    await i18n.changeLanguage('en')
    expect(plural(1, 'guides.poland.verdict.trips')).toBe('trip')
    expect(plural(3, 'guides.poland.verdict.trips')).toBe('trips')
  })
})
