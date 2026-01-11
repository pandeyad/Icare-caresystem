// src/features/employee-rota/components/ShiftsList/ShiftsList.tsx

import React from "react";
import "./shiftList.scss";
import type { ShiftsListProps } from "./shiftList.types";

function monthShort(dateISO: string) {
  const d = new Date(dateISO);
  // Guard against invalid ISO strings
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-US", { month: "short" });
}

function dayNum(dateISO: string) {
  const d = new Date(dateISO);
  if (Number.isNaN(d.getTime())) return "";
  return String(d.getDate());
}

export const ShiftsList: React.FC<ShiftsListProps> = ({ title, shifts, onViewDetails, onRequestSwap }) => {
  return (
    <section className="er-shifts" aria-label="My shifts">
      <h2 className="er-sectionTitle">{title}</h2>

      <div className="er-shifts__list">
        {shifts.map((s) => (
          <article key={s.id} className="er-shiftCard">
            <div className="er-shiftCard__date" aria-hidden="true">
              <div className="er-shiftCard__day">{dayNum(s.dateISO)}</div>
              <div className="er-shiftCard__month">{monthShort(s.dateISO)}</div>
            </div>

            <div className="er-shiftCard__details">
              <h3 className="er-shiftCard__title">{s.title}</h3>

              <div className="er-shiftCard__meta">
                <span>🕐 {s.timeText}</span>
                <span>👥 {s.childrenAssignedText}</span>
                <span>🏠 {s.locationText}</span>
              </div>
            </div>

            <div className="er-shiftCard__actions">
              <button
                type="button"
                className="er-btn er-btn--primary"
                onClick={() => onViewDetails?.(s.id)}
              >
                View Details
              </button>

              <button
                type="button"
                className="er-btn er-btn--warning"
                onClick={() => onRequestSwap?.(s.id)}
              >
                Request Swap
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
