import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import { GuidePageHeader } from '@/components/layout/GuidePageHeader'
import { SiteLegalDisclaimer } from '@/components/layout/SiteLegalDisclaimer'
import { PropertySaleTaxCalculator } from '@/guides/shared/ua-property-sale/components/PropertySaleTaxCalculator'
import { usePropertySaleCalculator } from '@/guides/shared/ua-property-sale/hooks/usePropertySaleCalculator'
import { usePageMeta } from '@/hooks/usePageMeta'
import type { SupportedLanguage } from '@/i18n/config'
import { localizedPath } from '@/i18n/langPath'

const UKRAINE_PROPERTY_SALE_TAXES_SLUG = 'ukraine-property-sale-taxes'

export default function PropertySaleCalculatorPage() {
  const { t, i18n } = useTranslation()
  const language = i18n.language as SupportedLanguage

  usePageMeta({
    title: t('guides.calculator.metaTitle'),
    description: t('guides.calculator.description'),
    canonicalPath: localizedPath(
      `/${UKRAINE_PROPERTY_SALE_TAXES_SLUG}`,
      language,
    ),
    pathWithoutLanguage: `/${UKRAINE_PROPERTY_SALE_TAXES_SLUG}`,
  })

  const propertySaleTaxCalculator = usePropertySaleCalculator()

  return (
    <div className="space-y-8">
      <GuidePageHeader
        title={t('guides.calculator.title')}
        subtitle={t('guides.calculator.subtitle')}
      />

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
        showNetInput
        showSectionHeader
        showFinancialDisclaimer={false}
      />

      <SiteLegalDisclaimer variant="financialTools" />
    </div>
  )
}
