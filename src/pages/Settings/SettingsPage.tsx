import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import "./SettingsPage.scss"
import PageHeader from "../../components/PageHeader/PageHeader"
import { useToast } from "../../components/Toast/ToastProvider"
import { PageTransition, FadeIn, standardTransition } from "../../components/Motion"

/**
 * Settings page — user preferences for visual appearance and accessibility.
 *
 * Tabs:
 *   • Theme  — light/dark mode + colour accessibility presets
 *
 * All preferences are persisted to localStorage and applied via `data-*`
 * attributes on <html>, so CSS custom properties switch instantly.
 */

type ThemeMode = "light" | "dark" | "system"
type ColorMode = "default" | "high-contrast" | "protanopia" | "deuteranopia" | "tritanopia"

const THEME_KEY = "icare.theme"
const COLOR_KEY = "icare.colorMode"

const THEME_OPTIONS: { value: ThemeMode; label: string; description: string }[] = [
  { value: "system", label: "System", description: "Follow your OS setting" },
  { value: "light", label: "Light", description: "White background, dark text" },
  { value: "dark", label: "Dark", description: "Dark background, light text" },
]

const COLOR_OPTIONS: { value: ColorMode; label: string; description: string }[] = [
  { value: "default", label: "Default", description: "Standard colour palette" },
  { value: "high-contrast", label: "High contrast", description: "Stronger borders and bolder colours for low vision" },
  { value: "protanopia", label: "Protanopia-safe", description: "Avoids red/green confusion (red-blind)" },
  { value: "deuteranopia", label: "Deuteranopia-safe", description: "Avoids red/green confusion (green-blind)" },
  { value: "tritanopia", label: "Tritanopia-safe", description: "Avoids blue/yellow confusion (blue-blind)" },
]

const resolveTheme = (mode: ThemeMode): "light" | "dark" => {
  if (mode === "system") {
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }
  return mode
}

const SettingsPage: React.FC = () => {
  const toast = useToast()

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const stored = window.localStorage.getItem(THEME_KEY)
    if (stored === "light" || stored === "dark" || stored === "system") return stored
    return "system"
  })

  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    const stored = window.localStorage.getItem(COLOR_KEY) as ColorMode | null
    if (stored && COLOR_OPTIONS.some((o) => o.value === stored)) return stored
    return "default"
  })

  // Apply theme to <html>
  useEffect(() => {
    const resolved = resolveTheme(themeMode)
    document.documentElement.setAttribute("data-theme", resolved)
    try { window.localStorage.setItem(THEME_KEY, themeMode) } catch { /* */ }
  }, [themeMode])

  // Apply colour mode to <html>
  useEffect(() => {
    if (colorMode === "default") {
      document.documentElement.removeAttribute("data-color-mode")
    } else {
      document.documentElement.setAttribute("data-color-mode", colorMode)
    }
    try { window.localStorage.setItem(COLOR_KEY, colorMode) } catch { /* */ }
  }, [colorMode])

  // Listen for OS theme changes when "system" is selected
  useEffect(() => {
    if (themeMode !== "system") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      document.documentElement.setAttribute("data-theme", mq.matches ? "dark" : "light")
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [themeMode])

  const handleTheme = (mode: ThemeMode) => {
    setThemeMode(mode)
    toast.success(`Theme set to ${mode}`)
  }

  const handleColor = (mode: ColorMode) => {
    setColorMode(mode)
    toast.success(`Colour mode set to ${COLOR_OPTIONS.find((o) => o.value === mode)?.label}`)
  }

  return (
    <PageTransition>
    <div className="settings">
      <PageHeader
        title="Settings"
        subtitle="Customise your visual preferences and accessibility options."
      />

      <FadeIn>
      <section className="settings__section card card--padded">
        <h2 className="settings__section-title">Appearance</h2>
        <p className="settings__section-desc">
          Choose a base theme. <em>System</em> follows your operating system's light/dark preference.
        </p>
        <motion.div className="settings__options" initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.04 } } }}>
          {THEME_OPTIONS.map((opt) => (
            <motion.button
              type="button"
              key={opt.value}
              className={`settings__option ${themeMode === opt.value ? "is-active" : ""}`}
              onClick={() => handleTheme(opt.value)}
              aria-pressed={themeMode === opt.value}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={standardTransition}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className="settings__option-label">{opt.label}</span>
              <span className="settings__option-desc">{opt.description}</span>
            </motion.button>
          ))}
        </motion.div>
      </section>
      </FadeIn>

      <FadeIn delay={0.08}>
      <section className="settings__section card card--padded">
        <h2 className="settings__section-title">Colour accessibility</h2>
        <p className="settings__section-desc">
          If you have difficulty distinguishing certain colours, pick a palette
          that adjusts status indicators, severity badges, and chart colours to
          be easier to read.
        </p>
        <motion.div className="settings__options" initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.04 } } }}>
          {COLOR_OPTIONS.map((opt) => (
            <motion.button
              type="button"
              key={opt.value}
              className={`settings__option ${colorMode === opt.value ? "is-active" : ""}`}
              onClick={() => handleColor(opt.value)}
              aria-pressed={colorMode === opt.value}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={standardTransition}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className="settings__option-label">{opt.label}</span>
              <span className="settings__option-desc">{opt.description}</span>
            </motion.button>
          ))}
        </motion.div>
      </section>
      </FadeIn>
    </div>
    </PageTransition>
  )
}

export default SettingsPage
