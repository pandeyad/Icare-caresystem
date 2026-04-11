import React, { useMemo, useState } from "react"
import "./ApprovalsInbox.scss"
import { STRINGS } from "../../i18n/strings"
import { APPROVAL_ITEMS, type ApprovalTab } from "./approvals.mock"

/**
 * MGT-006 — Approvals inbox.
 *
 * Reusable pattern per design-system doc: same card shape for swaps,
 * leave, and permission grants. Action row is verb + noun per
 * microcopy spec ("Approve" / "Decline" / "See details").
 */

const ApprovalsInbox: React.FC = () => {
  const [tab, setTab] = useState<ApprovalTab>("swaps")

  const items = useMemo(
    () => APPROVAL_ITEMS.filter((i) => i.tab === tab),
    [tab]
  )

  const counts = useMemo(() => {
    return {
      swaps: APPROVAL_ITEMS.filter((i) => i.tab === "swaps").length,
      leave: APPROVAL_ITEMS.filter((i) => i.tab === "leave").length,
      permissions: APPROVAL_ITEMS.filter((i) => i.tab === "permissions").length,
    }
  }, [])

  return (
    <div className="approvals">
      <header className="approvals__hero">
        <div>
          <div className="eyebrow">Management · MGT-006</div>
          <h1>{STRINGS.approvals.title}</h1>
          <p>{STRINGS.approvals.subtitle}</p>
        </div>
      </header>

      <div className="approvals__tabs" role="tablist" aria-label="Approval type">
        {([
          { k: "swaps", label: STRINGS.approvals.tab.swaps, n: counts.swaps },
          { k: "leave", label: STRINGS.approvals.tab.leave, n: counts.leave },
          { k: "permissions", label: STRINGS.approvals.tab.permissions, n: counts.permissions },
        ] as const).map((t) => (
          <button
            key={t.k}
            type="button"
            role="tab"
            aria-selected={tab === t.k}
            className={`approvals__tab ${tab === t.k ? "approvals__tab--active" : ""}`}
            onClick={() => setTab(t.k)}
          >
            <span>{t.label}</span>
            <span className="approvals__count">{t.n}</span>
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="card card--padded approvals__empty">
          <div className="approvals__empty-icon" aria-hidden="true">✓</div>
          <h3>{STRINGS.approvals.empty.title}</h3>
          <p>{STRINGS.approvals.empty.body}</p>
        </div>
      ) : (
        <div className="approvals__grid">
          {items.map((i) => (
            <article key={i.id} className={`approval-card approval-card--${i.tone}`}>
              <header className="approval-card__head">
                <div className="approval-card__avatar" aria-hidden="true">
                  {i.requester.initials}
                </div>
                <div>
                  <div className="approval-card__requester">{i.requester.name}</div>
                  <div className="approval-card__role">{i.requester.role}</div>
                </div>
                <div className="approval-card__when">{i.when}</div>
              </header>

              <div className="approval-card__body">
                <h3 className="approval-card__title">{i.title}</h3>
                <p className="approval-card__reason">"{i.reason}"</p>
                <ul className="approval-card__meta">
                  {i.meta.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>

              <footer className="approval-card__actions">
                <button type="button" className="btn btn--ghost">
                  {STRINGS.approvals.action.details}
                </button>
                <div className="approval-card__actions-right">
                  <button type="button" className="btn btn--secondary">
                    {STRINGS.approvals.action.decline}
                  </button>
                  <button type="button" className="btn btn--primary">
                    {STRINGS.approvals.action.approve}
                  </button>
                </div>
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default ApprovalsInbox
