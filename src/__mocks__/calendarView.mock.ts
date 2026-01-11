// src/features/employee-rota/mocks/employeeCalendar.mock.ts

import type { CalendarViewModelProps } from "../components/CalendarView/calendarView.types";


export const EMPLOYEE_DEC_2024_CALENDAR: CalendarViewModelProps = {
  variant: "model",

  monthLabel: "December 2024",
  monthISO: "2024-12",

  // Dec 1, 2024 is a Sunday in your HTML layout (no leading blanks)
  startWeekday: 0,

  daysInMonth: 31,

  // "today" cell is 22 in the HTML
  todayDay: 22,

  dayHeaders: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

  shiftsByDay: {
    2: { timeText: "07:00 - 15:00", locationText: "Sunshine Home" },
    3: { timeText: "07:00 - 15:00", locationText: "Sunshine Home" },

    5: { timeText: "15:00 - 23:00", locationText: "Sunshine Home" },
    6: { timeText: "15:00 - 23:00", locationText: "Hope House" },

    9: { timeText: "07:00 - 15:00", locationText: "Sunshine Home" },
    10: { timeText: "07:00 - 15:00", locationText: "Sunshine Home" },
    11: { timeText: "07:00 - 15:00", locationText: "Sunshine Home" },
    12: { timeText: "15:00 - 23:00", locationText: "Sunshine Home" },
    13: { timeText: "15:00 - 23:00", locationText: "Hope House" },

    16: { timeText: "07:00 - 15:00", locationText: "Sunshine Home" },
    17: { timeText: "07:00 - 15:00", locationText: "Sunshine Home" },
    18: { timeText: "07:00 - 15:00", locationText: "Sunshine Home" },
    19: { timeText: "15:00 - 23:00", locationText: "Sunshine Home" },
    20: { timeText: "15:00 - 23:00", locationText: "Hope House" },

    22: { timeText: "07:00 - 15:00", locationText: "Sunshine Home" },
    23: { timeText: "07:00 - 15:00", locationText: "Sunshine Home" },
    24: { timeText: "07:00 - 15:00", locationText: "Sunshine Home" },

    26: { timeText: "15:00 - 23:00", locationText: "Sunshine Home" },
    27: { timeText: "15:00 - 23:00", locationText: "Hope House" },

    30: { timeText: "07:00 - 15:00", locationText: "Sunshine Home" },
    31: { timeText: "07:00 - 15:00", locationText: "Sunshine Home" },
  },
};
