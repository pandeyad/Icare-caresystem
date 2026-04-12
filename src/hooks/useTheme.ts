import { useEffect, useState } from "react"

export type ThemeMode = "light" | "dark" | "system"

const THEME_KEY = "icare.theme"

const resolveTheme = (mode: ThemeMode): "light" | "dark" => {
  if (mode === "system") {
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }
  return mode
}

export const useTheme = () => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light"
    const stored = window.localStorage.getItem(THEME_KEY) as ThemeMode | null
    if (stored === "light" || stored === "dark" || stored === "system") return stored
    return "system"
  })

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolveTheme(mode))
    try {
      window.localStorage.setItem(THEME_KEY, mode)
    } catch {
      /* storage denied (incognito) — silently skip */
    }
  }, [mode])

  // Cycle: system → light → dark → system
  const toggle = () =>
    setMode((m) => (m === "system" ? "light" : m === "light" ? "dark" : "system"))

  return { theme: resolveTheme(mode), mode, toggle }
}
