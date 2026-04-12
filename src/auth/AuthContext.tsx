import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { CurrentUser, HomeRef } from "./user"
import type { Permission } from "./roles"
import { identityService } from "../services"

/**
 * AuthContext — consumes IdSvc (via `identityService`) and the gateway-
 * proxied AcsSvc permissions endpoint (`identityService.getMyPermissions`).
 *
 * Lifecycle:
 *   1. On mount we bootstrap in parallel: `getMe()` + `getMyPermissions()`.
 *   2. While loading, the provider renders `null` so downstream pages never
 *      see a half-built context (e.g. MyDashboard dereferences `user.name`
 *      synchronously).
 *   3. After success, `user`/`permissions`/`scope` are populated and
 *      `status === "authenticated"`. Pages render from there.
 *
 * The UI never references "roles" — `can(perm)` checks a flat permissions
 * array returned by the backend (AcsSvc, via the gateway). In the mock
 * phase, `switchDemoUser` swaps the identity so reviewers can experience
 * different access levels.
 */

type AuthStatus = "loading" | "authenticated" | "error"

type AuthState = {
  user: CurrentUser
  permissions: Permission[]
  scope: { homes: string[] }
  /** Currently selected home context (for filtering). Null = all homes. */
  activeHome: HomeRef | null
  setActiveHome: (home: HomeRef | null) => void
  status: AuthStatus
  /** Dev-only: swap to a different mock user to preview their access. */
  switchDemoUser: (userId: string) => Promise<void>
  can: (perm: Permission) => boolean
  logout: () => Promise<void>
}

const AuthCtx = createContext<AuthState | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [scope, setScope] = useState<{ homes: string[] }>({ homes: [] })
  const [activeHome, setActiveHome] = useState<HomeRef | null>(null)
  const [status, setStatus] = useState<AuthStatus>("loading")

  const bootstrap = useCallback(async () => {
    setStatus("loading")
    try {
      const [me, perms] = await Promise.all([
        identityService.getMe(),
        identityService.getMyPermissions(),
      ])
      setUser(me)
      setPermissions(perms.permissions)
      setScope(perms.scope)
      setStatus("authenticated")
    } catch {
      // Errors are already reported to the toast bridge by gatewayClient —
      // we just flip into "error" so the splash stays visible.
      setStatus("error")
    }
  }, [])

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  const switchDemoUser = useCallback(async (userId: string) => {
    // Persists the chosen mock user so a page refresh keeps the same
    // identity. `identityService.switchDemoUser` reads this key so the
    // two stores stay in sync.
    try {
      window.localStorage.setItem("icare.user", userId)
    } catch {
      /* storage denied — ignore */
    }
    const { user: u, permissions: p } =
      await identityService.switchDemoUser(userId)
    setUser(u)
    setPermissions(p)
    setScope({ homes: u.homes.map((h) => h.name) })
    setActiveHome(null)
  }, [])

  const logout = useCallback(async () => {
    await identityService.logout()
    setUser(null)
    setPermissions([])
    setScope({ homes: [] })
    setStatus("error")
  }, [])

  const can = useCallback(
    (perm: Permission) => permissions.includes(perm),
    [permissions]
  )

  const value = useMemo<AuthState | null>(() => {
    if (status !== "authenticated" || !user) return null
    return {
      user,
      permissions,
      scope,
      activeHome,
      setActiveHome,
      status,
      switchDemoUser,
      can,
      logout,
    }
  }, [user, permissions, scope, activeHome, status, switchDemoUser, can, logout])

  // Render-gate: until the initial bootstrap resolves we show a small
  // splash. Every downstream page assumes `useAuth().user` is non-null
  // (e.g. `user.name.split(" ")[0]` in AppShell's topbar).
  if (!value) {
    return (
      <div
        role="status"
        aria-busy="true"
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          font: "500 14px/1.2 system-ui, sans-serif",
          color: "var(--text-muted, #666)",
          background: "var(--bg, #fff)",
        }}
      >
        {status === "error" ? "Sign-in required" : "Loading…"}
      </div>
    )
  }

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export const useAuth = (): AuthState => {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}
