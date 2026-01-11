import React from "react";
import type { TabPanelProps } from "./tabPanel.types";

export const TabPanel: React.FC<TabPanelProps> = ({ active, children }) => {
  if (!active) return null;
  return <div>{children}</div>;
};
