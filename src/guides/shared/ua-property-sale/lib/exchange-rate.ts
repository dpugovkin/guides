export const FALLBACK_UAH_PER_USD = 41

export type UahRateInfo = {
  rate: number
  date: string
  source: 'nbu'
}

type NbuRow = {
  rate: number
  cc: string
  exchangedate?: string
}

const NBU_USD_URL =
  'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&json'

export async function fetchNbuUahPerUsd(): Promise<UahRateInfo> {
  const res = await fetch(NBU_USD_URL)
  if (!res.ok) {
    throw new Error(`NBU HTTP ${res.status}`)
  }
  const data = (await res.json()) as NbuRow[]
  const usd = data.find((r) => r.cc === 'USD')
  if (!usd?.rate || usd.rate <= 0) {
    throw new Error('NBU: USD rate missing')
  }
  return {
    rate: usd.rate,
    date: usd.exchangedate ?? '',
    source: 'nbu',
  }
}

export function formatNbuDate(date: string): string {
  if (!date || date.length !== 8) return date
  return `${date.slice(6, 8)}.${date.slice(4, 6)}.${date.slice(0, 4)}`
}
