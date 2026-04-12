/**
 * Permission catalogue for ICare.
 *
 * Every screen and action is gated by a *permission* string. The UI never
 * knows what "role" the signed-in user has — it only sees a flat
 * `Permission[]` array returned by the backend (`GET /api/me/permissions`).
 *
 * On the backend, an IAM-style Access Control Service (AcsSvc) resolves
 * the user's effective permissions from:
 *   1. Named roles (Professional, Team Lead, …) — baseline bundles.
 *   2. Custom policies — per-user or per-team overrides set by managers.
 *   3. Time-scoped grants — emergency access windows with audit notes.
 *
 * The UI's only job is to consume the flattened result and gate features.
 *
 * Scope rule
 * ──────────
 * Some permissions come in a pair — a base grant and a `*.all` widening.
 *   • `team.view`      → everyone (see the Team page; content scoped to own team)
 *   • `team.view.all`  → leads and up (see every team in the home scope)
 *   • `audit.view`     → everyone (see the Audit page; scoped to own team)
 *   • `audit.view.all` → managers and up (see every event in the home scope)
 * Pages ask for the base permission at the route gate and then check the
 * `.all` widening inside the page to decide which query scope to fetch.
 *
 * TODO(admin-panel): a future admin console will manage policies per user,
 * per team, and per home through AcsSvc. See `docs/admin-panel.md`.
 */

export type Permission =
  // Personal — everyone has these
  | "me.view"
  | "leave.request"
  | "swap.request"
  // Team scope
  | "team.view" //        see the Team page, scoped to own team
  | "team.view.all" //    see every team inside the home scope
  | "team.overrideAssign"
  | "team.analytics.view"
  // Home scope
  | "home.view"
  | "home.analytics.view"
  | "people.view"
  | "people.edit"
  // Management actions
  | "manage.view"
  | "approvals.review"
  | "permissions.grant"
  | "rota.publish"
  // Audit scope
  | "audit.view" //       see the Audit page, scoped to own team's events
  | "audit.view.all" //   see every event inside the home scope
  | "audit.export"
