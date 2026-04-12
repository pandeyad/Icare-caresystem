import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import type { Permission } from "./roles"

/**
 * Route-level RBAC guard.
 *
 * Wraps a route element and redirects to `/me` (the safe personal view) if
 * the current user does not have at least ONE of the listed permissions.
 *
 * Keep the guard list short per route — the same permission flags that
 * drive nav.config.ts visibility should drive this too so there is a single
 * source of truth.
 */

type Props = {
  /** User needs AT LEAST ONE of these. Empty → always allowed. */
  anyOf: Permission[]
  children: React.ReactNode
}

const RequirePermission: React.FC<Props> = ({ anyOf, children }) => {
  const { can } = useAuth()
  const allowed = anyOf.length === 0 || anyOf.some((p) => can(p))
  if (!allowed) return <Navigate to="/me" replace />
  return <>{children}</>
}

export default RequirePermission
