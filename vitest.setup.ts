import ukCommon from '@/i18n/locales/uk/common.json'
import ukPoland from '@/i18n/locales/uk/poland.json'
import ukTax from '@/i18n/locales/uk/tax.json'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

await i18n.use(initReactI18next).init({
  lng: 'uk',
  resources: {
    uk: { common: ukCommon, tax: ukTax, poland: ukPoland },
  },
  ns: ['common', 'tax', 'poland'],
  defaultNS: ['common', 'tax', 'poland'],
  fallbackNS: 'common',
  interpolation: { escapeValue: false },
})
