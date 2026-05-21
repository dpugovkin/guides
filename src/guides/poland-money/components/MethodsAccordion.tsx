import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { AtmMethodSection } from '@/guides/poland-money/components/AtmMethodSection'
import { BorderMethodSection } from '@/guides/poland-money/components/BorderMethodSection'
import { DocumentsList } from '@/guides/poland-money/components/DocumentsList'
import type { BorderCashTransferPlan } from '@/guides/shared/ua-property-sale/lib/calculator'
import type { LegalMethod } from '@/guides/poland-money/types'

type MethodsAccordionProps = {
  selectedLegalMethod: LegalMethod | undefined
  onSelectedLegalMethodChange: (method: LegalMethod | undefined) => void
  bankAccountCount: number
  maxUsdPerBorderTrip: number
  borderCashTransferPlan: BorderCashTransferPlan
  netProceedsUsd: number
  uahPerUsd: number
  onBankAccountCountChange: (delta: number) => void
  onMaxUsdPerBorderTripChange: (value: number) => void
}

export function MethodsAccordion({
  selectedLegalMethod,
  onSelectedLegalMethodChange,
  bankAccountCount,
  maxUsdPerBorderTrip,
  borderCashTransferPlan,
  netProceedsUsd,
  uahPerUsd,
  onBankAccountCountChange,
  onMaxUsdPerBorderTripChange,
}: MethodsAccordionProps) {
  const { t } = useTranslation()

  return (
    <section className="space-y-4">
      <h2 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
        {t('guides.poland.methods.sectionTitle')}
      </h2>

      <Accordion
        type="single"
        collapsible
        value={selectedLegalMethod ?? ''}
        onValueChange={(value) =>
          onSelectedLegalMethodChange(
            value ? (value as LegalMethod) : undefined,
          )
        }
        className="space-y-3"
      >
        <AccordionItem
          value="border"
          className="rounded-xl border border-l-4 border-l-primary px-4 last:border-b"
        >
          <AccordionTrigger className="py-4 hover:no-underline">
            <div className="pr-2 text-left">
              <span className="font-medium">
                {t('guides.poland.methods.border.title')}
              </span>
              <span className="text-muted-foreground mt-0.5 block text-xs font-normal">
                {t('guides.poland.methods.border.short')}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <BorderMethodSection
              bankAccountCount={bankAccountCount}
              maxUsdPerBorderTrip={maxUsdPerBorderTrip}
              borderCashTransferPlan={borderCashTransferPlan}
              onBankAccountCountChange={onBankAccountCountChange}
              onMaxUsdPerBorderTripChange={onMaxUsdPerBorderTripChange}
            />
            <DocumentsList method="border" />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="atm"
          className="rounded-xl border border-l-4 border-l-primary px-4 last:border-b"
        >
          <AccordionTrigger className="py-4 hover:no-underline">
            <div className="pr-2 text-left">
              <span className="font-medium">
                {t('guides.poland.methods.atm.title')}
              </span>
              <span className="text-muted-foreground mt-0.5 block text-xs font-normal">
                {t('guides.poland.methods.atm.short')}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <AtmMethodSection
              netProceedsUsd={netProceedsUsd}
              uahPerUsd={uahPerUsd}
            />
            <DocumentsList method="atm" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}
