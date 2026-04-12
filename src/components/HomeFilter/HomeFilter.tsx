import React from "react"
import "./HomeFilter.scss"
import { useAuth } from "../../auth/AuthContext"

/**
 * HomeFilter — inline home-scoping dropdown for pages that need home context.
 *
 * Reads from `useAuth().user.homes` and writes to `activeHome` /
 * `setActiveHome`. When the user has only one home, nothing renders —
 * filtering is meaningless.
 *
 * Drop this into a PageHeader's `actions` slot or anywhere in a page's
 * toolbar to let the user scope that view to a single home.
 */

type Props = {
  /** Extra CSS class for layout positioning. */
  className?: string
}

const HomeFilter: React.FC<Props> = ({ className }) => {
  const { user, activeHome, setActiveHome } = useAuth()

  if (user.homes.length <= 1) return null

  return (
    <div className={`home-filter${className ? ` ${className}` : ""}`}>
      <select
        value={activeHome?.id ?? ""}
        onChange={(e) => {
          const home = user.homes.find((h) => h.id === e.target.value)
          setActiveHome(home ?? null)
        }}
        aria-label="Filter by home"
        className="home-filter__select"
      >
        <option value="">All homes</option>
        {user.homes.map((h) => (
          <option key={h.id} value={h.id}>
            {h.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default HomeFilter
