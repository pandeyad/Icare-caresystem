/**
 * MeSvc request/response types. The response shapes (MyShift, MyRequest,
 * WorkingSnapshot) and their seed rows live in `./me.mock` — the source
 * of truth inside the services tree.
 */
import type { MyShift, MyRequest, WorkingSnapshot } from "./me.mock"

export type LeaveKind = "annual" | "sick" | "unpaid" | "compassionate"

export type CreateLeaveRequest = {
  kind: LeaveKind
  /** yyyy-mm-dd */
  startDate: string
  endDate: string
  note?: string
}

export type CreateOvertimeRequest = {
  /** yyyy-mm-ddTHH:mm local-clock — UI convention. Backend converts to UTC. */
  start: string
  end: string
  note?: string
}

export type SnapshotRange = "week" | "month"
export type RequestsFilter = "open" | "all"

// Re-export the data shapes through the types module so service consumers
// can pull them from a single location.
export type { MyShift, MyRequest, WorkingSnapshot }
