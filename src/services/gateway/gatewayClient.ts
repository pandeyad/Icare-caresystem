/**
 * The single axios instance for the whole UI.
 *
 * Every service client imports `gatewayClient` (or, during the mock phase,
 * `mockResponse`) from this file. No other module is allowed to import
 * `axios` directly — that boundary is the entire point of this layer and
 * keeps the UI swappable between mock data and real backend without page
 * edits.
 *
 * What this file owns:
 *   • Axios instance with `baseURL`, `withCredentials`, default headers
 *   • Request interceptor that injects the JWT bearer from `tokenStore`
 *   • Response interceptor that normalises errors into `ApiError`
 *   • `mockResponse<T>(data)` — returns canned data with simulated latency
 *   • `mockReject(error?)` — same shape but rejects, for error-branch tests
 *
 * Production base URL is read from `VITE_GATEWAY_URL`; fallback is the
 * local prototype gateway at `http://localhost:8080`.
 */
import axios, { type AxiosError, type AxiosInstance } from "axios"
import { getAuthToken } from "./tokenStore"
import { reportApiError } from "./toastBridge"

const BASE_URL =
  (import.meta.env.VITE_GATEWAY_URL as string | undefined) ??
  "http://localhost:8080"

export const gatewayClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  withCredentials: true, // honors httpOnly cookie auth
  headers: { "Content-Type": "application/json" },
})

gatewayClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/**
 * Normalised error shape every service client rejects with. Pages and
 * service callers should treat anything coming out of a service as either
 * `T` (success) or `ApiError` (failure) — never raw axios errors.
 */
export type ApiError = {
  status: number
  /** Machine code, e.g. "UNAUTHORIZED", "FORBIDDEN", "NOT_FOUND". */
  code: string
  message: string
  details?: Record<string, unknown>
  /** Server-supplied trace id, for support tickets. */
  requestId?: string
}

const codeFromStatus = (status: number): string => {
  if (status === 401) return "UNAUTHORIZED"
  if (status === 403) return "FORBIDDEN"
  if (status === 404) return "NOT_FOUND"
  if (status >= 500) return "SERVER_ERROR"
  if (status >= 400) return "BAD_REQUEST"
  return "NETWORK_ERROR"
}

gatewayClient.interceptors.response.use(
  (r) => r,
  (err: AxiosError<{ code?: string; message?: string; details?: unknown }>) => {
    const status = err.response?.status ?? 0
    const payload = err.response?.data
    const requestIdRaw = err.response?.headers?.["x-request-id"]
    const apiError: ApiError = {
      status,
      code: payload?.code ?? codeFromStatus(status),
      message: payload?.message ?? err.message ?? "Unexpected error",
      details:
        payload?.details && typeof payload.details === "object"
          ? (payload.details as Record<string, unknown>)
          : undefined,
      requestId: typeof requestIdRaw === "string" ? requestIdRaw : undefined,
    }
    // Default UX: surface the error as a toast. Callers that want to render
    // an inline error themselves can pass `{ silent: true }` on the service
    // method (currently a no-op during the mock phase).
    reportApiError(apiError)
    return Promise.reject(apiError)
  }
)

/**
 * Tiny helper used by every service client while the backend is still
 * being built. Returns canned data after a short delay so the UI sees the
 * same "Promise arriving later" shape it will see with real HTTP.
 *
 * Service methods should also include a // TODO(integration) comment
 * showing the exact gateway call they will make when wired up.
 */
export const mockResponse = <T>(data: T, ms = 250): Promise<T> =>
  new Promise((resolve) => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug("[mockResponse]", { data, ms })
    }
    window.setTimeout(() => resolve(data), ms)
  })

/**
 * Fires a mock rejection so callers can test error branches locally
 * without touching the backend. Resolves to the same `ApiError` shape
 * as the response interceptor.
 */
export const mockReject = (
  error: Partial<ApiError> = {},
  ms = 250
): Promise<never> =>
  new Promise((_resolve, reject) => {
    const full: ApiError = {
      status: 500,
      code: "SERVER_ERROR",
      message: "Simulated error",
      ...error,
    }
    window.setTimeout(() => reject(full), ms)
  })

/**
 * Shared options accepted by service methods. Currently only `silent` is
 * meaningful — when true, the response interceptor's automatic toast is
 * suppressed and the caller handles the rejected promise itself. The
 * option is a no-op during the mock phase (because mockResponse never
 * rejects) but the type is exported now so service signatures don't
 * change later.
 */
export type ServiceCallOptions = {
  silent?: boolean
  signal?: AbortSignal
}
