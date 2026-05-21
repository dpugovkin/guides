import { useCallback, useMemo, useState } from 'react'

import {
  calcPriceFromNet,
  calcSaleFromPrice,
  DEFAULT_PRICE,
  type SaleTaxResult,
} from '@/guides/shared/ua-property-sale/lib/calculator'
import { useUahRate } from '@/guides/shared/ua-property-sale/hooks/useUahRate'
import type { UahRateInfo } from '@/guides/shared/ua-property-sale/lib/exchange-rate'
import type { SaleOrderInYear } from '@/guides/shared/ua-property-sale/lib/ua-sale-taxes'

export type UahExchangeRateState = {
  rate: number
  info: UahRateInfo | null
  loading: boolean
  error: boolean
  isFallback: boolean
  refresh: () => void
}

/** @deprecated Use `UahExchangeRateState` */
export type UahRateState = UahExchangeRateState

function useUkrainePropertySaleTaxInputs(uahPerUsd: number) {
  const [salePriceUsd, setSalePriceUsdState] = useState(DEFAULT_PRICE)
  const [ownedMoreThanThreeYears, setOwnedMoreThanThreeYearsState] =
    useState(true)
  const [saleOrderInYear, setSaleOrderInYearState] =
    useState<SaleOrderInYear>('first')
  const [purchasePriceUsd, setPurchasePriceUsdState] = useState(0)

  const saleTaxResult: SaleTaxResult = useMemo(
    () =>
      calcSaleFromPrice(
        salePriceUsd,
        ownedMoreThanThreeYears,
        saleOrderInYear,
        uahPerUsd,
        saleOrderInYear === 'thirdPlus' ? purchasePriceUsd : 0,
      ),
    [
      salePriceUsd,
      ownedMoreThanThreeYears,
      saleOrderInYear,
      uahPerUsd,
      purchasePriceUsd,
    ],
  )

  const setSalePriceUsd = useCallback((value: number) => {
    setSalePriceUsdState(Math.max(1000, value || DEFAULT_PRICE))
  }, [])

  const setNetProceedsUsd = useCallback(
    (value: number) => {
      if (value > 0) {
        setSalePriceUsdState(
          calcPriceFromNet(
            value,
            ownedMoreThanThreeYears,
            saleOrderInYear,
            uahPerUsd,
            saleOrderInYear === 'thirdPlus' ? purchasePriceUsd : 0,
          ),
        )
      }
    },
    [ownedMoreThanThreeYears, saleOrderInYear, uahPerUsd, purchasePriceUsd],
  )

  const setOwnedMoreThanThreeYears = useCallback((value: boolean) => {
    setOwnedMoreThanThreeYearsState(value)
  }, [])

  const setSaleOrderInYear = useCallback((value: SaleOrderInYear) => {
    setSaleOrderInYearState(value)
    if (value !== 'thirdPlus') setPurchasePriceUsdState(0)
  }, [])

  const setPurchasePriceUsd = useCallback((value: number) => {
    setPurchasePriceUsdState(Math.max(0, value || 0))
  }, [])

  return {
    salePriceUsd,
    netProceedsUsd: Math.round(saleTaxResult.net),
    ownedMoreThanThreeYears,
    saleOrderInYear,
    purchasePriceUsd,
    saleTaxResult,
    setSalePriceUsd,
    setNetProceedsUsd,
    setOwnedMoreThanThreeYears,
    setSaleOrderInYear,
    setPurchasePriceUsd,
    // Aliases for existing components (shorter prop names at call sites)
    price: salePriceUsd,
    net: Math.round(saleTaxResult.net),
    moreThan3: ownedMoreThanThreeYears,
    saleOrder: saleOrderInYear,
    purchasePrice: purchasePriceUsd,
    result: saleTaxResult,
    setPrice: setSalePriceUsd,
    setNet: setNetProceedsUsd,
    setMoreThan3: setOwnedMoreThanThreeYears,
    setSaleOrder: setSaleOrderInYear,
    setPurchasePrice: setPurchasePriceUsd,
  }
}

/** NBU USD/UAH rate + Ukraine property sale tax calculator state. */
export function usePropertySaleCalculator(
  exchangeRateState?: UahExchangeRateState,
) {
  const internalExchangeRate = useUahRate()
  const exchangeRate = exchangeRateState ?? {
    rate: internalExchangeRate.rate,
    info: internalExchangeRate.info,
    loading: internalExchangeRate.loading,
    error: internalExchangeRate.error,
    isFallback: internalExchangeRate.isFallback,
    refresh: internalExchangeRate.refresh,
  }
  const taxInputs = useUkrainePropertySaleTaxInputs(exchangeRate.rate)

  return {
    ...taxInputs,
    rate: exchangeRate.rate,
    info: exchangeRate.info,
    loading: exchangeRate.loading,
    error: exchangeRate.error,
    isFallback: exchangeRate.isFallback,
    refreshRate: exchangeRate.refresh,
  }
}
