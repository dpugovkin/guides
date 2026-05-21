import {
  calcSaleTaxBreakdown,
  calcPriceFromNet as calcPriceFromNetTaxes,
  type SaleOrderInYear,
  type SaleTaxBreakdown,
  type TaxLine,
} from '@/guides/shared/ua-property-sale/lib/ua-sale-taxes'

export type { SaleOrderInYear, SaleTaxBreakdown, TaxLine }

export const DEFAULT_MAX_PER_TRIP = 20_000
export const DEFAULT_PRICE = 50_000
/** Target net proceeds to legalize in PL (USD) */
export const DEFAULT_NET_USD = 50_000
export const BANK_DAY = 100_000

export type SaleTaxResult = {
  price: number
  taxBreakdown: SaleTaxBreakdown
  taxAmt: number
  taxRate: number
  net: number
}

/** Border cash transfer plan (method 1) — based on net proceeds after UA taxes. */
export type BorderCashTransferPlan = {
  net: number
  days: number
  trips: number
  perTrip: number
  weeksMin: number
  weeksMax: number
  perDayUah: number
  tripAmounts: number[]
}

export function calcSaleFromPrice(
  price: number,
  moreThan3: boolean,
  saleOrder: SaleOrderInYear,
  uahPerUsd: number,
  purchasePriceUsd = 0,
): SaleTaxResult {
  const safePrice = Math.max(1000, price || DEFAULT_PRICE)
  const taxBreakdown = calcSaleTaxBreakdown(
    safePrice,
    moreThan3,
    saleOrder,
    uahPerUsd,
    purchasePriceUsd,
  )
  const net = taxBreakdown.netUsd
  const taxAmt = taxBreakdown.sellerTotalUsd
  const taxRate = safePrice > 0 ? taxAmt / safePrice : 0

  return {
    price: safePrice,
    taxBreakdown,
    taxRate,
    taxAmt,
    net,
  }
}

export function calculateBorderCashTransferPlan(
  netProceedsUsd: number,
  bankAccountCount: number,
  maxUsdPerBorderTrip: number,
  uahPerUsd: number,
): BorderCashTransferPlan {
  const net = Math.max(0, netProceedsUsd)
  const safeMaxPerTrip = Math.max(
    1000,
    maxUsdPerBorderTrip || DEFAULT_MAX_PER_TRIP,
  )
  const safeBanks = Math.max(1, bankAccountCount)
  const uah = net * Math.max(1, uahPerUsd)
  const perDayUah = safeBanks * BANK_DAY
  const days = perDayUah > 0 ? Math.ceil(uah / perDayUah) : 0
  const trips = safeMaxPerTrip > 0 ? Math.ceil(net / safeMaxPerTrip) : 0
  const weeksMin = Math.ceil(days / 5) + trips + 1
  const weeksMax = weeksMin + trips

  const tripAmounts: number[] = []
  let rem = net
  for (let i = 0; i < trips; i++) {
    const amt = Math.min(rem, safeMaxPerTrip)
    tripAmounts.push(Math.round(amt))
    rem -= amt
  }

  return {
    net,
    days,
    trips,
    perTrip: safeMaxPerTrip,
    weeksMin,
    weeksMax,
    perDayUah,
    tripAmounts,
  }
}

export { calcPriceFromNetTaxes as calcPriceFromNet }
