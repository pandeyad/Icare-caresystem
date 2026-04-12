import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./HomesList.scss"
import PageHeader from "../../components/PageHeader/PageHeader"
import Modal from "../../components/Modal/Modal"
import ViewToggle, { useViewMode } from "../../components/ViewToggle/ViewToggle"
import { useAuth } from "../../auth/AuthContext"
import { useToast } from "../../components/Toast/ToastProvider"
import { RATING_LABEL } from "./homes.mock"
import { homeService } from "../../services"
import type { Home, HomeActivity } from "../../services/home/home.types"

/**
 * HOME-001 — Homes.
 *
 * The leadership view of every home the user has permission to see.
 * Cards are a fluid grid now; clicking a card opens a modal with the
 * full breakdown (occupancy, coverage, recent activity, quick actions).
 * This keeps the list view breathable and avoids cramping the detail on
 * small screens where the sticky sidebar used to collide with the grid.
 *
 * Permission gates
 *   home.view            — shows the page (filtered at RequirePermission)
 *   home.analytics.view  — reveals the coverage/occupancy numbers
 *   people.view          — reveals "People in care" / "View rota" actions
 */

const ratingTone = (r: Home["rating"]) => {
  switch (r) {
    case "outstanding":
      return "success"
    case "good":
      return "info"
    case "requires_improvement":
      return "warning"
    case "inadequate":
      return "danger"
  }
}

const HomesList: React.FC = () => {
  const { can, scope, setActiveHome, user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const canAnalytics = can("home.analytics.view")
  const canPeople = can("people.view")

  // HomeSvc feed: list of all homes the user has access to (the gateway
  // already scopes by `useAuth().user.homes`). We still filter client-
  // side because the mock returns the full list.
  const [homes, setHomes] = useState<Home[]>([])
  useEffect(() => {
    let cancelled = false
    void homeService.listHomes().then((list) => {
      if (!cancelled) setHomes(list)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Show only the homes the user has access to. Admin/home_manager see all;
  // others see their primary home.
  const visibleHomes = useMemo(() => {
    if (scope.homes.length === 0) return homes
    return homes.filter((h) => scope.homes.includes(h.name))
  }, [homes, scope.homes])

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = visibleHomes.find((h) => h.id === selectedId) ?? null

  // Activity feed per home — fetched lazily when a card opens so we only
  // load the rows the user is actually looking at.
  const [activity, setActivity] = useState<HomeActivity[]>([])
  useEffect(() => {
    if (!selected) {
      setActivity([])
      return
    }
    let cancelled = false
    void homeService.getHomeActivity(selected.id).then((list) => {
      if (!cancelled) setActivity(list)
    })
    return () => {
      cancelled = true
    }
  }, [selected])

  const close = () => setSelectedId(null)

  const handlePeople = (h: Home) => {
    const homeRef = user.homes.find((uh) => uh.id === h.id)
    if (homeRef) setActiveHome(homeRef)
    close()
    navigate("/clients")
  }
  const handleRota = (h: Home) => {
    const homeRef = user.homes.find((uh) => uh.id === h.id)
    if (homeRef) setActiveHome(homeRef)
    close()
    navigate("/rota")
  }
  const handleNote = (h: Home) => {
    void homeService
      .addHomeNote(h.id, { text: "Note from leadership view" })
      .then((created) => {
        toast.success("Note saved", {
          description: `Visible to the management team on ${h.name}`,
        })
        // Prepend to the visible activity feed so the note shows up
        // immediately for the home that's still open.
        setActivity((list) => [created, ...list])
      })
  }

  const [viewMode, setViewMode] = useViewMode("icare.homes.view")

  return (
    <div className="homes">
      <PageHeader
        title="Homes"
        subtitle="Coverage, occupancy, and activity for every home you manage. Click a card for the full breakdown."
        actions={<ViewToggle value={viewMode} onChange={setViewMode} />}
      />

      {/* ── Home list ──────────────────────────────── */}
      {viewMode === "row" ? (
        <div className="homes__table card" role="table">
          <div className="homes__table-head" role="row">
            <span role="columnheader">Home</span>
            <span role="columnheader">Location</span>
            <span role="columnheader">Rating</span>
            <span role="columnheader">Residents</span>
            <span role="columnheader">Coverage</span>
            <span role="columnheader">Care types</span>
          </div>
          {visibleHomes.map((h) => (
            <button
              type="button"
              key={h.id}
              className="homes__table-row"
              role="row"
              onClick={() => setSelectedId(h.id)}
            >
              <span className="homes__table-name">{h.name}</span>
              <span>{h.location}</span>
              <span><span className={`badge badge--${ratingTone(h.rating)}`}>{RATING_LABEL[h.rating]}</span></span>
              <span>{h.residents} / {h.capacity}</span>
              <span className={h.coverage >= 95 ? "is-good" : h.coverage >= 85 ? "is-ok" : "is-warn"}>{h.coverage}%</span>
              <span className="homes__table-tags">{h.careTypes.join(", ")}</span>
            </button>
          ))}
        </div>
      ) : (
      <div className="homes__grid" role="list">
        {visibleHomes.map((h) => {
          const occupancy = Math.round((h.residents / h.capacity) * 100)
          return (
            <button
              type="button"
              role="listitem"
              key={h.id}
              className="homes__card card"
              onClick={() => setSelectedId(h.id)}
            >
              <div className="homes__card-head">
                <div>
                  <div className="homes__card-name">{h.name}</div>
                  <div className="homes__card-loc">{h.location}</div>
                </div>
                <span className={`badge badge--${ratingTone(h.rating)}`}>
                  {RATING_LABEL[h.rating]}
                </span>
              </div>

              <ul className="homes__card-tags">
                {h.careTypes.map((t) => (
                  <li key={t} className="homes__tag">
                    {t}
                  </li>
                ))}
              </ul>

              {canAnalytics && (
                <dl className="homes__card-stats">
                  <div>
                    <dt>Residents</dt>
                    <dd>
                      {h.residents}
                      <span className="muted"> / {h.capacity}</span>
                    </dd>
                  </div>
                  <div>
                    <dt>Occupancy</dt>
                    <dd>{occupancy}%</dd>
                  </div>
                  <div>
                    <dt>Coverage</dt>
                    <dd
                      className={
                        h.coverage >= 95
                          ? "is-good"
                          : h.coverage >= 85
                          ? "is-ok"
                          : "is-warn"
                      }
                    >
                      {h.coverage}%
                    </dd>
                  </div>
                </dl>
              )}

              <div className="homes__card-foot">
                <span className="homes__card-hint">{h.highlight}</span>
                <span className="homes__card-arrow" aria-hidden="true">
                  ›
                </span>
              </div>
            </button>
          )
        })}
      </div>
      )}

      {/* ── Detail modal ─────────────────────────────── */}
      <Modal
        open={!!selected}
        onClose={close}
        size="lg"
        eyebrow="HOME DETAIL"
        title={selected?.name ?? "Home"}
        description={selected?.location}
        footer={
          selected &&
          canPeople && (
            <>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => handleNote(selected)}
              >
                Add note
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => handleRota(selected)}
              >
                View rota
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => handlePeople(selected)}
              >
                People in care
              </button>
            </>
          )
        }
      >
        {selected && (
          <div className="homes__modal">
            <div className="homes__modal-badges">
              <span className={`badge badge--${ratingTone(selected.rating)}`}>
                {RATING_LABEL[selected.rating]}
              </span>
              {selected.careTypes.map((t) => (
                <span key={t} className="badge badge--neutral">
                  {t}
                </span>
              ))}
            </div>

            {canAnalytics && (
              <>
                <section>
                  <h4 className="homes__section-title">Coverage</h4>
                  <div className="homes__coverage-bar" aria-hidden="true">
                    <span
                      className="homes__coverage-fill"
                      style={{ width: `${selected.coverage}%` }}
                    />
                  </div>
                  <div className="homes__coverage-meta">
                    <span>
                      <strong>
                        {selected.staffOnShift} / {selected.staffRequired}
                      </strong>{" "}
                      on shift now
                    </span>
                    <span>{selected.coverage}% this week</span>
                  </div>
                </section>

                <section>
                  <h4 className="homes__section-title">Occupancy</h4>
                  <dl className="homes__mini-stats">
                    <div>
                      <dt>Residents</dt>
                      <dd>{selected.residents}</dd>
                    </div>
                    <div>
                      <dt>Capacity</dt>
                      <dd>{selected.capacity}</dd>
                    </div>
                    <div>
                      <dt>Free beds</dt>
                      <dd>{selected.capacity - selected.residents}</dd>
                    </div>
                  </dl>
                </section>
              </>
            )}

            <section>
              <h4 className="homes__section-title">Recent activity</h4>
              {activity.length === 0 ? (
                <p className="homes__detail-empty">Nothing to show.</p>
              ) : (
                <ul className="homes__activity">
                  {activity.map((a) => (
                    <li
                      key={a.id}
                      className={`homes__activity-item homes__activity-item--${a.kind}`}
                    >
                      <span className="homes__activity-when">{a.when}</span>
                      <span className="homes__activity-summary">{a.summary}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default HomesList
