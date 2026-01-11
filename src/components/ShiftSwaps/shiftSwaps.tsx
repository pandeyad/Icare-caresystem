import React from "react";
import "./ShiftSwaps.scss";
import { SwapCard } from "../SwapCard/swapCard";
import type { ShiftSwapsProps } from "./shiftSwaps.types";


export const ShiftSwaps: React.FC<ShiftSwapsProps> = ({
  introTitle,
  introText,
  colleagues,
  pendingTitle,
  incomingTitle,
  requests,
  onSelectColleague,
  onAccept,
  onDecline,
}) => {
  const pending = requests.filter((r) => r.status === "pending");
  const incoming = requests.filter((r) => r.status === "new");

  return (
    <section className="swap-tab">
      <div className="swap-section">
        <h2 className="er-sectionTitle">{introTitle}</h2>
        <p className="er-muted">{introText}</p>

        <div className="colleague-list">
          {colleagues.map((c) => (
            <button
              key={c.id}
              type="button"
              className="colleague-card"
              onClick={() => onSelectColleague?.(c.id)}
            >
              <div className="colleague-avatar">{c.avatarEmoji}</div>
              <div className="colleague-name">{c.name}</div>
              <div className="colleague-role">{c.role}</div>
              <div className={`colleague-availability ${c.availability}`}>
                {c.availability === "available" ? "✓ Available" : "⏰ Limited"}
              </div>
            </button>
          ))}
        </div>
      </div>

      <h2 className="er-sectionTitle">{pendingTitle}</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {pending.map((r) => (
          <SwapCard key={r.id} request={r} />
        ))}
      </div>

      <h2 className="er-sectionTitle">{incomingTitle}</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {incoming.map((r) => (
          <SwapCard key={r.id} request={r} onAccept={onAccept} onDecline={onDecline} />
        ))}
      </div>
    </section>
  );
};
