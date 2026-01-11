import React from "react";
import type { StatusBadgeProps } from "./statusBadge.types";


export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const label = status === "new" ? "New Request" : status;
  return <div className={`status-badge ${status}`}>{label}</div>;
};
