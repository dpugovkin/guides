import { describe, expect, it } from 'vitest'

import enCommon from '@/i18n/locales/en/common.json'
import enPoland from '@/i18n/locales/en/poland.json'
import enTax from '@/i18n/locales/en/tax.json'
import plCommon from '@/i18n/locales/pl/common.json'
import plPoland from '@/i18n/locales/pl/poland.json'
import plTax from '@/i18n/locales/pl/tax.json'
import ukCommon from '@/i18n/locales/uk/common.json'
import ukPoland from '@/i18n/locales/uk/poland.json'
import ukTax from '@/i18n/locales/uk/tax.json'

const ukBundles = { common: ukCommon, tax: ukTax, poland: ukPoland }
const enBundles = { common: enCommon, tax: enTax, poland: enPoland }
const plBundles = { common: plCommon, tax: plTax, poland: plPoland }

/** Leaf keys used for parity (plural suffixes differ by language). */
function leafKeys(obj: unknown, prefix = ''): string[] {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return prefix ? [prefix] : []
  }
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    leafKeys(v, prefix ? `${prefix}.${k}` : k),
  )
}

const PLURAL_SUFFIX = /_(one|few|many|other)$/

function normalizePluralKey(key: string): string {
  return key.replace(PLURAL_SUFFIX, '')
}

function mergedLeafKeys(bundles: Record<string, unknown>): string[] {
  return Object.entries(bundles).flatMap(([ns, data]) =>
    leafKeys(data).map((k) => `${ns}.${k}`),
  )
}

describe('locale files', () => {
  it('uk and en namespaces share the same key structure (ignoring plural suffix variants)', () => {
    const ukNorm = new Set(mergedLeafKeys(ukBundles).map(normalizePluralKey))
    const enNorm = new Set(mergedLeafKeys(enBundles).map(normalizePluralKey))
    expect([...enNorm].sort()).toEqual([...ukNorm].sort())
  })

  it('pl namespaces share the same key structure as uk (ignoring plural suffix variants)', () => {
    const ukNorm = new Set(mergedLeafKeys(ukBundles).map(normalizePluralKey))
    const plNorm = new Set(mergedLeafKeys(plBundles).map(normalizePluralKey))
    expect([...plNorm].sort()).toEqual([...ukNorm].sort())
  })
})
