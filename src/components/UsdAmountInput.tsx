import { useId } from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type UsdAmountInputProps = {
  id?: string
  label?: string
  value: number
  onChange: (value: number) => void
  min?: number
  step?: number
  placeholder?: string
  size?: 'default' | 'large'
  currencySuffix?: string
  className?: string
}

export function UsdAmountInput({
  id: idProp,
  label,
  value,
  onChange,
  min = 1000,
  step = 1000,
  placeholder,
  size = 'default',
  currencySuffix = 'USD',
  className,
}: UsdAmountInputProps) {
  const autoId = useId()
  const inputId = idProp ?? autoId

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-muted-foreground mb-2 block text-xs font-semibold tracking-wide uppercase"
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg border bg-background px-3',
          size === 'large' && 'py-2',
        )}
      >
        <span className="text-muted-foreground text-sm font-medium" aria-hidden>
          $
        </span>
        <Input
          id={inputId}
          type="number"
          min={min}
          step={step}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            'font-mono border-0 bg-transparent shadow-none focus-visible:ring-0',
            size === 'large' ? 'text-lg font-semibold' : '',
          )}
        />
        <span className="text-muted-foreground text-xs">{currencySuffix}</span>
      </div>
    </div>
  )
}
