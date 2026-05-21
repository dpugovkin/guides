import type { ReactNode } from 'react'
import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import type { LegalMethod } from '@/guides/poland-money/types'

type MethodInputsSectionProps = {
  method: LegalMethod
  children: ReactNode
}

export function MethodInputsSection({
  method,
  children,
}: MethodInputsSectionProps) {
  const { t } = useTranslation()
  const titleKey =
    method === 'border'
      ? 'guides.poland.inputs.borderParamsTitle'
      : 'guides.poland.methods.atm.paramsTitle'

  return (
    <section className="space-y-4">
      <h3 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
        {t(titleKey)}
      </h3>
      <div className="rounded-xl border bg-card p-4 sm:p-6">{children}</div>
    </section>
  )
}
