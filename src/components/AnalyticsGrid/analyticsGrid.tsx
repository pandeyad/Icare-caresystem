import React from "react";
import "./AnalyticsGrid.scss";
import type { AnalyticsGridProps } from "./analyticsGrid.types";

export const AnalyticsGrid: React.FC<AnalyticsGridProps> = ({ charts }) => (
  <div className="mr-analytics">
    {charts.map((c) => (
      <div key={c.id} className="mr-chartCard">
        <h3 className="mr-chartCard__title">{c.title}</h3>
        <div className="mr-chartCard__placeholder">{c.placeholderText}</div>
      </div>
    ))}
  </div>
);
