import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import { InputsPanel } from '@/guides/poland-money/components/InputsPanel'
import { MethodInputsSection } from '@/guides/poland-money/components/MethodInputsSection'
import { StatsGrid } from '@/guides/poland-money/components/StatsGrid'
import { TripsList } from '@/guides/poland-money/components/TripsList'
import { VerdictCard } from '@/guides/poland-money/components/VerdictCard'
import type { BorderCashTransferPlan } from '@/guides/shared/ua-property-sale/lib/calculator'
import { fmt, plural } from '@/guides/shared/ua-property-sale/lib/format'

type BorderMethodSectionProps = {
  bankAccountCount: number
  maxUsdPerBorderTrip: number
  borderCashTransferPlan: BorderCashTransferPlan
  onBankAccountCountChange: (delta: number) => void
  onMaxUsdPerBorderTripChange: (value: number) => void
}

export function BorderMethodSection({
  bankAccountCount,
  maxUsdPerBorderTrip,
  borderCashTransferPlan,
  onBankAccountCountChange,
  onMaxUsdPerBorderTripChange,
}: BorderMethodSectionProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-8">
      <p className="text-muted-foreground text-sm leading-relaxed">
        {t('guides.poland.methods.border.intro')}
      </p>

      <MethodInputsSection method="border">
        <InputsPanel
          bankAccountCount={bankAccountCount}
          maxUsdPerBorderTrip={maxUsdPerBorderTrip}
          dailyDepositCapacityUah={borderCashTransferPlan.perDayUah}
          onBankAccountCountChange={onBankAccountCountChange}
          onMaxUsdPerBorderTripChange={onMaxUsdPerBorderTripChange}
        />
      </MethodInputsSection>

      <VerdictCard
        labelKey="guides.poland.verdict.label"
        bodyKey="guides.poland.verdict.body"
        highlightKey="guides.poland.verdict.highlight"
        values={{
          net: fmt(borderCashTransferPlan.net),
          banks: bankAccountCount,
          banksWord: plural(bankAccountCount, 'guides.poland.verdict.banks'),
          days: borderCashTransferPlan.days,
          daysWord: plural(
            borderCashTransferPlan.days,
            'guides.poland.verdict.days',
          ),
          trips: borderCashTransferPlan.trips,
          tripsWord: plural(
            borderCashTransferPlan.trips,
            'guides.poland.verdict.trips',
          ),
          perTrip: fmt(borderCashTransferPlan.perTrip),
          weeksMin: borderCashTransferPlan.weeksMin,
          weeksMax: borderCashTransferPlan.weeksMax,
        }}
      />

      <StatsGrid
        calendarDaysNeeded={borderCashTransferPlan.days}
        borderCrossingCount={borderCashTransferPlan.trips}
        usdPerBorderTrip={borderCashTransferPlan.perTrip}
        maxUsdPerBorderTrip={maxUsdPerBorderTrip}
        timelineWeeksMin={borderCashTransferPlan.weeksMin}
        timelineWeeksMax={borderCashTransferPlan.weeksMax}
      />

      <TripsList tripAmounts={borderCashTransferPlan.tripAmounts} />
    </div>
  )
}
