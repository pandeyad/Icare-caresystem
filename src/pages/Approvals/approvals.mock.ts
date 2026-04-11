export type ApprovalTab = "swaps" | "leave" | "permissions"

export type ApprovalItem = {
  id: string
  tab: ApprovalTab
  title: string
  reason: string
  requester: { name: string; initials: string; role: string }
  when: string
  tone: "info" | "warning" | "danger"
  meta: string[]
}

export const APPROVAL_ITEMS: ApprovalItem[] = [
  {
    id: "ap-1",
    tab: "swaps",
    title: "Swap Mon 07:00 day shift → Wed 07:00",
    reason: "Childcare conflict — partner is travelling Monday.",
    requester: { name: "Amira O.", initials: "AO", role: "HCA · 3 years" },
    when: "2 h ago",
    tone: "warning",
    meta: ["Willow Ward", "8 h shift", "Cover confirmed: Daniel T."],
  },
  {
    id: "ap-2",
    tab: "swaps",
    title: "Swap Thu overnight → Fri overnight",
    reason: "Personal appointment cannot be rescheduled.",
    requester: { name: "Clara F.", initials: "CF", role: "HCA · 1 year" },
    when: "6 h ago",
    tone: "info",
    meta: ["Oakmoor Ward", "10 h shift", "Cover pending"],
  },
  {
    id: "ap-3",
    tab: "leave",
    title: "Annual leave · Apr 14 – Apr 18",
    reason: "Family visit, booked 6 weeks in advance.",
    requester: { name: "Daniel T.", initials: "DT", role: "HCA · 4 years" },
    when: "Yesterday",
    tone: "info",
    meta: ["5 working days", "Balance after: 12 days", "No rota conflict"],
  },
  {
    id: "ap-4",
    tab: "leave",
    title: "Compassionate leave · Apr 12 only",
    reason: "Bereavement. Short-notice request.",
    requester: { name: "Tomás R.", initials: "TR", role: "Nurse · 6 years" },
    when: "30 min ago",
    tone: "danger",
    meta: ["Urgent", "Auto-approved under policy 4.2", "Awaiting your sign-off"],
  },
  {
    id: "ap-5",
    tab: "permissions",
    title: "Grant audit:read to Clara F.",
    reason: "Team Lead promotion — needs to review care events.",
    requester: { name: "Priya A.", initials: "PA", role: "Home Manager" },
    when: "Yesterday",
    tone: "warning",
    meta: ["Step-up auth required", "Expires: 2026-10-10", "Scoped: Willow House"],
  },
]
