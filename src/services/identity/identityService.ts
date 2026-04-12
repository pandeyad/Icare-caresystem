/**
 * IdSvc client (plus the gateway-owned /api/me/permissions endpoint).
 *
 * In production:
 *   • login → POST /api/auth/login → IdSvc validates credentials and
 *     mints a JWT, which the gateway proxies back to the UI.
 *   • getMe → GET /api/me/profile → IdSvc returns the basic CurrentUser
 *     shape (no permissions).
 *   • getMyPermissions → GET /api/me/permissions → the GATEWAY fulfils
 *     this internally by calling AcsSvc (policy-based IAM). The UI never
 *     talks to AcsSvc directly.
 *
 * Mock phase: pretends a login always succeeds; the user id stored under
 * `icare.user` in localStorage is treated as the "logged-in" identity so
 * the dev-only user switcher in AppShell keeps working.
 */
import { mockResponse } from "../gateway/gatewayClient"
import {
  DEFAULT_MOCK_USER,
  findMockUser,
  MOCK_USERS,
} from "../../auth/user"
import type { CurrentUser } from "../../auth/user"
import type {
  LoginRequest,
  LoginResponse,
  MyPermissionsResponse,
  SwitchDemoUserResponse,
} from "./identity.types"

const USER_STORAGE_KEY = "icare.user"

const readStoredUser = () => {
  if (typeof window === "undefined") return DEFAULT_MOCK_USER
  const stored = window.localStorage.getItem(USER_STORAGE_KEY)
  if (!stored) return DEFAULT_MOCK_USER
  return findMockUser(stored) ?? DEFAULT_MOCK_USER
}

export const login = (req: LoginRequest): Promise<LoginResponse> => {
  // TODO(integration): POST /api/auth/login body=LoginRequest
  //   On success, call setAuthToken(response.token) before resolving.
  void req
  const mockUser = readStoredUser()
  return mockResponse<LoginResponse>({
    token: "mock.jwt.token",
    tokenType: "Bearer",
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    user: mockUser,
  })
}

export const logout = (): Promise<void> => {
  // TODO(integration): POST /api/auth/logout
  //   On success, call setAuthToken(null).
  return mockResponse<void>(undefined)
}

export const getMe = (): Promise<CurrentUser> => {
  // TODO(integration): GET /api/me/profile
  return mockResponse(readStoredUser() as CurrentUser)
}

export const getMyPermissions = (): Promise<MyPermissionsResponse> => {
  // TODO(integration): GET /api/me/permissions
  //   The gateway fulfils this internally by calling AcsSvc.getPermissions(userId).
  //   AcsSvc resolves the user's effective permissions from their assigned
  //   roles, custom policies, and time-scoped grants.
  const mockUser = readStoredUser()
  return mockResponse<MyPermissionsResponse>({
    permissions: mockUser.permissions,
    scope: { homes: mockUser.homes.map((h) => h.name) },
  })
}

/**
 * Dev-only: swap to a different mock user to preview their access level.
 * In production this endpoint does not exist — users sign out and sign
 * back in under a different identity.
 */
export const switchDemoUser = (
  userId: string
): Promise<SwitchDemoUserResponse> => {
  const mockUser = findMockUser(userId) ?? DEFAULT_MOCK_USER
  return mockResponse<SwitchDemoUserResponse>({
    user: mockUser,
    permissions: mockUser.permissions,
  })
}

/** Convenience: list available demo users for the sidebar switcher. */
export const listDemoUsers = () =>
  MOCK_USERS.map((u) => ({ id: u.id, name: u.name, roleLabel: u.roleLabel }))
