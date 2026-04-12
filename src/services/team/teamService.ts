/**
 * TeamSvc client. The teammates the signed-in user can see, plus the
 * KPI tiles for the Team Overview page, plus a convenience override
 * endpoint that delegates to RotaSvc on the backend.
 */
import { mockResponse } from "../gateway/gatewayClient"
import { TEAM_MEMBERS, TEAM_STATS } from "./team.mock"
import type { OverrideDraft } from "../manage/manage.mock"
import type {
  CreateTeamOverrideRequest,
  ListTeamMembersQuery,
  TeamMember,
  TeamStat,
  TeamStatsRange,
} from "./team.types"

export const listMembers = (
  q: ListTeamMembersQuery = {}
): Promise<TeamMember[]> => {
  // TODO(integration): GET /api/team/members?teamId=${q.teamId}&home=${q.home}&homes=${q.homes}&status=${q.status}
  //   The real endpoint will resolve scope server-side: if the caller
  //   only has `team.view`, the gateway forces `teamId` to the caller's
  //   own team and rejects any other filter. `team.view.all` allows
  //   filtering by `home` or `homes` inside the caller's allowed scope.
  let list = TEAM_MEMBERS
  if (q.teamId) list = list.filter((m) => m.teamId === q.teamId)
  if (q.home) list = list.filter((m) => m.home === q.home)
  if (q.homes && q.homes.length > 0) {
    const set = new Set(q.homes)
    list = list.filter((m) => set.has(m.home))
  }
  if (q.status) list = list.filter((m) => m.status === q.status)
  return mockResponse(list)
}

export const getStats = (
  range: TeamStatsRange = "week"
): Promise<TeamStat[]> => {
  // TODO(integration): GET /api/team/stats?range=${range}
  void range
  return mockResponse(TEAM_STATS)
}

export const createOverride = (
  req: CreateTeamOverrideRequest
): Promise<OverrideDraft> => {
  // TODO(integration): POST /api/team/${req.memberId}/override body=CreateTeamOverrideRequest
  //   On the backend this becomes a RotaSvc override draft.
  const draft: OverrideDraft = {
    id: `ov-${Date.now()}`,
    start: req.start,
    end: req.end,
    home: "Willow House",
    slot: "Unassigned slot",
    original: req.memberId,
    replacement: "TBD",
    reason: req.reason,
    status: "draft",
  }
  return mockResponse(draft)
}
