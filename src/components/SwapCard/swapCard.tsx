import React from "react";
import "./SwapCard.scss";
import type { SwapCardProps } from "./swapCard.types";
import { StatusBadge } from "../StatusBadge/statusBadge";


export const SwapCard: React.FC<SwapCardProps> = ({ request, onAccept, onDecline }) => {
  const badgeStatus = request.status === "new" ? "new" : "pending";

  return (
    <div className="swap-card">
      <div className="swap-header">
        <h3>{request.title}</h3>
        <StatusBadge status={badgeStatus} />
      </div>

      <div className="swap-details">
        <div>
          <h4>{request.leftLabel}</h4>
          <div>{request.left.dateText}</div>
          <div>{request.left.timeText}</div>
          <div>{request.left.location}</div>
        </div>

        <div className="swap-arrow">⇄</div>

        <div>
          <h4>{request.rightLabel}</h4>
          <div>{request.right.dateText}</div>
          <div>{request.right.timeText}</div>
          <div>{request.right.location}</div>
        </div>
      </div>

      <div className="swap-footer">{request.footerText}</div>

      {request.showActions ? (
        <div className="swap-actions">
          <button type="button" className="er-btn er-btn--success" onClick={() => onAccept?.(request.id)}>
            ✓ Accept Swap
          </button>
          <button type="button" className="er-btn er-btn--neutral" onClick={() => onDecline?.(request.id)}>
            ✗ Decline
          </button>
        </div>
      ) : null}
    </div>
  );
};
