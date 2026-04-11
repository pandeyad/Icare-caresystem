export type SubjectRow = {
  id: string
  code: string
  name: string
  initials: string
  home: string
  keyworker: string
  lastReviewDays: number
  status: "stable" | "needs-review" | "new" | "transitioning"
}

export const SUBJECTS: SubjectRow[] = [
  { id: "s1", code: "A-1142", name: "Ashanti K.", initials: "AK", home: "Willow House", keyworker: "Priya A.", lastReviewDays: 2, status: "stable" },
  { id: "s2", code: "A-1139", name: "Beatrice M.", initials: "BM", home: "Willow House", keyworker: "Daniel T.", lastReviewDays: 14, status: "needs-review" },
  { id: "s3", code: "A-1138", name: "Chen Wei", initials: "CW", home: "Willow House", keyworker: "Amira O.", lastReviewDays: 1, status: "stable" },
  { id: "s4", code: "A-1137", name: "Daria P.", initials: "DP", home: "Willow House", keyworker: "Priya A.", lastReviewDays: 21, status: "needs-review" },
  { id: "s5", code: "A-1136", name: "Elena R.", initials: "ER", home: "Oakmoor", keyworker: "Tomás R.", lastReviewDays: 3, status: "stable" },
  { id: "s6", code: "A-1135", name: "Finn O.", initials: "FO", home: "Oakmoor", keyworker: "Clara F.", lastReviewDays: 0, status: "new" },
  { id: "s7", code: "A-1134", name: "Grace I.", initials: "GI", home: "Willow House", keyworker: "Daniel T.", lastReviewDays: 7, status: "transitioning" },
  { id: "s8", code: "A-1133", name: "Hiroki T.", initials: "HT", home: "Willow House", keyworker: "Amira O.", lastReviewDays: 5, status: "stable" },
]
