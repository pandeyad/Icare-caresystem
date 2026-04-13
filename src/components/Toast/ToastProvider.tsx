import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { AnimatePresence, motion } from "framer-motion"
import "./Toast.scss"

/**
 * Lightweight app-wide toast system.
 *
 * Buttons all over the v2 IA call `toast.success(...)` / `toast.info(...)` etc.
 * to confirm an action happened — approvals, overrides, exports, request
 * submissions. Since there's no backend yet, this is how we give the user
 * feedback that a button *did something*.
 *
 *   const toast = useToast()
 *   toast.success("Swap request submitted")
 *   toast.info("Drafted override saved", { description: "Ready for review" })
 *
 * Rendered via <Toaster /> mounted inside AppShell. Auto-dismiss after 3.6s
 * unless the toast is `duration: 0`.
 */

export type ToastTone = "info" | "success" | "warning" | "danger"

export type ToastItem = {
  id: string
  tone: ToastTone
  title: string
  description?: string
  duration: number
}

type ToastContextValue = {
  show: (
    tone: ToastTone,
    title: string,
    opts?: { description?: string; duration?: number }
  ) => void
  info: (t: string, o?: { description?: string; duration?: number }) => void
  success: (t: string, o?: { description?: string; duration?: number }) => void
  warning: (t: string, o?: { description?: string; duration?: number }) => void
  danger: (t: string, o?: { description?: string; duration?: number }) => void
}

type InternalCtx = ToastContextValue & {
  items: ToastItem[]
  dismiss: (id: string) => void
}

const ToastCtx = createContext<InternalCtx | null>(null)

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastCtx)
  if (!ctx) {
    // Soft fallback — during tests / storybook it's fine to no-op rather than
    // crash the tree. Real runtime always has the provider.
    const noop = () => {}
    return {
      show: noop,
      info: noop,
      success: noop,
      warning: noop,
      danger: noop,
    }
  }
  return ctx
}

let seq = 0

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setItems((list) => list.filter((t) => t.id !== id))
  }, [])

  const show = useCallback<ToastContextValue["show"]>(
    (tone, title, opts = {}) => {
      const id = `t-${Date.now()}-${++seq}`
      const item: ToastItem = {
        id,
        tone,
        title,
        description: opts.description,
        duration: opts.duration ?? 3600,
      }
      setItems((list) => [...list, item])
    },
    []
  )

  const value = useMemo<InternalCtx>(
    () => ({
      items,
      dismiss,
      show,
      info: (t, o) => show("info", t, o),
      success: (t, o) => show("success", t, o),
      warning: (t, o) => show("warning", t, o),
      danger: (t, o) => show("danger", t, o),
    }),
    [items, dismiss, show]
  )

  return <ToastCtx.Provider value={value}>{children}</ToastCtx.Provider>
}

export const Toaster: React.FC = () => {
  const ctx = useContext(ToastCtx)
  if (!ctx) return null
  return (
    <div className="toaster" aria-live="polite" aria-atomic="false">
      <AnimatePresence mode="popLayout">
        {ctx.items.map((t) => (
          <ToastRow key={t.id} item={t} onDismiss={() => ctx.dismiss(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

const toastVariants = {
  initial: { opacity: 0, y: -8, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, x: 80, scale: 0.96 },
}

const ToastRow: React.FC<{ item: ToastItem; onDismiss: () => void }> = ({
  item,
  onDismiss,
}) => {
  useEffect(() => {
    if (item.duration === 0) return
    const handle = window.setTimeout(onDismiss, item.duration)
    return () => window.clearTimeout(handle)
  }, [item.duration, onDismiss])

  const glyph =
    item.tone === "success"
      ? "✓"
      : item.tone === "warning"
      ? "!"
      : item.tone === "danger"
      ? "×"
      : "i"

  return (
    <motion.div
      className={`toast toast--${item.tone}`}
      role="status"
      layout
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <span className="toast__glyph" aria-hidden="true">
        {glyph}
      </span>
      <div className="toast__body">
        <div className="toast__title">{item.title}</div>
        {item.description && (
          <div className="toast__desc">{item.description}</div>
        )}
      </div>
      <button
        type="button"
        className="toast__close"
        aria-label="Dismiss"
        onClick={onDismiss}
      >
        ×
      </button>
    </motion.div>
  )
}
