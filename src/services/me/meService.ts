/**
 * MeSvc client — the signed-in user's own working hours, upcoming
 * shifts, and own requests. Leave + overtime + withdrawal writes go
 * here. Swap creation lives on `swapService` (peer-to-peer, not
 * approval-based) — MeSvc only aggregates the swap into the request
 * list for display.
 */
import { mockResponse } from "../gateway/gatewayClient"
import { MY_SNAPSHOT, MY_UPCOMING_SHIFTS, MY_REQUESTS } from "./me.mock"
import type {
  CreateLeaveRequest,
  CreateOvertimeRequest,
  MyRequest,
  MyShift,
  RequestsFilter,
  SnapshotRange,
  WorkingSnapshot,
} from "./me.types"

export const getSnapshot = (
  range: SnapshotRange = "week"
): Promise<WorkingSnapshot> => {
  // TODO(integration): GET /api/me/snapshot?range=${range}
  void range
  return mockResponse(MY_SNAPSHOT)
}

export const getUpcomingShifts = (limit = 4): Promise<MyShift[]> => {
  // TODO(integration): GET /api/me/upcoming-shifts?limit=${limit}
  return mockResponse(MY_UPCOMING_SHIFTS.slice(0, limit))
}

export const getMyRequests = (
  status: RequestsFilter = "open"
): Promise<MyRequest[]> => {
  // TODO(integration): GET /api/me/requests?status=${status}
  const data =
    status === "all"
      ? MY_REQUESTS
      : MY_REQUESTS.filter(
          (r) => r.status === "pending" || r.status === "awaiting_teammate"
        )
  return mockResponse(data)
}

export const submitLeave = (req: CreateLeaveRequest): Promise<MyRequest> => {
  // TODO(integration): POST /api/me/leave body=CreateLeaveRequest
  const created: MyRequest = {
    id: `r-${Date.now()}`,
    kind: "leave",
    summary: req.note
      ? `${req.kind} · ${req.startDate} – ${req.endDate} — ${req.note}`
      : `${req.kind} · ${req.startDate} – ${req.endDate}`,
    when: "Submitted just now",
    status: "pending",
  }
  return mockResponse(created)
}

export const submitOvertime = (
  req: CreateOvertimeRequest
): Promise<MyRequest> => {
  // TODO(integration): POST /api/me/overtime body=CreateOvertimeRequest
  const created: MyRequest = {
    id: `r-${Date.now()}`,
    kind: "overtime",
    summary: `+overtime ${req.start} → ${req.end}${
      req.note ? ` — ${req.note}` : ""
    }`,
    when: "Submitted just now",
    status: "pending",
  }
  return mockResponse(created)
}

export const withdrawRequest = (id: string): Promise<void> => {
  // TODO(integration): DELETE /api/me/requests/${id}
  void id
  return mockResponse<void>(undefined)
}
