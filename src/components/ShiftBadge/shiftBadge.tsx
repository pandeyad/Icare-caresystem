import React from "react";
import "./ShiftBadge.scss";
import type { ShiftBadgeProps } from "./shiftBadge.types";

export const ShiftBadge: React.FC<ShiftBadgeProps> = ({ value }) => {
  return <span className={`mr-shiftBadge mr-shiftBadge--${value.type}`}>{value.text}</span>;
};
