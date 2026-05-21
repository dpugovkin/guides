import { describe, expect, it } from 'vitest'

import { absoluteGuideUrl } from '@/lib/site-meta'

describe('site-meta', () => {
  it('builds absolute URLs for each language', () => {
    expect(absoluteGuideUrl('/', 'uk')).toBe(
      'https://dpugovkin.github.io/guides/uk',
    )
    expect(absoluteGuideUrl('/ukraine-property-sale-poland', 'pl')).toBe(
      'https://dpugovkin.github.io/guides/pl/ukraine-property-sale-poland',
    )
  })
})
