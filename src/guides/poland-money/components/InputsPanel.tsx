import { Minus, Plus } from 'lucide-react'
import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import { UsdAmountInput } from '@/components/UsdAmountInput'
import { Button } from '@/components/ui/button'
import { fmt } from '@/guides/shared/ua-property-sale/lib/format'

type BorderCashInputsPanelProps = {
  bankAccountCount: number
  maxUsdPerBorderTrip: number
  dailyDepositCapacityUah: number
  onBankAccountCountChange: (delta: number) => void
  onMaxUsdPerBorderTripChange: (value: number) => void
}

export function InputsPanel({
  bankAccountCount,
  maxUsdPerBorderTrip,
  dailyDepositCapacityUah,
  onBankAccountCountChange,
  onMaxUsdPerBorderTripChange,
}: BorderCashInputsPanelProps) {
  const { t } = useTranslation()
  const ns = 'guides.poland.inputs'

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="space-y-2">
        <label className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
          {t(`${ns}.banksLabel`)}
        </label>
        <div className="flex items-center gap-3 rounded-lg border bg-background px-3 py-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onBankAccountCountChange(-1)}
            disabled={bankAccountCount <= 1}
            aria-label={t('a11y.decrease')}
          >
            <Minus className="size-4" />
          </Button>
          <span className="font-mono min-w-[2ch] text-center text-lg font-semibold">
            {bankAccountCount}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onBankAccountCountChange(1)}
            disabled={bankAccountCount >= 5}
            aria-label={t('a11y.increase')}
          >
            <Plus className="size-4" />
          </Button>
          <span className="text-muted-foreground text-xs">
            {t(`${ns}.banksHint`, { perDay: fmt(dailyDepositCapacityUah) })}
          </span>
        </div>
      </div>

      <UsdAmountInput
        label={t(`${ns}.maxPerTripLabel`)}
        value={maxUsdPerBorderTrip}
        onChange={onMaxUsdPerBorderTripChange}
        currencySuffix={t(`${ns}.currency`)}
      />
    </div>
  )
}
