// src/features/employee-rota/components/CalendarView/CalendarView.tsx

import React from "react";
import "./CalendarView.scss";
import type { WeekdayIndex, CalendarShift, CalendarDay, CalendarViewProps } from "./calendarView.types";


const DEFAULT_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function buildCalendarGrid(args: {
  monthISO: string; // "YYYY-MM"
  startWeekday: WeekdayIndex;
  daysInMonth: number;
  shiftsByDay?: Record<number, CalendarShift>;
  todayDay?: number;
}): CalendarDay[] {
  const { monthISO, startWeekday, daysInMonth, shiftsByDay, todayDay } = args;

  const grid: CalendarDay[] = [];

  // leading padding
  for (let i = 0; i < startWeekday; i += 1) {
    grid.push({
      id: `pad-start-${i}`,
      dayLabel: "",
    });
  }

  // actual month days
  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateISO = `${monthISO}-${pad2(day)}`;
    grid.push({
      id: dateISO,
      dayLabel: String(day),
      dateISO,
      isToday: todayDay === day,
      shift: shiftsByDay?.[day],
    });
  }

  // trailing padding to complete weeks
  const remainder = grid.length % 7;
  if (remainder !== 0) {
    const need = 7 - remainder;
    for (let i = 0; i < need; i += 1) {
      grid.push({
        id: `pad-end-${i}`,
        dayLabel: "",
      });
    }
  }

  return grid;
}

export const CalendarView: React.FC<CalendarViewProps> = (props) => {
  const dayHeaders =
    props.variant === "model"
      ? props.dayHeaders ?? DEFAULT_HEADERS
      : props.dayHeaders;

  const monthLabel = props.monthLabel;

  const gridDays =
    props.variant === "model"
      ? buildCalendarGrid({
          monthISO: props.monthISO,
          startWeekday: props.startWeekday,
          daysInMonth: props.daysInMonth,
          shiftsByDay: props.shiftsByDay,
          todayDay: props.todayDay,
        })
      : props.gridDays;

  const handleCellClick = (day: CalendarDay) => {
    if (!day.dateISO) return; // ignore padding cells
    props.onSelectDay?.(day);
  };

  return (
    <section className="er-calendar" aria-label="Schedule calendar">
      <div className="er-calendar__top">
        <div className="er-calendar__nav">
          <button
            type="button"
            className="er-btn er-btn--neutral"
            onClick={props.onPrevious}
          >
            ← Previous
          </button>

          <div className="er-calendar__month" aria-live="polite">
            {monthLabel}
          </div>

          <button
            type="button"
            className="er-btn er-btn--neutral"
            onClick={props.onNext}
          >
            Next →
          </button>
        </div>

        <button
          type="button"
          className="er-btn er-btn--primary"
          onClick={props.onExport}
        >
          📥 Export Schedule
        </button>
      </div>

      <div className="er-calendar__grid" role="grid" aria-label="Calendar grid">
        {dayHeaders.map((h) => (
          <div key={h} className="er-calendar__head" role="columnheader">
            {h}
          </div>
        ))}

        {gridDays.map((d) => {
          const classNames = [
            "er-calendar__cell",
            d.shift ? "has-shift" : "",
            d.isToday ? "is-today" : "",
            !d.dateISO ? "is-padding" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={d.id}
              type="button"
              className={classNames}
              role="gridcell"
              disabled={!d.dateISO}
              onClick={() => handleCellClick(d)}
              aria-label={
                d.dateISO
                  ? `${d.dateISO}${
                      d.shift
                        ? ` shift ${d.shift.timeText} at ${d.shift.locationText}`
                        : ""
                    }${d.isToday ? " (today)" : ""}`
                  : "Empty day"
              }
            >
              <div className="er-calendar__day">{d.dayLabel}</div>

              {d.shift ? (
                <div className="er-calendar__shift">
                  <div className="er-calendar__shiftTime">{d.shift.timeText}</div>
                  <div className="er-calendar__shiftLoc">{d.shift.locationText}</div>
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
};
