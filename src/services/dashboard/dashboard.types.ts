/**
 * DashboardSvc types — gateway aggregator that fans out to
 * RotaSvc, RequestSvc, HomeSvc, and AuditSvc.
 *
 * The snapshot is scoped hierarchically:
 *   • `team`       — single-team view (default for professionals)
 *   • `home`       — one home (team leads, home managers filtered)
 *   • `multi_home` — cross-home (admin / regional manager)
 */

export type DashboardScope = "team" | "home" | "multi_home"

export type KpiCard = {
  id: string
  label: string
  value: number
  /** Contextual delta text (e.g. "+2 this week", "3 overdue"). */
  delta: string
  tone: "neutral" | "success" | "warning" | "danger"
}

export type DaySnapshot = {
  /** ISO date, e.g. "2026-04-12" */
  date: string
  /** Short weekday label, e.g. "Mon" */
  dayLabel: string
  staffOnShift: number
  staffPlanned: number
  incidentsLogged: number
  reviewsDue: number
}

export type DashboardSnapshot = {
  scope: DashboardScope
  /** Which home(s) data is drawn from. */
  homeNames: string[]
  kpis: KpiCard[]
  /** Rolling 7-day daily drill-down. */
  dailyStrip: DaySnapshot[]
  /** ISO timestamp of snapshot generation. */
  generatedAt: string
}
