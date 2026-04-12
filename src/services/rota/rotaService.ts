/**
 * RotaSvc client — staff scheduling with arbitrary time granularity.
 *
 * The weekly timeline is the primary view: individual staff entries
 * positioned by exact start/end times. Team rosters provide the
 * team-level grouping and member lists.
 */
import { mockResponse } from "../gateway/gatewayClient"
import { generateWeek, MOCK_TEAM_ROSTERS } from "./rota.mock"
import type { ListWeekQuery, RotaWeek, TeamRoster } from "./rota.types"

export const listWeek = (query: ListWeekQuery): Promise<RotaWeek> => {
  // TODO(integration): GET /api/rota/week?homeId=${query.homeId}&weekStart=${query.weekStart}
  return mockResponse(generateWeek(query.weekStart))
}

export const listTeamRosters = (
  homeId?: string
): Promise<TeamRoster[]> => {
  // TODO(integration): GET /api/rota/rosters?homeId=${homeId}
  void homeId
  return mockResponse(MOCK_TEAM_ROSTERS)
}
