import React, { useId, useMemo } from "react"
import "./DateTimeField.scss"

/**
 * DateTimeField — a typed datetime picker with timezone disclosure.
 *
 * Why a wrapper:
 *   • All shift / override / leave forms used to ship loose strings like
 *     "Mon 14 Apr · 07:00–15:00", which is impossible to compare, sort, or
 *     pass to the backend. Now every datetime input is a real
 *     `<input type="datetime-local">` and emits an ISO-friendly value
 *     (`2026-04-14T07:00`).
 *   • The browser shows the value in the user's local zone but never tells
 *     them which zone that is. We surface the IANA zone + UTC offset right
 *     under the input so the user knows what they're picking, and the
 *     backend can store everything in UTC and stay region-agnostic.
 *
 * The wrapper deliberately stays uncontrolled-friendly: pass `defaultValue`
 * for forms that submit via `FormData`, or `value` + `onChange` for
 * controlled state.
 */

export type DateTimeFieldProps = {
  name: string
  label: string
  /** Show "* required" hint and forward `required` to the input. */
  required?: boolean
  /** Uncontrolled initial value (`yyyy-mm-ddTHH:mm`). */
  defaultValue?: string
  /** Controlled value. If provided, prefer over `defaultValue`. */
  value?: string
  onChange?: (value: string) => void
  /** Optional custom hint shown after the timezone line. */
  hint?: string
  /** Earliest selectable datetime (`yyyy-mm-ddTHH:mm`). */
  min?: string
  /** Latest selectable datetime. */
  max?: string
  /** Minute granularity (default 5). */
  step?: number
}

const formatOffset = (date: Date): string => {
  const offsetMin = -date.getTimezoneOffset() // east of UTC is positive
  const sign = offsetMin >= 0 ? "+" : "−"
  const abs = Math.abs(offsetMin)
  const hh = String(Math.floor(abs / 60)).padStart(2, "0")
  const mm = String(abs % 60).padStart(2, "0")
  return `UTC${sign}${hh}:${mm}`
}

/**
 * Read-only static accessor — used both inside DateTimeField and exported
 * so callers can show "All times in BST · Europe/London" elsewhere.
 */
export const useTimezoneLabel = (): { zone: string; offset: string } =>
  useMemo(() => {
    const zone =
      typeof Intl !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : "UTC"
    return { zone, offset: formatOffset(new Date()) }
  }, [])

const DateTimeField: React.FC<DateTimeFieldProps> = ({
  name,
  label,
  required = false,
  defaultValue,
  value,
  onChange,
  hint,
  min,
  max,
  step = 5,
}) => {
  const id = useId()
  const { zone, offset } = useTimezoneLabel()

  // Translate minutes → seconds for the HTML attribute.
  const stepAttr = Math.max(60, step * 60)

  return (
    <label className="form-field datetime-field" htmlFor={id}>
      <span className="form-field__label">
        {label}
        {required && <span className="datetime-field__required"> *</span>}
      </span>
      <input
        id={id}
        type="datetime-local"
        name={name}
        className="form-field__control datetime-field__input"
        defaultValue={value === undefined ? defaultValue : undefined}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        min={min}
        max={max}
        step={stepAttr}
        required={required}
      />
      <span className="form-field__hint datetime-field__hint">
        Times shown in <strong>{zone}</strong>
        <span className="datetime-field__offset">({offset})</span>
        <span className="datetime-field__utc-note">
          · stored as UTC, displayed in your local zone
        </span>
        {hint && <span className="datetime-field__custom-hint"> — {hint}</span>}
      </span>
    </label>
  )
}

export default DateTimeField
