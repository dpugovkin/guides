import { useTranslation } from 'react-i18next'

const APP_NAMESPACES = ['common', 'tax', 'poland'] as const

/** Resolves keys across common, tax, and poland namespaces. */
export function useAppTranslation() {
  return useTranslation([...APP_NAMESPACES])
}
