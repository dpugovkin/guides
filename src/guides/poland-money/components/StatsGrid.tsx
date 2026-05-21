import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import { Card, CardContent } from '@/components/ui/card'
import { fmt } from '@/guides/shared/ua-property-sale/lib/format'

type BorderCashTransferStatsGridProps = {
  calendarDaysNeeded: number
  borderCrossingCount: number
  usdPerBorderTrip: number
  maxUsdPerBorderTrip: number
  timelineWeeksMin: number
  timelineWeeksMax: number
}

export function StatsGrid({
  calendarDaysNeeded,
  borderCrossingCount,
  usdPerBorderTrip,
  maxUsdPerBorderTrip,
  timelineWeeksMin,
  timelineWeeksMax,
}: BorderCashTransferStatsGridProps) {
  const { t } = useTranslation()
  const s = 'guides.poland.stats'

  const items = [
    {
      value: calendarDaysNeeded,
      label: t(`${s}.days`),
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      value: borderCrossingCount,
      label: t(`${s}.trips`),
      color: 'text-primary',
    },
    {
      value: fmt(usdPerBorderTrip),
      label: t(`${s}.perTrip`, { max: fmt(maxUsdPerBorderTrip) }),
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      value: `${timelineWeeksMin}–${timelineWeeksMax}`,
      label: t(`${s}.weeks`),
      color: 'text-primary',
    },
  ]

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="py-4">
          <CardContent className="px-4 text-center">
            <div className={`font-mono text-xl font-semibold ${item.color}`}>
              {item.value}
            </div>
            <div className="text-muted-foreground mt-1 text-xs leading-snug">
              {item.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
