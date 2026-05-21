import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAppTranslation as useTranslation } from '@/hooks/useAppTranslation'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()
  const isDark = theme === 'dark'

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? t('layout.themeLight') : t('layout.themeDark')}
    >
      <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </Button>
  )
}
