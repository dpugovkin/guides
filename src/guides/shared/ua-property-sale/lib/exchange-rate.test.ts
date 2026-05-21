import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  FALLBACK_UAH_PER_USD,
  fetchNbuUahPerUsd,
  formatNbuDate,
} from './exchange-rate'

describe('exchange-rate', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('formatNbuDate formats YYYYMMDD', () => {
    expect(formatNbuDate('20240515')).toBe('15.05.2024')
  })

  it('formatNbuDate returns input when not 8 chars', () => {
    expect(formatNbuDate('')).toBe('')
    expect(formatNbuDate('bad')).toBe('bad')
  })

  it('fetchNbuUahPerUsd parses USD row', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ cc: 'USD', rate: 41.5, exchangedate: '20240515' }],
      }),
    )

    const info = await fetchNbuUahPerUsd()
    expect(info.rate).toBe(41.5)
    expect(info.date).toBe('20240515')
    expect(info.source).toBe('nbu')
  })

  it('fetchNbuUahPerUsd throws on HTTP error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 503 }),
    )

    await expect(fetchNbuUahPerUsd()).rejects.toThrow('NBU HTTP 503')
  })

  it('fetchNbuUahPerUsd throws when USD missing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ cc: 'EUR', rate: 44 }],
      }),
    )

    await expect(fetchNbuUahPerUsd()).rejects.toThrow('USD rate missing')
  })

  it('exposes stable fallback constant', () => {
    expect(FALLBACK_UAH_PER_USD).toBeGreaterThan(0)
  })
})
