/**
 * Manage hub mock — source of truth for the four Manage panels
 * (overrides, approvals, swaps, permissions) and their types. Lives
 * inside the services tree so `manageService`, `teamService`, and
 * `swapService` can own their dependencies without reaching back into
 * `src/pages/Manage/*`.
 *
 * Notes
 * ─────
 * • Datetimes use the local-clock format `yyyy-mm-ddTHH:mm` (no zone). The
 *   real backend will store everything in UTC; the UI emits this format from
 *   <input type="datetime-local"> via DateTimeField, and we render it back
 *   with `Intl.DateTimeFormat`.
 * • Swap requests are NOT in MANAGE_APPROVALS — swaps go directly to the
 *   teammate, not the manager. They live in MANAGE_SWAPS as observe-only
 *   visibility for the manager. Approvals only contain leave + overtime.
 *
 * The `pages/Manage/manage.mock.ts` counterpart keeps only the UI
 * labels (`REASON_LABEL`, `ROLE_LABEL_MANAGE`, `SWAP_STATUS_LABEL`)
 * and imports types from `services/manage/manage.types`. Generic
 * datetime helpers (`formatLocalDateTime`, `formatLocalRange`) live
 * in `src/lib/format.ts`.
 */

export type OverrideDraft = {
  id: string
  /** ISO local datetime — start of the shift slot. */
  start: string
  /** ISO local datetime — end of the shift slot. */
  end: string
  home: string
  slot: string
  original: string
  replacement: string
  reason: "sickness" | "no_show" | "holiday" | "training"
  status: "draft" | "ready"
}

export const MANAGE_OVERRIDES: OverrideDraft[] = [
  {
    id: "ov-1",
    start: "2026-04-11T14:00",
    end: "2026-04-11T22:00",
    home: "Willow House",
    slot: "East wing · Senior HCA",
    original: "Hiroki T.",
    replacement: "Daniel T.",
    reason: "sickness",
    status: "ready",
  },
  {
    id: "ov-2",
    start: "2026-04-12T07:00",
    end: "2026-04-12T15:00",
    home: "Oakmoor House",
    slot: "Night cover · HCA",
    original: "—",
    replacement: "Clara F. (offered)",
    reason: "no_show",
    status: "draft",
  },
  {
    id: "ov-3",
    start: "2026-04-17T15:00",
    end: "2026-04-17T23:00",
    home: "Rowan Lodge",
    slot: "Nursing · RN",
    original: "Tomás R.",
    replacement: "Agency cover",
    reason: "training",
    status: "ready",
  },
]

/**
 * Approvals — leave + overtime only. Swap items are out, see MANAGE_SWAPS.
 * `requesterId` matches a TeamMember.id so the service layer can scope
 * approvals to a specific team when the viewer only has base visibility.
 */
export type ApprovalItem = {
  id: string
  kind: "leave" | "overtime"
  requesterId: string
  requester: { name: string; initials: string; role: string }
  summary: string
  when: string
  priority: "low" | "normal" | "high"
}

export const MANAGE_APPROVALS: ApprovalItem[] = [
  {
    id: "ap-2",
    kind: "leave",
    requesterId: "tm-4",
    requester: { name: "Tomás R.", initials: "TR", role: "Nurse · Willow" },
    summary: "Annual leave · 2–4 May (3 days)",
    when: "Submitted yesterday",
    priority: "normal",
  },
  {
    id: "ap-3",
    kind: "overtime",
    requesterId: "tm-3",
    requester: { name: "Clara F.", initials: "CF", role: "HCA · Oakmoor" },
    summary: "+4h cover · Wed 16 Apr",
    when: "Submitted this morning",
    priority: "high",
  },
  {
    id: "ap-5",
    kind: "leave",
    requesterId: "tm-8",
    requester: { name: "Beatrice M.", initials: "BM", role: "HCA · Rowan" },
    summary: "Sick leave · Mon 13 Apr",
    when: "Submitted 1h ago",
    priority: "high",
  },
]

/**
 * Swaps — visibility-only feed. Managers and teammates both consume this
 * through the Team Overview page. Decisions live with the teammate the
 * swap was requested *to* (counterparty); managers do NOT approve or
 * decline swaps — they only watch so they can intervene with an override
 * if a swap stalls.
 *
 * `requesterId` / `counterpartyId` match TeamMember.id so the service
 * layer can scope the feed to a single team when the viewer only has the
 * base `team.view` permission.
 */
export type SwapActivity = {
  id: string
  requesterId: string
  requester: { name: string; initials: string; role: string }
  counterpartyId: string
  counterparty: { name: string; initials: string }
  /** ISO local datetime — start of the original shift being given up. */
  fromStart: string
  /** ISO local datetime — start of the requested replacement shift. */
  toStart: string
  summary: string
  when: string
  status: "awaiting_teammate" | "accepted" | "declined" | "cancelled"
}

export const MANAGE_SWAPS: SwapActivity[] = [
  {
    id: "sw-1",
    requesterId: "tm-1",
    requester: { name: "Amira O.", initials: "AO", role: "HCA · Willow" },
    counterpartyId: "tm-2",
    counterparty: { name: "Daniel T.", initials: "DT" },
    fromStart: "2026-04-14T07:00",
    toStart: "2026-04-16T07:00",
    summary: "Mon 14 Apr 07:00 → Wed 16 Apr 07:00",
    when: "Sent 2h ago",
    status: "awaiting_teammate",
  },
  {
    id: "sw-2",
    requesterId: "tm-7",
    requester: { name: "Hiroki T.", initials: "HT", role: "HCA · Willow" },
    counterpartyId: "tm-8",
    counterparty: { name: "Beatrice M.", initials: "BM" },
    fromStart: "2026-04-17T14:00",
    toStart: "2026-04-19T14:00",
    summary: "Thu 17 Apr 14:00 → Sat 19 Apr 14:00",
    when: "Sent 3d ago",
    status: "awaiting_teammate",
  },
  {
    id: "sw-3",
    requesterId: "tm-3",
    requester: { name: "Clara F.", initials: "CF", role: "HCA · Oakmoor" },
    counterpartyId: "tm-6",
    counterparty: { name: "Finn O.", initials: "FO" },
    fromStart: "2026-04-09T07:00",
    toStart: "2026-04-11T07:00",
    summary: "Thu 9 Apr 07:00 → Sat 11 Apr 07:00",
    when: "Accepted yesterday",
    status: "accepted",
  },
]

export type PermissionRow = {
  id: string
  name: string
  initials: string
  /** Access-level label managed by AcsSvc — display-only on the UI. */
  accessLevel: "professional" | "team_lead" | "home_manager" | "admin"
  scope: string
  lastChanged: string
}

export const MANAGE_PERMISSIONS: PermissionRow[] = [
  {
    id: "pm-1",
    name: "Daniel T.",
    initials: "DT",
    accessLevel: "team_lead",
    scope: "Willow · West wing",
    lastChanged: "12 Mar 2026 by Priya A.",
  },
  {
    id: "pm-2",
    name: "Tomás R.",
    initials: "TR",
    accessLevel: "team_lead",
    scope: "Willow · Nursing",
    lastChanged: "28 Feb 2026 by Priya A.",
  },
  {
    id: "pm-3",
    name: "Priya A.",
    initials: "PA",
    accessLevel: "home_manager",
    scope: "Willow · All wards",
    lastChanged: "04 Jan 2026 by Sam O.",
  },
  {
    id: "pm-4",
    name: "Clara F.",
    initials: "CF",
    accessLevel: "professional",
    scope: "Oakmoor",
    lastChanged: "15 Feb 2026 by Sam O.",
  },
]
