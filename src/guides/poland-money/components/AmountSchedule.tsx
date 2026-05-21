import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { fmt } from '@/guides/shared/ua-property-sale/lib/format'

const FULL_LIST_MAX = 6

type AmountScheduleProps = {
  amounts: number[]
  desc: string
  formatAmount: (n: number) => string
  summaryKey:
    | 'guides.poland.schedule.atmSummary'
    | 'guides.poland.schedule.tripsSummary'
  summaryLastKey:
    | 'guides.poland.schedule.atmSummaryLast'
    | 'guides.poland.schedule.tripsSummaryLast'
  summaryUsdNote?: string
  badges?: { ua: string; pl: string; ok: string }
}

export function AmountSchedule({
  amounts,
  desc,
  formatAmount,
  summaryKey,
  summaryLastKey,
  summaryUsdNote,
  badges,
}: AmountScheduleProps) {
  const { t } = useTranslation()

  if (amounts.length === 0) return null

  if (amounts.length <= FULL_LIST_MAX) {
    return (
      <div className="space-y-2">
        {amounts.map((amt, i) => (
          <Card key={i} className="py-3">
            <CardContent className="flex items-center gap-3 px-4">
              <span className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold font-mono">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-mono font-semibold">
                  {formatAmount(amt)}
                  {summaryUsdNote && (
                    <span className="text-muted-foreground ml-1 text-xs font-normal">
                      {summaryUsdNote}
                    </span>
                  )}
                </div>
                <div className="text-muted-foreground text-xs">{desc}</div>
              </div>
              {badges && (
                <div className="flex shrink-0 gap-1">
                  <Badge variant="ua">{badges.ua}</Badge>
                  <Badge variant="pl">{badges.pl}</Badge>
                  <Badge variant="ok">{badges.ok}</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const typical = amounts[0]
  const last = amounts[amounts.length - 1]
  const allSame = amounts.every((a) => a === typical)
  const lastPart =
    !allSame && last !== typical ? t(summaryLastKey, { last: fmt(last) }) : ''

  return (
    <Card className="border-dashed py-4">
      <CardContent className="space-y-2 px-6 text-sm">
        <p className="font-medium">
          {t(summaryKey, {
            count: amounts.length,
            typical: fmt(typical),
            lastPart,
          })}
        </p>
        <p className="text-muted-foreground text-xs">{desc}</p>
        {!allSame && (
          <p className="text-muted-foreground font-mono text-xs">
            {t('guides.poland.schedule.example', {
              first: formatAmount(typical),
              last: formatAmount(last),
            })}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
