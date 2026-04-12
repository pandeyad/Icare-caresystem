import React, { useCallback, useEffect, useState } from "react"
import "./PasscodeGate.scss"

const STORAGE_KEY = "icare.access.unlocked"

/**
 * Client-side passcode gate for demo / staging deployments.
 *
 * When `VITE_ACCESS_CODE` is set, visitors must enter the passcode before the
 * app renders. The unlock state persists in `sessionStorage` so refreshes
 * within the same tab don't re-prompt.
 *
 * If the env var is empty or unset the gate is transparent (renders children
 * immediately) — handy for local dev.
 *
 * NOTE: This is a *casual* access barrier. The passcode ships inside the JS
 * bundle and can be found by anyone who inspects the source. For real
 * authentication, use server-side middleware or Vercel Pro's password
 * protection.
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

  // Auto-focus the input on mount.
  const inputRef = useCallback((el: HTMLInputElement | null) => {
    el?.focus()
  }, [])

  // Clear shake animation after it plays.
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
      <div className="passcode-gate__backdrop" />

      <form
        className={`passcode-gate__card${shake ? " passcode-gate__card--shake" : ""}`}
        onSubmit={handleSubmit}
      >
        <div className="passcode-gate__logo" aria-hidden="true">
          I
        </div>
        <h1 className="passcode-gate__title">ICare</h1>
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
        </button>
      </form>
    </div>
  )
}

export default PasscodeGate
