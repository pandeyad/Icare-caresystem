/**
 * TeamSvc types. The override convenience endpoint is just a wrapper
 * around RotaSvc's override-draft creation, pre-filling `original` from
 * the team-member id.
 */
import type { TeamMember, TeamStat } from "./team.mock"
import type { OverrideDraft } from "../manage/manage.mock"

export type ListTeamMembersQuery = {
  /** One specific home — used by managers with `team.view.all`. */
  home?: string
  /** Multiple homes (e.g. `user.homes`) — used for home-wide scope. */
  homes?: string[]
  /**
   * Single team identifier. Used when the signed-in user only has the
   * base `team.view` permission — they should see their own teammates
   * and nobody else.
   */
  teamId?: string
  status?: TeamMember["status"]
}

export type CreateTeamOverrideRequest = {
  memberId: string
  /** yyyy-mm-ddTHH:mm local-clock */
  start: string
  end: string
  reason: OverrideDraft["reason"]
  note?: string
}

export type TeamStatsRange = "week"

export type { TeamMember, TeamStat, OverrideDraft }
