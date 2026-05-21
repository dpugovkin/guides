import { describe, expect, it } from 'vitest'

import { getLangFromPath, localizedPath, stripLangPrefix } from './langPath'

describe('langPath', () => {
  it('parses language from path', () => {
    expect(getLangFromPath('/uk')).toBe('uk')
    expect(getLangFromPath('/en/ukraine-property-sale-poland')).toBe('en')
    expect(getLangFromPath('/pl/ukraine-property-sale-poland')).toBe('pl')
    expect(getLangFromPath('/ukraine-property-sale-poland')).toBeNull()
  })

  it('localizedPath always includes lang', () => {
    expect(localizedPath('/', 'uk')).toBe('/uk')
    expect(localizedPath('/', 'en')).toBe('/en')
    expect(localizedPath('/', 'pl')).toBe('/pl')
    expect(localizedPath('/ukraine-property-sale-taxes', 'uk')).toBe(
      '/uk/ukraine-property-sale-taxes',
    )
  })

  it('stripLangPrefix removes lang segment', () => {
    expect(stripLangPrefix('/uk')).toBe('/')
    expect(stripLangPrefix('/en/foo')).toBe('/foo')
    expect(stripLangPrefix('/pl/foo')).toBe('/foo')
  })
})
