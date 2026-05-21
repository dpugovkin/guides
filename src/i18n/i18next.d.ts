import 'i18next'

import type common from '@/i18n/locales/uk/common.json'
import type poland from '@/i18n/locales/uk/poland.json'
import type tax from '@/i18n/locales/uk/tax.json'

/** All translation keys across namespaces (for typed `t()` with defaultNS list). */
export type AppTranslation = typeof common & typeof tax & typeof poland

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: AppTranslation
      tax: AppTranslation
      poland: AppTranslation
    }
    strictKeyChecks: false
  }
}
