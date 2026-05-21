import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import { AmountSchedule } from '@/guides/poland-money/components/AmountSchedule'
import { fmt } from '@/guides/shared/ua-property-sale/lib/format'

type TripsListProps = {
  tripAmounts: number[]
}

export function TripsList({ tripAmounts }: TripsListProps) {
  const { t } = useTranslation()
  const tr = 'guides.poland.trips'

  return (
    <section className="mt-10">
      <h2 className="text-muted-foreground mb-4 flex items-center gap-3 text-xs font-semibold tracking-widest uppercase">
        {t(`${tr}.sectionTitle`)}
        <span className="bg-border h-px flex-1" />
      </h2>

      <AmountSchedule
        amounts={tripAmounts}
        desc={t(`${tr}.desc`)}
        formatAmount={(n) => `$${fmt(n)}`}
        summaryKey="guides.poland.schedule.tripsSummary"
        summaryLastKey="guides.poland.schedule.tripsSummaryLast"
        badges={{
          ua: t(`${tr}.badgeUa`),
          pl: t(`${tr}.badgePl`),
          ok: t(`${tr}.badgeOk`),
        }}
      />
    </section>
  )
}
