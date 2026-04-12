/**
 * RotaSvc types — individual staff entries at arbitrary time granularity.
 *
 * Each entry represents one person's assignment for a time window within
 * a single calendar day. Night shifts crossing midnight are split into
 * two entries. Start/end times can be at any minute (07:15, 14:45, etc.).
 */

export type EntryType = "shift" | "overtime" | "leave" | "swap"

export type RotaEntry = {
  id: string
  date: string          // yyyy-mm-dd
  startTime: string     // HH:mm
  endTime: string       // HH:mm
  type: EntryType
  staffId: string
  staffName: string
  staffRole: string
  teamId: string
  teamName: string
  note?: string         // e.g. "Covering for Daniel T."
}

export type RotaDay = {
  date: string
  dayLabel: string
}

export type RotaWeek = {
  weekStart: string
  weekLabel: string
  homeId: string
  homeName: string
  days: RotaDay[]
  entries: RotaEntry[]
}

export type TeamRoster = {
  id: string
  name: string
  members: TeamMember[]
}

export type TeamMember = {
  id: string
  name: string
  role: string
}

export type ListWeekQuery = {
  homeId?: string
  weekStart: string
}
