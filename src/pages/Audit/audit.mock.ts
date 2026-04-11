export type AuditSeverity = "info" | "notice" | "warning" | "critical"
export type AuditChannel = "auth" | "rota" | "care" | "permissions"

export type AuditEvent = {
  id: string
  at: string // ISO-ish display string
  actor: string
  actorRole: string
  action: string
  target: string
  channel: AuditChannel
  severity: AuditSeverity
}

export const AUDIT_EVENTS: AuditEvent[] = [
  { id: "e1", at: "2026-04-11 07:02", actor: "Amira O.", actorRole: "HCA", action: "Clocked in", target: "Shift #W-8821", channel: "rota", severity: "info" },
  { id: "e2", at: "2026-04-11 06:48", actor: "Tomás R.", actorRole: "Nurse", action: "Logged medication given", target: "Subject A-1139", channel: "care", severity: "info" },
  { id: "e3", at: "2026-04-11 06:32", actor: "System", actorRole: "Rota scheduler", action: "Auto-filled vacancy", target: "Shift #W-8870 · Willow House", channel: "rota", severity: "notice" },
  { id: "e4", at: "2026-04-11 03:14", actor: "Daniel T.", actorRole: "HCA", action: "Logged incident", target: "Subject A-1137 · IN-0219", channel: "care", severity: "warning" },
  { id: "e5", at: "2026-04-10 22:10", actor: "Priya A.", actorRole: "Home Manager", action: "Granted permission", target: "audit:read to Clara F.", channel: "permissions", severity: "warning" },
  { id: "e6", at: "2026-04-10 21:55", actor: "Priya A.", actorRole: "Home Manager", action: "Published rota", target: "Week 15 · Apr 14–20", channel: "rota", severity: "notice" },
  { id: "e7", at: "2026-04-10 18:03", actor: "Clara F.", actorRole: "HCA", action: "Sign-in failed (bad password)", target: "-", channel: "auth", severity: "warning" },
  { id: "e8", at: "2026-04-10 17:41", actor: "Priya A.", actorRole: "Home Manager", action: "Accepted swap", target: "Amira O. ↔ Daniel T.", channel: "rota", severity: "info" },
  { id: "e9", at: "2026-04-10 16:12", actor: "Auditor (SVC)", actorRole: "External", action: "Exported evidence pack", target: "Home: Willow · Mar 2026", channel: "permissions", severity: "critical" },
  { id: "e10", at: "2026-04-10 14:00", actor: "Tomás R.", actorRole: "Nurse", action: "Closed care plan revision", target: "Subject A-1142", channel: "care", severity: "info" },
]
