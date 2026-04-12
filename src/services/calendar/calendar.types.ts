/**
 * CalendarSvc types. CalendarSvc is a *gateway aggregator*, not a
 * standalone backend service — `GET /api/calendar/events` fans out to
 * RotaSvc + RequestSvc + SwapSvc and merges the result into one
 * `CalendarEvent[]` feed. From the UI's perspective there is still
 * exactly one client.
 */
import type { CalendarEvent, EventKind } from "./calendar.mock"

export type CalendarScope = "personal" | "coverage"

export type ListCalendarEventsQuery = {
  /** yyyy-mm-dd */
  from: string
  to: string
  scope: CalendarScope
}

export type CreateCoverRequest = {
  vacancyId: string
  /** yyyy-mm-ddTHH:mm local-clock — UI convention */
  start: string
  end: string
  reason: "sickness" | "no_show" | "holiday" | "training"
}

export type { CalendarEvent, EventKind }
