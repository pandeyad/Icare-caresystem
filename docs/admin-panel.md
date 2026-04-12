# Admin Panel — Design Placeholder

> **Status:** TODO. Not implemented. This file exists so the TODO markers
> in `src/auth/roles.ts` and the nav/gate comments point somewhere.
>
> Track the implementation under the `feature/admin-panel` branch when work
> starts.

## Why

Today the RBAC model lives entirely in code:

- `src/auth/roles.ts` — the `ROLE_PERMISSIONS` table is the single source of
  truth for which permission bundles each of the four roles carries.
- `src/auth/user.ts` — `MOCK_USERS` assigns a role (and `teamId`) per demo
  user.
- `src/app/nav.config.ts` / `App.tsx` — nav items and route gates hard-code
  which permissions are required to see each page.

Changing any of those requires a code edit + redeploy. That's fine for the
prototype but will not scale once real customers onboard: admins will need
to tailor permission sets per user, invite new teammates with custom scope,
move people between teams, and revoke access without waiting for a
release.

## What the Admin Panel needs to do

1. **Permission management**
   - Browse the `Permission` catalogue from `roles.ts` with
     human-readable descriptions.
   - Create / edit permission bundles (roles) beyond the four built-ins.
   - Assign and revoke permissions per user, layered on top of their
     role's baseline.
   - Version the permission table so a grant/revoke is fully auditable
     (AuditSvc already receives `permissions.grant` / `permissions.revoke`
     events — the admin panel just needs to emit them consistently).

2. **User management**
   - Invite new teammates (email + role + team + home scope).
   - Edit team membership (`teamId` on `CurrentUser` — used by the Team
     and Audit same-team scope filters).
   - Suspend / reactivate users without deleting history.

3. **Content & feature access**
   - Toggle which features are available per home (e.g. hide Swaps for a
     home that doesn't run them).
   - Override any route gate from the UI for emergency access windows,
     with a mandatory audit note.

4. **Template bundles**
   - Ship opinionated role templates (HCA, Nurse, Senior, Team Lead,
     Home Manager, Regional Admin) so a new home can onboard in minutes.

## Where it will live

- **Route:** `/manage/admin` — lives under ManageHub as a fifth panel,
  gated by a new `admin.panel` permission that only admins carry.
- **Service:** `src/services/admin/adminService.ts` (future) — backed by
  AcsSvc on the backend (`/internal/*` endpoints already exist — see the
  service catalog in the root plan doc).

## Out of scope for this doc

- **Auth provider integration.** SSO/SAML/SCIM are a separate workstream.
- **Multi-tenant isolation.** Each tenant's permission table is scoped by
  the gateway via JWT claims; the admin panel just edits its own slice.
- **Billing / entitlements.** Feature gating by plan is handled by a
  different service and is orthogonal to permission management.

## Related code

- `src/auth/roles.ts` — the permission catalogue and role matrix.
- `src/auth/user.ts` — `CurrentUser` and the mock user bank.
- `src/services/team/team.mock.ts` — `TeamMember.teamId` for same-team
  scope.
- `src/pages/Manage/ManageHub.tsx` — where the new `Admin` tab will slot
  in.
