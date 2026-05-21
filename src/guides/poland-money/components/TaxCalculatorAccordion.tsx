import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import { localizedPath } from '@/i18n/langPath'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { PropertySaleTaxCalculator } from '@/guides/shared/ua-property-sale/components/PropertySaleTaxCalculator'
import type { SupportedLanguage } from '@/i18n/config'
import {
  usePropertySaleCalculator,
  type UahExchangeRateState,
} from '@/guides/shared/ua-property-sale/hooks/usePropertySaleCalculator'
import { fmt } from '@/guides/shared/ua-property-sale/lib/format'

const CALCULATOR_GUIDE_SLUG = 'ukraine-property-sale-taxes'

type TaxCalculatorAccordionProps = {
  exchangeRateState?: UahExchangeRateState
  onApplyNetProceedsUsd?: (netProceedsUsd: number) => void
}

export function TaxCalculatorAccordion({
  exchangeRateState,
  onApplyNetProceedsUsd,
}: TaxCalculatorAccordionProps) {
  const { t, i18n } = useTranslation()
  const propertySaleTaxCalculator = usePropertySaleCalculator(exchangeRateState)
  const taxGuidePath = localizedPath(
    `/${CALCULATOR_GUIDE_SLUG}`,
    i18n.language as SupportedLanguage,
  )

  return (
    <section className="space-y-2">
      <Accordion type="single" collapsible className="rounded-xl border px-4">
        <AccordionItem value="tax-calc" className="border-0">
          <AccordionTrigger className="py-4 hover:no-underline">
            <div className="pr-2 text-left">
              <span className="font-medium">
                {t('guides.poland.taxCalcAccordion.title')}
              </span>
              <span className="text-muted-foreground mt-0.5 block text-xs font-normal">
                {t('guides.poland.taxCalcAccordion.subtitle')}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-6">
            <p className="text-muted-foreground text-xs leading-relaxed">
              {t('guides.poland.taxCalcAccordion.independentNote')}
            </p>
            <Link
              to={taxGuidePath}
              className="text-primary inline-flex items-center gap-1 text-sm underline hover:no-underline"
            >
              {t('guides.poland.taxCalcAccordion.guideLink')}
              <ArrowUpRight className="size-3.5" />
            </Link>
            <PropertySaleTaxCalculator
              uahRate={propertySaleTaxCalculator.rate}
              rateLoading={propertySaleTaxCalculator.loading}
              rateError={propertySaleTaxCalculator.error}
              rateFallback={propertySaleTaxCalculator.isFallback}
              rateDate={propertySaleTaxCalculator.info?.date}
              onRateRefresh={() => void propertySaleTaxCalculator.refreshRate()}
              price={propertySaleTaxCalculator.price}
              net={propertySaleTaxCalculator.net}
              moreThan3={propertySaleTaxCalculator.moreThan3}
              saleOrder={propertySaleTaxCalculator.saleOrder}
              purchasePrice={propertySaleTaxCalculator.purchasePrice}
              taxBreakdown={propertySaleTaxCalculator.result.taxBreakdown}
              onPriceChange={propertySaleTaxCalculator.setPrice}
              onNetChange={propertySaleTaxCalculator.setNet}
              onTenureChange={propertySaleTaxCalculator.setMoreThan3}
              onSaleOrderChange={propertySaleTaxCalculator.setSaleOrder}
              onPurchasePriceChange={propertySaleTaxCalculator.setPurchasePrice}
              showFinancialDisclaimer={false}
            />
            {onApplyNetProceedsUsd && propertySaleTaxCalculator.net > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() =>
                  onApplyNetProceedsUsd(propertySaleTaxCalculator.net)
                }
              >
                {t('guides.tax.applyNet', {
                  net: fmt(propertySaleTaxCalculator.net),
                })}
              </Button>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}
