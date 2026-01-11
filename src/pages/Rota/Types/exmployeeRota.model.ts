export type RotaTabKey = "calendar" | "shifts" | "leave" | "swap";

export type UserInfo = {
  name: string;
  roleLabel: string;
  employeeId: string;
};

export type StatCard = {
  label: string;
  value: string | number;
  gradient?: string;
};

export type Shift = {
  id: string;
  dateISO: string; // YYYY-MM-DD
  title: string;
  time: string; // "07:00 - 15:00"
  childrenAssigned: number;
  location: string;
};

export type CalendarDayShift = {
  time: string;
  location: string;
};

export type LeaveStatus = "pending" | "approved" | "rejected";
export type LeaveRequest = {
  id: string;
  title: string;
  datesText: string;
  metaText: string;
  status: LeaveStatus;
};

export type LeaveType = "annual" | "sick" | "personal" | "emergency";
export type LeaveDuration = "full" | "morning" | "afternoon";

export type LeaveFormValue = {
  leaveType: LeaveType | "";
  duration: LeaveDuration | "";
  startDate: string;
  endDate: string;
  reason: string;
};

export type ColleagueAvailability = "available" | "limited";
export type Colleague = {
  id: string;
  name: string;
  role: string;
  avatarEmoji: string;
  availability: ColleagueAvailability;
};

export type SwapStatus = "pending" | "new";
export type SwapShift = {
  dateText: string;
  timeText: string;
  location: string;
};

export type SwapRequest = {
  id: string;
  title: string;
  status: SwapStatus;
  leftLabel: string;
  left: SwapShift;
  rightLabel: string;
  right: SwapShift;
  footerText: string;
  showActions?: boolean;
};

export type EmployeeRotaData = {
  headerTitle: string;
  headerSubtitle: string;
  user: UserInfo;
  tabs: Array<{ key: RotaTabKey; label: string }>;
  stats: StatCard[];

  calendar: {
    monthLabel: string;
    dayHeaders: string[];
    gridDays: Array<{
      dayNumber: number | null;
      isToday?: boolean;
      shift?: CalendarDayShift;
    }>;
  };

  shifts: Shift[];

  leave: {
    formTitle: string;
    historyTitle: string;
    history: LeaveRequest[];
  };

  swap: {
    introTitle: string;
    introText: string;
    colleagues: Colleague[];
    pendingTitle: string;
    incomingTitle: string;
    requests: SwapRequest[];
  };
};

export type EmployeeRotaHandlers = {
  onExportSchedule?: () => void;
  onPreviousMonth?: () => void;
  onNextMonth?: () => void;

  onViewShiftDetails?: (shiftId: string) => void;
  onRequestSwapFromShift?: (shiftId: string) => void;

  onSubmitLeave?: (value: LeaveFormValue) => void;

  onSelectColleague?: (colleagueId: string) => void;
  onAcceptSwap?: (swapId: string) => void;
  onDeclineSwap?: (swapId: string) => void;
};
