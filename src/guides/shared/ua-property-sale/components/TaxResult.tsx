import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { SaleTaxBreakdown } from '@/guides/shared/ua-property-sale/lib/calculator'
import { fmt } from '@/guides/shared/ua-property-sale/lib/format'
import type { SaleOrderInYear } from '@/guides/shared/ua-property-sale/lib/ua-sale-taxes'
import {
  DEFAULT_DOCS_UAH,
  DEFAULT_NOTARY_UAH,
} from '@/guides/shared/ua-property-sale/lib/ua-sale-taxes'

type TaxResultProps = {
  breakdown: SaleTaxBreakdown
  saleOrder: SaleOrderInYear
}

export function TaxResult({ breakdown, saleOrder }: TaxResultProps) {
  const { t } = useTranslation()
  const ns = 'guides.tax.result'

  const sellerLines = breakdown.lines.filter((l) => l.includedInNet)
  const buyerLines = breakdown.lines.filter((l) => !l.includedInNet)
  const showProfit = saleOrder === 'thirdPlus' && breakdown.taxableProfitUsd > 0

  return (
    <Alert variant="default" className="border-primary/20 bg-card">
      <AlertTitle>{t(`${ns}.label`)}</AlertTitle>
      <AlertDescription className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/60 pb-3">
          <span className="text-muted-foreground text-xs uppercase tracking-wide">
            {t(`${ns}.salePrice`)}
          </span>
          <span className="font-mono text-lg font-semibold">
            ${fmt(Math.round(breakdown.priceUsd))}
          </span>
        </div>

        {showProfit && (
          <p className="text-muted-foreground text-xs">
            {t(`${ns}.taxableProfit`, {
              profit: fmt(Math.round(breakdown.taxableProfitUsd)),
              purchase: fmt(Math.round(breakdown.purchasePriceUsd)),
            })}
          </p>
        )}

        <ul className="space-y-2 text-sm">
          {sellerLines.map((line) => (
            <li
              key={line.id}
              className="flex flex-wrap items-baseline justify-between gap-2"
            >
              <span className="text-muted-foreground">
                {t(`${ns}.lines.${line.id}`)}
                {line.id === 'pit' && saleOrder === 'thirdPlus' ? (
                  <span className="text-foreground/70 ml-1 text-xs">
                    ({t(`${ns}.pitOnProfit`)})
                  </span>
                ) : (
                  line.ratePercent != null &&
                  line.ratePercent > 0 && (
                    <span className="text-foreground/70 ml-1 font-mono text-xs">
                      ({line.ratePercent}%)
                    </span>
                  )
                )}
                {line.ratePercent === 0 && line.id !== 'pit' && (
                  <span className="text-foreground/70 ml-1 text-xs">(0%)</span>
                )}
                {line.id === 'pit' && line.ratePercent === 0 && (
                  <span className="text-foreground/70 ml-1 text-xs">(0%)</span>
                )}
              </span>
              <span className="font-mono text-amber-700 dark:text-amber-400">
                −${fmt(Math.round(line.amountUsd))}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-border/60 pt-2 text-sm">
          <span className="font-medium">{t(`${ns}.sellerTotal`)}</span>
          <span className="font-mono font-semibold text-amber-700 dark:text-amber-400">
            −${fmt(Math.round(breakdown.sellerTotalUsd))}
          </span>
        </div>

        {buyerLines.length > 0 && (
          <div className="text-muted-foreground space-y-1 border-t border-dashed border-border/60 pt-2 text-xs">
            <p>{t(`${ns}.buyerNote`)}</p>
            {buyerLines.map((line) => (
              <p key={line.id} className="flex justify-between gap-2">
                <span>
                  {t(`${ns}.lines.${line.id}`)}
                  {line.ratePercent != null && (
                    <span className="font-mono"> ({line.ratePercent}%)</span>
                  )}
                </span>
                <span className="font-mono">
                  ${fmt(Math.round(line.amountUsd))}
                </span>
              </p>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-primary/20 bg-primary/5 -mx-1 rounded-md px-3 py-3">
          <span className="text-primary text-xs font-semibold uppercase tracking-wide">
            {t(`${ns}.netLabel`)}
          </span>
          <span className="font-mono text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
            ${fmt(Math.round(breakdown.netUsd))}
          </span>
        </div>

        <p className="text-muted-foreground text-xs leading-relaxed">
          {t(`${ns}.footnote`, {
            notaryUah: fmt(DEFAULT_NOTARY_UAH),
            docsUah: fmt(DEFAULT_DOCS_UAH),
          })}
        </p>
      </AlertDescription>
    </Alert>
  )
}
