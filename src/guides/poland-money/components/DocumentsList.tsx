import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import { Card, CardContent } from '@/components/ui/card'
import type { LegalMethod } from '@/guides/poland-money/types'

type DocumentsListProps = {
  method: LegalMethod
}

export function DocumentsList({ method }: DocumentsListProps) {
  const { t } = useTranslation()
  const key =
    method === 'border' ? 'guides.poland.docs.border' : 'guides.poland.docs.atm'
  const items = t(`${key}.items`, { returnObjects: true }) as string[]

  return (
    <section className="mt-8">
      <h2 className="text-muted-foreground mb-4 flex items-center gap-3 text-xs font-semibold tracking-widest uppercase">
        {t(`${key}.sectionTitle`)}
        <span className="bg-border h-px flex-1" />
      </h2>
      <Card className="border-primary/20 bg-primary/5 py-4">
        <CardContent className="px-6">
          <p className="text-primary mb-3 text-xs font-semibold tracking-wide uppercase">
            {t(`${key}.label`)}
          </p>
          <ul className="text-muted-foreground space-y-1.5 text-sm">
            {items.map((item) => (
              <li key={item} className="relative pl-4">
                <span className="text-primary absolute left-0">·</span>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
