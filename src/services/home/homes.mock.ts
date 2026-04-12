/**
 * HomeSvc homes mock — source of truth for `Home`, `HomeActivity`, and
 * the `HOMES` / `HOME_ACTIVITY` seed data. Lives inside the services
 * tree so `homeService` can own its dependencies without reaching back
 * into `src/pages/Homes/*`.
 *
 * The legacy `pages/Homes/homes.mock.ts` keeps the `RATING_LABEL` UI
 * constant (used only by `HomesList.tsx` for card rendering) and now
 * imports the `Home` type from `services/home/home.types`.
 */
export type Home = {
  id: string
  name: string
  /** Short city-level location, not a full street address. */
  location: string
  /** Capacity = licensed beds, not current headcount. */
  capacity: number
  residents: number
  staffOnShift: number
  staffRequired: number
  /** Current coverage percent for the week. */
  coverage: number
  /** High-level care type mix. */
  careTypes: string[]
  /** Last CQC-style rating — for quick reassurance on the card. */
  rating: "outstanding" | "good" | "requires_improvement" | "inadequate"
  /** Headline metric that updates daily. */
  highlight: string
}

export const HOMES: Home[] = [
  {
    id: "home-willow",
    name: "Willow House",
    location: "Bristol · BS1",
    capacity: 42,
    residents: 39,
    staffOnShift: 18,
    staffRequired: 20,
    coverage: 90,
    careTypes: ["Residential", "Dementia"],
    rating: "good",
    highlight: "2 unfilled slots this week",
  },
  {
    id: "home-oakmoor",
    name: "Oakmoor House",
    location: "Bath · BA2",
    capacity: 28,
    residents: 26,
    staffOnShift: 11,
    staffRequired: 12,
    coverage: 92,
    careTypes: ["Residential", "Respite"],
    rating: "outstanding",
    highlight: "Fully compliant on last audit",
  },
  {
    id: "home-rowan",
    name: "Rowan Lodge",
    location: "Bristol · BS7",
    capacity: 24,
    residents: 22,
    staffOnShift: 9,
    staffRequired: 11,
    coverage: 82,
    careTypes: ["Nursing", "End-of-life"],
    rating: "good",
    highlight: "1 senior nurse on annual leave",
  },
]

export type HomeActivity = {
  id: string
  homeId: string
  when: string
  kind: "incident" | "admission" | "discharge" | "audit" | "note"
  summary: string
}

export const HOME_ACTIVITY: HomeActivity[] = [
  {
    id: "ha-1",
    homeId: "home-willow",
    when: "Today · 08:14",
    kind: "incident",
    summary: "Minor slip reported in West wing — no injury, noted by Priya A.",
  },
  {
    id: "ha-2",
    homeId: "home-willow",
    when: "Yesterday",
    kind: "admission",
    summary: "New resident admitted to Room 14 (dementia care pathway).",
  },
  {
    id: "ha-3",
    homeId: "home-oakmoor",
    when: "2d ago",
    kind: "audit",
    summary: "Medication audit passed — 0 discrepancies across 182 doses.",
  },
  {
    id: "ha-4",
    homeId: "home-rowan",
    when: "3d ago",
    kind: "note",
    summary: "Family meeting scheduled for Room 7 — care plan review.",
  },
]
