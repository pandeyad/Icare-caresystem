/**
 * Token storage abstraction.
 *
 * Production target: httpOnly secure cookie set by IdSvc — the UI never reads
 * it, the browser attaches it automatically because gatewayClient sets
 * `withCredentials: true`.
 *
 * Prototype fallback: localStorage under `icare.auth.token`. This file is the
 * single seam where we'll swap storage strategies later.
 */
const TOKEN_KEY = "icare.auth.token"

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null
  try {
    return window.localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export const setAuthToken = (token: string | null): void => {
  if (typeof window === "undefined") return
  try {
    if (token === null) window.localStorage.removeItem(TOKEN_KEY)
    else window.localStorage.setItem(TOKEN_KEY, token)
  } catch {
    /* storage denied — ignore */
  }
}
