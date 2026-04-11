import React, { useEffect, useState } from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"
import "./AppShell.scss"
import { NAV_SECTIONS, type NavItem } from "./nav.config"
import { STRINGS } from "../i18n/strings"

/**
 * AppShell — the global chrome shared by every authenticated route.
 *
 * Layout:
 *   ┌──────────────────────────────────────────────┐
 *   │  Topbar (search · theme · user)              │
 *   ├──────────┬───────────────────────────────────┤
 *   │ Sidebar  │         Page outlet               │
 *   │ sections │         (child routes)            │
 *   │          │                                   │
 *   └──────────┴───────────────────────────────────┘
 *
 * Mobile: sidebar collapses to a bottom tab-ish drawer via a hamburger;
 * we don't build the full drawer in the prototype, but we hide the sidebar
 * below the tablet breakpoint so the content is still usable.
 */

type Theme = "light" | "dark"
const THEME_KEY = "icare.theme"

const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light"
    const stored = window.localStorage.getItem(THEME_KEY) as Theme | null
    if (stored === "light" || stored === "dark") return stored
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  })

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    try {
      window.localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* storage denied (incognito) — silently skip */
    }
  }, [theme])

  return {
    theme,
    toggle: () => setTheme((t) => (t === "light" ? "dark" : "light")),
  }
}

const isItemActive = (item: NavItem, pathname: string) => {
  if (item.matchPrefix) return pathname.startsWith(item.matchPrefix)
  if (item.to === "/") return pathname === "/"
  return pathname === item.to || pathname.startsWith(item.to + "/")
}

const AppShell: React.FC = () => {
  const { theme, toggle } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  // Close mobile drawer after navigation.
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <div className="app-shell">
      <aside
        className={`app-sidebar ${mobileOpen ? "app-sidebar--open" : ""}`}
        aria-label="Primary navigation"
      >
        <div className="app-sidebar__brand">
          <div className="app-sidebar__logo" aria-hidden="true">
            I
          </div>
          <div className="app-sidebar__brand-text">
            <div className="app-sidebar__name">{STRINGS.app.name}</div>
            <div className="app-sidebar__tenant">Willow House</div>
          </div>
        </div>

        <nav className="app-sidebar__nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.id} className="app-sidebar__section">
              <div className="app-sidebar__section-label">{section.label}</div>
              <ul className="app-sidebar__list">
                {section.items.map((item) => {
                  const active = isItemActive(item, location.pathname)
                  return (
                    <li key={item.id}>
                      <NavLink
                        to={item.to}
                        className={`app-sidebar__item ${
                          active ? "app-sidebar__item--active" : ""
                        }`}
                        end={item.to === "/"}
                      >
                        <span
                          className="app-sidebar__item-icon"
                          aria-hidden="true"
                        >
                          {item.icon}
                        </span>
                        <span className="app-sidebar__item-label">
                          {item.label}
                        </span>
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="app-sidebar__footer">
          <div className="app-sidebar__user">
            <div className="app-sidebar__avatar" aria-hidden="true">
              PA
            </div>
            <div className="app-sidebar__user-meta">
              <div className="app-sidebar__user-name">Priya Amari</div>
              <div className="app-sidebar__user-role">Home Manager</div>
            </div>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          className="app-shell__scrim"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="app-shell__main">
        <header className="app-topbar">
          <button
            type="button"
            className="app-topbar__hamburger"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span aria-hidden="true">☰</span>
          </button>

          <label className="app-topbar__search">
            <span className="sr-only">Search</span>
            <span className="app-topbar__search-icon" aria-hidden="true">
              ⌕
            </span>
            <input
              type="search"
              placeholder={STRINGS.nav.search}
              aria-label={STRINGS.nav.search}
            />
            <kbd className="app-topbar__kbd">⌘K</kbd>
          </label>

          <div className="app-topbar__right">
            <button
              type="button"
              className="app-topbar__icon-btn"
              aria-label={STRINGS.nav.themeToggle}
              onClick={toggle}
              title={STRINGS.nav.themeToggle}
            >
              <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
            </button>
            <div className="app-topbar__user-chip">
              <span className="app-topbar__user-dot" aria-hidden="true" />
              <span>Priya A.</span>
            </div>
          </div>
        </header>

        <main className="app-shell__content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppShell
