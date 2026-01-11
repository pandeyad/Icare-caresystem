export function formatMonthShort(dateISO: string) {
  const d = new Date(dateISO + "T00:00:00");
  return d.toLocaleString(undefined, { month: "short" });
}

export function formatDayNumber(dateISO: string) {
  const d = new Date(dateISO + "T00:00:00");
  return String(d.getDate());
}
