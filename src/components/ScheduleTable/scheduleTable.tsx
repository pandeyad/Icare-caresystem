import React from "react";
import "./ScheduleTable.scss";
import { ShiftBadge } from "../ShiftBadge/shiftBadge";
import type { ScheduleTableProps } from "./scheduleTable.types";


export const ScheduleTable: React.FC<ScheduleTableProps> = (props) => {
  return (
    <div className="mr-scheduleGrid">
      <table className="mr-table">
        <thead>
          <tr>
            {props.columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>

        {props.mode === "daily" ? (
          <tbody>
            {props.rows.map((r) => (
              <tr key={r.employeeId}>
                <td>
                  <div className="mr-employeeCell">
                    <div className="mr-avatar">{r.avatarEmoji}</div>
                    <div>
                      <div className="mr-employeeName">{r.name}</div>
                      {r.role ? <div className="mr-employeeRole">{r.role}</div> : null}
                    </div>
                  </div>
                </td>
                <td>{r.shift ? <ShiftBadge value={r.shift} /> : null}</td>
                <td>{r.location ?? "-"}</td>
                <td>{r.childrenText ?? "-"}</td>
                <td>
                  <span className={`mr-status mr-status--${r.statusTone ?? "muted"}`}>
                    {r.statusText ?? "-"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            {props.weeklyRows.map((r) => (
              <tr key={r.employeeId}>
                <td>
                  <div className="mr-employeeCell">
                    <div className="mr-avatar">{r.avatarEmoji}</div>
                    <div className="mr-employeeName">{r.name}</div>
                  </div>
                </td>
                {r.days.map((d, idx) => (
                  <td key={`${r.employeeId}-${idx}`}>
                    <ShiftBadge value={d} />
                  </td>
                ))}
                <td className="mr-hours">{r.hoursText}</td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};
