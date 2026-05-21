import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import { UsdAmountInput } from '@/components/UsdAmountInput'

type NetTransferInputProps = {
  net: number
  onNetChange: (v: number) => void
}

export function NetTransferInput({ net, onNetChange }: NetTransferInputProps) {
  const { t } = useTranslation()
  const ns = 'guides.poland.netSection'

  return (
    <section className="rounded-xl border border-primary/25 bg-primary/5 p-4 sm:p-6">
      <h2 className="text-primary text-xs font-semibold tracking-widest uppercase">
        {t(`${ns}.title`)}
      </h2>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        {t(`${ns}.hint`)}
      </p>
      <div className="mt-4 sm:max-w-md">
        <UsdAmountInput
          label={t(`${ns}.inputLabel`)}
          value={net}
          onChange={onNetChange}
          size="large"
          currencySuffix={t('currency.usd')}
          className="min-w-[12rem]"
        />
      </div>
    </section>
  )
}
