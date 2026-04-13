import React, { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import "./TeamOverview.scss"
import PageHeader from "../../components/PageHeader/PageHeader"
import HomeFilter from "../../components/HomeFilter/HomeFilter"
import { PageTransition, FadeIn, StaggerList, StaggerItem, statContainerVariants, statCardVariants, standardTransition } from "../../components/Motion"
import Modal from "../../components/Modal/Modal"
import DateTimeField from "../../components/DateTimeField/DateTimeField"
import { useAuth } from "../../auth/AuthContext"
import { useToast } from "../../components/Toast/ToastProvider"
import { formatLocalDateTime, formatLocalRange } from "../../lib/format"
import { manageService, teamService } from "../../services"
import type {
  OverrideDraft,
  TeamMember,
  TeamStat,
} from "../../services/team/team.types"
import type {
  ApprovalItem,
  SwapActivity,
} from "../../services/manage/manage.types"

/**
 * TEAM-001 — Team overview.
 *
 * The Team page is visible to *every* role; what changes is scope.
 *
 *   • Base `team.view` (everyone) — the signed-in user sees their own
 *     teammates (same `teamId`) and nothing else. Action buttons are
 *     hidden because they don't carry the actioning permissions.
 *   • `team.view.all` (team_lead, home_manager, admin) — widens to the
 *     whole home scope (`user.homes`). Leads keep the review buttons
 *     via `approvals.review`; managers additionally get override.
 *
 * Sections:
 *   1. Stats row            — 4 coverage KPIs (hidden when `team.analytics.view`
 *                             is absent — professionals see the roster only)
 *   2. Filter bar           — search + home + status chips
 *   3. Team list            — row per member with hours bar, pending pills,
 *                             and action buttons wired to modals / toasts
 *   4. Team activity        — peer leave / overtime / swap feed so the
 *                             whole team can see what's in flight without
 *                             actioning anything (actions stay gated).
 *
 * Permission gates (checked via useAuth().can):
 *   team.view           — shows the page at all (already filtered at nav)
 *   team.view.all       — widens scope from own team → home scope
 *   team.analytics.view — reveals the KPI stats row
 *   team.overrideAssign — reveals "Override" action at row + page level
 *   approvals.review    — reveals "Review" on pending swaps/leaves and
 *                         the Approve/Decline buttons in the activity feed
 */

const STATUS_LABEL: Record<TeamMember["status"], string> = {
  on_shift: "On shift",
  off: "Off duty",
  on_leave: "On leave",
}

const STATUS_TONE: Record<TeamMember["status"], "success" | "neutral" | "info"> = {
  on_shift: "success",
  off: "neutral",
  on_leave: "info",
}

type HomeFilter = "all" | string
type StatusFilter = "all" | TeamMember["status"]

const TeamOverview: React.FC = () => {
  const { user, scope, can } = useAuth()
  const toast = useToast()
  const canOverride = can("team.overrideAssign")
  const canReview = can("approvals.review")
  const canSeeAnalytics = can("team.analytics.view")
  const canSeeAll = can("team.view.all")

  const [query, setQuery] = useState("")
  const [homeFilter, setHomeFilter] = useState<HomeFilter>("all")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  const [overrideMember, setOverrideMember] = useState<TeamMember | null>(null)
  const [reviewMember, setReviewMember] = useState<TeamMember | null>(null)
  // Track members whose pending items have been resolved, so the UI
  // reflects the action.
  const [resolved, setResolved] = useState<Record<string, boolean>>({})

  // TeamSvc data: members scoped by permission (own team for base
  // `team.view`, whole-home scope for `team.view.all`) plus KPI stats.
  // Refetched only on mount; filters are applied locally.
  const [members, setMembers] = useState<TeamMember[]>([])
  const [stats, setStats] = useState<TeamStat[]>([])
  const [peerApprovals, setPeerApprovals] = useState<ApprovalItem[]>([])
  const [peerSwaps, setPeerSwaps] = useState<SwapActivity[]>([])
  useEffect(() => {
    let cancelled = false
    // Decide query scope once, up front: leads/managers widen to the
    // whole home scope; everyone else sees just their team.
    const memberQuery = canSeeAll
      ? { homes: scope.homes }
      : { teamId: user.teamId }
    void Promise.all([
      teamService.listMembers(memberQuery),
      teamService.getStats("week"),
    ]).then(([m, s]) => {
      if (cancelled) return
      setMembers(m)
      setStats(s)
      // Scope peer activity to whichever members we just fetched — the
      // service layer handles the filter, so the page just forwards the
      // ids to both manageService feeds.
      const memberIds = m.map((row) => row.id)
      if (memberIds.length === 0) {
        setPeerApprovals([])
        setPeerSwaps([])
        return
      }
      void Promise.all([
        manageService.listApprovals({ requesterIds: memberIds }),
        manageService.listSwaps({ memberIds }),
      ]).then(([apps, swaps]) => {
        if (cancelled) return
        setPeerApprovals(apps)
        setPeerSwaps(swaps)
      })
    })
    return () => {
      cancelled = true
    }
  }, [canSeeAll, scope.homes, user.teamId])

  const homes = useMemo(
    () => Array.from(new Set(members.map((m) => m.home))).sort(),
    [members]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return members.filter((m) => {
      if (homeFilter !== "all" && m.home !== homeFilter) return false
      if (statusFilter !== "all" && m.status !== statusFilter) return false
      if (!q) return true
      return (
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.home.toLowerCase().includes(q)
      )
    })
  }, [members, query, homeFilter, statusFilter])

  const pctFor = (m: TeamMember) =>
    Math.min(
      Math.round((m.hoursThisWeek / Math.max(m.hoursRequired, 1)) * 100),
      100
    )

  const handleOverrideSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!overrideMember) return
    const form = new FormData(e.currentTarget)
    const start = String(form.get("start") || "")
    const end = String(form.get("end") || "")
    const reasonRaw = String(form.get("reason") || "sickness")
    const note = String(form.get("note") || "")
    if (!start || !end) {
      toast.danger("Pick start and end times", {
        description: "Override needs both a start and end datetime.",
      })
      return
    }
    // `reason` is typed as the `OverrideDraft["reason"]` discriminator —
    // the <select> options already line up with those values one-to-one.
    const reason = reasonRaw as OverrideDraft["reason"]
    void teamService
      .createOverride({
        memberId: overrideMember.id,
        start,
        end,
        reason,
        note: note || undefined,
      })
      .then(() => {
        toast.success("Override drafted", {
          description: `${overrideMember.name} · ${formatLocalRange(start, end)} — ${reason}`,
        })
        setOverrideMember(null)
      })
  }

  // Default the override datetime fields to "tomorrow 14:00 → 22:00" so the
  // form has a sensible starting point for a typical afternoon shift.
  const defaultOverrideStart = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    d.setHours(14, 0, 0, 0)
    return toLocalIso(d)
  }, [])
  const defaultOverrideEnd = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    d.setHours(22, 0, 0, 0)
    return toLocalIso(d)
  }, [])

  const approveReview = (m: TeamMember) => {
    setResolved((r) => ({ ...r, [m.id]: true }))
    toast.success("Request approved", { description: `${m.name} · cleared` })
    setReviewMember(null)
  }
  const declineReview = (m: TeamMember) => {
    setResolved((r) => ({ ...r, [m.id]: true }))
    toast.warning("Request declined", {
      description: `${m.name} — they've been notified`,
    })
    setReviewMember(null)
  }

  return (
    <PageTransition><div className="team">
      <PageHeader
        eyebrow=""
        title="Team"
        subtitle={
          canSeeAll
            ? "Coverage, pending requests, and overrides for every professional in your home scope."
            : "Your teammates and the leave, overtime, and swaps they have in flight."
        }
        actions={
          <>
            <HomeFilter />
            {canOverride && (
              <button
                type="button"
                className="btn btn--primary"
                onClick={() =>
                  toast.info("Pick a team member", {
                    description:
                      "Use the per-row Override button to draft a reassignment.",
                  })
                }
              >
                New override
              </button>
            )}
          </>
        }
      />

      {/* ── Stats row ──────────────────────────────────── */}
      {canSeeAnalytics && (
        <motion.ul className="team__stats" variants={statContainerVariants} initial="initial" animate="animate">
          {stats.map((s) => (
            <motion.li key={s.label} className={`stat-card stat-card--${s.tone}`} variants={statCardVariants} transition={standardTransition}>
              <span className="stat-card__label">{s.label}</span>
              <span className="stat-card__value">{s.value}</span>
              {s.delta && <span className="stat-card__delta">{s.delta}</span>}
            </motion.li>
          ))}
        </motion.ul>
      )}

      {/* ── Filter bar ─────────────────────────────────── */}
      <div className="team__filters">
        <label className="team__search">
          <span className="sr-only">Search team</span>
          <input
            type="search"
            placeholder="Search by name, role, or home…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <div className="team__chips" role="group" aria-label="Home">
          <button
            type="button"
            className={`team__chip ${homeFilter === "all" ? "is-on" : ""}`}
            onClick={() => setHomeFilter("all")}
          >
            All homes
          </button>
          {homes.map((h) => (
            <button
              key={h}
              type="button"
              className={`team__chip ${homeFilter === h ? "is-on" : ""}`}
              onClick={() => setHomeFilter(h)}
            >
              {h}
            </button>
          ))}
        </div>

        <div className="team__chips" role="group" aria-label="Status">
          {(["all", "on_shift", "off", "on_leave"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              type="button"
              className={`team__chip ${statusFilter === s ? "is-on" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" ? "All statuses" : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Team list ──────────────────────────────────── */}
      <FadeIn delay={0.08}><section className="team__list card" aria-label="Team members">
        <header className="team__list-head">
          <div className="team__col team__col--who">Member</div>
          <div className="team__col team__col--home">Home</div>
          <div className="team__col team__col--hours">Hours this week</div>
          <div className="team__col team__col--pending">Pending</div>
          <div className="team__col team__col--status">Status</div>
          <div className="team__col team__col--actions" />
        </header>

        {filtered.length === 0 ? (
          <div className="team__empty">No team members match those filters.</div>
        ) : (
          <StaggerList className="team__rows">
            {filtered.map((m) => {
              const pct = pctFor(m)
              const pendingCleared = resolved[m.id]
              const hasPending =
                !pendingCleared && (m.leavesPending > 0 || m.swapsPending > 0)
              return (
                <StaggerItem key={m.id} className="team__row">
                  <div className="team__col team__col--who">
                    <span className="team__avatar" aria-hidden="true">
                      {m.initials}
                    </span>
                    <div className="team__who-text">
                      <div className="team__name">{m.name}</div>
                      <div className="team__role">{m.role}</div>
                    </div>
                  </div>

                  <div className="team__col team__col--home">{m.home}</div>

                  <div className="team__col team__col--hours">
                    <div className="team__hours-bar" aria-hidden="true">
                      <span
                        className={`team__hours-fill ${
                          pct >= 100
                            ? "is-full"
                            : pct >= 75
                            ? "is-high"
                            : "is-low"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="team__hours-text">
                      <strong>{m.hoursThisWeek}</strong>
                      <span className="muted"> / {m.hoursRequired} h</span>
                    </div>
                  </div>

                  <div className="team__col team__col--pending">
                    {!hasPending ? (
                      <span className="team__pending-none">
                        {pendingCleared ? "Cleared" : "—"}
                      </span>
                    ) : (
                      <div className="team__pending-pills">
                        {m.leavesPending > 0 && (
                          <span className="badge badge--info">
                            {m.leavesPending} leave
                          </span>
                        )}
                        {m.swapsPending > 0 && (
                          <span className="badge badge--warning">
                            {m.swapsPending} swap
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="team__col team__col--status">
                    <span className={`badge badge--${STATUS_TONE[m.status]}`}>
                      {STATUS_LABEL[m.status]}
                    </span>
                  </div>

                  <div className="team__col team__col--actions">
                    {canReview && hasPending && (
                      <button
                        type="button"
                        className="btn btn--ghost team__action"
                        onClick={() => setReviewMember(m)}
                      >
                        Review
                      </button>
                    )}
                    {canOverride && (
                      <button
                        type="button"
                        className="btn btn--secondary team__action"
                        onClick={() => setOverrideMember(m)}
                      >
                        Override
                      </button>
                    )}
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerList>
        )}
      </section></FadeIn>

      {/* ── Team activity ──────────────────────────────── */}
      <FadeIn delay={0.12}><section
        className="team__activity card"
        aria-label="Team activity in flight"
      >
        <header className="team__activity-head">
          <h2 className="team__activity-title">Team activity</h2>
          <p className="team__activity-sub">
            Leave, overtime, and swap requests from{" "}
            {canSeeAll ? "everyone in your home scope" : "your teammates"}.
            Managers and leads can action these from the Manage hub.
          </p>
        </header>

        {peerApprovals.length === 0 && peerSwaps.length === 0 ? (
          <div className="team__empty">
            No team leave, overtime, or swaps are in flight right now.
          </div>
        ) : (
          <StaggerList className="team__activity-list">
            {peerApprovals.map((a) => (
              <StaggerItem
                key={a.id}
                className={`team__activity-row team__activity-row--${a.kind}`}
              >
                <span className="team__avatar" aria-hidden="true">
                  {a.requester.initials}
                </span>
                <div className="team__activity-text">
                  <div className="team__activity-head-row">
                    <strong>{a.requester.name}</strong>
                    <span className="muted"> · {a.requester.role}</span>
                    <span
                      className={`badge badge--${
                        a.kind === "leave" ? "info" : "warning"
                      }`}
                    >
                      {a.kind === "leave" ? "Leave" : "Overtime"}
                    </span>
                  </div>
                  <div className="team__activity-summary">{a.summary}</div>
                  <div className="team__activity-when muted">{a.when}</div>
                </div>
              </StaggerItem>
            ))}

            {peerSwaps.map((s) => (
              <StaggerItem key={s.id} className="team__activity-row team__activity-row--swap">
                <span className="team__avatar" aria-hidden="true">
                  {s.requester.initials}
                </span>
                <div className="team__activity-text">
                  <div className="team__activity-head-row">
                    <strong>{s.requester.name}</strong>
                    <span className="muted"> ↔ {s.counterparty.name}</span>
                    <span className="badge badge--neutral">Swap</span>
                  </div>
                  <div className="team__activity-summary">
                    {formatLocalDateTime(s.fromStart)} →{" "}
                    {formatLocalDateTime(s.toStart)}
                  </div>
                  <div className="team__activity-when muted">
                    {s.when}
                    {s.status === "awaiting_teammate"
                      ? " · awaiting teammate"
                      : s.status === "accepted"
                      ? " · accepted"
                      : s.status === "declined"
                      ? " · declined"
                      : " · cancelled"}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerList>
        )}
      </section></FadeIn>

      {/* ── Override modal ─────────────────────────────── */}
      <Modal
        open={!!overrideMember}
        onClose={() => setOverrideMember(null)}
        eyebrow="OVERRIDE"
        title={
          overrideMember ? `Override — ${overrideMember.name}` : "Override assign"
        }
        description={
          overrideMember
            ? `${overrideMember.role} · ${overrideMember.home}`
            : undefined
        }
        size="md"
      >
        {overrideMember && (
          <form onSubmit={handleOverrideSubmit}>
            <div className="form-row">
              <DateTimeField
                name="start"
                label="Shift start"
                required
                defaultValue={defaultOverrideStart}
              />
              <DateTimeField
                name="end"
                label="Shift end"
                required
                defaultValue={defaultOverrideEnd}
              />
            </div>
            <label className="form-field">
              <span className="form-field__label">Replacement</span>
              <input
                name="replacement"
                className="form-field__control"
                placeholder="Who covers this shift"
              />
            </label>
            <label className="form-field">
              <span className="form-field__label">Reason</span>
              <select
                name="reason"
                className="form-field__control"
                defaultValue="sickness"
              >
                <option value="sickness">Sickness</option>
                <option value="no_show">No-show</option>
                <option value="holiday">Holiday cover</option>
                <option value="training">Training</option>
              </select>
            </label>
            <label className="form-field">
              <span className="form-field__label">Note (optional)</span>
              <textarea
                name="note"
                className="form-field__control"
                placeholder="What should the audit log say?"
              />
            </label>
            <div className="modal__form-actions">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setOverrideMember(null)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn--primary">
                Draft override
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ── Review modal ───────────────────────────────── */}
      <Modal
        open={!!reviewMember}
        onClose={() => setReviewMember(null)}
        eyebrow="REVIEW"
        title={reviewMember ? `${reviewMember.name} — pending items` : "Review"}
        description={reviewMember?.role}
        size="sm"
        footer={
          reviewMember && (
            <>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => declineReview(reviewMember)}
              >
                Decline all
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => approveReview(reviewMember)}
              >
                Approve all
              </button>
            </>
          )
        }
      >
        {reviewMember && (
          <ul className="team__review-list">
            {reviewMember.leavesPending > 0 && (
              <li className="team__review-item team__review-item--leave">
                <span className="eyebrow">Leave request</span>
                <span>{reviewMember.leavesPending} day(s) pending manager approval</span>
              </li>
            )}
            {reviewMember.swapsPending > 0 && (
              <li className="team__review-item team__review-item--swap">
                <span className="eyebrow">Swap request</span>
                <span>{reviewMember.swapsPending} swap(s) awaiting your decision</span>
              </li>
            )}
            {reviewMember.leavesPending === 0 && reviewMember.swapsPending === 0 && (
              <li className="team__review-item">
                <span>Nothing left to review.</span>
              </li>
            )}
          </ul>
        )}
      </Modal>
    </div></PageTransition>
  )
}

/** Convert a Date to a `yyyy-mm-ddTHH:mm` local-ISO string for datetime-local. */
function toLocalIso(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`
}

export default TeamOverview
