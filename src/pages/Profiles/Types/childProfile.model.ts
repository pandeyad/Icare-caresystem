export type HistoryItem = {
  date: string;
  text: string;
};

export type CommentItem = {
  dateTime: string;
  authorName: string;
  authorHref: string;
  authorMeta?: string; // e.g., "(Relief Caretaker)"
  text: string;
};

export type ChildProfileProps = {
  title?: string;
  subtitle?: string;

  // Photo
  photoUrl?: string; // if provided, show <img>, else placeholder
  photoAlt?: string;
  photoEmoji?: string;

  // Child details
  fullName: string;
  dobText: string;
  childId: string;
  admissionDate: string;

  homeName: string;
  homeHref: string;

  medicalConditions: string;

  // Actions
  viewHomeHref: string;
  viewHistoryHref: string;
  addCommentHref: string;

  // Caretaker
  caretakerName: string;
  caretakerHref: string;
  caretakerPhone: string;
  caretakerEmailText: string; // keep simple text; avoid Cloudflare decode script in React
  caretakerIconEmoji?: string;

  // Sections
  recentHistory: HistoryItem[];
  caretakerComments: CommentItem[];
};
