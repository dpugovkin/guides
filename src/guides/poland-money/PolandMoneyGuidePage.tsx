import { useState } from 'react'
import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import { GuidePageHeader } from '@/components/layout/GuidePageHeader'
import { SiteLegalDisclaimer } from '@/components/layout/SiteLegalDisclaimer'
import { usePageMeta } from '@/hooks/usePageMeta'
import { localizedPath } from '@/i18n/langPath'
import type { SupportedLanguage } from '@/i18n/config'
import { MethodsAccordion } from '@/guides/poland-money/components/MethodsAccordion'
import { NetTransferInput } from '@/guides/poland-money/components/NetTransferInput'
import { SchemeAccordion } from '@/guides/poland-money/components/SchemeAccordion'
import { TaxCalculatorAccordion } from '@/guides/poland-money/components/TaxCalculatorAccordion'
import { usePolandLegalizationTransfer } from '@/guides/poland-money/hooks/usePolandLegalizationTransfer'
import { useUahRate } from '@/guides/shared/ua-property-sale/hooks/useUahRate'
import type { LegalMethod } from '@/guides/poland-money/types'

const POLAND_GUIDE_SLUG = 'ukraine-property-sale-poland'

export default function PolandMoneyGuidePage() {
  const { t, i18n } = useTranslation()
  const language = i18n.language as SupportedLanguage

  usePageMeta({
    title: t('guides.poland.metaTitle'),
    description: t('guides.poland.description'),
    canonicalPath: localizedPath(`/${POLAND_GUIDE_SLUG}`, language),
    pathWithoutLanguage: `/${POLAND_GUIDE_SLUG}`,
  })

  const [selectedLegalMethod, setSelectedLegalMethod] = useState<
    LegalMethod | undefined
  >(undefined)

  const uahExchangeRate = useUahRate()
  const polandLegalizationTransfer = usePolandLegalizationTransfer(
    uahExchangeRate.rate,
  )

  return (
    <div className="space-y-8">
      <GuidePageHeader
        title={t('guides.poland.title')}
        subtitle={t('guides.poland.subtitle')}
      />

      <NetTransferInput
        net={polandLegalizationTransfer.netProceedsAfterUkraineTaxesUsd}
        onNetChange={
          polandLegalizationTransfer.setNetProceedsAfterUkraineTaxesUsd
        }
      />

      <TaxCalculatorAccordion
        exchangeRateState={{
          rate: uahExchangeRate.rate,
          info: uahExchangeRate.info,
          loading: uahExchangeRate.loading,
          error: uahExchangeRate.error,
          isFallback: uahExchangeRate.isFallback,
          refresh: uahExchangeRate.refresh,
        }}
        onApplyNetProceedsUsd={
          polandLegalizationTransfer.setNetProceedsAfterUkraineTaxesUsd
        }
      />

      <MethodsAccordion
        selectedLegalMethod={selectedLegalMethod}
        onSelectedLegalMethodChange={setSelectedLegalMethod}
        bankAccountCount={polandLegalizationTransfer.bankAccountCount}
        maxUsdPerBorderTrip={polandLegalizationTransfer.maxUsdPerBorderTrip}
        borderCashTransferPlan={
          polandLegalizationTransfer.borderCashTransferPlan
        }
        netProceedsUsd={
          polandLegalizationTransfer.netProceedsAfterUkraineTaxesUsd
        }
        uahPerUsd={uahExchangeRate.rate}
        onBankAccountCountChange={
          polandLegalizationTransfer.changeBankAccountCount
        }
        onMaxUsdPerBorderTripChange={
          polandLegalizationTransfer.setMaxUsdPerBorderTrip
        }
      />

      <SchemeAccordion />

      <SiteLegalDisclaimer variant="financialTools" />
    </div>
  )
}
