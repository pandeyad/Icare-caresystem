/*
 * Sidebar navigation config.
 *
 * Shape mirrors the three-subsystem IA from
 * docs/02-ui-ux/04-information-architecture.md:
 *   Overview → Management → Rota → Professional
 *
 * Each NavItem renders as a clickable row in the sidebar. The NavSection
 * grouping drives the visual sub-headings. Icons are inline emoji so we
 * don't drag in an icon lib during the prototype phase — swap for Lucide
 * once the icon set is finalised.
 */
import { STRINGS } from "../i18n/strings"

export type NavItem = {
  id: string
  to: string
  label: string
  icon: string
  /**
   * When the sidebar item should treat a URL as "active" beyond an exact
   * match. For example the Rota parent is active for any /rota/* child.
   */
  matchPrefix?: string
  /**
   * Catalog ID from docs/02-ui-ux/05-screen-catalog.md — kept for
   * traceability. Not shown to users.
   */
  catalogId?: string
}

export type NavSection = {
  id: string
  label: string
  items: NavItem[]
}

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "overview",
    label: STRINGS.nav.section.overview,
    items: [
      {
        id: "dashboard",
        to: "/",
        label: STRINGS.nav.dashboard,
        icon: "◎",
        catalogId: "MGT-001",
      },
    ],
  },
  {
    id: "management",
    label: STRINGS.nav.section.management,
    items: [
      {
        id: "subjects",
        to: "/subjects",
        label: STRINGS.nav.subjects,
        icon: "⦿",
        catalogId: "MGT-002",
      },
      {
        id: "profile-example",
        to: "/child/profile",
        label: STRINGS.nav.childProfile,
        icon: "◐",
        catalogId: "MGT-003",
      },
      {
        id: "audit",
        to: "/audit",
        label: STRINGS.nav.audit,
        icon: "≡",
        catalogId: "MGT-004",
      },
      {
        id: "approvals",
        to: "/approvals",
        label: STRINGS.nav.approvals,
        icon: "✓",
        catalogId: "MGT-006",
      },
    ],
  },
  {
    id: "rota",
    label: STRINGS.nav.section.rota,
    items: [
      {
        id: "manager-rota",
        to: "/rota/manager",
        label: STRINGS.nav.managerRota,
        icon: "◇",
        matchPrefix: "/rota/manager",
        catalogId: "ROT-001",
      },
      {
        id: "employee-rota",
        to: "/rota/employee",
        label: STRINGS.nav.employeeRota,
        icon: "○",
        matchPrefix: "/rota/employee",
        catalogId: "ROT-001",
      },
    ],
  },
  {
    id: "professional",
    label: STRINGS.nav.section.professional,
    items: [
      {
        id: "today-shift",
        to: "/professional/today",
        label: STRINGS.nav.todayShift,
        icon: "●",
        catalogId: "PRO-001",
      },
    ],
  },
]
