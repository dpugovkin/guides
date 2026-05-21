import { describe, expect, it } from 'vitest'

import {
  calcAtmMethod,
  DEFAULT_ATM_CARDS,
  DEFAULT_WEEKLY_LIMIT_UAH,
} from './atm-calculator'
import { FALLBACK_UAH_PER_USD } from '@/guides/shared/ua-property-sale/lib/exchange-rate'

const RATE = FALLBACK_UAH_PER_USD

describe('atm-calculator', () => {
  it('converts UAH weekly limit to USD for timeline', () => {
    const r = calcAtmMethod(
      49_000,
      DEFAULT_WEEKLY_LIMIT_UAH,
      DEFAULT_ATM_CARDS,
      RATE,
    )
    const perWeekUsd = DEFAULT_WEEKLY_LIMIT_UAH / RATE
    expect(r.perWeekTotalUah).toBe(12_500)
    expect(r.perWeekTotalUsd).toBeCloseTo(perWeekUsd, 0)
    expect(r.weeks).toBe(Math.ceil(49_000 / perWeekUsd))
  })

  it('scales with number of cards', () => {
    const one = calcAtmMethod(49_000, DEFAULT_WEEKLY_LIMIT_UAH, 1, RATE)
    const two = calcAtmMethod(49_000, DEFAULT_WEEKLY_LIMIT_UAH, 2, RATE)
    expect(two.weeks).toBeLessThan(one.weeks)
    expect(two.perWeekTotalUah).toBe(25_000)
  })

  it('handles zero net', () => {
    const r = calcAtmMethod(0, 12_500, 1, RATE)
    expect(r.weeks).toBe(0)
  })
})
