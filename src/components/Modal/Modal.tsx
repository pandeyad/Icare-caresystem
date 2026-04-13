import React, { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
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

const scrimVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

const cardVariants = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 4, scale: 0.98 },
}

const cardTransition = { duration: 0.2, ease: [0.2, 0.8, 0.2, 1] as const }

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

  return (
    <AnimatePresence>
      {open && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.button
            type="button"
            className="modal__scrim"
            aria-label="Close"
            onClick={onClose}
            variants={scrimVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.15 }}
          />
          <motion.div
            className={`modal__card modal__card--${size}`}
            onClick={(e) => e.stopPropagation()}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={cardTransition}
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Modal
