import React from "react";
import "./RequestCard.scss";
import type { RequestCardProps } from "./requestCard.types";

export const RequestCard: React.FC<RequestCardProps> = ({ card, rightPillText, onAction }) => {
  return (
    <div className={`mr-request ${card.urgency === "urgent" ? "is-urgent" : "is-normal"}`}>
      <div className="mr-request__avatar">{card.avatarEmoji}</div>

      <div className="mr-request__details">
        <h3 className="mr-request__title">{card.title}</h3>
        <div className="mr-request__meta">{card.meta}</div>
        <div className="mr-request__reason">{card.reasonText}</div>
      </div>

      <div className="mr-request__right">
        {rightPillText ? <div className="mr-request__pill">{rightPillText}</div> : null}

        <div className="mr-request__actions">
          {card.actions.map((a) => (
            <button
              key={a.key}
              type="button"
              className={`mr-btn ${a.tone === "approve" ? "mr-btn--success" : a.tone === "reject" ? "mr-btn--danger" : "mr-btn--info"}`}
              onClick={() => onAction?.(a.key)}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
