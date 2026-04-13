import React, { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import "./Clients.scss"
import PageHeader from "../../components/PageHeader/PageHeader"
import { PageTransition, FadeIn, staggerContainer, staggerItem, standardTransition } from "../../components/Motion"
import HomeFilter from "../../components/HomeFilter/HomeFilter"
import ViewToggle, { useViewMode } from "../../components/ViewToggle/ViewToggle"
import { useAuth } from "../../auth/AuthContext"
import { clientsService } from "../../services"
import type {
  ClientProfile,
  ClientStatus,
} from "../../services/clients/clients.types"

/**
 * CLIENT-001 — Clients list.
 *
 * The people-in-care workspace. Each card shows the client's code, home,
 * keyworker, and current status chip; clicking a card opens the detail
 * page (`/clients/:id`) with profile / comments / service history tabs.
 *
 * Permission gates
 *   people.view     — full access (home managers and up). Sees every
 *                     client in the caller's home scope and the contact
 *                     panel in the detail page.
 *   team.view.all   — read-only access (team leads). Sees the same list
 *                     but without contact details / edit affordances.
 *
 * The nav item requires `people.view OR team.view.all` so professionals
 * without either never see this tab.
 */

const statusLabel: Record<ClientStatus, string> = {
  stable: "Stable",
  "needs-review": "Needs review",
  new: "New admission",
  transitioning: "Transitioning",
}

const statusTone: Record<ClientStatus, "neutral" | "success" | "warning" | "info"> = {
  stable: "success",
  "needs-review": "warning",
  new: "info",
  transitioning: "neutral",
}

type StatusFilter = "all" | ClientStatus

const STATUS_ORDER: ClientStatus[] = [
  "stable",
  "needs-review",
  "new",
  "transitioning",
]

const ClientsList: React.FC = () => {
  const { user, scope, can } = useAuth()
  const canSeeAll = can("people.view")

  // ClientsSvc feed — scoped to the caller's visible homes.
  // Users with `people.view` see all clients in their home scope.
  // Everyone else sees only clients where they are primary or assigned owner.
  const [clients, setClients] = useState<ClientProfile[]>([])
  useEffect(() => {
    let cancelled = false
    void clientsService
      .listClients({ homes: scope.homes, ownerId: canSeeAll ? undefined : user.id })
      .then((list) => {
        if (!cancelled) setClients(list)
      })
    return () => {
      cancelled = true
    }
  }, [scope.homes, user.id, canSeeAll])

  const [status, setStatus] = useState<StatusFilter>("all")
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    let list = clients
    if (status !== "all") list = list.filter((c) => c.status === status)
    if (query.trim()) {
      const needle = query.toLowerCase()
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(needle) ||
          c.code.toLowerCase().includes(needle) ||
          c.keyworker.toLowerCase().includes(needle)
      )
    }
    return list
  }, [clients, status, query])

  const counts = useMemo(() => {
    const m: Record<ClientStatus, number> = {
      stable: 0,
      "needs-review": 0,
      new: 0,
      transitioning: 0,
    }
    for (const c of clients) m[c.status] += 1
    return m
  }, [clients])

  const [viewMode, setViewMode] = useViewMode("icare.clients.view")

  return (
    <PageTransition><div className="clients">
      <PageHeader
        title="Clients"
        subtitle="Profiles, care history, and notes for every resident in your home scope."
        actions={<><HomeFilter /><ViewToggle value={viewMode} onChange={setViewMode} /></>}
      />

      {/* ── Filter bar ─────────────────────────────────── */}
      <FadeIn><div className="clients__filters">
        <div className="clients__chips" role="group" aria-label="Status">
          <button
            type="button"
            className={`clients__chip ${status === "all" ? "is-on" : ""}`}
            onClick={() => setStatus("all")}
            aria-pressed={status === "all"}
          >
            All clients
            <span className="clients__chip-count">{clients.length}</span>
          </button>
          {STATUS_ORDER.map((s) => (
            <button
              type="button"
              key={s}
              className={`clients__chip clients__chip--${s} ${
                status === s ? "is-on" : ""
              }`}
              onClick={() => setStatus(s)}
              aria-pressed={status === s}
            >
              {statusLabel[s]}
              <span className="clients__chip-count">{counts[s]}</span>
            </button>
          ))}
        </div>
        <label className="clients__search">
          <span className="sr-only">Search clients</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, code, or keyworker…"
          />
        </label>
      </div></FadeIn>

      {/* ── Client list ──────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="clients__empty card card--padded">
          <h3>No clients match</h3>
          <p>Try clearing the filter or broadening the search.</p>
        </div>
      ) : viewMode === "row" ? (
        <FadeIn className="clients__table card" as="div">
          <div className="clients__table-head" role="row">
            <span role="columnheader">Name</span>
            <span role="columnheader">Code</span>
            <span role="columnheader">Status</span>
            <span role="columnheader">Age</span>
            <span role="columnheader">Room</span>
            <span role="columnheader">Home</span>
            <span role="columnheader">Keyworker</span>
          </div>
          {filtered.map((c, index) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...standardTransition, delay: index * 0.03 }}
            >
              <Link
                to={`/clients/${c.id}`}
                className="clients__table-row"
                role="row"
              >
                <span className="clients__table-name">
                  <span className="clients__avatar clients__avatar--sm" aria-hidden="true">{c.initials}</span>
                  {c.name}
                </span>
                <span className="clients__table-code">{c.code}</span>
                <span><span className={`badge badge--${statusTone[c.status]}`}>{statusLabel[c.status]}</span></span>
                <span>{c.age}</span>
                <span>{c.roomNumber}</span>
                <span>{c.home}</span>
                <span>{c.keyworker}</span>
              </Link>
            </motion.div>
          ))}
        </FadeIn>
      ) : (
        <motion.div className="clients__grid" role="list" variants={staggerContainer} initial="initial" animate="animate">
          {filtered.map((c) => (
            <motion.div key={c.id} variants={staggerItem} transition={standardTransition} whileHover={{ y: -3, transition: { duration: 0.15 } }}>
              <Link
                to={`/clients/${c.id}`}
                role="listitem"
                className="clients__card card"
              >
                <div className="clients__card-head">
                  <div className="clients__avatar" aria-hidden="true">
                    {c.initials}
                  </div>
                  <div className="clients__card-title">
                    <div className="clients__card-name">{c.name}</div>
                    <div className="clients__card-code">{c.code}</div>
                  </div>
                  <span className={`badge badge--${statusTone[c.status]}`}>
                    {statusLabel[c.status]}
                  </span>
                </div>

                <dl className="clients__card-stats">
                  <div>
                    <dt>Age</dt>
                    <dd>{c.age}</dd>
                  </div>
                  <div>
                    <dt>Room</dt>
                    <dd>{c.roomNumber}</dd>
                  </div>
                  <div>
                    <dt>Home</dt>
                    <dd>{c.home}</dd>
                  </div>
                </dl>

                <div className="clients__card-foot">
                  <span className="clients__card-hint">
                    Keyworker · {c.keyworker}
                  </span>
                  <span className="clients__card-arrow" aria-hidden="true">
                    ›
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div></PageTransition>
  )
}

export default ClientsList
