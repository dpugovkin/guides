import { describe, expect, it } from 'vitest'

import {
  calculateBorderCashTransferPlan,
  calcPriceFromNet,
  calcSaleFromPrice,
  DEFAULT_MAX_PER_TRIP,
  DEFAULT_NET_USD,
} from './calculator'
import { FALLBACK_UAH_PER_USD } from './exchange-rate'
import { calcSaleTaxBreakdown } from './ua-sale-taxes'

const RATE = FALLBACK_UAH_PER_USD

describe('calculator', () => {
  it('calculates default scenario: 50k sale, 1st >3y', () => {
    const b = calcSaleTaxBreakdown(50_000, true, 'first', RATE)
    const r = calcSaleFromPrice(50_000, true, 'first', RATE)
    expect(r.net).toBeCloseTo(b.netUsd, 0)
  })

  it('2nd sale reduces net vs 1st exempt sale', () => {
    const first = calcSaleFromPrice(50_000, true, 'first', RATE)
    const second = calcSaleFromPrice(50_000, true, 'second', RATE)
    expect(second.net).toBeLessThan(first.net)
  })

  it('border logistics uses transfer net independently of sale price', () => {
    const b = calculateBorderCashTransferPlan(
      DEFAULT_NET_USD,
      2,
      DEFAULT_MAX_PER_TRIP,
      RATE,
    )
    expect(b.net).toBe(50_000)
    expect(b.trips).toBe(3)
    expect(b.tripAmounts).toEqual([20_000, 20_000, 10_000])
  })

  it('reverse-calculates price from net', () => {
    const b = calcSaleTaxBreakdown(50_000, true, 'first', RATE)
    expect(calcPriceFromNet(b.netUsd, true, 'first', RATE)).toBe(50_000)
  })
})
