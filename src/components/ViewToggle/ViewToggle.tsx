import React from "react"
import "./ViewToggle.scss"

/**
 * Card / Row view toggle. Persists preference to localStorage under the
 * given `storageKey`.
 */

export type ViewMode = "card" | "row"

type Props = {
  value: ViewMode
  onChange: (mode: ViewMode) => void
}

const ViewToggle: React.FC<Props> = ({ value, onChange }) => (
  <div className="view-toggle" role="group" aria-label="View mode">
    <button
      type="button"
      className={`view-toggle__btn ${value === "card" ? "is-active" : ""}`}
      onClick={() => onChange("card")}
      aria-pressed={value === "card"}
      title="Card view"
    >
      <span aria-hidden="true">▦</span>
    </button>
    <button
      type="button"
      className={`view-toggle__btn ${value === "row" ? "is-active" : ""}`}
      onClick={() => onChange("row")}
      aria-pressed={value === "row"}
      title="Row view"
    >
      <span aria-hidden="true">≡</span>
    </button>
  </div>
)

export default ViewToggle

/** Hook to persist view mode preference. */
export const useViewMode = (key: string, fallback: ViewMode = "card"): [ViewMode, (m: ViewMode) => void] => {
  const [mode, setMode] = React.useState<ViewMode>(() => {
    try {
      const stored = window.localStorage.getItem(key)
      if (stored === "card" || stored === "row") return stored
    } catch { /* */ }
    return fallback
  })

  const set = (m: ViewMode) => {
    setMode(m)
    try { window.localStorage.setItem(key, m) } catch { /* */ }
  }

  return [mode, set]
}
