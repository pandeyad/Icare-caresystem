import React, { useEffect, useMemo, useRef, useState } from "react"
import "./RotaView.scss"
import PageHeader from "../../components/PageHeader/PageHeader"
import HomeFilter from "../../components/HomeFilter/HomeFilter"
import { useAuth } from "../../auth/AuthContext"
import { rotaService } from "../../services"
import type {
  RotaWeek,
  RotaEntry,
  TeamRoster,
} from "../../services/rota/rota.types"

/**
 * ROTA-001 — 24-hour timeline rota with team coverage blocks.
 *
 * Timeline shows aggregated team coverage per day. Clicking a day
 * opens a detail panel with per-team member breakdown including
 * leave, overtime, and swap coverage.
 */

const HOUR_PX = 48
const TOTAL_H = 24 * HOUR_PX
const HOURS = Array.from({ length: 24 }, (_, i) => i)

const timeToMinutes = (t: string): number => {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}

const timeToPx = (t: string): number => {
  if (t === "24:00") return TOTAL_H
  return (timeToMinutes(t) / (24 * 60)) * TOTAL_H
}

const formatHour = (h: number): string =>
  `${String(h).padStart(2, "0")}:00`

const toMonday = (d: Date): string => {
  const copy = new Date(d)
  const day = copy.getDay()
  const diff = copy.getDate() - day + (day === 0 ? -6 : 1)
  copy.setDate(diff)
  return copy.toISOString().slice(0, 10)
}

const fmtEnd = (t: string) => (t === "24:00" ? "00:00" : t)

/* ─── Coverage block types ─────────────────── */

type CoverageBlock = {
  key: string
  date: string
  startTime: string
  endTime: string
  teamId: string
  teamName: string
  staffCount: number
  isOvertime: boolean
  entries: RotaEntry[]
}

type LayoutBlock = CoverageBlock & { col: number; totalCols: number }

/** Split non-overlapping entries from the same team into separate blocks. */
function splitContiguous(entries: RotaEntry[]): RotaEntry[][] {
  const sorted = [...entries].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  )
  const groups: RotaEntry[][] = [[sorted[0]]]

  for (let i = 1; i < sorted.length; i++) {
    const curr = sorted[i]
    const prev = groups[groups.length - 1]
    const prevEnd = Math.max(
      ...prev.map((e) =>
        e.endTime === "24:00" ? 1440 : timeToMinutes(e.endTime)
      )
    )
    if (timeToMinutes(curr.startTime) < prevEnd) {
      prev.push(curr)
    } else {
      groups.push([curr])
    }
  }
  return groups
}

/** Aggregate entries into team coverage blocks per day. */
function computeTeamBlocks(week: RotaWeek): Map<string, CoverageBlock[]> {
  const map = new Map<string, CoverageBlock[]>()

  for (const day of week.days) {
    const dayEntries = week.entries.filter(
      (e) => e.date === day.date && e.type !== "leave"
    )

    // Group by (teamId, isOvertime)
    const groups = new Map<string, RotaEntry[]>()
    for (const e of dayEntries) {
      const k =
        e.type === "overtime" ? `${e.teamId}:ot` : `${e.teamId}:shift`
      if (!groups.has(k)) groups.set(k, [])
      groups.get(k)!.push(e)
    }

    const blocks: CoverageBlock[] = []
    for (const [groupKey, gEntries] of groups) {
      const isOT = groupKey.endsWith(":ot")
      // Split non-contiguous windows
      for (const chunk of splitContiguous(gEntries)) {
        let earliest = "24:00"
        let latest = "00:00"
        for (const e of chunk) {
          if (e.startTime < earliest) earliest = e.startTime
          if (e.endTime > latest) latest = e.endTime
        }
        blocks.push({
          key: `${day.date}:${groupKey}:${earliest}`,
          date: day.date,
          startTime: earliest,
          endTime: latest,
          teamId: chunk[0].teamId,
          teamName: chunk[0].teamName,
          staffCount: chunk.length,
          isOvertime: isOT,
          entries: chunk,
        })
      }
    }

    map.set(day.date, blocks)
  }
  return map
}

/** Assign columns so overlapping blocks sit side-by-side. */
function layoutBlocks(blocks: CoverageBlock[]): LayoutBlock[] {
  if (blocks.length === 0) return []
  const sorted = [...blocks].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  )
  const cols: CoverageBlock[][] = []
  const result: LayoutBlock[] = []

  for (const block of sorted) {
    const startMin = timeToMinutes(block.startTime)
    let placed = false
    for (let c = 0; c < cols.length; c++) {
      const last = cols[c][cols[c].length - 1]
      const lastEnd =
        last.endTime === "24:00" ? 1440 : timeToMinutes(last.endTime)
      if (lastEnd <= startMin) {
        cols[c].push(block)
        result.push({ ...block, col: c, totalCols: 0 })
        placed = true
        break
      }
    }
    if (!placed) {
      cols.push([block])
      result.push({ ...block, col: cols.length - 1, totalCols: 0 })
    }
  }
  const total = cols.length
  for (const r of result) r.totalCols = total
  return result
}

/* ─── Component ────────────────────────────── */

const RotaView: React.FC = () => {
  const { user, activeHome } = useAuth()
  const timelineRef = useRef<HTMLDivElement>(null)

  const [weekStart, setWeekStart] = useState(() => toMonday(new Date()))
  const [week, setWeek] = useState<RotaWeek | null>(null)
  const [_rosters, setRosters] = useState<TeamRoster[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const homeId = activeHome?.id ?? user.primaryHome.id

  useEffect(() => {
    let cancelled = false
    void rotaService.listWeek({ homeId, weekStart }).then((w) => {
      if (!cancelled) setWeek(w)
    })
    return () => {
      cancelled = true
    }
  }, [homeId, weekStart])

  useEffect(() => {
    let cancelled = false
    void rotaService.listTeamRosters(homeId).then((r) => {
      if (!cancelled) setRosters(r)
    })
    return () => {
      cancelled = true
    }
  }, [homeId])

  // Scroll to 06:00 on first load
  useEffect(() => {
    if (week && timelineRef.current) {
      timelineRef.current.scrollTop = 6 * HOUR_PX
    }
  }, [week])

  const blocksByDate = useMemo(() => {
    if (!week) return new Map<string, CoverageBlock[]>()
    return computeTeamBlocks(week)
  }, [week])

  /* Detail data for selected day */
  const selectedDetail = useMemo(() => {
    if (!selectedDate || !week) return null
    const dayEntries = week.entries.filter((e) => e.date === selectedDate)

    const teams = new Map<
      string,
      {
        name: string
        working: RotaEntry[]
        leave: RotaEntry[]
        overtime: RotaEntry[]
      }
    >()
    for (const e of dayEntries) {
      if (!teams.has(e.teamId)) {
        teams.set(e.teamId, {
          name: e.teamName,
          working: [],
          leave: [],
          overtime: [],
        })
      }
      const t = teams.get(e.teamId)!
      if (e.type === "leave") t.leave.push(e)
      else if (e.type === "overtime") t.overtime.push(e)
      else t.working.push(e)
    }
    return { date: selectedDate, teams }
  }, [selectedDate, week])

  const navWeek = (delta: number) => {
    const d = new Date(weekStart + "T00:00:00")
    d.setDate(d.getDate() + delta * 7)
    setWeekStart(toMonday(d))
    setSelectedDate(null)
  }

  const todayIso = new Date().toISOString().slice(0, 10)

  return (
    <div className="rota">
      <PageHeader
        eyebrow={week?.homeName ?? ""}
        title="Rota"
        subtitle={week?.weekLabel ?? "Loading..."}
        actions={<HomeFilter />}
      />

      {/* Week navigation */}
      <div className="rota__nav">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => navWeek(-1)}
        >
          ← Prev
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setWeekStart(toMonday(new Date()))}
        >
          Today
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => navWeek(1)}
        >
          Next →
        </button>
        <div className="rota__legend">
          <span className="rota__legend-item rota__legend-item--shift">
            Shift
          </span>
          <span className="rota__legend-item rota__legend-item--overtime">
            Overtime
          </span>
          <span className="rota__legend-item rota__legend-item--leave">
            Leave
          </span>
          <span className="rota__legend-item rota__legend-item--swap">
            Swap
          </span>
        </div>
      </div>

      {/* 24-hour timeline grid */}
      {week && week.days.length > 0 && (
        <div className="rota__timeline-wrap" ref={timelineRef}>
          {/* Sticky day headers */}
          <div className="rota__timeline-header">
            <div className="rota__time-corner" />
            {week.days.map((d) => (
              <button
                key={d.date}
                type="button"
                className={`rota__day-header ${d.date === todayIso ? "rota__day-header--today" : ""} ${d.date === selectedDate ? "rota__day-header--selected" : ""}`}
                onClick={() =>
                  setSelectedDate(
                    d.date === selectedDate ? null : d.date
                  )
                }
              >
                <div className="rota__day-name">{d.dayLabel}</div>
                <div className="rota__day-date">{d.date.slice(5)}</div>
              </button>
            ))}
          </div>

          {/* Timeline body */}
          <div className="rota__timeline-body">
            {/* Time axis */}
            <div className="rota__time-axis" style={{ height: TOTAL_H }}>
              {HOURS.map((h) => (
                <div
                  key={h}
                  className="rota__hour-label"
                  style={{ top: h * HOUR_PX }}
                >
                  {formatHour(h)}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {week.days.map((d) => {
              const dayBlocks = blocksByDate.get(d.date) ?? []
              const laid = layoutBlocks(dayBlocks)
              return (
                <div
                  key={d.date}
                  className={`rota__day-col ${d.date === todayIso ? "rota__day-col--today" : ""}`}
                  style={{ height: TOTAL_H }}
                  onClick={() =>
                    setSelectedDate(
                      d.date === selectedDate ? null : d.date
                    )
                  }
                >
                  {/* Hour grid lines */}
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      className="rota__hour-line"
                      style={{ top: h * HOUR_PX }}
                    />
                  ))}

                  {/* Team coverage blocks */}
                  {laid.map((block) => {
                    const top = timeToPx(block.startTime)
                    const bottom = timeToPx(block.endTime)
                    const height = bottom - top
                    if (height <= 0) return null
                    const widthPct = 100 / block.totalCols
                    const leftPct = (block.col / block.totalCols) * 100
                    return (
                      <div
                        key={block.key}
                        className={`rota__block rota__block--${block.isOvertime ? "overtime" : "shift"}`}
                        style={{
                          top,
                          height,
                          left: `calc(${leftPct}% + 3px)`,
                          width: `calc(${widthPct}% - 6px)`,
                        }}
                        title={`${block.teamName} · ${block.staffCount} staff · ${block.startTime}–${fmtEnd(block.endTime)}`}
                      >
                        <div className="rota__block-team">
                          {block.teamName}
                        </div>
                        <div className="rota__block-count">
                          {block.staffCount} staff
                        </div>
                        <div className="rota__block-time">
                          {block.startTime}–{fmtEnd(block.endTime)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Detail panel — all teams for the selected day */}
      {selectedDetail && (
        <section className="rota__detail card card--padded">
          <header className="rota__detail-header">
            <h3 className="section-title">
              {week?.days.find((d) => d.date === selectedDetail.date)
                ?.dayLabel ?? ""}{" "}
              {selectedDetail.date.slice(5)}
            </h3>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setSelectedDate(null)}
              aria-label="Close detail"
            >
              ✕
            </button>
          </header>

          {Array.from(selectedDetail.teams.entries()).map(
            ([teamId, team]) => (
              <div key={teamId} className="rota__detail-team">
                <div className="rota__detail-team-name">{team.name}</div>

                {team.working.length > 0 && (
                  <div className="rota__detail-group">
                    {team.working.map((e) => (
                      <div key={e.id} className="rota__detail-entry">
                        <span className="rota__detail-dot rota__detail-dot--shift" />
                        <span className="rota__detail-name">
                          {e.staffName}
                        </span>
                        <span className="rota__detail-role">
                          {e.staffRole}
                        </span>
                        <span className="rota__detail-time">
                          {e.startTime}–{fmtEnd(e.endTime)}
                        </span>
                        {e.note && (
                          <span className="rota__detail-note">
                            {e.note}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {team.leave.length > 0 && (
                  <div className="rota__detail-group">
                    <div className="rota__detail-subhead">On leave</div>
                    {team.leave.map((e) => (
                      <div key={e.id} className="rota__detail-entry">
                        <span className="rota__detail-dot rota__detail-dot--leave" />
                        <span className="rota__detail-name">
                          {e.staffName}
                        </span>
                        <span className="rota__detail-role">
                          {e.staffRole}
                        </span>
                        <span className="rota__detail-time">
                          {e.startTime}–{fmtEnd(e.endTime)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {team.overtime.length > 0 && (
                  <div className="rota__detail-group">
                    <div className="rota__detail-subhead">
                      Overtime coverage
                    </div>
                    {team.overtime.map((e) => (
                      <div key={e.id} className="rota__detail-entry">
                        <span className="rota__detail-dot rota__detail-dot--overtime" />
                        <span className="rota__detail-name">
                          {e.staffName}
                        </span>
                        <span className="rota__detail-role">
                          {e.staffRole}
                        </span>
                        <span className="rota__detail-time">
                          {e.startTime}–{fmtEnd(e.endTime)}
                        </span>
                        {e.note && (
                          <span className="rota__detail-note">
                            {e.note}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </section>
      )}
    </div>
  )
}

export default RotaView
