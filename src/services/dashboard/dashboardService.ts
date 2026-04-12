/**
 * DashboardSvc client — gateway aggregator over Rota, Request, Home, Audit.
 *
 * Returns a hierarchical snapshot scoped to the caller's access level:
 *   • Professionals see team-level KPIs.
 *   • Team leads / home managers see home-level.
 *   • Admins see multi-home (all homes in scope).
 */
import { mockResponse } from "../gateway/gatewayClient"
import {
  MOCK_SNAPSHOT_HOME,
  MOCK_SNAPSHOT_MULTI,
  MOCK_SNAPSHOT_TEAM,
} from "./dashboard.mock"
import type { DashboardSnapshot, DashboardScope } from "./dashboard.types"

export const getSnapshot = (
  scope: DashboardScope,
  _homeId?: string
): Promise<DashboardSnapshot> => {
  // TODO(integration): GET /api/dashboard/snapshot?scope=${scope}&home=${homeId}
  if (scope === "multi_home") return mockResponse(MOCK_SNAPSHOT_MULTI)
  if (scope === "home") return mockResponse(MOCK_SNAPSHOT_HOME)
  return mockResponse(MOCK_SNAPSHOT_TEAM)
}

export type { DashboardSnapshot, DashboardScope }
