import { RefreshCw } from 'lucide-react'
import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import { Button } from '@/components/ui/button'
import {
  FALLBACK_UAH_PER_USD,
  formatNbuDate,
} from '@/guides/shared/ua-property-sale/lib/exchange-rate'

type ExchangeRateBadgeProps = {
  rate: number
  loading: boolean
  error: boolean
  isFallback: boolean
  date?: string
  onRefresh: () => void
}

export function ExchangeRateBadge({
  rate,
  loading,
  error,
  isFallback,
  date,
  onRefresh,
}: ExchangeRateBadgeProps) {
  const { t } = useTranslation()
  const ns = 'guides.tax.exchangeRate'

  if (loading) {
    return <p className="text-foreground text-sm">{t(`${ns}.loading`)}</p>
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-foreground text-sm">
        {error || isFallback
          ? t(`${ns}.fallback`, { rate: FALLBACK_UAH_PER_USD })
          : t(`${ns}.nbu`, {
              rate: rate.toFixed(2),
              date: date ? formatNbuDate(date) : '—',
            })}
      </p>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs"
        onClick={onRefresh}
        disabled={loading}
        aria-label={t(`${ns}.refreshAria`)}
      >
        <RefreshCw className="mr-1 size-3" />
        {t(`${ns}.refresh`)}
      </Button>
    </div>
  )
}
