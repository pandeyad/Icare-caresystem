import React, { useEffect, useMemo, useState } from "react"
import "./AuditLog.scss"
import PageHeader from "../../components/PageHeader/PageHeader"
import HomeFilter from "../../components/HomeFilter/HomeFilter"
import { useAuth } from "../../auth/AuthContext"
import { useToast } from "../../components/Toast/ToastProvider"
import {
  DOMAIN_LABEL,
  DOMAIN_ORDER,
} from "./audit.mock"
import { auditService, teamService } from "../../services"
import type {
  AuditDomain,
  AuditEvent,
  AuditSeverity,
} from "../../services/audit/audit.types"

/**
 * AUDIT-001 — Audit log.
 *
 * Domain tabs replace the old hierarchy/timeline toggle:
 *   • All       — every event sorted newest-first (the default)
 *   • Home      — home-level events only
 *   • Team      — team-level events only
 *   • People    — people/comments events only
 *   • Professional — professional action events only
 *
 * The active tab determines the `domain` sent to the service query so
 * pagination stays consistent with the visible list.
 *
 * Permission gates
 *   audit.view       — lands here (everyone; scoped to same team below)
 *   audit.view.all   — widens scope from same-team to the whole home scope
 *   audit.export     — reveals the export action in the header
 */

const severityTone: Record<AuditSeverity, "neutral" | "info" | "warning" | "danger"> = {
  info: "neutral",
  notice: "info",
  warning: "warning",
  critical: "danger",
}
const severityLabel: Record<AuditSeverity, string> = {
  info: "Info",
  notice: "Notice",
  warning: "Warning",
  critical: "Critical",
}

type DomainTab = "all" | AuditDomain

const TAB_LABELS: Record<DomainTab, string> = {
  all: "All",
  home: "Home",
  team: "Team",
  people: "People",
  professional: "Professional",
}

const TAB_ORDER: DomainTab[] = ["all", ...DOMAIN_ORDER]

const toEpoch = (at: string) => new Date(at.replace(" ", "T")).getTime()

const AuditLog: React.FC = () => {
  const { can, user, scope } = useAuth()
  const toast = useToast()
  const canExport = can("audit.export")
  const canSeeAll = can("audit.view.all")

  const [tab, setTab] = useState<DomainTab>("all")
  const changeTab = (t: DomainTab) => { setTab(t); setPage(1) }

  const [events, setEvents] = useState<AuditEvent[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 25

  useEffect(() => {
    let cancelled = false
    const domain = tab === "all" ? undefined : tab
    const load = async () => {
      if (canSeeAll) {
        const res = await auditService.listEvents({ homes: scope.homes, domain, page, pageSize })
        if (!cancelled) {
          setEvents(res.items)
          setTotal(res.total)
        }
        return
      }
      const members = await teamService.listMembers({ teamId: user.teamId })
      const actorIds = members.map((m) => m.id)
      if (actorIds.length === 0) {
        if (!cancelled) { setEvents([]); setTotal(0) }
        return
      }
      const res = await auditService.listEvents({ actorIds, domain, page, pageSize })
      if (!cancelled) {
        setEvents(res.items)
        setTotal(res.total)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [canSeeAll, scope.homes, user.teamId, page, tab])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const sorted = useMemo(() => {
    return [...events].sort((a, b) => toEpoch(b.at) - toEpoch(a.at))
  }, [events])

  const handleExport = () => {
    const stamp = new Date().toLocaleString("en-GB")
    void auditService
      .exportEvidencePack({
        filter: {
          homes: scope.homes,
          domain: tab === "all" ? undefined : tab,
        },
        label: `Audit export · ${stamp}`,
      })
      .then((job) => {
        toast.success(`Evidence pack queued`, {
          description: `${sorted.length} events · ${stamp} · job ${job.jobId}`,
        })
      })
  }

  return (
    <div className="audit">
      <PageHeader
        title="Audit"
        subtitle={
          canSeeAll
            ? "Every significant event across the homes you manage."
            : "Recent activity from your teammates."
        }
        actions={
          <>
            <HomeFilter />
            {canExport && (
              <button
                type="button"
                className="btn btn--secondary"
                onClick={handleExport}
              >
                Export evidence
              </button>
            )}
          </>
        }
      />

      {/* ── Domain tabs ────────────────────────────────── */}
      <div className="audit__tabs" role="tablist" aria-label="Audit domain">
        {TAB_ORDER.map((t) => (
          <button
            type="button"
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={`audit__tab ${tab === t ? "is-active" : ""} ${t !== "all" ? `audit__tab--${t}` : ""}`}
            onClick={() => changeTab(t)}
          >
            {TAB_LABELS[t]}
            {t === "all" && <span className="audit__tab-count">{total}</span>}
          </button>
        ))}
      </div>

      {/* ── Event list ─────────────────────────────────── */}
      {sorted.length === 0 ? (
        <div className="audit__empty card card--padded">
          <h3>No events yet</h3>
          <p>Nothing matches the current filter on your scope.</p>
        </div>
      ) : (
        <section className={`audit__domain ${tab !== "all" ? `audit__domain--${tab}` : ""}`}>
          <ol className="audit__events audit__events--flat card">
            {sorted.map((e) => (
              <AuditRow key={e.id} event={e} showDomain={tab === "all"} />
            ))}
          </ol>
        </section>
      )}

      {/* ── Pagination ─────────────────────────────────── */}
      {totalPages > 1 && (
        <nav className="audit__pagination" aria-label="Audit pages">
          <button
            type="button"
            className="btn btn--ghost"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Prev
          </button>
          <span className="audit__page-info">
            Page {page} of {totalPages}
            <span className="muted"> · {total} events</span>
          </span>
          <button
            type="button"
            className="btn btn--ghost"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  )
}

const AuditRow: React.FC<{ event: AuditEvent; showDomain?: boolean }> = ({
  event: e,
  showDomain,
}) => (
  <li className="audit__event">
    <span
      className={`audit__severity audit__severity--${e.severity}`}
      aria-label={severityLabel[e.severity]}
    />
    <div className="audit__when">
      <time>{e.at}</time>
    </div>
    <div className="audit__body">
      <div className="audit__title">
        <strong>{e.actor}</strong>
        <span className="audit__role">· {e.actorRole}</span>
        <span className="audit__action"> — {e.action}</span>
      </div>
      <div className="audit__target">{e.target}</div>
    </div>
    <div className="audit__meta">
      {showDomain && (
        <span className={`badge audit__domain-badge audit__domain-badge--${e.domain}`}>
          {DOMAIN_LABEL[e.domain]}
        </span>
      )}
      <span className={`badge badge--${severityTone[e.severity]}`}>
        {severityLabel[e.severity]}
      </span>
      {e.home && <span className="badge badge--neutral">{e.home}</span>}
    </div>
  </li>
)

export default AuditLog
