import React, { useEffect, useState } from "react"
import "./MetricsView.scss"
import PageHeader from "../../components/PageHeader/PageHeader"
import HomeFilter from "../../components/HomeFilter/HomeFilter"
import { useAuth } from "../../auth/AuthContext"
import { dashboardService } from "../../services"
import type {
  DashboardSnapshot,
  DashboardScope,
} from "../../services/dashboard/dashboard.types"

/**
 * METRICS-001 — Aggregated KPIs and daily overview.
 *
 * Scope derives from the user's permissions:
 *   - professional  → team-level KPIs (4 cards)
 *   - home_manager  → home or multi-home KPIs (6 cards)
 *
 * The daily strip shows a 7-day rolling window of staff coverage,
 * incidents, and reviews — a quick pulse-check before diving into
 * individual pages.
 */

const MetricsView: React.FC = () => {
  const { scope, can, activeHome } = useAuth()
  const [snap, setSnap] = useState<DashboardSnapshot | null>(null)

  const dashScope: DashboardScope = can("home.view")
    ? scope.homes.length > 1 && !activeHome
      ? "multi_home"
      : "home"
    : "team"

  useEffect(() => {
    let cancelled = false
    void dashboardService
      .getSnapshot(dashScope, activeHome?.id)
      .then((d) => { if (!cancelled) setSnap(d) })
    return () => { cancelled = true }
  }, [dashScope, activeHome])

  return (
    <div className="metrics">
      <PageHeader
        eyebrow=""
        title="Metrics"
        subtitle="Aggregated KPIs, daily snapshots, and operational trends."
        actions={<HomeFilter />}
      />

      {snap && (
        <>
          {/* KPI cards */}
          <section className="metrics__kpis">
            {snap.kpis.map((kpi) => (
              <div
                key={kpi.id}
                className={`metrics__kpi card card--padded metrics__kpi--${kpi.tone}`}
              >
                <div className="metrics__kpi-value">
                  {kpi.id === "rota-coverage" ? `${kpi.value}%` : kpi.value}
                </div>
                <div className="metrics__kpi-label">{kpi.label}</div>
                {kpi.delta && (
                  <div className="metrics__kpi-delta">{kpi.delta}</div>
                )}
              </div>
            ))}
          </section>

          {/* Daily overview */}
          <section className="metrics__daily card card--padded">
            <header className="section-head">
              <h3 className="section-title">Daily overview</h3>
              <span className="eyebrow">
                {snap.scope === "multi_home"
                  ? `${snap.homeNames.length} homes`
                  : snap.homeNames[0]}
              </span>
            </header>
            <div className="metrics__daily-strip">
              {snap.dailyStrip.map((day) => {
                const isToday = day.date === new Date().toISOString().slice(0, 10)
                return (
                  <div
                    key={day.date}
                    className={`metrics__day ${isToday ? "metrics__day--today" : ""}`}
                  >
                    <div className="metrics__day-label">{day.dayLabel}</div>
                    <div className="metrics__day-date">{day.date.slice(8)}</div>
                    <div className="metrics__day-staff">
                      <span className="metrics__day-count">{day.staffOnShift}</span>
                      <span className="metrics__day-planned">/{day.staffPlanned}</span>
                    </div>
                    {day.incidentsLogged > 0 && (
                      <span className="metrics__day-badge metrics__day-badge--danger">
                        {day.incidentsLogged}
                      </span>
                    )}
                    {day.reviewsDue > 0 && (
                      <span className="metrics__day-badge metrics__day-badge--warning">
                        {day.reviewsDue}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* Trend placeholder */}
          <section className="metrics__trends card card--padded">
            <header className="section-head">
              <h3 className="section-title">Trends</h3>
              <span className="eyebrow">Last 30 days</span>
            </header>
            <div className="metrics__placeholder">
              Historical charts for coverage, incidents, and leave patterns will appear here once the analytics service is connected.
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default MetricsView
