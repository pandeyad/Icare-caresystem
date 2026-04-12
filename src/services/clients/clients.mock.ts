/**
 * ClientsSvc mock — per-client profile, comments, and service history.
 *
 * The base client roster comes from `home/residents.mock.ts` (same rows
 * that back `homeService.listResidents`); this file *layers* detail on
 * top — date of birth, keyworker, admission date, comments timeline,
 * and a chronological service-history feed.
 *
 * On the real backend this data is the composition of two domains:
 *   • HomeSvc (who lives where, basic demographics)
 *   • CareSvc (care plan, medication, incidents, notes)
 * ClientsSvc is the gateway aggregator that returns a single merged
 * row per client so the UI doesn't have to fan out on every render.
 */
import type { SubjectRow } from "../home/residents.mock"
import { SUBJECTS } from "../home/residents.mock"

/** Where a client is in their service journey. */
export type ClientStatus = SubjectRow["status"]

export type ClientProfile = SubjectRow & {
  /** ISO date — the resident's date of birth. */
  dateOfBirth: string
  /** Derived age in years. Pre-computed in the mock. */
  age: number
  primaryContact: {
    name: string
    relation: string
    phone: string
  }
  /** ISO date — first admitted into care. */
  admissionDate: string
  roomNumber: string
  summary: string
}

export type ClientComment = {
  id: string
  clientId: string
  authorId: string
  author: string
  authorRole: string
  /** Display string ("2026-04-11 14:32" or "2 h ago"). */
  at: string
  body: string
  /** If set, this comment is a reply to the given parent comment. */
  parentId: string | null
}

export type ServiceEventKind =
  | "admission"
  | "care_plan"
  | "medication_review"
  | "incident"
  | "appointment"
  | "note"

export type ServiceEvent = {
  id: string
  clientId: string
  at: string
  kind: ServiceEventKind
  summary: string
  by: string
}

const PROFILE_DETAIL: Record<
  string,
  Omit<ClientProfile, keyof SubjectRow>
> = {
  s1: {
    dateOfBirth: "1945-03-18",
    age: 81,
    primaryContact: {
      name: "Miriam K.",
      relation: "Daughter",
      phone: "+44 7700 900018",
    },
    admissionDate: "2023-02-14",
    roomNumber: "W-102",
    summary:
      "Stable; mild arthritis managed with scheduled paracetamol. Prefers morning walks in the garden courtyard when weather allows.",
  },
  s2: {
    dateOfBirth: "1938-11-02",
    age: 87,
    primaryContact: {
      name: "Geoff M.",
      relation: "Son",
      phone: "+44 7700 900139",
    },
    admissionDate: "2021-09-03",
    roomNumber: "W-215",
    summary:
      "Care plan review overdue (14 days). Advanced dementia; one-to-one at mealtimes required and night-time orientation cues.",
  },
  s3: {
    dateOfBirth: "1952-06-27",
    age: 73,
    primaryContact: {
      name: "Mei Wei",
      relation: "Spouse",
      phone: "+44 7700 900138",
    },
    admissionDate: "2024-07-12",
    roomNumber: "W-109",
    summary:
      "Post-stroke rehabilitation. Mobility improving week-on-week. Weekly physio scheduled Tues + Thurs.",
  },
  s4: {
    dateOfBirth: "1940-01-12",
    age: 86,
    primaryContact: {
      name: "Ola P.",
      relation: "Niece",
      phone: "+44 7700 900137",
    },
    admissionDate: "2022-05-30",
    roomNumber: "W-221",
    summary:
      "Care plan revision in progress. Type-2 diabetes — low-sugar diet and post-meal blood glucose checks.",
  },
  s5: {
    dateOfBirth: "1947-09-09",
    age: 78,
    primaryContact: {
      name: "Javier R.",
      relation: "Son",
      phone: "+44 7700 900136",
    },
    admissionDate: "2023-11-25",
    roomNumber: "O-104",
    summary:
      "Stable. Enjoys reading group on Wednesdays. Low-dose anticoagulant monitored monthly.",
  },
  s6: {
    dateOfBirth: "1955-04-22",
    age: 70,
    primaryContact: {
      name: "Ailís O.",
      relation: "Daughter",
      phone: "+44 7700 900135",
    },
    admissionDate: "2026-03-28",
    roomNumber: "O-210",
    summary:
      "New admission — still settling in. Familiarising with the morning routine and keyworker.",
  },
  s7: {
    dateOfBirth: "1943-12-08",
    age: 82,
    primaryContact: {
      name: "Arthur I.",
      relation: "Husband",
      phone: "+44 7700 900134",
    },
    admissionDate: "2024-01-19",
    roomNumber: "W-207",
    summary:
      "Transitioning from day-care to full residency. Daughter visits weekly; care plan re-balancing in progress.",
  },
  s8: {
    dateOfBirth: "1949-08-15",
    age: 76,
    primaryContact: {
      name: "Yuka T.",
      relation: "Wife",
      phone: "+44 7700 900133",
    },
    admissionDate: "2022-12-07",
    roomNumber: "W-118",
    summary:
      "Stable, Parkinson's managed with scheduled medication windows. Enjoys music therapy sessions.",
  },
}

/** Merged list: base residents + per-client detail. */
export const CLIENTS: ClientProfile[] = SUBJECTS.map((row) => ({
  ...row,
  ...PROFILE_DETAIL[row.id],
}))

export const CLIENT_COMMENTS: ClientComment[] = [
  {
    id: "cc-1",
    clientId: "s1",
    authorId: "tm-5",
    author: "Priya A.",
    authorRole: "Home Manager",
    at: "2026-04-10 16:40",
    body: "Ashanti mentioned knee pain again this morning. Let's review with the GP at the next visit.",
    parentId: null,
  },
  {
    id: "cc-1r1",
    clientId: "s1",
    authorId: "tm-1",
    author: "Amira O.",
    authorRole: "HCA",
    at: "2026-04-10 17:05",
    body: "Noted — she also mentioned it during afternoon tea. I'll flag it in the handover notes.",
    parentId: "cc-1",
  },
  {
    id: "cc-1r2",
    clientId: "s1",
    authorId: "tm-5",
    author: "Priya A.",
    authorRole: "Home Manager",
    at: "2026-04-10 17:20",
    body: "Thanks Amira. GP visit is Thursday — I'll add it to the agenda.",
    parentId: "cc-1",
  },
  {
    id: "cc-2",
    clientId: "s1",
    authorId: "tm-1",
    author: "Amira O.",
    authorRole: "HCA",
    at: "2026-04-09 09:12",
    body: "Morning walk went well — 12 minutes, no assistance required.",
    parentId: null,
  },
  {
    id: "cc-3",
    clientId: "s2",
    authorId: "tm-4",
    author: "Tomás R.",
    authorRole: "Nurse",
    at: "2026-04-11 06:50",
    body: "Logged scheduled 06:30 medication. No missed doses overnight.",
    parentId: null,
  },
  {
    id: "cc-4",
    clientId: "s2",
    authorId: "tm-2",
    author: "Daniel T.",
    authorRole: "HCA",
    at: "2026-04-10 22:05",
    body: "Night-time orientation routine worked well tonight — no wandering.",
    parentId: null,
  },
  {
    id: "cc-4r1",
    clientId: "s2",
    authorId: "tm-5",
    author: "Priya A.",
    authorRole: "Home Manager",
    at: "2026-04-11 07:15",
    body: "Good to hear. Let's keep tracking this — three consecutive good nights means we can reduce the check frequency.",
    parentId: "cc-4",
  },
  {
    id: "cc-5",
    clientId: "s4",
    authorId: "tm-2",
    author: "Daniel T.",
    authorRole: "HCA",
    at: "2026-04-11 03:20",
    body: "Brief dizziness event during 03:00 check. Blood pressure normal on re-test. Monitoring.",
    parentId: null,
  },
  {
    id: "cc-5r1",
    clientId: "s4",
    authorId: "tm-4",
    author: "Tomás R.",
    authorRole: "Nurse",
    at: "2026-04-11 06:45",
    body: "Reviewed — BP stable at 06:30 check. Will keep an eye during day shift. Could be positional.",
    parentId: "cc-5",
  },
  {
    id: "cc-6",
    clientId: "s5",
    authorId: "tm-5",
    author: "Priya A.",
    authorRole: "Home Manager",
    at: "2026-04-08 11:15",
    body: "Family visit scheduled for next Saturday — please confirm visiting slot on the board.",
    parentId: null,
  },
  {
    id: "cc-7",
    clientId: "s6",
    authorId: "tm-3",
    author: "Clara F.",
    authorRole: "HCA",
    at: "2026-04-11 08:30",
    body: "Settling well into the morning routine. First group breakfast today.",
    parentId: null,
  },
]

export const CLIENT_SERVICE_HISTORY: ServiceEvent[] = [
  // s1 — Ashanti
  {
    id: "se-1",
    clientId: "s1",
    at: "2023-02-14",
    kind: "admission",
    summary: "Admitted to Willow House West wing",
    by: "Priya A.",
  },
  {
    id: "se-2",
    clientId: "s1",
    at: "2025-11-30",
    kind: "care_plan",
    summary: "Care plan annual review · mobility goals updated",
    by: "Tomás R.",
  },
  {
    id: "se-3",
    clientId: "s1",
    at: "2026-04-10",
    kind: "note",
    summary: "Closed care plan revision (stable)",
    by: "Tomás R.",
  },
  // s2 — Beatrice
  {
    id: "se-4",
    clientId: "s2",
    at: "2021-09-03",
    kind: "admission",
    summary: "Admitted to Willow House East wing",
    by: "Priya A.",
  },
  {
    id: "se-5",
    clientId: "s2",
    at: "2026-03-28",
    kind: "medication_review",
    summary: "Quarterly medication review completed",
    by: "Tomás R.",
  },
  {
    id: "se-6",
    clientId: "s2",
    at: "2026-04-11",
    kind: "medication_review",
    summary: "Scheduled 06:30 medication administered",
    by: "Tomás R.",
  },
  // s3 — Chen Wei
  {
    id: "se-7",
    clientId: "s3",
    at: "2024-07-12",
    kind: "admission",
    summary: "Admitted post-stroke for rehabilitation",
    by: "Priya A.",
  },
  {
    id: "se-8",
    clientId: "s3",
    at: "2026-04-09",
    kind: "appointment",
    summary: "Weekly physiotherapy session",
    by: "External · Physio",
  },
  // s4 — Daria
  {
    id: "se-9",
    clientId: "s4",
    at: "2022-05-30",
    kind: "admission",
    summary: "Admitted to Willow House",
    by: "Priya A.",
  },
  {
    id: "se-10",
    clientId: "s4",
    at: "2026-04-11",
    kind: "incident",
    summary: "Brief dizziness during 03:00 check — monitored, BP normal",
    by: "Daniel T.",
  },
  // s5 — Elena
  {
    id: "se-11",
    clientId: "s5",
    at: "2023-11-25",
    kind: "admission",
    summary: "Admitted to Oakmoor House",
    by: "Priya A.",
  },
  {
    id: "se-12",
    clientId: "s5",
    at: "2026-04-05",
    kind: "medication_review",
    summary: "Monthly anticoagulant levels within range",
    by: "Tomás R.",
  },
  // s6 — Finn
  {
    id: "se-13",
    clientId: "s6",
    at: "2026-03-28",
    kind: "admission",
    summary: "New admission — Oakmoor House",
    by: "Priya A.",
  },
  {
    id: "se-14",
    clientId: "s6",
    at: "2026-04-05",
    kind: "care_plan",
    summary: "Initial care plan drafted with family",
    by: "Priya A.",
  },
  // s7 — Grace
  {
    id: "se-15",
    clientId: "s7",
    at: "2024-01-19",
    kind: "admission",
    summary: "Day-care admission, Willow House",
    by: "Priya A.",
  },
  {
    id: "se-16",
    clientId: "s7",
    at: "2026-04-07",
    kind: "note",
    summary: "Transition to full residency approved",
    by: "Priya A.",
  },
  // s8 — Hiroki
  {
    id: "se-17",
    clientId: "s8",
    at: "2022-12-07",
    kind: "admission",
    summary: "Admitted to Willow House West wing",
    by: "Priya A.",
  },
  {
    id: "se-18",
    clientId: "s8",
    at: "2026-04-10",
    kind: "appointment",
    summary: "Music therapy session attended",
    by: "External · Therapist",
  },
]
