/*
 * Mock data for the dashboard (MGT-001).
 * Lives next to the page (not in /__mocks__) so the contract is local.
 * All fixtures are hand-authored, not scraped — safe for screenshots.
 */

export type DashboardStat = {
  id: string
  label: string
  value: string
  delta: string
  trend: "up" | "down" | "flat"
  tone: "neutral" | "info" | "warning" | "success" | "danger"
}

export type AttentionItem = {
  id: string
  type: "swap" | "leave" | "incident" | "unfilled" | "audit"
  title: string
  meta: string
  tone: "warning" | "info" | "danger"
  when: string
  href: string
}

export type ActivityEntry = {
  id: string
  actor: string
  action: string
  target: string
  when: string
}

export type Shortcut = {
  id: string
  label: string
  icon: string
  href: string
  tone: "accent" | "neutral"
}

export const DASHBOARD_STATS: DashboardStat[] = [
  {
    id: "on-shift",
    label: "On shift",
    value: "14 / 16",
    delta: "2 short vs planned",
    trend: "down",
    tone: "warning",
  },
  {
    id: "approvals",
    label: "Pending approvals",
    value: "7",
    delta: "3 older than 24 h",
    trend: "flat",
    tone: "info",
  },
  {
    id: "incidents",
    label: "Open incidents",
    value: "2",
    delta: "1 logged overnight",
    trend: "up",
    tone: "danger",
  },
  {
    id: "coverage",
    label: "Rota coverage (7 d)",
    value: "96%",
    delta: "+2% vs last week",
    trend: "up",
    tone: "success",
  },
]

export const ATTENTION_ITEMS: AttentionItem[] = [
  {
    id: "at-1",
    type: "unfilled",
    title: "Sunday night shift unfilled · Willow House",
    meta: "21:00 – 07:00 · 1 HCA needed",
    tone: "danger",
    when: "In 14 h",
    href: "/rota/manager",
  },
  {
    id: "at-2",
    type: "swap",
    title: "Swap request from Amira O.",
    meta: "Mon 07:00 day shift → Wed 07:00",
    tone: "warning",
    when: "2 h ago",
    href: "/approvals",
  },
  {
    id: "at-3",
    type: "incident",
    title: "Incident IN-0219 awaits sign-off",
    meta: "Medication discrepancy · Low severity",
    tone: "warning",
    when: "5 h ago",
    href: "/audit",
  },
  {
    id: "at-4",
    type: "leave",
    title: "Leave request · Daniel T.",
    meta: "Annual leave · 14 – 18 Apr",
    tone: "info",
    when: "Yesterday",
    href: "/approvals",
  },
]

export const ACTIVITY_LOG: ActivityEntry[] = [
  {
    id: "ac-1",
    actor: "Amira O.",
    action: "Clocked in for",
    target: "Day shift · Willow Ward",
    when: "07:02",
  },
  {
    id: "ac-2",
    actor: "You",
    action: "Published rota for",
    target: "Week 15 · Apr 14 – Apr 20",
    when: "Yesterday · 17:41",
  },
  {
    id: "ac-3",
    actor: "System",
    action: "Auto-rotated care plan for",
    target: "Subject #A-1142",
    when: "Yesterday · 03:00",
  },
  {
    id: "ac-4",
    actor: "Tomás R.",
    action: "Logged medication given for",
    target: "Subject #A-1139",
    when: "06:48",
  },
  {
    id: "ac-5",
    actor: "Clara F.",
    action: "Requested a swap with",
    target: "Daniel T. · Thu overnight",
    when: "06:15",
  },
]

export const SHORTCUTS: Shortcut[] = [
  { id: "sc-1", label: "Publish rota", icon: "◇", href: "/rota/manager", tone: "accent" },
  { id: "sc-2", label: "Add a person", icon: "+", href: "/subjects", tone: "neutral" },
  { id: "sc-3", label: "Log incident", icon: "!", href: "/audit", tone: "neutral" },
  { id: "sc-4", label: "Export audit pack", icon: "↓", href: "/audit", tone: "neutral" },
]
