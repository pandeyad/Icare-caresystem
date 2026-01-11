import type { EmployeeRotaData } from "../pages/Rota/Types/exmployeeRota.model";

export const EMPLOYEE_ROTA_MOCK: EmployeeRotaData = {
  headerTitle: "📅 My Rota",
  headerSubtitle: "Employee Schedule Management",
  user: { name: "Sarah Johnson", roleLabel: "Primary Caretaker", employeeId: "EMP-001" },

  tabs: [
    { key: "calendar", label: "📅 Calendar View" },
    { key: "shifts", label: "📋 My Shifts" },
    { key: "leave", label: "🏖️ Leave Requests" },
    { key: "swap", label: "🔄 Shift Swaps" },
  ],

  stats: [
    { label: "Total Hours This Month", value: 168 },
    { label: "Shifts This Week", value: 5, gradient: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)" },
    { label: "Pending Requests", value: 2, gradient: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)" },
    { label: "Available Leave Days", value: 12, gradient: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)" },
  ],

  calendar: {
    monthLabel: "December 2024",
    dayHeaders: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    gridDays: [
      { dayNumber: 1 },
      { dayNumber: 2, shift: { time: "07:00 - 15:00", location: "Sunshine Home" } },
      { dayNumber: 3, shift: { time: "07:00 - 15:00", location: "Sunshine Home" } },
      { dayNumber: 4 },
      { dayNumber: 5, shift: { time: "15:00 - 23:00", location: "Sunshine Home" } },
      { dayNumber: 6, shift: { time: "15:00 - 23:00", location: "Hope House" } },
      { dayNumber: 7 },
      { dayNumber: 8 },
      { dayNumber: 9, shift: { time: "07:00 - 15:00", location: "Sunshine Home" } },
      { dayNumber: 10, shift: { time: "07:00 - 15:00", location: "Sunshine Home" } },
      { dayNumber: 11, shift: { time: "07:00 - 15:00", location: "Sunshine Home" } },
      { dayNumber: 12, shift: { time: "15:00 - 23:00", location: "Sunshine Home" } },
      { dayNumber: 13, shift: { time: "15:00 - 23:00", location: "Hope House" } },
      { dayNumber: 14 },
      { dayNumber: 15 },
      { dayNumber: 16, shift: { time: "07:00 - 15:00", location: "Sunshine Home" } },
      { dayNumber: 17, shift: { time: "07:00 - 15:00", location: "Sunshine Home" } },
      { dayNumber: 18, shift: { time: "07:00 - 15:00", location: "Sunshine Home" } },
      { dayNumber: 19, shift: { time: "15:00 - 23:00", location: "Sunshine Home" } },
      { dayNumber: 20, shift: { time: "15:00 - 23:00", location: "Hope House" } },
      { dayNumber: 21 },
      { dayNumber: 22, isToday: true, shift: { time: "07:00 - 15:00", location: "Sunshine Home" } },
      { dayNumber: 23, shift: { time: "07:00 - 15:00", location: "Sunshine Home" } },
      { dayNumber: 24, shift: { time: "07:00 - 15:00", location: "Sunshine Home" } },
      { dayNumber: 25 },
      { dayNumber: 26, shift: { time: "15:00 - 23:00", location: "Sunshine Home" } },
      { dayNumber: 27, shift: { time: "15:00 - 23:00", location: "Hope House" } },
      { dayNumber: 28 },
      { dayNumber: 29 },
      { dayNumber: 30, shift: { time: "07:00 - 15:00", location: "Sunshine Home" } },
      { dayNumber: 31, shift: { time: "07:00 - 15:00", location: "Sunshine Home" } },
    ],
  },

  shifts: [
    { id: "shift-22", dateISO: "2024-12-22", title: "Morning Shift - Sunshine Home", time: "07:00 - 15:00", childrenAssigned: 3, location: "Sunshine Home" },
    { id: "shift-23", dateISO: "2024-12-23", title: "Morning Shift - Sunshine Home", time: "07:00 - 15:00", childrenAssigned: 3, location: "Sunshine Home" },
    { id: "shift-24", dateISO: "2024-12-24", title: "Morning Shift - Sunshine Home", time: "07:00 - 15:00", childrenAssigned: 4, location: "Sunshine Home" },
    { id: "shift-26", dateISO: "2024-12-26", title: "Evening Shift - Sunshine Home", time: "15:00 - 23:00", childrenAssigned: 3, location: "Sunshine Home" },
    { id: "shift-27", dateISO: "2024-12-27", title: "Evening Shift - Hope House", time: "15:00 - 23:00", childrenAssigned: 5, location: "Hope House" },
  ],

  leave: {
    formTitle: "Request Time Off",
    historyTitle: "Leave Request History",
    history: [
      { id: "leave-1", title: "Annual Leave Request", datesText: "📅 Jan 15, 2025 - Jan 19, 2025 (5 days)", metaText: "Submitted: Dec 20, 2024", status: "pending" },
      { id: "leave-2", title: "Personal Leave", datesText: "📅 Dec 28, 2024 (1 day)", metaText: "Submitted: Dec 18, 2024", status: "pending" },
      { id: "leave-3", title: "Annual Leave", datesText: "📅 Dec 9, 2024 - Dec 11, 2024 (3 days)", metaText: "Approved by: Manager John Smith", status: "approved" },
      { id: "leave-4", title: "Sick Leave", datesText: "📅 Nov 22, 2024 (1 day)", metaText: "Approved by: Manager John Smith", status: "approved" },
    ],
  },

  swap: {
    introTitle: "Request Shift Swap",
    introText: "Select a colleague to swap shifts with. They will receive a notification and can accept or decline.",
    colleagues: [
      { id: "c1", name: "Michael Brown", role: "Relief Caretaker", avatarEmoji: "👨‍⚕️", availability: "available" },
      { id: "c2", name: "Emily Davis", role: "Senior Caretaker", avatarEmoji: "👩‍⚕️", availability: "available" },
      { id: "c3", name: "Robert Wilson", role: "Caretaker", avatarEmoji: "👨‍⚕️", availability: "available" },
      { id: "c4", name: "Lisa Anderson", role: "Caretaker", avatarEmoji: "👩‍⚕️", availability: "limited" },
    ],
    pendingTitle: "Pending Swap Requests",
    incomingTitle: "Incoming Swap Requests",
    requests: [
      {
        id: "sr-2024-003",
        title: "Swap Request #SR-2024-003",
        status: "pending",
        leftLabel: "Your Shift",
        left: { dateText: "📅 Dec 26, 2024", timeText: "🕐 15:00 - 23:00", location: "🏠 Sunshine Home" },
        rightLabel: "Michael Brown's Shift",
        right: { dateText: "📅 Dec 27, 2024", timeText: "🕐 07:00 - 15:00", location: "🏠 Hope House" },
        footerText: "Requested: Dec 20, 2024 • Reason: Family commitment",
      },
      {
        id: "incoming-1",
        title: "Swap Request from Emily Davis",
        status: "new",
        leftLabel: "Emily's Shift",
        left: { dateText: "📅 Dec 30, 2024", timeText: "🕐 07:00 - 15:00", location: "🏠 Sunshine Home" },
        rightLabel: "Your Shift",
        right: { dateText: "📅 Dec 31, 2024", timeText: "🕐 07:00 - 15:00", location: "🏠 Sunshine Home" },
        footerText: "Requested: Dec 21, 2024 • Reason: Medical appointment",
        showActions: true,
      },
    ],
  },
};
