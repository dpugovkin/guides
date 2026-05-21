/** Fixed UAH costs (typical Kyiv/regional order of magnitude) */
export const DEFAULT_NOTARY_UAH = 8_000
export const DEFAULT_DOCS_UAH = 1_200

/** Ukraine TC art. 172 — sale order of residential property in a calendar year */
export type SaleOrderInYear = 'first' | 'second' | 'thirdPlus'

export type TaxLineId =
  | 'pit'
  | 'military'
  | 'stateDuty'
  | 'notary'
  | 'docs'
  | 'pension'

export type TaxLine = {
  id: TaxLineId
  ratePercent: number | null
  amountUsd: number
  paidBy: 'seller' | 'buyer'
  includedInNet: boolean
}

export type SaleTaxBreakdown = {
  priceUsd: number
  purchasePriceUsd: number
  taxableProfitUsd: number
  lines: TaxLine[]
  sellerTotalUsd: number
  buyerTotalUsd: number
  netUsd: number
}

/** Military levy: 5% on 2nd/3rd+ sales; 0% only when PIT is exempt (1st sale, >3 years) */
export function getIncomeTaxRates(
  moreThan3: boolean,
  saleOrder: SaleOrderInYear,
): {
  pitRateOnPrice: number
  pitRateOnProfit: number | null
  militaryRate: number
} {
  if (saleOrder === 'thirdPlus') {
    return { pitRateOnPrice: 0, pitRateOnProfit: 0.18, militaryRate: 0.05 }
  }
  if (saleOrder === 'second') {
    return { pitRateOnPrice: 0.05, pitRateOnProfit: null, militaryRate: 0.05 }
  }
  if (moreThan3) {
    return { pitRateOnPrice: 0, pitRateOnProfit: null, militaryRate: 0 }
  }
  return { pitRateOnPrice: 0.05, pitRateOnProfit: null, militaryRate: 0.05 }
}

export function calcSaleTaxBreakdown(
  priceUsd: number,
  moreThan3: boolean,
  saleOrder: SaleOrderInYear,
  uahPerUsd: number,
  purchasePriceUsd = 0,
): SaleTaxBreakdown {
  const price = Math.max(1000, priceUsd || 0)
  const purchase = Math.max(0, Math.min(purchasePriceUsd || 0, price - 1))
  const rate = Math.max(1, uahPerUsd)
  const { pitRateOnPrice, pitRateOnProfit, militaryRate } = getIncomeTaxRates(
    moreThan3,
    saleOrder,
  )

  const taxableProfit =
    pitRateOnProfit != null ? Math.max(0, price - purchase) : 0
  const pitUsd =
    pitRateOnProfit != null
      ? taxableProfit * pitRateOnProfit
      : price * pitRateOnPrice
  const militaryUsd = price * militaryRate
  const stateDutyUsd = price * 0.01
  const pensionUsd = price * 0.01
  const notaryUsd = DEFAULT_NOTARY_UAH / rate
  const docsUsd = DEFAULT_DOCS_UAH / rate

  const lines: TaxLine[] = [
    {
      id: 'pit',
      ratePercent: pitRateOnProfit != null ? 18 : pitRateOnPrice * 100,
      amountUsd: pitUsd,
      paidBy: 'seller',
      includedInNet: true,
    },
    {
      id: 'military',
      ratePercent: militaryRate * 100,
      amountUsd: militaryUsd,
      paidBy: 'seller',
      includedInNet: true,
    },
    {
      id: 'stateDuty',
      ratePercent: 1,
      amountUsd: stateDutyUsd,
      paidBy: 'seller',
      includedInNet: true,
    },
    {
      id: 'notary',
      ratePercent: null,
      amountUsd: notaryUsd,
      paidBy: 'seller',
      includedInNet: true,
    },
    {
      id: 'docs',
      ratePercent: null,
      amountUsd: docsUsd,
      paidBy: 'seller',
      includedInNet: true,
    },
    {
      id: 'pension',
      ratePercent: 1,
      amountUsd: pensionUsd,
      paidBy: 'buyer',
      includedInNet: false,
    },
  ]

  const sellerTotalUsd = lines
    .filter((l) => l.includedInNet)
    .reduce((s, l) => s + l.amountUsd, 0)
  const buyerTotalUsd = lines
    .filter((l) => !l.includedInNet)
    .reduce((s, l) => s + l.amountUsd, 0)

  return {
    priceUsd: price,
    purchasePriceUsd: purchase,
    taxableProfitUsd: taxableProfit,
    lines,
    sellerTotalUsd,
    buyerTotalUsd,
    netUsd: price - sellerTotalUsd,
  }
}

export function calcPriceFromNet(
  netUsd: number,
  moreThan3: boolean,
  saleOrder: SaleOrderInYear,
  uahPerUsd: number,
  purchasePriceUsd = 0,
): number {
  const net = Math.max(0, netUsd)
  const purchase = Math.max(0, purchasePriceUsd || 0)
  const fixedUsd =
    (DEFAULT_NOTARY_UAH + DEFAULT_DOCS_UAH) / Math.max(1, uahPerUsd)

  if (saleOrder === 'thirdPlus') {
    const coef = 1 - 0.05 - 0.01 - 0.18
    if (coef <= 0) return net + fixedUsd + purchase * 0.18
    return Math.round((net + fixedUsd - purchase * 0.18) / coef)
  }

  const { pitRateOnPrice, militaryRate } = getIncomeTaxRates(
    moreThan3,
    saleOrder,
  )
  const percentTotal = pitRateOnPrice + militaryRate + 0.01
  if (percentTotal >= 1) return net + fixedUsd
  return Math.round((net + fixedUsd) / (1 - percentTotal))
}
