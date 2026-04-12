/**
 * Bridge between the (plain-module) gateway client and the (React-context)
 * toast provider.
 *
 * The gateway client is a regular module — it can't call `useToast()` —
 * but it still needs to surface 401/403/500 errors as a toast. We solve
 * this by letting `AppShell` register the live toast handle at runtime
 * via `registerToast`. The gateway's response interceptor then calls
 * `reportApiError(err)` and the user sees a friendly message without
 * each call site having to import `useToast`.
 *
 * If `registerToast` was never called (e.g. unit tests), `reportApiError`
 * is a silent no-op so nothing crashes.
 */
import type { ApiError } from "./gatewayClient"

/**
 * Structural shape of the toast handle we need. We don't import the
 * concrete `ToastContextValue` type from `ToastProvider.tsx` because that
 * type isn't exported, and adding the export would touch a file outside
 * the scaffolding scope. The structural type below matches the methods
 * `useToast()` returns.
 */
export type ToastHandle = {
  info: (
    title: string,
    opts?: { description?: string; duration?: number }
  ) => void
  success: (
    title: string,
    opts?: { description?: string; duration?: number }
  ) => void
  warning: (
    title: string,
    opts?: { description?: string; duration?: number }
  ) => void
  danger: (
    title: string,
    opts?: { description?: string; duration?: number }
  ) => void
}

let liveToast: ToastHandle | null = null

export const registerToast = (t: ToastHandle | null): void => {
  liveToast = t
}

export const reportApiError = (err: ApiError): void => {
  if (!liveToast) return
  const title =
    err.code === "UNAUTHORIZED"
      ? "Please sign in again"
      : err.code === "FORBIDDEN"
      ? "You don't have access to that"
      : err.code === "NOT_FOUND"
      ? "We couldn't find that"
      : "Something went wrong"
  liveToast.danger(title, {
    description:
      err.message + (err.requestId ? ` · ref ${err.requestId}` : ""),
  })
}
