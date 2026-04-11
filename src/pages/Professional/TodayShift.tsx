import React, { useEffect, useState } from "react"
import "./TodayShift.scss"
import { STRINGS } from "../../i18n/strings"

/**
 * PRO-001 — Today's shift (Professional mobile app).
 *
 * Designed per docs/02-ui-ux/09-mobile-first.md:
 *  - Thumb-reachable primary action (clock in/out) at the bottom.
 *  - 44×44 minimum touch targets.
 *  - One big status headline — no hunting.
 *  - Works on desktop too, but narrow-column max-width so layout stays honest.
 */

type ShiftState = "pre-shift" | "on-duty" | "break" | "off"

const SHIFT = {
  date: new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }),
  role: "Health Care Assistant",
  ward: "Willow Ward · West wing",
  start: "07:00",
  end: "15:00",
  handover: "See Priya A. in the nursing station at 06:55 for hand-over.",
}

const TASKS = [
  { id: "t1", time: "07:15", label: "Medication round · A-wing", done: false },
  { id: "t2", time: "08:30", label: "Breakfast support · A. Kimura", done: false },
  { id: "t3", time: "10:00", label: "Care plan review · B. Mahmoud", done: false },
  { id: "t4", time: "12:30", label: "Lunch break", done: false },
  { id: "t5", time: "13:30", label: "Physio with C. Wei", done: false },
]

const TodayShift: React.FC = () => {
  const [state, setState] = useState<ShiftState>("pre-shift")
  const [now, setNow] = useState(() => new Date())
  const [clockInAt, setClockInAt] = useState<Date | null>(null)

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000 * 30)
    return () => window.clearInterval(id)
  }, [])

  const onPrimary = () => {
    if (state === "pre-shift") {
      setState("on-duty")
      setClockInAt(new Date())
    } else if (state === "on-duty") {
      setState("off")
    } else if (state === "break") {
      setState("on-duty")
    } else {
      setState("pre-shift")
      setClockInAt(null)
    }
  }

  const cta =
    state === "pre-shift"
      ? STRINGS.professional.today.clockInCta
      : state === "on-duty"
      ? STRINGS.professional.today.clockOutCta
      : state === "break"
      ? "Resume shift"
      : "Start new shift"

  const statusLine =
    state === "on-duty"
      ? `${STRINGS.professional.today.onDuty} ${clockInAt?.toLocaleTimeString(
          "en-GB",
          { hour: "2-digit", minute: "2-digit" }
        )}`
      : state === "pre-shift"
      ? `${STRINGS.professional.today.notStarted} ${SHIFT.start}`
      : state === "break"
      ? STRINGS.professional.today.breakActive
      : "Shift finished"

  return (
    <div className="today-shift">
      <div className="today-shift__backdrop" aria-hidden="true" />

      <header className="today-shift__header">
        <div className="eyebrow">{SHIFT.date}</div>
        <h1>{STRINGS.professional.today.title}</h1>
        <div className="today-shift__now">
          <span className="today-shift__now-dot" aria-hidden="true" />
          {now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </header>

      <section className={`today-shift__hero today-shift__hero--${state}`}>
        <div className="today-shift__hero-label">{statusLine}</div>
        <div className="today-shift__hero-role">
          {SHIFT.role}
          <span className="today-shift__hero-sep">·</span>
          {SHIFT.ward}
        </div>
        <div className="today-shift__hero-time">
          <div>
            <div className="today-shift__t-label">Start</div>
            <div className="today-shift__t-value">{SHIFT.start}</div>
          </div>
          <div className="today-shift__t-bar" aria-hidden="true">
            <div className="today-shift__t-fill" style={{ width: state === "on-duty" ? "45%" : "0%" }} />
          </div>
          <div>
            <div className="today-shift__t-label">End</div>
            <div className="today-shift__t-value">{SHIFT.end}</div>
          </div>
        </div>
      </section>

      <section className="card card--padded">
        <h3 className="section-title">{STRINGS.professional.today.handover}</h3>
        <p className="today-shift__handover">{SHIFT.handover}</p>
      </section>

      <section className="card today-shift__tasks">
        <header className="today-shift__tasks-head">
          <h3 className="section-title">Shift plan</h3>
          <span className="eyebrow">{TASKS.length} items</span>
        </header>
        <ol className="today-shift__task-list">
          {TASKS.map((t) => (
            <li key={t.id} className="today-shift__task">
              <div className="today-shift__task-check" aria-hidden="true" />
              <time className="today-shift__task-time">{t.time}</time>
              <div className="today-shift__task-label">{t.label}</div>
            </li>
          ))}
        </ol>
      </section>

      <div className="today-shift__secondary-actions">
        <button type="button" className="btn btn--secondary">
          {STRINGS.professional.today.logEvent}
        </button>
        <button type="button" className="btn btn--secondary">
          {STRINGS.professional.today.swap}
        </button>
      </div>

      <div className="today-shift__cta-bar">
        {state === "on-duty" && (
          <button
            type="button"
            className="btn btn--ghost today-shift__break-btn"
            onClick={() => setState("break")}
          >
            {STRINGS.professional.today.breakCta}
          </button>
        )}
        <button type="button" className="btn btn--primary today-shift__cta" onClick={onPrimary}>
          {cta}
        </button>
      </div>
    </div>
  )
}

export default TodayShift
