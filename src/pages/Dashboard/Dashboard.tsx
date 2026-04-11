import React from "react"
import { Link } from "react-router-dom"
import "./Dashboard.scss"
import { STRINGS } from "../../i18n/strings"
import {
  ACTIVITY_LOG,
  ATTENTION_ITEMS,
  DASHBOARD_STATS,
  SHORTCUTS,
  type AttentionItem,
  type DashboardStat,
} from "./dashboard.mock"

/**
 * MGT-001 — Home Manager dashboard.
 *
 * Primary user: Home Manager in an active home, glancing at this between
 * meetings. The screen is a triage tool, not an analytics surface — we only
 * show what might need a decision in the next hour.
 */

const trendGlyph: Record<DashboardStat["trend"], string> = {
  up: "▲",
  down: "▼",
  flat: "–",
}

const AttentionRow: React.FC<{ item: AttentionItem }> = ({ item }) => (
  <Link to={item.href} className={`attention-row attention-row--${item.tone}`}>
    <span className="attention-row__dot" aria-hidden="true" />
    <div className="attention-row__body">
      <div className="attention-row__title">{item.title}</div>
      <div className="attention-row__meta">{item.meta}</div>
    </div>
    <div className="attention-row__when">{item.when}</div>
    <span className="attention-row__chevron" aria-hidden="true">
      ›
    </span>
  </Link>
)

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <header className="dashboard__hero">
        <div>
          <div className="eyebrow">{new Date().toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}</div>
          <h1 className="dashboard__title">{STRINGS.dashboard.title}</h1>
          <p className="dashboard__subtitle">{STRINGS.dashboard.subtitle}</p>
        </div>
        <div className="dashboard__hero-actions">
          <Link to="/rota/manager" className="btn btn--primary">
            {STRINGS.dashboard.shortcut.publishRota}
          </Link>
          <Link to="/audit" className="btn btn--secondary">
            {STRINGS.dashboard.shortcut.runAudit}
          </Link>
        </div>
      </header>

      <section aria-label="Key indicators" className="dashboard__stats">
        {DASHBOARD_STATS.map((s) => (
          <article
            key={s.id}
            className={`stat-card stat-card--${s.tone}`}
            aria-label={`${s.label}: ${s.value}`}
          >
            <div className="stat-card__label">{s.label}</div>
            <div className="stat-card__value">{s.value}</div>
            <div className="stat-card__delta">
              <span
                className={`stat-card__trend stat-card__trend--${s.trend}`}
                aria-hidden="true"
              >
                {trendGlyph[s.trend]}
              </span>
              {s.delta}
            </div>
          </article>
        ))}
      </section>

      <div className="dashboard__grid">
        <section className="dashboard__panel" aria-label="Attention items">
          <header className="section-title section-title--with-eyebrow">
            <span>{STRINGS.dashboard.section.attention}</span>
            <Link to="/approvals" className="dashboard__panel-link">
              See all →
            </Link>
          </header>

          {ATTENTION_ITEMS.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__title">{STRINGS.dashboard.attentionEmpty}</div>
            </div>
          ) : (
            <div className="attention-list">
              {ATTENTION_ITEMS.map((i) => (
                <AttentionRow key={i.id} item={i} />
              ))}
            </div>
          )}
        </section>

        <aside className="dashboard__side">
          <section className="card card--padded">
            <h3 className="section-title">{STRINGS.dashboard.section.shortcuts}</h3>
            <div className="shortcut-list">
              {SHORTCUTS.map((s) => (
                <Link
                  key={s.id}
                  to={s.href}
                  className={`shortcut shortcut--${s.tone}`}
                >
                  <span className="shortcut__icon" aria-hidden="true">
                    {s.icon}
                  </span>
                  <span>{s.label}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="card card--padded">
            <h3 className="section-title">{STRINGS.dashboard.section.activity}</h3>
            <ol className="activity-list">
              {ACTIVITY_LOG.map((a) => (
                <li key={a.id} className="activity-row">
                  <span className="activity-row__when">{a.when}</span>
                  <span className="activity-row__body">
                    <strong>{a.actor}</strong> {a.action}{" "}
                    <span className="activity-row__target">{a.target}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default Dashboard
