import React from "react";
import type { StatCard } from "../../pages/Rota/Types/exmployeeRota.model";

type Props = { stats: StatCard[] };

export const StatsGrid: React.FC<Props> = ({ stats }) => (
  <div className="stats-grid">
    {stats.map((s, idx) => (
      <div key={`${s.label}-${idx}`} className="stat-card" style={s.gradient ? { background: s.gradient } : undefined}>
        <div className="stat-label">{s.label}</div>
        <div className="stat-number">{s.value}</div>
      </div>
    ))}
  </div>
);
