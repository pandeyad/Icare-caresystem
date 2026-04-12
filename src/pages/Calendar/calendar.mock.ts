/**
 * Page-level UI constants for the Calendar view. The `CalendarEvent` /
 * `EventKind` types and the `CALENDAR_EVENTS` seed feed now live in
 * `src/services/calendar/calendar.mock.ts` — the services tree owns
 * all domain data. This file is kept only for labels that are specific
 * to the Calendar page UI.
 */
import type { EventKind } from "../../services/calendar/calendar.types"

export const KIND_LABEL: Record<EventKind, string> = {
  shift: "Shift",
  swap: "Swap",
  overtime: "Overtime",
  leave: "Leave",
  unfilled: "Unfilled",
}
