import React from "react";
import "./PerformanceTable.scss";
import type { PerformanceTableProps } from "./performanceTable.types";

export const PerformanceTable: React.FC<PerformanceTableProps> = ({ rows }) => {
  return (
    <div className="mr-scheduleGrid">
      <table className="mr-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Hours This Month</th>
            <th>On-Time Check-ins</th>
            <th>Leave Days Used</th>
            <th>Overtime Hours</th>
            <th>Performance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.employeeName}>
              <td>{r.employeeName}</td>
              <td>{r.hoursThisMonth}</td>
              <td>{r.onTimeCheckins}</td>
              <td>{r.leaveDaysUsed}</td>
              <td>{r.overtimeHours}</td>
              <td>
                <span className={`mr-perf mr-perf--${r.performanceTone}`}>{r.performanceText}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
