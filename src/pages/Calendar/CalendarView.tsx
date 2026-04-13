import React, { useEffect, useMemo, useState } from "react"
import "./CalendarView.scss"
import PageHeader from "../../components/PageHeader/PageHeader"
import HomeFilter from "../../components/HomeFilter/HomeFilter"
import Modal from "../../components/Modal/Modal"
import DateTimeField from "../../components/DateTimeField/DateTimeField"
import { useAuth } from "../../auth/AuthContext"
import { useToast } from "../../components/Toast/ToastProvider"
import { KIND_LABEL } from "./calendar.mock"
import { calendarService } from "../../services"
import { PageTransition, FadeIn } from "../../components/Motion"
import type {
  CalendarEvent,
  EventKind,
} from "../../services/calendar/calendar.types"

/**
 * CAL-001 — Calendar (v2).
 *
 * One page, two scopes, two layouts.
 *
 * Scopes
 * ──────
 *   • personal — only events where `mine === true`. Default for everyone.
 *   • coverage — *all* events including teammate shifts and vacant slots.
 *                Visible only to users with `team.view`. This is the
 *                "manager wholistic" view: what's covered, what's open,
 *                where the holes are. Click an unfilled slot → open the
 *                Cover modal to draft an overtime/override.
 *
 * Layouts
 * ───────
 *   • Wide ≥ 1024px — month + day side-by-side. The month grid is the
 *     primary nav, the day pane mirrors the selected day with a
 *     timeline-laid-out view of overlapping events.
 *   • Narrow < 1024px — month only by default; clicking a day opens the
 *     same day pane inside a modal so phones stay readable.
 *
 * Both layouts share the *same* day-pane component, so the timeline
 * rendering is consistent everywhere.
 *
 * Why merged with personal calendar (rather than a second route)?
 *   The user explicitly asked us to consider it. Merging is the right
 *   call because: (1) the data model is identical — manager view is
 *   "personal + everyone else"; (2) keeping a single page means the
 *   month grid, hover popovers, filters, and responsive logic only
 *   exist once; (3) role-aware "Scope" toggle is far less surprising
 *   than discovering a separate "Coverage" page in the sidebar.
 */

const TODAY = new Date("2026-04-11T08:00:00Z")

const toISO = (d: Date) => d.toISOString().slice(0, 10)
const addDays = (d: Date, n: number) =>
  new Date(d.getTime() + n * 24 * 3600 * 1000)
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
const startOfGrid = (d: Date) => {
  const first = startOfMonth(d)
  const dow = (first.getDay() + 6) % 7 // grid starts on Monday
  return addDays(first, -dow)
}
const sameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const monthName = (d: Date) =>
  d.toLocaleDateString("en-GB", { month: "long", year: "numeric" })

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

/** Day timeline window — keeps the visual height bounded. */
const DAY_HOUR_START = 6
const DAY_HOUR_END = 23 // exclusive
const DAY_HOURS = DAY_HOUR_END - DAY_HOUR_START

type Scope = "personal" | "coverage"

/** Minimal media-query hook so the calendar can flip layout on resize. */
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  )
  useEffect(() => {
    if (typeof window === "undefined") return
    const m = window.matchMedia(query)
    const onChange = () => setMatches(m.matches)
    m.addEventListener("change", onChange)
    return () => m.removeEventListener("change", onChange)
  }, [query])
  return matches
}

/** Parse "HH:mm" → minutes since midnight, clamped to the visible window. */
const minutes = (hhmm: string | undefined): number => {
  if (!hhmm) return 0
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

/**
 * Lane allocation: assign each event to the lowest-index lane it doesn't
 * overlap into. Needed so two events at 14:00 render side-by-side instead
 * of stacking on top of each other.
 */
type LaidOut = { event: CalendarEvent; lane: number; lanes: number }
const layoutEvents = (list: CalendarEvent[]): LaidOut[] => {
  const sorted = [...list].sort(
    (a, b) => minutes(a.start) - minutes(b.start)
  )
  const laneEnd: number[] = []
  const placed: Array<{ event: CalendarEvent; lane: number }> = []
  for (const e of sorted) {
    const startMin = minutes(e.start)
    const endMin =
      e.end && minutes(e.end) > startMin ? minutes(e.end) : startMin + 60
    let lane = laneEnd.findIndex((until) => until <= startMin)
    if (lane === -1) {
      lane = laneEnd.length
      laneEnd.push(endMin)
    } else {
      laneEnd[lane] = endMin
    }
    placed.push({ event: e, lane })
  }
  // Lane width = max lane index used + 1.
  const lanes = Math.max(1, laneEnd.length)
  return placed.map((p) => ({ ...p, lanes }))
}

const isVacant = (e: CalendarEvent) => e.kind === "unfilled"

const CalendarView: React.FC = () => {
  const { can } = useAuth()
  const toast = useToast()
  const canManageScope = can("team.view")

  // Wide layout = side-by-side. Narrow = stacked + day modal.
  const isWide = useMediaQuery("(min-width: 1024px)")

  const [cursor, setCursor] = useState<Date>(TODAY)
  const [selectedISO, setSelectedISO] = useState<string>(toISO(TODAY))
  const [scope, setScope] = useState<Scope>("personal")
  const [activeKinds, setActiveKinds] = useState<Set<EventKind>>(
    new Set<EventKind>(["shift", "swap", "overtime", "leave", "unfilled"])
  )
  const [openEventId, setOpenEventId] = useState<string | null>(null)
  /** When narrow layout, clicking a day opens the day pane in a modal. */
  const [dayModalISO, setDayModalISO] = useState<string | null>(null)
  /** Cover modal for vacant slots — manager flow. */
  const [coverFor, setCoverFor] = useState<CalendarEvent | null>(null)
  /** Events feed from CalendarSvc (gateway aggregator over Rota+Request+Swap). */
  const [events, setEvents] = useState<CalendarEvent[]>([])

  // If the user loses the scope permission (role switch), drop them back.
  useEffect(() => {
    if (!canManageScope && scope === "coverage") setScope("personal")
  }, [canManageScope, scope])

  // Fetch the events feed from CalendarSvc. We refetch whenever the scope
  // flips (personal ↔ coverage) or the month cursor moves — the real
  // backend will bucket by from/to so this is the right shape.
  useEffect(() => {
    let cancelled = false
    const monthStart = startOfMonth(cursor)
    const from = toISO(startOfGrid(cursor))
    const to = toISO(addDays(startOfGrid(cursor), 41))
    void monthStart
    void calendarService
      .listEvents({ from, to, scope })
      .then((data) => {
        if (!cancelled) setEvents(data)
      })
    return () => {
      cancelled = true
    }
  }, [cursor, scope])

  // Bucket events by ISO date once, scoped + filtered. Scope is already
  // applied server-side by CalendarSvc, so we only do kind filtering here.
  const visibleEvents = useMemo(() => {
    return events.filter((e) => activeKinds.has(e.kind))
  }, [activeKinds, events])

  const byDate = useMemo(() => {
    const m = new Map<string, CalendarEvent[]>()
    for (const e of visibleEvents) {
      const bucket = m.get(e.date) ?? []
      bucket.push(e)
      m.set(e.date, bucket)
    }
    // Order each day by start time.
    for (const [, list] of m) {
      list.sort((a, b) => minutes(a.start) - minutes(b.start))
    }
    return m
  }, [visibleEvents])

  const gridStart = useMemo(() => startOfGrid(cursor), [cursor])
  const days = useMemo(
    () => Array.from({ length: 42 }, (_, i) => addDays(gridStart, i)),
    [gridStart]
  )

  const selectedEvents = useMemo(
    () => byDate.get(selectedISO) ?? [],
    [byDate, selectedISO]
  )
  const openEvent = useMemo(
    () => events.find((e) => e.id === openEventId) ?? null,
    [events, openEventId]
  )

  const toggleKind = (k: EventKind) => {
    setActiveKinds((prev) => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })
  }

  const goPrev = () =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))
  const goNext = () =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))
  const goToday = () => {
    setCursor(TODAY)
    setSelectedISO(toISO(TODAY))
  }

  const handleDayClick = (iso: string) => {
    setSelectedISO(iso)
    if (!isWide) setDayModalISO(iso)
  }

  const handleEventClick = (e: CalendarEvent) => {
    setSelectedISO(e.date)
    setOpenEventId(e.id)
  }

  const handleCoverSubmit = (form: HTMLFormElement) => {
    const data = new FormData(form)
    const start = String(data.get("start") || "")
    const end = String(data.get("end") || "")
    const replacement = String(data.get("replacement") || "TBD")
    if (!start || !end) {
      toast.danger("Pick start and end times")
      return
    }
    if (!coverFor) return
    // CalendarSvc's cover-requests endpoint translates this into a RotaSvc
    // override draft tied to the vacancy. The returned `CalendarEvent` is
    // spliced into the feed so the vacant slot flips to "pending cover"
    // immediately without refetching the whole month.
    const vacancyId = coverFor.id
    const slot = coverFor.slot ?? coverFor.title
    void calendarService
      .createCoverRequest({
        vacancyId,
        start,
        end,
        reason: "sickness",
      })
      .then((created) => {
        setEvents((list) => [...list, created])
        toast.success("Cover request drafted", {
          description: `${slot} — ${replacement}`,
        })
      })
    setCoverFor(null)
  }

  // ── Cell renderer (shared between wide + narrow). ──
  const renderCell = (d: Date) => {
    const iso = toISO(d)
    const events = byDate.get(iso) ?? []
    const outside = !sameMonth(d, cursor)
    const isToday = sameDay(d, TODAY)
    const isSelected = iso === selectedISO
    const vacantCount = events.filter(isVacant).length
    const total = events.length
    return (
      <div
        key={iso}
        className={`cal__cell ${outside ? "is-outside" : ""} ${
          isToday ? "is-today" : ""
        } ${isSelected ? "is-selected" : ""}`}
        role="button"
        tabIndex={0}
        onClick={() => handleDayClick(iso)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleDayClick(iso)
          }
        }}
      >
        <div className="cal__cell-header">
          <span className="cal__cell-num">{d.getDate()}</span>
          {total > 0 && (
            <span
              className={`cal__cell-count ${
                vacantCount > 0 ? "has-vacancy" : ""
              }`}
              aria-label={`${total} events${
                vacantCount ? `, ${vacantCount} vacant` : ""
              }`}
            >
              {total}
            </span>
          )}
        </div>
        <div className="cal__cell-events">
          {events.slice(0, 3).map((e) => (
            <button
              type="button"
              key={e.id}
              className={`cal__pill cal__pill--${e.kind} ${
                e.mine ? "is-mine" : ""
              }`}
              title={e.title}
              onClick={(ev) => {
                ev.stopPropagation()
                handleEventClick(e)
              }}
            >
              <span className="cal__pill-time">
                {e.start ?? KIND_LABEL[e.kind]}
              </span>
              <span className="cal__pill-title">{e.title}</span>
            </button>
          ))}
          {total > 3 && (
            <span className="cal__more">+{total - 3} more</span>
          )}
        </div>
        {/* Hover popover — CSS-driven, full event list in start-time order */}
        {total > 0 && (
          <div className="cal__hover-pop" role="presentation">
            <div className="cal__hover-pop-title">
              {d.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}
            </div>
            <ul className="cal__hover-list">
              {events.map((e) => (
                <li key={e.id} className={`cal__hover-item cal__hover-item--${e.kind}`}>
                  <span className="cal__hover-time">
                    {e.start && e.end ? `${e.start}–${e.end}` : KIND_LABEL[e.kind]}
                  </span>
                  <span className="cal__hover-title">{e.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  // ── Day pane (also rendered inside the day modal on narrow). ──
  const renderDayPane = () => {
    const dayDate = new Date(selectedISO)
    const events = selectedEvents
    const timed = events.filter((e) => e.start && e.end)
    const allDay = events.filter((e) => !e.start || !e.end)
    const laidOut = layoutEvents(timed)

    return (
      <div className="cal__day card card--padded">
        <header className="cal__day-head">
          <div>
            <div className="eyebrow">
              {dayDate.toLocaleDateString("en-GB", { weekday: "long" })}
            </div>
            <h3 className="cal__day-title">
              {dayDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h3>
          </div>
          <span className="badge badge--neutral">
            {events.length} {events.length === 1 ? "event" : "events"}
          </span>
        </header>

        {allDay.length > 0 && (
          <ul className="cal__day-allday">
            {allDay.map((e) => (
              <li
                key={e.id}
                className={`cal__day-allday-item cal__day-allday-item--${e.kind}`}
                onClick={() => handleEventClick(e)}
              >
                <span className="eyebrow">{KIND_LABEL[e.kind]}</span>
                <span>{e.title}</span>
              </li>
            ))}
          </ul>
        )}

        {events.length === 0 ? (
          <p className="cal__empty">Nothing scheduled on this day.</p>
        ) : (
          <div className="cal__timeline">
            {/* Hour ruler */}
            <ul className="cal__timeline-hours" aria-hidden="true">
              {Array.from({ length: DAY_HOURS + 1 }, (_, i) => {
                const h = DAY_HOUR_START + i
                return (
                  <li
                    key={h}
                    className="cal__timeline-hour"
                    style={{ top: `${(i / DAY_HOURS) * 100}%` }}
                  >
                    <span className="cal__timeline-hour-label">
                      {String(h).padStart(2, "0")}:00
                    </span>
                  </li>
                )
              })}
            </ul>
            {/* Now indicator */}
            {sameDay(dayDate, TODAY) && <NowLine />}
            {/* Event blocks */}
            <div className="cal__timeline-events">
              {laidOut.map(({ event, lane, lanes }) => {
                const startMin = Math.max(
                  minutes(event.start),
                  DAY_HOUR_START * 60
                )
                let endMin = minutes(event.end!)
                if (endMin <= minutes(event.start)) endMin += 24 * 60 // overnight
                endMin = Math.min(endMin, DAY_HOUR_END * 60)
                if (endMin <= startMin) return null
                const top =
                  ((startMin - DAY_HOUR_START * 60) / (DAY_HOURS * 60)) * 100
                const height =
                  ((endMin - startMin) / (DAY_HOURS * 60)) * 100
                const widthPct = 100 / lanes
                const left = lane * widthPct
                return (
                  <button
                    type="button"
                    key={event.id}
                    className={`cal__timeline-event cal__timeline-event--${event.kind} ${
                      event.mine ? "is-mine" : ""
                    } ${isVacant(event) ? "is-vacant" : ""}`}
                    style={{
                      top: `${top}%`,
                      height: `${Math.max(height, 4)}%`,
                      left: `calc(${left}% + 2px)`,
                      width: `calc(${widthPct}% - 4px)`,
                    }}
                    onClick={() => handleEventClick(event)}
                    title={`${event.title} · ${event.start}–${event.end}`}
                  >
                    <span className="cal__timeline-event-time">
                      {event.start}–{event.end}
                    </span>
                    <span className="cal__timeline-event-title">
                      {event.title}
                    </span>
                    {event.person && event.person !== "You" && (
                      <span className="cal__timeline-event-person">
                        {event.person}
                      </span>
                    )}
                    {isVacant(event) && (
                      <span className="cal__timeline-event-tag">Vacant</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <PageTransition>
    <div className="cal">
      <PageHeader
        eyebrow=""
        title="Calendar"
        subtitle={
          scope === "coverage"
            ? "Every assignment, leave, and vacant slot across your homes — colour-coded for who's covered and where the holes are."
            : "Your shifts, leaves, and requests — colour-coded and click-through."
        }
        actions={
          <>
            <HomeFilter />
            {canManageScope && (
              <div
                className="cal__scope-switch"
                role="tablist"
                aria-label="Scope"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={scope === "personal"}
                  className={`cal__scope-btn ${
                    scope === "personal" ? "is-active" : ""
                  }`}
                  onClick={() => setScope("personal")}
                >
                  My calendar
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={scope === "coverage"}
                  className={`cal__scope-btn ${
                    scope === "coverage" ? "is-active" : ""
                  }`}
                  onClick={() => setScope("coverage")}
                >
                  All assignments
                </button>
              </div>
            )}
          </>
        }
      />

      {/* Toolbar — month nav + filters */}
      <FadeIn>
      <div className="cal__toolbar">
        <div className="cal__nav">
          <button
            type="button"
            className="btn btn--ghost cal__nav-btn"
            onClick={goPrev}
            aria-label="Previous month"
          >
            ‹
          </button>
          <div className="cal__nav-title">{monthName(cursor)}</div>
          <button
            type="button"
            className="btn btn--ghost cal__nav-btn"
            onClick={goNext}
            aria-label="Next month"
          >
            ›
          </button>
          <button
            type="button"
            className="btn btn--secondary cal__today"
            onClick={goToday}
          >
            Today
          </button>
        </div>

        <div className="cal__legend" role="group" aria-label="Event filters">
          {(["shift", "swap", "overtime", "leave", "unfilled"] as EventKind[]).map(
            (k) => (
              <button
                type="button"
                key={k}
                onClick={() => toggleKind(k)}
                className={`cal__chip cal__chip--${k} ${
                  activeKinds.has(k) ? "is-on" : ""
                }`}
                aria-pressed={activeKinds.has(k)}
              >
                <span className="cal__chip-dot" aria-hidden="true" />
                {KIND_LABEL[k]}
              </button>
            )
          )}
        </div>
      </div>
      </FadeIn>

      {/* Body: side-by-side on wide, stacked on narrow. */}
      <FadeIn delay={0.08}>
      <div className={`cal__body ${isWide ? "is-wide" : "is-narrow"}`}>
        <div className="cal__month card">
          <div className="cal__weekdays">
            {WEEKDAYS.map((d) => (
              <div key={d} className="cal__weekday">
                {d}
              </div>
            ))}
          </div>
          <div className="cal__grid">{days.map(renderCell)}</div>
        </div>

        {isWide && (
          <aside className="cal__day-pane" aria-label="Day detail">
            {renderDayPane()}
          </aside>
        )}
      </div>
      </FadeIn>

      {/* Day modal — narrow layouts only. */}
      <Modal
        open={!isWide && dayModalISO !== null}
        onClose={() => setDayModalISO(null)}
        eyebrow="DAY VIEW"
        title={
          dayModalISO
            ? new Date(dayModalISO).toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })
            : "Day"
        }
        size="lg"
      >
        {dayModalISO && renderDayPane()}
      </Modal>

      {/* Event detail pane — also a modal so it works at any width. */}
      <Modal
        open={openEvent !== null}
        onClose={() => setOpenEventId(null)}
        eyebrow={openEvent ? KIND_LABEL[openEvent.kind].toUpperCase() : "EVENT"}
        title={openEvent ? openEvent.title : "Event"}
        size="sm"
        footer={
          openEvent && (
            <>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setOpenEventId(null)}
              >
                Close
              </button>
              {isVacant(openEvent) && canManageScope && (
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => {
                    setCoverFor(openEvent)
                    setOpenEventId(null)
                  }}
                >
                  Create cover request
                </button>
              )}
            </>
          )
        }
      >
        {openEvent && (
          <dl className="cal__detail-list">
            <dt>Date</dt>
            <dd>
              {new Date(openEvent.date).toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </dd>
            {openEvent.start && openEvent.end && (
              <>
                <dt>Time</dt>
                <dd>
                  {openEvent.start} – {openEvent.end}
                </dd>
              </>
            )}
            {openEvent.person && (
              <>
                <dt>Person</dt>
                <dd>{openEvent.person}</dd>
              </>
            )}
            {openEvent.ward && (
              <>
                <dt>Ward</dt>
                <dd>{openEvent.ward}</dd>
              </>
            )}
            {openEvent.slot && (
              <>
                <dt>Slot</dt>
                <dd>{openEvent.slot}</dd>
              </>
            )}
            {openEvent.status && (
              <>
                <dt>Status</dt>
                <dd>{openEvent.status.replace("_", " ")}</dd>
              </>
            )}
            {openEvent.openRequests && openEvent.openRequests.length > 0 && (
              <>
                <dt>Open requests</dt>
                <dd>
                  {openEvent.openRequests.map((r) => (
                    <span key={r} className="badge badge--info" style={{ marginRight: 4 }}>
                      {r}
                    </span>
                  ))}
                </dd>
              </>
            )}
          </dl>
        )}
      </Modal>

      {/* Cover request modal — opens when manager picks a vacant slot. */}
      <Modal
        open={coverFor !== null}
        onClose={() => setCoverFor(null)}
        eyebrow="COVER"
        title={coverFor ? `Cover ${coverFor.slot ?? coverFor.title}` : "Cover slot"}
        description={
          coverFor
            ? `${new Date(coverFor.date).toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })} · draft an overtime offer or assign someone manually.`
            : undefined
        }
        size="md"
      >
        {coverFor && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleCoverSubmit(e.currentTarget)
            }}
          >
            <div className="form-row">
              <DateTimeField
                name="start"
                label="Start"
                required
                defaultValue={`${coverFor.date}T${coverFor.start ?? "14:00"}`}
              />
              <DateTimeField
                name="end"
                label="End"
                required
                defaultValue={`${coverFor.date}T${coverFor.end ?? "22:00"}`}
              />
            </div>
            <label className="form-field">
              <span className="form-field__label">Replacement</span>
              <input
                name="replacement"
                className="form-field__control"
                placeholder="Who covers this — or leave blank for an overtime offer"
              />
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
                onClick={() => setCoverFor(null)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn--primary">
                Draft request
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
    </PageTransition>
  )
}

/** Tiny "now" line that ticks every minute on the day timeline. */
const NowLine: React.FC = () => {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(id)
  }, [])
  const min = now.getHours() * 60 + now.getMinutes()
  if (min < DAY_HOUR_START * 60 || min > DAY_HOUR_END * 60) return null
  const top = ((min - DAY_HOUR_START * 60) / (DAY_HOURS * 60)) * 100
  return (
    <div
      className="cal__timeline-now"
      style={{ top: `${top}%` }}
      aria-hidden="true"
    >
      <span className="cal__timeline-now-label">Now</span>
    </div>
  )
}

export default CalendarView
