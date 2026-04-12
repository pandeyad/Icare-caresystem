/**
 * MeSvc mock — source of truth for the signed-in user's data types
 * (`MyShift`, `MyRequest`, `WorkingSnapshot`) and the `MY_SNAPSHOT`,
 * `MY_UPCOMING_SHIFTS`, `MY_REQUESTS` seed rows. Lives inside the
 * services tree so `meService` and `swapService` can own their
 * dependencies without reaching back into `src/pages/Me/*`.
 *
 * There is no matching `pages/Me/me.mock.ts` shim — that file was
 * deleted during the boundary cleanup because nothing on the page side
 * imported from it directly (MyDashboard imports types via the service
 * types barrel and data via `meService`).
 */
export type MyShift = {
  id: string
  date: string // ISO date
  start: string // HH:mm
  end: string
  role: string
  ward: string
  status: "planned" | "in_progress" | "completed"
}

export type MyRequest = {
  id: string
  kind: "swap" | "overtime" | "leave"
  summary: string
  when: string
  /**
   * Lifecycle of the request:
   *   • pending — manager hasn't decided yet (overtime / leave)
   *   • awaiting_teammate — swap-only, sat with the counterparty
   *   • approved / declined — terminal
   *
   * Swaps NEVER use `pending` because managers don't approve them — the
   * counterparty does. Manager dashboards see swaps as visibility-only.
   */
  status: "pending" | "awaiting_teammate" | "approved" | "declined"
  /** Counterparty for swaps — the teammate who must accept. */
  teammate?: string
}

export type WorkingSnapshot = {
  rangeLabel: string
  required: number // hours required in range
  worked: number // hours already worked
  overtime: number // hours
  leaveTaken: number // days in range
  leaveBalance: number // days remaining
}

export const MY_SNAPSHOT: WorkingSnapshot = {
  rangeLabel: "This week · 7 – 13 Apr",
  required: 40,
  worked: 24,
  overtime: 2,
  leaveTaken: 0,
  leaveBalance: 12,
}

export const MY_UPCOMING_SHIFTS: MyShift[] = [
  {
    id: "s1",
    date: "2026-04-11",
    start: "07:00",
    end: "15:00",
    role: "HCA",
    ward: "Willow Ward · West wing",
    status: "in_progress",
  },
  {
    id: "s2",
    date: "2026-04-12",
    start: "07:00",
    end: "15:00",
    role: "HCA",
    ward: "Willow Ward · West wing",
    status: "planned",
  },
  {
    id: "s3",
    date: "2026-04-13",
    start: "14:00",
    end: "22:00",
    role: "HCA",
    ward: "Willow Ward · East wing",
    status: "planned",
  },
  {
    id: "s4",
    date: "2026-04-15",
    start: "07:00",
    end: "15:00",
    role: "HCA",
    ward: "Oakmoor House",
    status: "planned",
  },
]

export const MY_REQUESTS: MyRequest[] = [
  {
    id: "r1",
    kind: "swap",
    summary: "Swap Mon 07:00 → Wed 07:00",
    when: "Sent 2 h ago",
    status: "awaiting_teammate",
    teammate: "Daniel T.",
  },
  {
    id: "r2",
    kind: "overtime",
    summary: "Pick up extra 4 h on Apr 14",
    when: "Submitted yesterday",
    status: "approved",
  },
  {
    id: "r3",
    kind: "leave",
    summary: "Annual leave · 5 – 9 May",
    when: "Submitted last week",
    status: "pending",
  },
]
