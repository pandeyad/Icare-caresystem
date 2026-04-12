/**
 * HomeSvc types. `Home` + `HomeActivity` come from `./homes.mock`,
 * `SubjectRow` from `./residents.mock`. `HomeAnalytics` is a new
 * derived shape that the analytics endpoint will return — for the
 * mock phase it's computed from the `Home` row.
 */
import type { Home, HomeActivity } from "./homes.mock"
import type { SubjectRow } from "./residents.mock"

export type HomeAnalytics = {
  /** Coverage percent for the current week. */
  coverage: number
  /** Occupancy percent. */
  occupancy: number
  /** Staff utilisation percent. */
  staffUtilisation: number
  /** Open incident count. */
  incidentsOpen: number
}

export type CreateNoteRequest = {
  text: string
}

export type { Home, HomeActivity, SubjectRow }
