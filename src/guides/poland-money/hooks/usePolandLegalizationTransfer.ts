import { useCallback, useMemo, useState } from 'react'

import {
  calculateBorderCashTransferPlan,
  DEFAULT_MAX_PER_TRIP,
  DEFAULT_NET_USD,
} from '@/guides/shared/ua-property-sale/lib/calculator'

const DEFAULT_BANK_ACCOUNT_COUNT = 2
const MIN_BANK_ACCOUNT_COUNT = 1
const MAX_BANK_ACCOUNT_COUNT = 5

/** Net proceeds for PL legalization methods — separate from the UA tax calculator. */
export function usePolandLegalizationTransfer(uahPerUsd: number) {
  const [netProceedsAfterUkraineTaxesUsd, setNetProceedsAfterUkraineTaxesUsd] =
    useState(DEFAULT_NET_USD)
  const [bankAccountCount, setBankAccountCount] = useState(
    DEFAULT_BANK_ACCOUNT_COUNT,
  )
  const [maxUsdPerBorderTrip, setMaxUsdPerBorderTrip] =
    useState(DEFAULT_MAX_PER_TRIP)

  const borderCashTransferPlan = useMemo(
    () =>
      calculateBorderCashTransferPlan(
        netProceedsAfterUkraineTaxesUsd,
        bankAccountCount,
        maxUsdPerBorderTrip,
        uahPerUsd,
      ),
    [
      netProceedsAfterUkraineTaxesUsd,
      bankAccountCount,
      maxUsdPerBorderTrip,
      uahPerUsd,
    ],
  )

  const setNetProceedsAfterUkraineTaxesUsdSafe = useCallback(
    (value: number) => {
      setNetProceedsAfterUkraineTaxesUsd(
        Math.max(1000, value || DEFAULT_NET_USD),
      )
    },
    [],
  )

  const changeBankAccountCount = useCallback((delta: number) => {
    setBankAccountCount((count) =>
      Math.max(
        MIN_BANK_ACCOUNT_COUNT,
        Math.min(MAX_BANK_ACCOUNT_COUNT, count + delta),
      ),
    )
  }, [])

  const setMaxUsdPerBorderTripSafe = useCallback((value: number) => {
    setMaxUsdPerBorderTrip(Math.max(1000, value || DEFAULT_MAX_PER_TRIP))
  }, [])

  return {
    netProceedsAfterUkraineTaxesUsd,
    bankAccountCount,
    maxUsdPerBorderTrip,
    borderCashTransferPlan,
    setNetProceedsAfterUkraineTaxesUsd: setNetProceedsAfterUkraineTaxesUsdSafe,
    changeBankAccountCount,
    setMaxUsdPerBorderTrip: setMaxUsdPerBorderTripSafe,
  }
}
