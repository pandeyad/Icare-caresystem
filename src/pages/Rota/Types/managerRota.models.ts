export type ManagerTabKey =
  | "overview"
  | "schedule"
  | "requests"
  | "override"
  | "coverage"
  | "analytics";

export type ManagerUser = {
  name: string;
  roleText: string;
};

export type StatCard = {
  label: string;
  value: string | number;
  gradient?: string;
};

export type ShiftType = "morning" | "afternoon" | "night" | "off";

export type ShiftBadgeValue = {
  type: ShiftType;
  text: string; // e.g. "07:00 - 15:00" or "07-15" or "OFF"
};

export type TeamScheduleRow = {
  employeeId: string;
  name: string;
  role?: string;
  avatarEmoji: string;
  location?: string;
  childrenText?: string;
  statusText?: string;
  statusTone?: "success" | "muted" | "danger";
  shift?: ShiftBadgeValue;
};

export type WeeklyScheduleRow = {
  employeeId: string;
  name: string;
  avatarEmoji: string;
  days: ShiftBadgeValue[]; // Mon..Sun
  hoursText: string; // "32h"
};

export type FilterOption = { value: string; label: string };

export type FilterBarState = {
  home: string;
  staffGroup: string;
  week: string; // HTML input week format e.g. "2024-W51"
};

export type QuickAction = {
  id: string;
  label: string;
};

export type RequestUrgency = "urgent" | "normal";
export type RequestActionKey = "approve" | "reject" | "review" | "monitor";

export type RequestAction = {
  key: RequestActionKey;
  label: string;
  tone: "approve" | "reject" | "review";
};

export type RequestCardModel = {
  id: string;
  urgency: RequestUrgency;
  avatarEmoji: string;
  title: string;
  meta: string;
  reasonText: string;
  actions: RequestAction[];
};

export type OverrideFormValue = {
  employee: string;
  homeLocation: string;
  date: string;
  shiftType: string;
  overrideType: string;
  priority: string;
  assignedChildren: string[];
  notes: string;
  notify: boolean;
};

export type CoverageStatus = "good" | "warning" | "critical";

export type StaffChip = {
  id: string;
  avatarEmoji: string;
  name: string;
  timeText: string;
  isOnDuty?: boolean;
  isVacancy?: boolean;
};

export type HomeCoverageCard = {
  id: string;
  title: string;
  status: CoverageStatus;
  statusText: string;
  summaryText: string;
  onDutyTitle: string;
  onDuty: StaffChip[];
  upcomingTitle?: string;
  upcoming?: StaffChip[];
  showFillVacancy?: boolean;
};

export type ChartCard = {
  id: string;
  title: string;
  placeholderText: string;
};

export type PerformanceRow = {
  employeeName: string;
  hoursThisMonth: string;
  onTimeCheckins: string;
  leaveDaysUsed: string;
  overtimeHours: string;
  performanceText: string;
  performanceTone: "excellent" | "good" | "warn";
};

export type ManagerRotaData = {
  headerTitle: string;
  headerSubtitle: string;
  user: ManagerUser;

  tabs: Array<{ key: ManagerTabKey; label: string }>;
  stats: StatCard[];

  overview: {
    todayTitle: string;
    todayRows: TeamScheduleRow[];
    quickActionsTitle: string;
    quickActions: QuickAction[];
  };

  schedule: {
    homes: FilterOption[];
    staffGroups: FilterOption[];
    initialFilters: FilterBarState;
    columns: string[]; // table headers
    rows: WeeklyScheduleRow[];
  };

  requests: {
    leaveTitle: string;
    leaveCards: RequestCardModel[];
    swapTitle: string;
    swapCards: RequestCardModel[];
  };

  override: {
    title: string;
    employeeOptions: FilterOption[];
    homeOptions: FilterOption[];
    shiftOptions: FilterOption[];
    overrideTypeOptions: FilterOption[];
    priorityOptions: FilterOption[];
    childrenOptions: FilterOption[];
    recentTitle: string;
    recentCards: Array<{
      id: string;
      avatarEmoji: string;
      title: string;
      meta: string;
      reason: string;
      statusPillText: string;
    }>;
  };

  coverage: {
    title: string;
    homes: HomeCoverageCard[];
  };

  analytics: {
    title: string;
    charts: ChartCard[];
    performanceTitle: string;
    performanceRows: PerformanceRow[];
  };
};

export type ManagerRotaHandlers = {
  onExportWeek?: (filters: FilterBarState) => void;
  onApplyFilters?: (filters: FilterBarState) => void;

  onQuickAction?: (actionId: string) => void;

  onRequestAction?: (requestId: string, action: RequestActionKey) => void;

  onSubmitOverride?: (value: OverrideFormValue) => void;
  onResetOverride?: () => void;

  onFillVacancy?: (homeId: string) => void;
};
