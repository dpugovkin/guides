export const DEFAULT_WEEKLY_LIMIT_UAH = 12_500
export const DEFAULT_ATM_CARDS = 1
export const MIN_ATM_CARDS = 1
export const MAX_ATM_CARDS = 5

export type AtmCalculatorResult = {
  netUsd: number
  weeklyLimitPerCardUah: number
  cards: number
  perWeekTotalUah: number
  perWeekTotalUsd: number
  weeks: number
  withdrawalAmountsUsd: number[]
}

export function calcAtmMethod(
  netUsd: number,
  weeklyLimitPerCardUah: number,
  cards: number,
  uahPerUsd: number,
): AtmCalculatorResult {
  const net = Math.max(0, netUsd)
  const weeklyLimitPerCard = Math.max(
    100,
    weeklyLimitPerCardUah || DEFAULT_WEEKLY_LIMIT_UAH,
  )
  const safeCards = Math.max(
    MIN_ATM_CARDS,
    Math.min(MAX_ATM_CARDS, cards || DEFAULT_ATM_CARDS),
  )
  const perWeekTotalUah = weeklyLimitPerCard * safeCards
  const safeRate = Math.max(1, uahPerUsd)
  const perWeekTotalUsd = perWeekTotalUah / safeRate
  const weeks =
    net > 0 && perWeekTotalUsd > 0 ? Math.ceil(net / perWeekTotalUsd) : 0

  const withdrawalAmountsUsd: number[] = []
  let rem = net
  for (let i = 0; i < weeks; i++) {
    const amt = Math.min(rem, perWeekTotalUsd)
    withdrawalAmountsUsd.push(amt)
    rem -= amt
  }

  return {
    netUsd: net,
    weeklyLimitPerCardUah: weeklyLimitPerCard,
    cards: safeCards,
    perWeekTotalUah,
    perWeekTotalUsd,
    weeks,
    withdrawalAmountsUsd,
  }
}
