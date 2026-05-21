import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

type SchemeLink = {
  url: string
  text: string
}

type SchemeReason = {
  label: string
  text: string
  quote?: string
  quoteLink?: string
  quoteSource?: string
  link?: string
  linkText?: string
  links?: SchemeLink[]
  isCase?: boolean
}

function reasonLinks(reason: SchemeReason): SchemeLink[] {
  if (reason.links?.length) return reason.links
  if (reason.link && reason.linkText) {
    return [{ url: reason.link, text: reason.linkText }]
  }
  return []
}

function ReasonLinks({ links }: { links: SchemeLink[] }) {
  if (links.length === 0) return null
  return (
    <ul className="mt-2 space-y-1">
      {links.map((l) => (
        <li key={l.url}>
          <a
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-xs underline hover:no-underline"
          >
            {l.text}
          </a>
        </li>
      ))}
    </ul>
  )
}

type Scheme = {
  id: string
  title: string
  tag: string
  reasons: SchemeReason[]
}

export function SchemeAccordion() {
  const { t } = useTranslation()
  const schemes = t('guides.poland.schemes.items', {
    returnObjects: true,
  }) as Scheme[]

  return (
    <section className="mt-10">
      <h2 className="text-muted-foreground mb-4 flex items-center gap-3 text-xs font-semibold tracking-widest uppercase">
        {t('guides.poland.schemes.sectionTitle')}
        <span className="bg-border h-px flex-1" />
      </h2>

      <Accordion type="multiple" className="space-y-2">
        {schemes.map((scheme) => (
          <AccordionItem
            key={scheme.id}
            value={scheme.id}
            className="rounded-lg border border-destructive/20 border-l-4 border-l-destructive px-4 last:border-b"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex flex-1 items-center gap-2 text-left">
                <span className="text-base">❌</span>
                <span className="font-medium">{scheme.title}</span>
                <Badge
                  variant="destructive"
                  className="ml-auto mr-2 max-w-[11rem] shrink-0 text-right text-[10px] leading-tight whitespace-normal"
                >
                  {scheme.tag}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pb-4">
              {scheme.reasons.map((reason, idx) => {
                const links = reasonLinks(reason)
                return (
                  <div
                    key={idx}
                    className="border-b border-border/60 pb-4 last:border-0 last:pb-0"
                  >
                    <p className="text-destructive mb-1 font-mono text-[10px] font-semibold tracking-wide">
                      {reason.label}
                    </p>
                    {reason.isCase ? (
                      <div className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive/90">
                        <p className="leading-relaxed">{reason.text}</p>
                        <ReasonLinks links={links} />
                      </div>
                    ) : (
                      <>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {reason.text}
                        </p>
                        <ReasonLinks links={links} />
                      </>
                    )}
                    {reason.quote && (
                      <blockquote className="text-muted-foreground mt-2 border-l-2 pl-3 text-xs italic">
                        {reason.quote}{' '}
                        {reason.quoteLink && (
                          <a
                            href={reason.quoteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary not-italic underline"
                          >
                            {reason.quoteSource}
                          </a>
                        )}
                      </blockquote>
                    )}
                  </div>
                )
              })}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
