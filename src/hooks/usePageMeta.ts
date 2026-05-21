import { useEffect } from 'react'

import { useAppTranslation } from '@/hooks/useAppTranslation'
import {
  OG_IMAGE_URL,
  SITE_BASE,
  syncHreflangAlternates,
} from '@/lib/site-meta'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function upsertCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

export type PageMetaOptions = {
  title: string
  description?: string
  /** Full path with language prefix, e.g. `/uk/ukraine-property-sale-poland` */
  canonicalPath?: string
  /**
   * Path without language, e.g. `/` or `/ukraine-property-sale-taxes`.
   * Enables `hreflang` alternates for uk / en / pl.
   */
  pathWithoutLanguage?: string
}

/** Updates document title, description, Open Graph, Twitter, canonical, hreflang, and og:image. */
export function usePageMeta({
  title,
  description,
  canonicalPath,
  pathWithoutLanguage,
}: PageMetaOptions) {
  const { t } = useAppTranslation()

  useEffect(() => {
    document.title = title

    if (description) {
      upsertMeta('name', 'description', description)
      upsertMeta('property', 'og:description', description)
      upsertMeta('name', 'twitter:description', description)
    }

    upsertMeta('property', 'og:title', title)
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', t('site.title'))
    upsertMeta('property', 'og:image', OG_IMAGE_URL)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:image', OG_IMAGE_URL)

    if (canonicalPath) {
      const href = `${SITE_BASE}${canonicalPath === '/' ? '' : canonicalPath}`
      upsertCanonical(href)
      upsertMeta('property', 'og:url', href)
    }

    if (pathWithoutLanguage) {
      syncHreflangAlternates(pathWithoutLanguage)
    }
  }, [title, description, canonicalPath, pathWithoutLanguage, t])
}
