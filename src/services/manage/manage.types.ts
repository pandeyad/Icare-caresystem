/**
 * Manage hub fan-in types. The Manage page renders four panels:
 * overrides, approvals (leave + overtime), swaps (visibility-only), and
 * permissions CRUD. On the backend these are spread across RotaSvc,
 * RequestSvc, SwapSvc, and the gateway's permission-grant proxy to
 * AcsSvc — but the UI sees a single client (`manageService`) so the
 * Manage page doesn't need to know about the boundary.
 */
import type {
  ApprovalItem,
  OverrideDraft,
  PermissionRow,
  SwapActivity,
} from "./manage.mock"
export type OverridesFilter = "draft" | "ready" | "all"

/**
 * Filter for `manageService.listApprovals`. Mirrors the query the real
 * `/api/requests` endpoint will accept. In the mock, `kind` actually
 * filters; `status` is treated as a no-op because the mock fixture
 * only models *pending* items.
 *
 * `requesterIds` scopes the result to a same-team view — pass the
 * TeamMember ids the caller is allowed to see when they only have the
 * base `team.view` permission.
 */
export type ListApprovalsQuery = {
  kind?: ApprovalItem["kind"]
  status?: "pending" | "approved" | "declined" | "all"
  requesterIds?: string[]
}

/**
 * Filter for `manageService.listSwaps`. The swap feed is visibility-only;
 * callers decide which slice to show. `memberIds` narrows to swaps where
 * either side is inside the team; the base `team.view` path always uses
 * this, while `team.view.all` callers omit it for a full feed.
 */
export type ListSwapsQuery = {
  memberIds?: string[]
}

export type CreateOverrideRequest = Omit<OverrideDraft, "id" | "status">

export type UpdateOverrideRequest = Partial<
  Pick<OverrideDraft, "start" | "end" | "replacement" | "reason">
>

export type ApproveRequestBody = { note?: string }
export type DeclineRequestBody = { note?: string }

export type UpdateAccessLevelRequest = {
  /** Access-level label as managed by AcsSvc (e.g. "team_lead"). */
  accessLevel: PermissionRow["accessLevel"]
}

export type InviteTeammateRequest = {
  email: string
  /** Initial access-level label assigned by AcsSvc on invite. */
  accessLevel: PermissionRow["accessLevel"]
}

export type InviteTeammateResponse = {
  inviteId: string
}

export type { ApprovalItem, OverrideDraft, PermissionRow, SwapActivity }
