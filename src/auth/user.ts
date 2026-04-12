import type { Permission } from "./roles"

/**
 * The signed-in user. Matches the claims payload the backend will emit on
 * login — everything a page needs to render before any service call.
 *
 * The user's *permissions* come separately via `GET /api/me/permissions`
 * and live in `AuthContext.permissions`, NOT on this object. `CurrentUser`
 * is pure identity + scope metadata; it carries no authorisation state so
 * the auth model stays flat and testable.
 *
 * `teamId` identifies the working team the user belongs to. For a
 * professional it's the cluster of teammates they'd swap shifts with; for
 * a team lead it's the team they run; for a home manager it's the primary
 * team at their home (managers see across teams via `team.view.all`, so
 * the team_id is only used for "default to my team" landings). Admins
 * don't belong to any single team — their `teamId` is the empty string,
 * and scoping helpers treat them as "see everything in scope".
 */
export type OrgRef = {
  id: string
  name: string
}

export type HomeRef = {
  id: string
  name: string
}

export type CurrentUser = {
  id: string
  name: string
  initials: string
  /** Display-only label from the backend (e.g. "HCA · 3 years"). */
  roleLabel: string
  /** Organisation the user belongs to. */
  org: OrgRef
  /** Primary home for default context. */
  primaryHome: HomeRef
  /** All homes the user has permission to act inside. */
  homes: HomeRef[]
  /** Working-team identifier (see TeamMember.teamId in team.mock). */
  teamId: string
}

/**
 * Mock-phase user bank.
 *
 * Each entry pairs identity with the *flat* permission set the backend
 * (AcsSvc) would resolve for that user. The `permissions` field lives
 * here — not on `CurrentUser` — because `identityService.getMyPermissions`
 * reads it separately (mirroring the real two-call bootstrap).
 *
 * Users can be switched at runtime via the dev-only user switcher in the
 * sidebar so the prototype can demonstrate RBAC without a real backend.
 *
 * Team assignments mirror `TEAM_MEMBERS` in `services/team/team.mock.ts`:
 *   • team-willow-day — Amira (HCA), Daniel (lead), Tomás, Priya (mgr),
 *     Hiroki, Beatrice.
 *   • team-oakmoor — Clara, Finn.
 * Admins are not part of any single team and carry an empty teamId.
 */
export type MockUser = CurrentUser & { permissions: Permission[] }

/** Shared org — all demo users belong to the same organisation. */
const BRIGHTPATH_ORG: OrgRef = { id: "org-bp", name: "BrightPath Care" }

const HOME_WILLOW: HomeRef = { id: "home-willow", name: "Willow House" }
const HOME_OAKMOOR: HomeRef = { id: "home-oakmoor", name: "Oakmoor House" }
const HOME_ROWAN: HomeRef = { id: "home-rowan", name: "Rowan Lodge" }

export const MOCK_USERS: MockUser[] = [
  {
    id: "u-pro",
    name: "Amira O.",
    initials: "AO",
    roleLabel: "HCA · 3 years",
    org: BRIGHTPATH_ORG,
    primaryHome: HOME_WILLOW,
    homes: [HOME_WILLOW],
    teamId: "team-willow-day",
    permissions: [
      "me.view",
      "leave.request",
      "swap.request",
      "team.view",
      "audit.view",
    ],
  },
  {
    id: "u-tl",
    name: "Daniel T.",
    initials: "DT",
    roleLabel: "Team Lead · Willow Ward",
    org: BRIGHTPATH_ORG,
    primaryHome: HOME_WILLOW,
    homes: [HOME_WILLOW],
    teamId: "team-willow-day",
    permissions: [
      "me.view",
      "leave.request",
      "swap.request",
      "team.view",
      "team.view.all",
      "team.analytics.view",
      "approvals.review",
      "audit.view",
    ],
  },
  {
    id: "u-hm",
    name: "Priya Amari",
    initials: "PA",
    roleLabel: "Home Manager",
    org: BRIGHTPATH_ORG,
    primaryHome: HOME_WILLOW,
    homes: [HOME_WILLOW, HOME_OAKMOOR, HOME_ROWAN],
    teamId: "team-willow-day",
    permissions: [
      "me.view",
      "leave.request",
      "swap.request",
      "team.view",
      "team.view.all",
      "team.overrideAssign",
      "team.analytics.view",
      "home.view",
      "home.analytics.view",
      "people.view",
      "people.edit",
      "manage.view",
      "approvals.review",
      "permissions.grant",
      "rota.publish",
      "audit.view",
      "audit.view.all",
      "audit.export",
    ],
  },
  {
    id: "u-ad",
    name: "Sam Ortega",
    initials: "SO",
    roleLabel: "Regional Admin",
    org: BRIGHTPATH_ORG,
    primaryHome: HOME_WILLOW,
    homes: [HOME_WILLOW, HOME_OAKMOOR, HOME_ROWAN],
    teamId: "",
    permissions: [
      "me.view",
      "leave.request",
      "swap.request",
      "team.view",
      "team.view.all",
      "team.overrideAssign",
      "team.analytics.view",
      "home.view",
      "home.analytics.view",
      "people.view",
      "people.edit",
      "manage.view",
      "approvals.review",
      "permissions.grant",
      "rota.publish",
      "audit.view",
      "audit.view.all",
      "audit.export",
    ],
  },
]

/** Lookup helper for mock-phase identity resolution. */
export const DEFAULT_MOCK_USER = MOCK_USERS[2] // Priya — home manager
export const findMockUser = (id: string): MockUser | undefined =>
  MOCK_USERS.find((u) => u.id === id)
