"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Evitar hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-sidebar-accent/50">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-sidebar-accent animate-pulse" />
          <span className="text-sm font-medium text-sidebar-foreground">Tema</span>
        </div>
        <div className="w-10 h-6 rounded-full bg-sidebar-accent animate-pulse" />
      </div>
    )
  }

  // Usar resolvedTheme para obtener el tema real que se está aplicando
  const isDark = resolvedTheme === "dark"
  const isSystem = theme === "system"

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  const getThemeIcon = () => {
    if (isSystem) {
      return <Monitor className="w-5 h-5 text-sidebar-foreground" />
    }
    return isDark ? (
      <Moon className="w-5 h-5 text-sidebar-foreground" />
    ) : (
      <Sun className="w-5 h-5 text-sidebar-foreground" />
    )
  }

  const getThemeLabel = () => {
    if (isSystem) {
      return `Sistema (${isDark ? "Oscuro" : "Claro"})`
    }
    return isDark ? "Modo Oscuro" : "Modo Claro"
  }

  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-sidebar-accent/50 hover:bg-sidebar-accent transition-colors">
      <div className="flex items-center gap-3">
        {getThemeIcon()}
        <span className="text-sm font-medium text-sidebar-foreground">
          {getThemeLabel()}
        </span>
      </div>

      {/* Toggle Switch */}
      <button
        onClick={toggleTheme}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus:ring-offset-2 focus:ring-offset-sidebar ${
          isDark ? "bg-sidebar-primary" : "bg-gray-300"
        }`}
        role="switch"
        aria-checked={isDark}
        aria-label="Cambiar tema"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isDark ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
}
