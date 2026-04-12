/*
 * Sidebar navigation config (v3 — grouped categories).
 *
 * Every tab is visible to every authenticated user. What changes is the
 * *content* each user sees — pages scope their data and features through
 * `useAuth().can(perm)` internally. The sidebar never hides items; it is
 * the same for a professional, a team lead, and a home manager.
 */

export type NavItem = {
  id: string
  to: string
  label: string
  /** Short glyph used in both expanded and collapsed sidebar. */
  icon: string
  /**
   * When the sidebar item should treat a URL as "active" beyond an exact
   * match. For example /homes is active for any /homes/* child.
   */
  matchPrefix?: string
  /** Optional short description shown as a tooltip on hover (collapsed mode). */
  hint?: string
}

export type NavGroup = {
  id: string
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "analytics",
    label: "Analytics",
    items: [
      { id: "me", to: "/me", label: "Dashboard", icon: "📊", hint: "Your hours, leaves, and open requests" },
      { id: "metrics", to: "/metrics", label: "Metrics", icon: "📈", hint: "KPIs, daily snapshots, and trends" },
    ],
  },
  {
    id: "care",
    label: "Care",
    items: [
      { id: "homes", to: "/homes", label: "Homes", icon: "⌂", matchPrefix: "/homes", hint: "Care homes you oversee" },
      { id: "team", to: "/team", label: "Team", icon: "👥", matchPrefix: "/team", hint: "Your teammates and their schedules" },
      { id: "clients", to: "/clients", label: "Clients", icon: "☺", matchPrefix: "/clients", hint: "Per-client profile, care history, and notes" },
    ],
  },
  {
    id: "manage",
    label: "Manage",
    items: [
      { id: "manage", to: "/manage", label: "Manage", icon: "⚙", matchPrefix: "/manage", hint: "Leaves, swaps, overtime, and permissions" },
    ],
  },
  {
    id: "schedule",
    label: "Schedule",
    items: [
      { id: "calendar", to: "/calendar", label: "Calendar", icon: "📅", hint: "Shifts, swaps, and leaves at a glance" },
      { id: "rota", to: "/rota", label: "Rota", icon: "🔄", matchPrefix: "/rota", hint: "Weekly team coverage and shift schedules" },
    ],
  },
  {
    id: "audit",
    label: "Audit",
    items: [
      { id: "audit", to: "/audit", label: "Audit Log", icon: "📝", matchPrefix: "/audit", hint: "Every significant event, append-only" },
    ],
  },
]

/** Flat list for backward compat (route matching, etc.). */
export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items)
