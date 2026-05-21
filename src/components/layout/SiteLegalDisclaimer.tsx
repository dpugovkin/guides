import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import { Alert, AlertDescription } from '@/components/ui/alert'

type SiteLegalDisclaimerProps = {
  /** Site-wide footer text vs. extra notice on financial calculators */
  variant?: 'site' | 'financialTools'
}

export function SiteLegalDisclaimer({
  variant = 'site',
}: SiteLegalDisclaimerProps) {
  const { t } = useTranslation()
  const messageKey =
    variant === 'financialTools'
      ? 'legal.financialToolsDisclaimer'
      : 'legal.siteDisclaimer'

  return (
    <Alert variant="default" className="border-muted-foreground/20 bg-muted/30">
      <AlertDescription className="text-muted-foreground text-xs leading-relaxed">
        {t(messageKey)}
      </AlertDescription>
    </Alert>
  )
}
