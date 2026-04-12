/**
 * HomeSvc client. Homes the user has access to, capacity/coverage,
 * activity feed, residents-in-care, and home-level notes.
 *
 * Residents are exposed under `/api/homes/:id/residents`. The per-client
 * detail surface (profile / audit history / comments / service history)
 * lives in `clientsService` — it consumes the same `residents.mock`
 * rows as the starting catalogue.
 */
import { mockResponse } from "../gateway/gatewayClient"
import { HOMES, HOME_ACTIVITY } from "./homes.mock"
import { SUBJECTS } from "./residents.mock"
import type {
  CreateNoteRequest,
  Home,
  HomeActivity,
  HomeAnalytics,
  SubjectRow,
} from "./home.types"

export const listHomes = (): Promise<Home[]> => {
  // TODO(integration): GET /api/homes
  return mockResponse(HOMES)
}

export const getHome = (id: string): Promise<Home | null> => {
  // TODO(integration): GET /api/homes/${id}
  return mockResponse(HOMES.find((h) => h.id === id) ?? null)
}

export const getHomeActivity = (
  id: string,
  limit = 10
): Promise<HomeActivity[]> => {
  // TODO(integration): GET /api/homes/${id}/activity?limit=${limit}
  return mockResponse(
    HOME_ACTIVITY.filter((a) => a.homeId === id).slice(0, limit)
  )
}

export const getHomeAnalytics = (id: string): Promise<HomeAnalytics> => {
  // TODO(integration): GET /api/homes/${id}/analytics
  const home = HOMES.find((h) => h.id === id)
  return mockResponse<HomeAnalytics>({
    coverage: home?.coverage ?? 0,
    occupancy: home ? Math.round((home.residents / home.capacity) * 100) : 0,
    staffUtilisation: home
      ? Math.round((home.staffOnShift / home.staffRequired) * 100)
      : 0,
    incidentsOpen: 2,
  })
}

export const listResidents = (homeId: string): Promise<SubjectRow[]> => {
  // TODO(integration): GET /api/homes/${homeId}/residents
  const home = HOMES.find((h) => h.id === homeId)
  const name = home?.name ?? ""
  return mockResponse(
    SUBJECTS.filter(
      (s) => s.home === name || s.home === name.replace(" House", "")
    )
  )
}

export const addHomeNote = (
  id: string,
  req: CreateNoteRequest
): Promise<HomeActivity> => {
  // TODO(integration): POST /api/homes/${id}/notes body=CreateNoteRequest
  const activity: HomeActivity = {
    id: `ha-${Date.now()}`,
    homeId: id,
    when: "Just now",
    kind: "note",
    summary: req.text,
  }
  return mockResponse(activity)
}
