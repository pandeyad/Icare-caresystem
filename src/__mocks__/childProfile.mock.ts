import type { ChildProfileProps } from "../pages/Profiles/Types/childProfile.model";

export const CHILD_PROFILE_MOCK: ChildProfileProps = {
  fullName: "John Michael Smith",
  dobText: "March 15, 2015 (Age: 10 years)",
  childId: "HC-2024-001",
  admissionDate: "January 10, 2024",
  homeName: "Sunshine Home",
  homeHref: "home_details.html",
  medicalConditions: "None reported",
  viewHomeHref: "home_details.html",
  viewHistoryHref: "child_history.html",
  addCommentHref: "add_comment.html",

  caretakerName: "Sarah Johnson",
  caretakerHref: "caretaker_profile.html?id=CT-001",
  caretakerPhone: "(555) 123-4567",
  caretakerEmailText: "[email protected]",

  recentHistory: [
    {
      date: "December 20, 2024",
      text: "Annual health checkup completed. All results normal.",
    },
    {
      date: "December 15, 2024",
      text: "Participated in community outing to local park. Enjoyed activities with peers.",
    },
    {
      date: "December 10, 2024",
      text: "Parent visitation completed. Positive interaction reported.",
    },
    {
      date: "December 1, 2024",
      text: "Enrolled in art therapy program. Showing enthusiasm and creativity.",
    },
  ],

  caretakerComments: [
    {
      dateTime: "December 21, 2024 - 3:45 PM",
      authorName: "Sarah Johnson",
      authorHref: "caretaker_profile.html?id=CT-001",
      text:
        "John has been doing wonderfully this week. He's engaging well with other children and showing great progress in his studies. Very proud of his achievements in math class.",
    },
  ],
};
