import type { RequestAction, ShiftBadgeValue, StaffChip, ManagerRotaData } from "../pages/Rota/Types/managerRota.models";


const approveRejectReview: RequestAction[] = [
  { key: "approve", label: "✓ Approve", tone: "approve" },
  { key: "reject", label: "✗ Reject", tone: "reject" },
  { key: "review", label: "👁️ Details", tone: "review" },
];

// const reviewOnly: RequestAction[] = [{ key: "review", label: "👁️ Review", tone: "review" }];
const monitorOnly: RequestAction[] = [{ key: "monitor", label: "👁️ Monitor", tone: "review" }];

const morning = (text: string): ShiftBadgeValue => ({ type: "morning", text });
const afternoon = (text: string): ShiftBadgeValue => ({ type: "afternoon", text });
const night = (text: string): ShiftBadgeValue => ({ type: "night", text });
const off = (): ShiftBadgeValue => ({ type: "off", text: "OFF" });

const chip = (id: string, avatarEmoji: string, name: string, timeText: string, isOnDuty?: boolean): StaffChip => ({
  id,
  avatarEmoji,
  name,
  timeText,
  isOnDuty,
});

export const MANAGER_ROTA_MOCK: ManagerRotaData = {
  headerTitle: "🏢 Manager Portal",
  headerSubtitle: "Rota & Staff Management System",
  user: { name: "John Smith", roleText: "Care Manager • Sunshine Home & Hope House" },

  tabs: [
    { key: "overview", label: "📊 Overview" },
    { key: "schedule", label: "📅 Team Schedule" },
    { key: "requests", label: "📬 Requests" },
    { key: "override", label: "⚡ Override/Assign" },
    { key: "coverage", label: "🏠 Coverage View" },
    { key: "analytics", label: "📈 Analytics" },
  ],

  stats: [
    { label: "Total Staff", value: 24 },
    { label: "On Duty Today", value: 12, gradient: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)" },
    { label: "Pending Requests", value: 7, gradient: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)" },
    { label: "Coverage Gaps", value: 2, gradient: "linear-gradient(135deg, #f44336 0%, #da190b 100%)" },
    { label: "Avg Hours/Week", value: 38, gradient: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)" },
  ],

  overview: {
    todayTitle: "Today's Schedule - Dec 22, 2024",
    todayRows: [
      {
        employeeId: "e1",
        name: "Sarah Johnson",
        role: "Primary Caretaker",
        avatarEmoji: "👩‍⚕️",
        shift: morning("07:00 - 15:00"),
        location: "Sunshine Home",
        childrenText: "3 Children",
        statusText: "✓ Checked In",
        statusTone: "success",
      },
      {
        employeeId: "e2",
        name: "Michael Brown",
        role: "Relief Caretaker",
        avatarEmoji: "👨‍⚕️",
        shift: morning("07:00 - 15:00"),
        location: "Hope House",
        childrenText: "4 Children",
        statusText: "✓ Checked In",
        statusTone: "success",
      },
      {
        employeeId: "e3",
        name: "Emily Davis",
        role: "Senior Caretaker",
        avatarEmoji: "👩‍⚕️",
        shift: afternoon("15:00 - 23:00"),
        location: "Sunshine Home",
        childrenText: "3 Children",
        statusText: "Scheduled",
        statusTone: "muted",
      },
      {
        employeeId: "e4",
        name: "Robert Wilson",
        role: "Caretaker",
        avatarEmoji: "👨‍⚕️",
        shift: afternoon("15:00 - 23:00"),
        location: "Hope House",
        childrenText: "5 Children",
        statusText: "Scheduled",
        statusTone: "muted",
      },
      {
        employeeId: "e5",
        name: "Lisa Anderson",
        role: "Caretaker",
        avatarEmoji: "👩‍⚕️",
        shift: night("23:00 - 07:00"),
        location: "Sunshine Home",
        childrenText: "3 Children",
        statusText: "Scheduled",
        statusTone: "muted",
      },
    ],
    quickActionsTitle: "Quick Actions",
    quickActions: [
      { id: "emergencyOverride", label: "⚡ Create Emergency Override" },
      { id: "reviewRequests", label: "📬 Review Pending Requests" },
      { id: "weeklyReport", label: "📊 Generate Weekly Report" },
      { id: "editSchedule", label: "📅 Edit Team Schedule" },
      { id: "notifyStaff", label: "📢 Send Staff Notification" },
    ],
  },

  schedule: {
    homes: [
      { value: "all", label: "All Homes" },
      { value: "sunshine", label: "Sunshine Home" },
      { value: "hope", label: "Hope House" },
    ],
    staffGroups: [
      { value: "all", label: "All Staff" },
      { value: "primary", label: "Primary Caretakers" },
      { value: "relief", label: "Relief Caretakers" },
      { value: "senior", label: "Senior Staff" },
    ],
    initialFilters: { home: "all", staffGroup: "all", week: "2024-W51" },
    columns: ["Employee", "Mon 23", "Tue 24", "Wed 25", "Thu 26", "Fri 27", "Sat 28", "Sun 29", "Hours"],
    rows: [
      {
        employeeId: "e1",
        name: "Sarah Johnson",
        avatarEmoji: "👩‍⚕️",
        days: [morning("07-15"), morning("07-15"), off(), afternoon("15-23"), afternoon("15-23"), off(), off()],
        hoursText: "32h",
      },
      {
        employeeId: "e2",
        name: "Michael Brown",
        avatarEmoji: "👨‍⚕️",
        days: [afternoon("15-23"), afternoon("15-23"), morning("07-15"), morning("07-15"), off(), morning("07-15"), off()],
        hoursText: "40h",
      },
      {
        employeeId: "e3",
        name: "Emily Davis",
        avatarEmoji: "👩‍⚕️",
        days: [off(), morning("07-15"), morning("07-15"), morning("07-15"), morning("07-15"), afternoon("15-23"), off()],
        hoursText: "40h",
      },
      {
        employeeId: "e4",
        name: "Robert Wilson",
        avatarEmoji: "👨‍⚕️",
        days: [night("23-07"), night("23-07"), off(), off(), night("23-07"), night("23-07"), night("23-07")],
        hoursText: "40h",
      },
      {
        employeeId: "e5",
        name: "Lisa Anderson",
        avatarEmoji: "👩‍⚕️",
        days: [morning("07-15"), off(), afternoon("15-23"), afternoon("15-23"), morning("07-15"), off(), morning("07-15")],
        hoursText: "40h",
      },
    ],
  },

  requests: {
    leaveTitle: "Pending Leave Requests",
    leaveCards: [
      {
        id: "leave-sarah",
        urgency: "urgent",
        avatarEmoji: "👩‍⚕️",
        title: "Sarah Johnson - Annual Leave",
        meta: "📅 Jan 15-19, 2025 (5 days) • Submitted: Dec 20, 2024",
        reasonText: "Reason: Family vacation already booked",
        actions: approveRejectReview,
      },
      {
        id: "leave-michael",
        urgency: "normal",
        avatarEmoji: "👨‍⚕️",
        title: "Michael Brown - Personal Leave",
        meta: "📅 Dec 28, 2024 (1 day) • Submitted: Dec 18, 2024",
        reasonText: "Reason: Medical appointment",
        actions: approveRejectReview,
      },
    ],
    swapTitle: "Pending Shift Swap Requests",
    swapCards: [
      {
        id: "swap-1",
        urgency: "normal",
        avatarEmoji: "👩‍⚕️",
        title: "Shift Swap: Sarah Johnson ⇄ Michael Brown",
        meta: "Sarah: Dec 26 (15:00-23:00) ⇄ Michael: Dec 27 (07:00-15:00)",
        reasonText: "Reason: Family commitment • Both parties agreed",
        actions: [
          { key: "approve", label: "✓ Approve Swap", tone: "approve" },
          { key: "reject", label: "✗ Reject", tone: "reject" },
          { key: "review", label: "👁️ Review", tone: "review" },
        ],
      },
      {
        id: "swap-2",
        urgency: "normal",
        avatarEmoji: "👩‍⚕️",
        title: "Shift Swap: Emily Davis ⇄ Lisa Anderson",
        meta: "Emily: Dec 30 (07:00-15:00) ⇄ Lisa: Dec 31 (07:00-15:00)",
        reasonText: "Reason: Medical appointment • Awaiting Lisa's response",
        actions: monitorOnly,
      },
    ],
  },

  override: {
    title: "Create Manual Override or Assignment",
    employeeOptions: [
      { value: "", label: "Select employee..." },
      { value: "sarah", label: "Sarah Johnson - Primary Caretaker" },
      { value: "michael", label: "Michael Brown - Relief Caretaker" },
      { value: "emily", label: "Emily Davis - Senior Caretaker" },
      { value: "robert", label: "Robert Wilson - Caretaker" },
      { value: "lisa", label: "Lisa Anderson - Caretaker" },
    ],
    homeOptions: [
      { value: "", label: "Select location..." },
      { value: "sunshine", label: "Sunshine Home" },
      { value: "hope", label: "Hope House" },
      { value: "rainbow", label: "Rainbow Care Center" },
    ],
    shiftOptions: [
      { value: "", label: "Select shift..." },
      { value: "morning", label: "Morning (07:00 - 15:00)" },
      { value: "afternoon", label: "Afternoon (15:00 - 23:00)" },
      { value: "night", label: "Night (23:00 - 07:00)" },
      { value: "custom", label: "Custom Time" },
    ],
    overrideTypeOptions: [
      { value: "", label: "Select type..." },
      { value: "emergency", label: "Emergency Coverage" },
      { value: "sickReplacement", label: "Sick Leave Replacement" },
      { value: "managerOverride", label: "Manager Override" },
      { value: "additionalCoverage", label: "Additional Coverage" },
    ],
    priorityOptions: [
      { value: "Normal", label: "Normal" },
      { value: "High", label: "High" },
      { value: "Critical", label: "Critical" },
    ],
    childrenOptions: [
      { value: "c1", label: "John Michael Smith (HC-2024-001)" },
      { value: "c2", label: "Emma Rose Davis (HC-2024-002)" },
      { value: "c3", label: "Lucas James Wilson (HC-2024-003)" },
      { value: "c4", label: "Sophia Marie Brown (HC-2024-004)" },
    ],
    recentTitle: "Recent Overrides",
    recentCards: [
      {
        id: "ov-1",
        avatarEmoji: "⚡",
        title: "Emergency Override - Robert Wilson",
        meta: "📅 Dec 22, 2024 • 15:00-23:00 • Hope House",
        reason: "Reason: Sick leave replacement for scheduled staff",
        statusPillText: "Active",
      },
    ],
  },

  coverage: {
    title: "Current Coverage Status by Home",
    homes: [
      {
        id: "sunshine",
        title: "🏠 Sunshine Home",
        status: "good",
        statusText: "✓ Fully Staffed",
        summaryText: "Children: 8 • Staff Required: 2 per shift • Current Staff: 2",
        onDutyTitle: "On Duty Now:",
        onDuty: [
          chip("sd1", "👩‍⚕️", "Sarah Johnson", "07:00-15:00", true),
          chip("sd2", "👨‍⚕️", "David Martinez", "07:00-15:00", true),
        ],
        upcomingTitle: "Upcoming Coverage:",
        upcoming: [
          chip("su1", "👩‍⚕️", "Emily Davis", "15:00-23:00"),
          chip("su2", "👨‍⚕️", "James Taylor", "15:00-23:00"),
          chip("su3", "👩‍⚕️", "Lisa Anderson", "23:00-07:00"),
        ],
      },
      {
        id: "hope",
        title: "🏠 Hope House",
        status: "warning",
        statusText: "⚠️ Minimal Coverage",
        summaryText: "Children: 12 • Staff Required: 3 per shift • Current Staff: 2",
        onDutyTitle: "On Duty Now:",
        onDuty: [
          chip("hd1", "👨‍⚕️", "Michael Brown", "07:00-15:00", true),
          chip("hd2", "👩‍⚕️", "Patricia Lee", "07:00-15:00", true),
          { id: "vac-1", avatarEmoji: "❌", name: "Vacancy", timeText: "Need Coverage", isVacancy: true },
        ],
        showFillVacancy: true,
      },
      {
        id: "rainbow",
        title: "🏠 Rainbow Care Center",
        status: "good",
        statusText: "✓ Well Staffed",
        summaryText: "Children: 6 • Staff Required: 2 per shift • Current Staff: 2",
        onDutyTitle: "On Duty Now:",
        onDuty: [
          chip("rd1", "👩‍⚕️", "Jennifer White", "07:00-15:00", true),
          chip("rd2", "👨‍⚕️", "Daniel Clark", "07:00-15:00", true),
        ],
      },
    ],
  },

  analytics: {
    title: "Staff & Schedule Analytics",
    charts: [
      { id: "ch1", title: "Weekly Hours Distribution", placeholderText: "📊 Chart: Hours per employee" },
      { id: "ch2", title: "Coverage by Home", placeholderText: "📈 Chart: Staff allocation" },
      { id: "ch3", title: "Leave Trends", placeholderText: "📉 Chart: Monthly leave requests" },
      { id: "ch4", title: "Shift Type Distribution", placeholderText: "🥧 Chart: Morning/Afternoon/Night" },
    ],
    performanceTitle: "Performance Metrics",
    performanceRows: [
      { employeeName: "Sarah Johnson", hoursThisMonth: "168h", onTimeCheckins: "98%", leaveDaysUsed: "3 days", overtimeHours: "4h", performanceText: "⭐ Excellent", performanceTone: "excellent" },
      { employeeName: "Michael Brown", hoursThisMonth: "172h", onTimeCheckins: "100%", leaveDaysUsed: "1 day", overtimeHours: "12h", performanceText: "⭐ Excellent", performanceTone: "excellent" },
      { employeeName: "Emily Davis", hoursThisMonth: "160h", onTimeCheckins: "95%", leaveDaysUsed: "2 days", overtimeHours: "0h", performanceText: "✓ Good", performanceTone: "good" },
      { employeeName: "Robert Wilson", hoursThisMonth: "176h", onTimeCheckins: "97%", leaveDaysUsed: "0 days", overtimeHours: "16h", performanceText: "⭐ Excellent", performanceTone: "excellent" },
      { employeeName: "Lisa Anderson", hoursThisMonth: "164h", onTimeCheckins: "96%", leaveDaysUsed: "4 days", overtimeHours: "4h", performanceText: "✓ Good", performanceTone: "good" },
    ],
  },
};
