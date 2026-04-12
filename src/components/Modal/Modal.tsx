import React, { useEffect } from "react"
import "./Modal.scss"

/**
 * Modal primitive.
 *
 * Used by:
 *   - MyDashboard         — Request swap / Request leave forms
 *   - TeamOverview        — Override assign picker
 *   - HomesList           — Home detail popup
 *
 * Renders a centered card over a scrim. Escape + scrim click both close.
 * `size` adjusts max-width. `footer` is optional and floats to the bottom.
 *
 * Intentionally simple — no focus-trap library, just auto-focuses the close
 * button on mount which is good enough for the demo.
 */

type Size = "sm" | "md" | "lg"

type Props = {
  open: boolean
  onClose: () => void
  title: string
  eyebrow?: string
  description?: string
  size?: Size
  footer?: React.ReactNode
  children: React.ReactNode
}

const Modal: React.FC<Props> = ({
  open,
  onClose,
  title,
  eyebrow,
  description,
  size = "md",
  footer,
  children,
}) => {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    // Lock page scroll while the modal is visible.
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className="modal__scrim"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className={`modal__card modal__card--${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal__head">
          <div className="modal__head-text">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h2 className="modal__title">{title}</h2>
            {description && <p className="modal__desc">{description}</p>}
          </div>
          <button
            type="button"
            className="modal__close"
            aria-label="Close"
            onClick={onClose}
            autoFocus
          >
            ×
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__footer">{footer}</footer>}
      </div>
    </div>
  )
}

export default Modal
