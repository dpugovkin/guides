import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import { UsdAmountInput } from '@/components/UsdAmountInput'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { SiteLegalDisclaimer } from '@/components/layout/SiteLegalDisclaimer'
import { ExchangeRateBadge } from '@/guides/shared/ua-property-sale/components/ExchangeRateBadge'
import { TaxResult } from '@/guides/shared/ua-property-sale/components/TaxResult'
import type { SaleTaxBreakdown } from '@/guides/shared/ua-property-sale/lib/calculator'
import type { SaleOrderInYear } from '@/guides/shared/ua-property-sale/lib/ua-sale-taxes'

export type PropertySaleTaxCalculatorProps = {
  uahRate: number
  rateLoading: boolean
  rateError: boolean
  rateFallback: boolean
  rateDate?: string
  onRateRefresh: () => void
  price: number
  net: number
  moreThan3: boolean
  saleOrder: SaleOrderInYear
  purchasePrice: number
  taxBreakdown: SaleTaxBreakdown
  onPriceChange: (v: number) => void
  onNetChange: (v: number) => void
  onTenureChange: (v: boolean) => void
  onSaleOrderChange: (v: SaleOrderInYear) => void
  onPurchasePriceChange: (v: number) => void
  /** Show net-proceeds input inside the block (standalone guide); hidden on PL guide page */
  showNetInput?: boolean
  /** Section heading (standalone guide page) */
  showSectionHeader?: boolean
  /** Financial disclaimer under the calculator (disable when the page shows its own) */
  showFinancialDisclaimer?: boolean
}

export function PropertySaleTaxCalculator({
  uahRate,
  rateLoading,
  rateError,
  rateFallback,
  rateDate,
  onRateRefresh,
  price,
  net,
  moreThan3,
  saleOrder,
  purchasePrice,
  taxBreakdown,
  onPriceChange,
  onNetChange,
  onTenureChange,
  onSaleOrderChange,
  onPurchasePriceChange,
  showNetInput = false,
  showSectionHeader = false,
  showFinancialDisclaimer = true,
}: PropertySaleTaxCalculatorProps) {
  const { t } = useTranslation()
  const ns = 'guides.tax.inputs'
  const tenureApplies = saleOrder === 'first'

  return (
    <div className="space-y-4">
      {showSectionHeader && (
        <>
          <h2 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            {t(`${ns}.sharedTitle`)}
          </h2>
          <p className="text-muted-foreground -mt-2 text-sm">
            {t(`${ns}.sharedHint`)}
          </p>
        </>
      )}

      <div className="space-y-6 rounded-xl border bg-card p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <UsdAmountInput
            label={t(`${ns}.priceLabel`)}
            value={price}
            onChange={onPriceChange}
            currencySuffix={t(`${ns}.currency`)}
          />

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                {t(`${ns}.saleOrderLabel`)}
              </label>
              <ToggleGroup
                type="single"
                value={saleOrder}
                onValueChange={(v) =>
                  v && onSaleOrderChange(v as SaleOrderInYear)
                }
                className="grid w-full grid-cols-3"
                variant="outline"
              >
                <ToggleGroupItem value="first" className="text-xs sm:text-sm">
                  {t(`${ns}.saleOrderFirst`)}
                </ToggleGroupItem>
                <ToggleGroupItem value="second" className="text-xs sm:text-sm">
                  {t(`${ns}.saleOrderSecond`)}
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="thirdPlus"
                  className="text-xs sm:text-sm"
                >
                  {t(`${ns}.saleOrderThird`)}
                </ToggleGroupItem>
              </ToggleGroup>
              {saleOrder === 'second' && (
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {t(`${ns}.saleOrderSecondNote`)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                className={`text-muted-foreground text-xs font-semibold tracking-wide uppercase ${!tenureApplies ? 'opacity-50' : ''}`}
              >
                {t(`${ns}.tenureLabel`)}
              </label>
              <ToggleGroup
                type="single"
                value={moreThan3 ? 'more' : 'less'}
                onValueChange={(v) =>
                  v && tenureApplies && onTenureChange(v === 'more')
                }
                className="w-full"
                variant="outline"
                disabled={!tenureApplies}
              >
                <ToggleGroupItem
                  value="more"
                  className="flex-1"
                  disabled={!tenureApplies}
                >
                  {t(`${ns}.tenureMore`)}
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="less"
                  className="flex-1"
                  disabled={!tenureApplies}
                >
                  {t(`${ns}.tenureLess`)}
                </ToggleGroupItem>
              </ToggleGroup>
              {!tenureApplies && (
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {t(`${ns}.tenureDisabledNote`)}
                </p>
              )}
            </div>
          </div>
        </div>

        {saleOrder === 'thirdPlus' && (
          <div className="space-y-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <p className="text-muted-foreground text-xs">
              {t(`${ns}.purchasePriceHint`)}
            </p>
            <UsdAmountInput
              label={t(`${ns}.purchasePriceLabel`)}
              value={purchasePrice}
              onChange={onPurchasePriceChange}
              min={0}
              placeholder="0"
              currencySuffix={t(`${ns}.currency`)}
              className="max-w-md"
            />
          </div>
        )}

        <TaxResult breakdown={taxBreakdown} saleOrder={saleOrder} />

        {showNetInput && (
          <div className="space-y-2 border-t pt-6 sm:max-w-md">
            <p className="text-muted-foreground text-xs">
              {t(`${ns}.netHint`)}
            </p>
            <UsdAmountInput
              label={t(`${ns}.netLabel`)}
              value={net}
              onChange={onNetChange}
              currencySuffix={t(`${ns}.currency`)}
            />
          </div>
        )}
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
        <ExchangeRateBadge
          rate={uahRate}
          loading={rateLoading}
          error={rateError}
          isFallback={rateFallback}
          date={rateDate}
          onRefresh={onRateRefresh}
        />
      </div>

      {showFinancialDisclaimer && (
        <SiteLegalDisclaimer variant="financialTools" />
      )}
    </div>
  )
}
