// src/features/employee-rota/components/CalendarView/CalendarView.types.ts

export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sun ... 6=Sat

export type CalendarShift = {
  timeText: string; // e.g. "07:00 - 15:00"
  locationText: string; // e.g. "Sunshine Home"
};

export type CalendarDay = {
  id: string; // for React keys (e.g. "2024-12-02" or "pad-0")
  dayLabel: string; // "1".."31" or "" for padding
  dateISO?: string; // e.g. "2024-12-02" (undefined for padding)
  isToday?: boolean;
  shift?: CalendarShift;
};

export type CalendarViewGridProps = {
  variant: "grid";

  monthLabel: string;
  dayHeaders: string[];
  gridDays: CalendarDay[];

  onPrevious?: () => void;
  onNext?: () => void;
  onExport?: () => void;
  onSelectDay?: (day: CalendarDay) => void;
};

export type CalendarViewModelProps = {
  variant: "model";

  monthLabel: string;
  /** "YYYY-MM" e.g. "2024-12" */
  monthISO: string;

  /** 0=Sun, 1=Mon, ... */
  startWeekday: WeekdayIndex;
  daysInMonth: number;

  /** example: { 2: {timeText:"07:00 - 15:00", locationText:"Sunshine Home"} } */
  shiftsByDay?: Record<number, CalendarShift>;

  /** 1..daysInMonth */
  todayDay?: number;

  dayHeaders?: string[];

  onPrevious?: () => void;
  onNext?: () => void;
  onExport?: () => void;
  onSelectDay?: (day: CalendarDay) => void;
};

export type CalendarViewProps = CalendarViewGridProps | CalendarViewModelProps;
