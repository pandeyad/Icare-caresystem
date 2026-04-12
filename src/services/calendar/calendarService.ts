/**
 * CalendarSvc client. CalendarSvc is a gateway aggregator — when wired
 * up, the gateway fans out to RotaSvc + RequestSvc + SwapSvc, but the
 * UI's mental model is one client and one flat `CalendarEvent[]` feed.
 */
import { mockResponse } from "../gateway/gatewayClient"
import { CALENDAR_EVENTS } from "./calendar.mock"
import type {
  CalendarEvent,
  CreateCoverRequest,
  ListCalendarEventsQuery,
} from "./calendar.types"

export const listEvents = (
  q: ListCalendarEventsQuery
): Promise<CalendarEvent[]> => {
  // TODO(integration): GET /api/calendar/events?from=${q.from}&to=${q.to}&scope=${q.scope}
  //   The gateway aggregates RotaSvc.listShifts/listVacancies, RequestSvc.listInRange,
  //   and SwapSvc.listInRange into a single CalendarEvent[].
  const events =
    q.scope === "personal"
      ? CALENDAR_EVENTS.filter((e) => e.mine)
      : CALENDAR_EVENTS
  return mockResponse(events)
}

export const createCoverRequest = (
  req: CreateCoverRequest
): Promise<CalendarEvent> => {
  // TODO(integration): POST /api/calendar/cover-requests body=CreateCoverRequest
  //   The gateway translates this into a RotaSvc override draft tied to the vacancy.
  const event: CalendarEvent = {
    id: `cov-${Date.now()}`,
    date: req.start.slice(0, 10),
    kind: "overtime",
    title: "Cover request",
    start: req.start.slice(11, 16),
    end: req.end.slice(11, 16),
    status: "pending",
  }
  return mockResponse(event)
}
