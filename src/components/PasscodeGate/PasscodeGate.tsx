import React, { useCallback, useEffect, useState } from "react"
import "./PasscodeGate.scss"

const STORAGE_KEY = "icare.access.unlocked"

/**
 * Client-side passcode gate for demo / staging deployments.
 *
 * Inspired by the Designali Creative Suite globe component — features a
 * purple-to-blue gradient backdrop with animated concentric rings and a
 * glassmorphism login card.
 *
 * When `VITE_ACCESS_CODE` is set, visitors must enter the passcode before the
 * app renders. The unlock state persists in `sessionStorage` so refreshes
 * within the same tab don't re-prompt.
 *
 * If the env var is empty or unset the gate is transparent (renders children
 * immediately) — handy for local dev.
 */
const PasscodeGate: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const accessCode = import.meta.env.VITE_ACCESS_CODE as string | undefined

  // If no access code configured, skip the gate entirely.
  if (!accessCode) return <>{children}</>

  return <Gate code={accessCode}>{children}</Gate>
}

/* ── Inner component (only mounts when a code is configured) ─────────── */

const Gate: React.FC<{ code: string; children: React.ReactNode }> = ({
  code,
  children,
}) => {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === "1"
    } catch {
      return false
    }
  })
  const [value, setValue] = useState("")
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const inputRef = useCallback((el: HTMLInputElement | null) => {
    el?.focus()
  }, [])

  useEffect(() => {
    if (!shake) return
    const t = setTimeout(() => setShake(false), 500)
    return () => clearTimeout(t)
  }, [shake])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim() === code) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1")
      } catch {
        /* storage denied */
      }
      setUnlocked(true)
    } else {
      setError(true)
      setShake(true)
      setValue("")
    }
  }

  if (unlocked) return <>{children}</>

  return (
    <div className="passcode-gate">
      {/* Gradient background */}
      <div className="passcode-gate__backdrop" />

      {/* Animated concentric rings — decorative globe element */}
      <div className="passcode-gate__rings" aria-hidden="true">
        <div className="passcode-gate__ring passcode-gate__ring--1" />
        <div className="passcode-gate__ring passcode-gate__ring--2" />
        <div className="passcode-gate__ring passcode-gate__ring--3" />
        <div className="passcode-gate__ring passcode-gate__ring--4" />
        <div className="passcode-gate__ring-core" />
      </div>

      {/* Secondary rings — top-left for depth */}
      <div className="passcode-gate__rings passcode-gate__rings--secondary" aria-hidden="true">
        <div className="passcode-gate__ring passcode-gate__ring--1" />
        <div className="passcode-gate__ring passcode-gate__ring--2" />
        <div className="passcode-gate__ring passcode-gate__ring--3" />
      </div>

      {/* Login card */}
      <form
        className={`passcode-gate__card${shake ? " passcode-gate__card--shake" : ""}`}
        onSubmit={handleSubmit}
      >
        <div className="passcode-gate__logo" aria-hidden="true">
          <span className="passcode-gate__logo-letter">I</span>
        </div>

        <h1 className="passcode-gate__title">ICare</h1>
        <p className="passcode-gate__badge">Care Management Suite</p>
        <p className="passcode-gate__subtitle">
          Enter the access code to continue
        </p>

        <label className="passcode-gate__field">
          <input
            ref={inputRef}
            type="password"
            className="passcode-gate__input"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setError(false)
            }}
            placeholder="Access code"
            autoComplete="off"
            aria-invalid={error}
            aria-describedby={error ? "gate-error" : undefined}
          />
        </label>

        {error && (
          <p id="gate-error" className="passcode-gate__error" role="alert">
            Incorrect code. Please try again.
          </p>
        )}

        <button type="submit" className="passcode-gate__btn">
          Unlock
          <span className="passcode-gate__btn-arrow" aria-hidden="true">
            &rarr;
          </span>
        </button>

        <p className="passcode-gate__footer">
          Protected staging environment
        </p>
      </form>
    </div>
  )
}

export default PasscodeGate
