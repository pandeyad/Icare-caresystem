import React, { useEffect, useState } from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"
import "./AppShell.scss"
import { NAV_GROUPS, type NavItem } from "./nav.config"
import { STRINGS } from "../i18n/strings"
import { useAuth } from "../auth/AuthContext"
import { MOCK_USERS } from "../auth/user"
import { Toaster, useToast } from "../components/Toast/ToastProvider"
import { registerToast } from "../services/gateway/toastBridge"
import UserMenu from "../components/UserMenu/UserMenu"
import { useTheme } from "../hooks/useTheme"
import { useCollapsed } from "../hooks/useCollapsed"
import { useNavGroupCollapse } from "../hooks/useNavGroupCollapse"

const isItemActive = (item: NavItem, pathname: string) => {
  if (item.matchPrefix) return pathname.startsWith(item.matchPrefix)
  if (item.to === "/") return pathname === "/"
  return pathname === item.to || pathname.startsWith(item.to + "/")
}

const AppShell: React.FC = () => {
  const { theme, mode, toggle } = useTheme()
  const [collapsed, toggleCollapsed] = useCollapsed()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isGroupCollapsed, toggleGroup] = useNavGroupCollapse()
  const location = useLocation()
  const { user, switchDemoUser } = useAuth()
  const toast = useToast()

  // Restore colour accessibility mode from localStorage on mount.
  useEffect(() => {
    const stored = window.localStorage.getItem("icare.colorMode")
    if (stored && stored !== "default") {
      document.documentElement.setAttribute("data-color-mode", stored)
    }
  }, [])

  // Close mobile drawer after navigation.
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Wire the toast handle into the gateway client so its response
  // interceptor can surface API errors as toasts (the gateway is a plain
  // module and cannot call `useToast()` itself).
  useEffect(() => {
    registerToast(toast)
    return () => registerToast(null)
  }, [toast])

  const sidebarClass = [
    "app-sidebar",
    mobileOpen && "app-sidebar--open",
    collapsed && "app-sidebar--collapsed",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className="app-shell">
      <aside className={sidebarClass} aria-label="Primary navigation">
        <button
          type="button"
          className="app-sidebar__toggle"
          aria-label={mobileOpen ? "Close menu" : collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => {
            if (mobileOpen) setMobileOpen(false)
            else toggleCollapsed()
          }}
        >
          <span aria-hidden="true">{mobileOpen ? "✕" : "☰"}</span>
        </button>

        <nav className="app-sidebar__nav">
          {NAV_GROUPS.map((group) => {
            const groupHidden = isGroupCollapsed(group.id)
            return (
              <div key={group.id} className="app-sidebar__group">
                <button
                  type="button"
                  className="app-sidebar__group-toggle"
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={!groupHidden}
                >
                  <span className="app-sidebar__group-label">{group.label}</span>
                  <span
                    className={`app-sidebar__group-chevron${groupHidden ? " app-sidebar__group-chevron--collapsed" : ""}`}
                    aria-hidden="true"
                  >
                    ‹
                  </span>
                </button>
                {!groupHidden && (
                  <ul className="app-sidebar__list">
                    {group.items.map((item) => {
                      const active = isItemActive(item, location.pathname)
                      return (
                        <li key={item.id}>
                          <NavLink
                            to={item.to}
                            className={`app-sidebar__item ${
                              active ? "app-sidebar__item--active" : ""
                            }`}
                            end={item.to === "/"}
                            title={collapsed ? item.label : item.hint}
                          >
                            <span className="app-sidebar__item-icon" aria-hidden="true">
                              {item.icon}
                            </span>
                            <span className="app-sidebar__item-label">{item.label}</span>
                          </NavLink>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}
        </nav>

        {import.meta.env.DEV && (
          <div className="app-sidebar__footer">
            <label className="app-sidebar__demo-switch">
              <span className="app-sidebar__demo-label">Demo user</span>
              <select
                value={user.id}
                onChange={(e) => void switchDemoUser(e.target.value)}
                aria-label="Switch demo user"
              >
                {MOCK_USERS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.roleLabel}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
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
          <div className="app-topbar__left">
            <button
              type="button"
              className="app-topbar__hamburger"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span aria-hidden="true">☰</span>
            </button>
            <div className="app-topbar__brand">
              <div className="app-topbar__brand-logo" aria-hidden="true">I</div>
              <div className="app-topbar__brand-text">
                <span className="app-topbar__brand-name">{STRINGS.app.name}</span>
                <span className="app-topbar__brand-home">
                  {user.org.name}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="app-topbar__search"
            aria-label={STRINGS.nav.search}
            onClick={() => toast.info("Search coming soon", { description: "Global search and command palette are not yet wired." })}
          >
            <span className="app-topbar__search-icon" aria-hidden="true">
              ⌕
            </span>
            <span className="app-topbar__search-placeholder">{STRINGS.nav.search}</span>
            <kbd className="app-topbar__kbd">⌘K</kbd>
          </button>

          <div className="app-topbar__right">
            <UserMenu theme={theme} themeMode={mode} onToggleTheme={toggle} />
          </div>
        </header>

        {/*
         * Keying the content area on `user.id` remounts the routed page
         * whenever the demo user switcher fires. That way every page's
         * `useEffect([])` data fetch runs again under the new identity —
         * critical once services start scoping responses by `user.homes`.
         * Without the key, stale data from the previous user would linger.
         */}
        <main
          className="app-shell__content"
          id="main-content"
          key={user.id}
        >
          <Outlet />
        </main>
      </div>

      <Toaster />
    </div>
  )
}

export default AppShell
