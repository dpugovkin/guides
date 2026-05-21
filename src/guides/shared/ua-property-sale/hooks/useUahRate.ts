import { useCallback, useEffect, useState } from 'react'

import {
  FALLBACK_UAH_PER_USD,
  fetchNbuUahPerUsd,
  type UahRateInfo,
} from '@/guides/shared/ua-property-sale/lib/exchange-rate'

export function useUahRate() {
  const [info, setInfo] = useState<UahRateInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const data = await fetchNbuUahPerUsd()
      setInfo(data)
    } catch {
      setError(true)
      setInfo(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const rate = info?.rate ?? FALLBACK_UAH_PER_USD

  return {
    rate,
    info,
    loading,
    error,
    isFallback: !info,
    refresh: load,
  }
}
