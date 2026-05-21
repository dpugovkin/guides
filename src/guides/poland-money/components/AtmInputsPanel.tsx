import { Minus, Plus } from 'lucide-react'
import { useId } from 'react'
import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fmt } from '@/guides/shared/ua-property-sale/lib/format'
import {
  MAX_ATM_CARDS,
  MIN_ATM_CARDS,
} from '@/guides/poland-money/lib/atm-calculator'

type AtmWithdrawalInputsPanelProps = {
  atmCardCount: number
  weeklyLimitPerCardUah: number
  weeklyWithdrawalCapacityUah: number
  weeklyWithdrawalCapacityUsd: number
  onAtmCardCountChange: (delta: number) => void
  onWeeklyLimitPerCardChange: (value: number) => void
}

export function AtmInputsPanel({
  atmCardCount,
  weeklyLimitPerCardUah,
  weeklyWithdrawalCapacityUah,
  weeklyWithdrawalCapacityUsd,
  onAtmCardCountChange,
  onWeeklyLimitPerCardChange,
}: AtmWithdrawalInputsPanelProps) {
  const { t } = useTranslation()
  const ns = 'guides.poland.methods.atm'
  const weeklyLimitInputId = useId()

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
          {t(`${ns}.cardsLabel`)}
        </p>
        <div className="flex items-center gap-3 rounded-lg border bg-background px-3 py-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onAtmCardCountChange(-1)}
            disabled={atmCardCount <= MIN_ATM_CARDS}
            aria-label={t('a11y.decrease')}
          >
            <Minus className="size-4" />
          </Button>
          <span
            className="font-mono min-w-[2ch] text-center text-lg font-semibold"
            aria-live="polite"
          >
            {atmCardCount}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onAtmCardCountChange(1)}
            disabled={atmCardCount >= MAX_ATM_CARDS}
            aria-label={t('a11y.increase')}
          >
            <Plus className="size-4" />
          </Button>
          <span className="text-muted-foreground text-xs">
            {t(`${ns}.cardsHint`, {
              cards: atmCardCount,
              perWeekUah: fmt(weeklyWithdrawalCapacityUah),
              perWeekUsd: fmt(Math.round(weeklyWithdrawalCapacityUsd)),
              weeklyUah: fmt(weeklyLimitPerCardUah),
            })}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor={weeklyLimitInputId}
          className="text-muted-foreground text-xs font-semibold tracking-wide uppercase"
        >
          {t(`${ns}.weeklyLimitLabel`)}
        </label>
        <div className="flex items-center gap-2 rounded-lg border bg-background px-3">
          <span className="text-muted-foreground text-sm" aria-hidden>
            ₴
          </span>
          <Input
            id={weeklyLimitInputId}
            type="number"
            min={100}
            step={500}
            value={weeklyLimitPerCardUah}
            onChange={(e) => onWeeklyLimitPerCardChange(Number(e.target.value))}
            className="font-mono border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
          <span className="text-muted-foreground text-xs">
            {t('currency.uah')}
          </span>
        </div>
        <p className="text-muted-foreground text-xs">
          {t(`${ns}.weeklyLimitHint`)}
        </p>
      </div>
    </div>
  )
}
