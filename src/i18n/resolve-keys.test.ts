import { describe, expect, it } from 'vitest'

import { initI18n } from '@/i18n'

describe('i18n runtime', () => {
  it('resolves guide card keys from tax and poland namespaces (uk)', async () => {
    await initI18n('/uk')
    const { default: i18n } = await import('@/i18n')
    expect(i18n.t('guides.calculator.title')).not.toBe(
      'guides.calculator.title',
    )
    expect(i18n.t('guides.poland.title')).not.toBe('guides.poland.title')
    expect(i18n.t('index.title')).not.toBe('index.title')
  })

  it('resolves guide card keys after loading pl', async () => {
    await initI18n('/uk')
    const { default: i18n, ensureLanguageLoaded } = await import('@/i18n')
    await ensureLanguageLoaded(i18n, 'pl')
    await i18n.changeLanguage('pl')
    expect(i18n.t('guides.calculator.title')).not.toBe(
      'guides.calculator.title',
    )
    expect(i18n.t('guides.poland.title')).not.toBe('guides.poland.title')
    expect(i18n.t('index.title')).toBe('Poradniki Dimasika')
  })
})
