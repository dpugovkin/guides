import { useMemo, useState } from 'react'
import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import { Card, CardContent } from '@/components/ui/card'
import { AmountSchedule } from '@/guides/poland-money/components/AmountSchedule'
import { VerdictCard } from '@/guides/poland-money/components/VerdictCard'
import { AtmInputsPanel } from '@/guides/poland-money/components/AtmInputsPanel'
import { MethodInputsSection } from '@/guides/poland-money/components/MethodInputsSection'
import {
  calcAtmMethod,
  DEFAULT_ATM_CARDS,
  DEFAULT_WEEKLY_LIMIT_UAH,
} from '@/guides/poland-money/lib/atm-calculator'
import { fmt, plural } from '@/guides/shared/ua-property-sale/lib/format'

type AtmWithdrawalMethodSectionProps = {
  netProceedsUsd: number
  uahPerUsd: number
}

export function AtmMethodSection({
  netProceedsUsd,
  uahPerUsd,
}: AtmWithdrawalMethodSectionProps) {
  const { t } = useTranslation()
  const [weeklyLimitPerCardUah, setWeeklyLimitPerCardUah] = useState(
    DEFAULT_WEEKLY_LIMIT_UAH,
  )
  const [atmCardCount, setAtmCardCount] = useState(DEFAULT_ATM_CARDS)

  const atmWithdrawalPlan = useMemo(
    () =>
      calcAtmMethod(
        netProceedsUsd,
        weeklyLimitPerCardUah,
        atmCardCount,
        uahPerUsd,
      ),
    [netProceedsUsd, weeklyLimitPerCardUah, atmCardCount, uahPerUsd],
  )

  const steps = t('guides.poland.methods.atm.steps', {
    returnObjects: true,
  }) as string[]

  const notes = t('guides.poland.methods.atm.notes', {
    returnObjects: true,
  }) as string[]

  const v = 'guides.poland.methods.atm.verdict'

  return (
    <div className="space-y-8">
      <p className="text-muted-foreground text-sm leading-relaxed">
        {t('guides.poland.methods.atm.intro')}
      </p>

      <MethodInputsSection method="atm">
        <AtmInputsPanel
          atmCardCount={atmWithdrawalPlan.cards}
          weeklyLimitPerCardUah={atmWithdrawalPlan.weeklyLimitPerCardUah}
          weeklyWithdrawalCapacityUah={atmWithdrawalPlan.perWeekTotalUah}
          weeklyWithdrawalCapacityUsd={atmWithdrawalPlan.perWeekTotalUsd}
          onAtmCardCountChange={(delta) =>
            setAtmCardCount((count) => Math.max(1, Math.min(5, count + delta)))
          }
          onWeeklyLimitPerCardChange={(value) =>
            setWeeklyLimitPerCardUah(
              Math.max(100, value || DEFAULT_WEEKLY_LIMIT_UAH),
            )
          }
        />
      </MethodInputsSection>

      <Card className="py-4">
        <CardContent className="space-y-4 px-6">
          <p className="text-primary text-xs font-semibold tracking-wide uppercase">
            {t('guides.poland.methods.atm.stepsTitle')}
          </p>
          <ol className="list-decimal space-y-2 pl-4 text-sm leading-relaxed">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Card className="py-4">
          <CardContent className="px-4 text-center">
            <div className="font-mono text-xl font-semibold text-emerald-600 dark:text-emerald-400">
              {atmWithdrawalPlan.weeks}
            </div>
            <div className="text-muted-foreground mt-1 text-xs">
              {t('guides.poland.methods.atm.stats.weeks')}
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="px-4 text-center">
            <div className="font-mono text-xl font-semibold text-primary">
              {fmt(atmWithdrawalPlan.perWeekTotalUah)}
            </div>
            <div className="text-muted-foreground mt-1 text-xs">
              {t('guides.poland.methods.atm.stats.perWeekUah')}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 py-4 md:col-span-1">
          <CardContent className="px-4 text-center">
            <div className="font-mono text-xl font-semibold text-amber-600 dark:text-amber-400">
              ~${fmt(Math.round(atmWithdrawalPlan.perWeekTotalUsd))}
            </div>
            <div className="text-muted-foreground mt-1 text-xs">
              {t('guides.poland.methods.atm.stats.perWeekUsd', {
                rate: Math.round(uahPerUsd),
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <VerdictCard
        labelKey={`${v}.label`}
        bodyKey={`${v}.body`}
        highlightKey={`${v}.highlight`}
        values={{
          net: fmt(atmWithdrawalPlan.netUsd),
          weeks: atmWithdrawalPlan.weeks,
          weeksWord: plural(atmWithdrawalPlan.weeks, `${v}.weeks`),
          cards: atmWithdrawalPlan.cards,
          cardsWord: plural(atmWithdrawalPlan.cards, `${v}.cards`),
          weeklyUah: fmt(atmWithdrawalPlan.weeklyLimitPerCardUah),
          perWeekUah: fmt(atmWithdrawalPlan.perWeekTotalUah),
          perWeekUsd: fmt(Math.round(atmWithdrawalPlan.perWeekTotalUsd)),
        }}
      />

      <Card className="border-primary/20 bg-primary/5 py-4">
        <CardContent className="space-y-3 px-6">
          <p className="text-primary text-xs font-semibold tracking-widest uppercase">
            {t('guides.poland.methods.atm.notSmurfingTitle')}
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t('guides.poland.methods.atm.notSmurfingIntro')}
          </p>
          <ul className="text-muted-foreground space-y-2 text-sm leading-relaxed">
            {(
              t('guides.poland.methods.atm.notSmurfingPoints', {
                returnObjects: true,
              }) as string[]
            ).map((point) => (
              <li key={point} className="relative pl-4">
                <span className="text-primary absolute left-0 font-semibold">
                  ·
                </span>
                {point}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground border-t border-primary/15 pt-3 text-xs leading-relaxed italic">
            {t('guides.poland.methods.atm.notSmurfingNote')}
          </p>
        </CardContent>
      </Card>

      {atmWithdrawalPlan.withdrawalAmountsUsd.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            {t('guides.poland.methods.atm.withdrawalsTitle')}
          </h3>
          <AmountSchedule
            amounts={atmWithdrawalPlan.withdrawalAmountsUsd}
            desc={t('guides.poland.methods.atm.withdrawalDesc')}
            formatAmount={(n) => `~$${fmt(n)}`}
            summaryKey="guides.poland.schedule.atmSummary"
            summaryLastKey="guides.poland.schedule.atmSummaryLast"
            summaryUsdNote={t('guides.poland.methods.atm.withdrawalUsdNote')}
          />
        </div>
      )}

      <Card className="border-amber-500/30 bg-amber-500/5 py-4">
        <CardContent className="px-6">
          <p className="mb-2 text-xs font-semibold tracking-wide text-amber-800 uppercase dark:text-amber-200">
            {t('guides.poland.methods.atm.notesTitle')}
          </p>
          <ul className="text-muted-foreground space-y-1.5 text-sm">
            {notes.map((note) => (
              <li key={note} className="relative pl-4">
                <span className="absolute left-0 text-amber-600">·</span>
                {note}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
