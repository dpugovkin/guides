import { describe, expect, it } from 'vitest'

import { FALLBACK_UAH_PER_USD } from './exchange-rate'
import {
  calcPriceFromNet,
  calcSaleTaxBreakdown,
  DEFAULT_DOCS_UAH,
  DEFAULT_NOTARY_UAH,
} from './ua-sale-taxes'

const RATE = FALLBACK_UAH_PER_USD
const FIXED = (DEFAULT_NOTARY_UAH + DEFAULT_DOCS_UAH) / RATE

describe('ua-sale-taxes', () => {
  it('1st sale >3y: 0% PIT and military', () => {
    const b = calcSaleTaxBreakdown(50_000, true, 'first', RATE)
    expect(b.lines.find((l) => l.id === 'pit')?.amountUsd).toBe(0)
    expect(b.lines.find((l) => l.id === 'military')?.amountUsd).toBe(0)
    expect(b.sellerTotalUsd).toBeCloseTo(500 + FIXED, 0)
  })

  it('1st sale <3y: 5% PIT + 5% military', () => {
    const b = calcSaleTaxBreakdown(50_000, false, 'first', RATE)
    expect(b.lines.find((l) => l.id === 'pit')?.amountUsd).toBe(2500)
    expect(b.lines.find((l) => l.id === 'military')?.amountUsd).toBe(2500)
  })

  it('2nd sale with >3y ownership: still 5% + 5%, not exempt', () => {
    const b = calcSaleTaxBreakdown(50_000, true, 'second', RATE)
    expect(b.lines.find((l) => l.id === 'pit')?.amountUsd).toBe(2500)
    expect(b.lines.find((l) => l.id === 'military')?.amountUsd).toBe(2500)
    expect(b.netUsd).toBeLessThan(
      calcSaleTaxBreakdown(50_000, true, 'first', RATE).netUsd,
    )
  })

  it('3rd+ sale: 18% on profit + 5% military on full price', () => {
    const b = calcSaleTaxBreakdown(50_000, true, 'thirdPlus', RATE, 30_000)
    expect(b.taxableProfitUsd).toBe(20_000)
    expect(b.lines.find((l) => l.id === 'pit')?.amountUsd).toBe(3600)
    expect(b.lines.find((l) => l.id === 'military')?.amountUsd).toBe(2500)
  })

  it('3rd+ without purchase price: 18% on full sale price', () => {
    const b = calcSaleTaxBreakdown(50_000, true, 'thirdPlus', RATE, 0)
    expect(b.lines.find((l) => l.id === 'pit')?.amountUsd).toBe(9000)
  })

  it('reverse-calculates price from net for each order', () => {
    for (const order of ['first', 'second', 'thirdPlus'] as const) {
      const purchase = order === 'thirdPlus' ? 20_000 : 0
      const b = calcSaleTaxBreakdown(50_000, true, order, RATE, purchase)
      expect(calcPriceFromNet(b.netUsd, true, order, RATE, purchase)).toBe(
        50_000,
      )
    }
  })
})
