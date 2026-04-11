import React, { useMemo, useState } from "react"
import "./AuditLog.scss"
import { STRINGS } from "../../i18n/strings"
import { AUDIT_EVENTS, type AuditChannel, type AuditSeverity } from "./audit.mock"

/**
 * MGT-004 — audit entries list.
 *
 * Append-only log. Filter by channel, click any row to see full event (out
 * of scope for the prototype — we render a locked card hint instead).
 */

type Filter = "all" | AuditChannel

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

const channelLabel: Record<AuditChannel, string> = {
  auth: "Auth",
  rota: "Rota",
  care: "Care",
  permissions: "Permissions",
}

const AuditLog: React.FC = () => {
  const [filter, setFilter] = useState<Filter>("all")

  const filtered = useMemo(() => {
    if (filter === "all") return AUDIT_EVENTS
    return AUDIT_EVENTS.filter((e) => e.channel === filter)
  }, [filter])

  return (
    <div className="audit">
      <header className="audit__hero">
        <div>
          <div className="eyebrow">Management · MGT-004</div>
          <h1>{STRINGS.audit.title}</h1>
          <p>{STRINGS.audit.subtitle}</p>
        </div>
        <button type="button" className="btn btn--secondary">
          <span aria-hidden="true">↓</span> {STRINGS.audit.export}
        </button>
      </header>

      <div className="audit__filters card card--padded">
        {([
          { k: "all", label: STRINGS.audit.filter.all },
          { k: "auth", label: STRINGS.audit.filter.auth },
          { k: "rota", label: STRINGS.audit.filter.rota },
          { k: "care", label: STRINGS.audit.filter.care },
          { k: "permissions", label: STRINGS.audit.filter.permissions },
        ] as const).map((f) => (
          <button
            key={f.k}
            type="button"
            className={`audit__chip ${filter === f.k ? "audit__chip--active" : ""}`}
            onClick={() => setFilter(f.k)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="card audit__table-wrap">
        {filtered.length === 0 ? (
          <div className="audit__empty">
            <h3>{STRINGS.audit.empty.title}</h3>
            <p>{STRINGS.audit.empty.body}</p>
          </div>
        ) : (
          <ol className="audit__list">
            {filtered.map((e) => (
              <li key={e.id} className="audit__row">
                <div className="audit__when">
                  <time>{e.at}</time>
                </div>
                <div className={`audit__severity audit__severity--${e.severity}`} aria-label={severityLabel[e.severity]} />
                <div className="audit__body">
                  <div className="audit__title">
                    <strong>{e.actor}</strong>
                    <span className="audit__actor-role">· {e.actorRole}</span>
                    <span className="audit__action"> — {e.action}</span>
                  </div>
                  <div className="audit__target">{e.target}</div>
                </div>
                <div className="audit__meta">
                  <span className={`badge badge--${severityTone[e.severity]}`}>
                    {severityLabel[e.severity]}
                  </span>
                  <span className="badge badge--neutral">{channelLabel[e.channel]}</span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

export default AuditLog
