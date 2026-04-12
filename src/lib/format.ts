/**
 * Display-only datetime formatters shared across the app.
 *
 * These helpers take an ISO local-clock datetime string
 * (`"yyyy-mm-ddTHH:mm"`) and render the friendly strings used on
 * the Manage hub, Team Overview, My Dashboard, and Calendar pages.
 *
 * They are intentionally pure display helpers with no service-side
 * dependency, which is why they live under `src/lib/` and not inside
 * any service client. Keep them independent of locale settings so the
 * whole app reads the same way.
 */

/**
 * Format an ISO local datetime ("yyyy-mm-ddTHH:mm") into a friendly
 * display string. Used by override drafts, swap activity, and the
 * working-week snapshot wherever a single point in time is shown.
 */
export const formatLocalDateTime = (iso: string): string => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

/**
 * Format an ISO local datetime range ("yyyy-mm-ddTHH:mm" to
 * "yyyy-mm-ddTHH:mm") into a friendly display string of the form
 * "Wed 9 Apr · 07:00–15:00". Used anywhere a shift or override window
 * is rendered as a single chip.
 */
export const formatLocalRange = (startISO: string, endISO: string): string => {
  const a = new Date(startISO)
  const b = new Date(endISO)
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) {
    return `${startISO} – ${endISO}`
  }
  const datePart = a.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
  const fmt = (d: Date) =>
    d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  return `${datePart} · ${fmt(a)}–${fmt(b)}`
}
