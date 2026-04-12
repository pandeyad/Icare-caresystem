/**
 * IdSvc + gateway-proxied permission types.
 *
 * `CurrentUser` lives in `src/auth/user.ts` so it can be re-exported here
 * without redefining it. `Permission` is owned by AcsSvc in the eventual
 * backend, but for now sourced from `src/auth/roles.ts` (which the
 * prototype treats as the catalogue of permission *names*).
 */
import type { CurrentUser } from "../../auth/user"
import type { Permission } from "../../auth/roles"

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string // JWT
  tokenType: "Bearer"
  expiresAt: string // ISO timestamp
  user: CurrentUser
}

export type MyPermissionsResponse = {
  permissions: Permission[]
  /** Homes the signed-in user has any permission for. */
  scope: { homes: string[] }
}

export type SwitchDemoUserResponse = {
  user: CurrentUser
  permissions: Permission[]
}

// Re-exports so service consumers don't need to import from /auth.
export type { CurrentUser, Permission }
