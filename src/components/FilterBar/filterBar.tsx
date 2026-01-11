import React from "react";
import "./FilterBar.scss";
import type { FilterBarProps } from "./filterBar.types";

export const FilterBar: React.FC<FilterBarProps> = ({ homes, staffGroups, value, onChange, onApply, onExport }) => {
  return (
    <div className="mr-filter">
      <select value={value.home} onChange={(e) => onChange({ ...value, home: e.target.value })}>
        {homes.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select value={value.staffGroup} onChange={(e) => onChange({ ...value, staffGroup: e.target.value })}>
        {staffGroups.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <input type="week" value={value.week} onChange={(e) => onChange({ ...value, week: e.target.value })} />

      <button type="button" className="mr-btn mr-btn--primary" onClick={onApply}>
        🔍 Filter
      </button>
      <button type="button" className="mr-btn mr-btn--success" onClick={onExport}>
        📥 Export
      </button>
    </div>
  );
};
