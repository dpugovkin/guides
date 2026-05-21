import { lazy, type LazyExoticComponent, type ComponentType } from 'react'

export type GuideCopyKey =
  | 'guides.calculator.title'
  | 'guides.calculator.description'
  | 'guides.poland.title'
  | 'guides.poland.description'

export type GuideEntry = {
  slug: string
  titleKey: GuideCopyKey
  descriptionKey: GuideCopyKey
  available: boolean
  component: LazyExoticComponent<ComponentType>
}

export const guides: GuideEntry[] = [
  {
    slug: 'ukraine-property-sale-taxes',
    titleKey: 'guides.calculator.title',
    descriptionKey: 'guides.calculator.description',
    available: true,
    component: lazy(
      () => import('./property-sale-calculator/PropertySaleCalculatorPage'),
    ),
  },
  {
    slug: 'ukraine-property-sale-poland',
    titleKey: 'guides.poland.title',
    descriptionKey: 'guides.poland.description',
    available: true,
    component: lazy(() => import('./poland-money/PolandMoneyGuidePage')),
  },
]
