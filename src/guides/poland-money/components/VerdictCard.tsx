import { Trans } from 'react-i18next'
import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import { Card, CardContent } from '@/components/ui/card'

type VerdictCardProps = {
  labelKey: string
  bodyKey: string
  highlightKey: string
  values: Record<string, string | number>
}

export function VerdictCard({
  labelKey,
  bodyKey,
  highlightKey,
  values,
}: VerdictCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="mt-6 border-l-4 border-l-primary py-4">
      <CardContent className="space-y-3 px-6">
        <p className="text-primary text-xs font-semibold tracking-widest uppercase">
          {t(labelKey as never)}
        </p>
        <p className="text-sm leading-relaxed">
          <Trans
            i18nKey={bodyKey as never}
            values={values}
            components={{ strong: <strong className="text-foreground" /> }}
          />
        </p>
        <p className="bg-primary/5 text-primary rounded-md px-3 py-2 text-xs italic">
          {t(highlightKey as never)}
        </p>
      </CardContent>
    </Card>
  )
}
