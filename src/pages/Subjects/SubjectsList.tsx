import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import "./SubjectsList.scss"
import { STRINGS } from "../../i18n/strings"
import { SUBJECTS, type SubjectRow } from "./subjects.mock"

/**
 * MGT-002 — list of people in care.
 *
 * This is a working-list surface, not a report. Filter + search are the
 * primary tools; full profile lives behind a row click.
 */

type Filter = "all" | "assigned" | "review"

const statusTone: Record<SubjectRow["status"], "neutral" | "info" | "success" | "warning"> = {
  stable: "success",
  "needs-review": "warning",
  new: "info",
  transitioning: "neutral",
}

const statusLabel: Record<SubjectRow["status"], string> = {
  stable: "Stable",
  "needs-review": "Review due",
  new: "New intake",
  transitioning: "Transitioning",
}

const reviewLabel = (d: number) => {
  if (d === 0) return "today"
  if (d === 1) return "1 day ago"
  return `${d} days ago`
}

const SubjectsList: React.FC = () => {
  const [filter, setFilter] = useState<Filter>("all")
  const [q, setQ] = useState("")

  const filtered = useMemo(() => {
    return SUBJECTS.filter((s) => {
      if (filter === "review" && s.status !== "needs-review") return false
      if (filter === "assigned" && s.keyworker !== "Priya A.") return false
      if (q.trim()) {
        const needle = q.toLowerCase()
        if (
          !s.name.toLowerCase().includes(needle) &&
          !s.code.toLowerCase().includes(needle)
        ) {
          return false
        }
      }
      return true
    })
  }, [filter, q])

  return (
    <div className="subjects">
      <header className="subjects__hero">
        <div>
          <div className="eyebrow">Management · MGT-002</div>
          <h1>{STRINGS.subjects.title}</h1>
          <p>{STRINGS.subjects.subtitle}</p>
        </div>
        <button type="button" className="btn btn--primary">
          <span aria-hidden="true">+</span> {STRINGS.subjects.addSubject}
        </button>
      </header>

      <div className="subjects__toolbar card card--padded">
        <label className="subjects__search">
          <span className="sr-only">Search people</span>
          <span className="subjects__search-icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder={STRINGS.subjects.searchPlaceholder}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <div className="subjects__filter" role="tablist" aria-label="Filter">
          {(
            [
              { k: "all", label: STRINGS.subjects.filter.all },
              { k: "assigned", label: STRINGS.subjects.filter.assigned },
              { k: "review", label: STRINGS.subjects.filter.needsReview },
            ] as const
          ).map((f) => (
            <button
              key={f.k}
              type="button"
              role="tab"
              aria-selected={filter === f.k}
              className={`subjects__chip ${filter === f.k ? "subjects__chip--active" : ""}`}
              onClick={() => setFilter(f.k)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card subjects__table-wrap">
        {filtered.length === 0 ? (
          <div className="subjects__empty">
            <div className="subjects__empty-icon" aria-hidden="true">○</div>
            <h3>{STRINGS.subjects.empty.title}</h3>
            <p>{STRINGS.subjects.empty.body}</p>
          </div>
        ) : (
          <table className="subjects__table">
            <thead>
              <tr>
                <th>{STRINGS.subjects.column.name}</th>
                <th>{STRINGS.subjects.column.id}</th>
                <th>{STRINGS.subjects.column.home}</th>
                <th>{STRINGS.subjects.column.keyworker}</th>
                <th>{STRINGS.subjects.column.lastReview}</th>
                <th>{STRINGS.subjects.column.status}</th>
                <th aria-hidden="true"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <Link to="/child/profile" className="subjects__name">
                      <span className="subjects__avatar" aria-hidden="true">
                        {s.initials}
                      </span>
                      <span>{s.name}</span>
                    </Link>
                  </td>
                  <td className="subjects__mono">{s.code}</td>
                  <td>{s.home}</td>
                  <td>{s.keyworker}</td>
                  <td>{reviewLabel(s.lastReviewDays)}</td>
                  <td>
                    <span className={`badge badge--${statusTone[s.status]}`}>
                      {statusLabel[s.status]}
                    </span>
                  </td>
                  <td>
                    <Link to="/child/profile" className="subjects__row-link">
                      Open →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default SubjectsList
