import React from "react";
import "./CoverageView.scss";
import type { CoverageViewProps } from "./coverageView.types";

export const CoverageView: React.FC<CoverageViewProps> = ({ homes, onFillVacancy }) => {
  return (
    <div className="mr-coverage">
      {homes.map((h) => (
        <div key={h.id} className="mr-homeCard">
          <div className="mr-homeCard__header">
            <h3 className="mr-homeCard__title">{h.title}</h3>
            <span className={`mr-homeCard__status mr-homeCard__status--${h.status}`}>{h.statusText}</span>
          </div>

          <div className="mr-homeCard__summary">{h.summaryText}</div>

          <div className="mr-homeCard__subTitle">{h.onDutyTitle}</div>
          <div className="mr-staffGrid">
            {h.onDuty.map((s) => (
              <div
                key={s.id}
                className={[
                  "mr-staffChip",
                  s.isOnDuty ? "is-onDuty" : "",
                  s.isVacancy ? "is-vacancy" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="mr-staffChip__avatar">{s.avatarEmoji}</div>
                <div className="mr-staffChip__name">{s.name}</div>
                <div className="mr-staffChip__time">{s.timeText}</div>
              </div>
            ))}
          </div>

          {h.upcoming?.length ? (
            <>
              <div className="mr-homeCard__subTitle">{h.upcomingTitle}</div>
              <div className="mr-staffGrid">
                {h.upcoming.map((s) => (
                  <div key={s.id} className="mr-staffChip">
                    <div className="mr-staffChip__avatar">{s.avatarEmoji}</div>
                    <div className="mr-staffChip__name">{s.name}</div>
                    <div className="mr-staffChip__time">{s.timeText}</div>
                  </div>
                ))}
              </div>
            </>
          ) : null}

          {h.showFillVacancy ? (
            <button type="button" className="mr-btn mr-btn--danger" onClick={() => onFillVacancy?.(h.id)}>
              ⚡ Fill Vacancy
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
};
