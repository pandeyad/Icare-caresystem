import React, { useState } from "react";
import "./LeaveRequests.scss";
import type { LeaveFormValue } from "../../pages/Rota/Types/exmployeeRota.model";
import { StatusBadge } from "../StatusBadge/statusBadge";
import type { LeaveRequestsProps } from "./leaveRequests.types";

const initialForm: LeaveFormValue = {
  leaveType: "",
  duration: "",
  startDate: "",
  endDate: "",
  reason: "",
};

export const LeaveRequests: React.FC<LeaveRequestsProps> = ({ formTitle, historyTitle, history, onSubmit }) => {
  const [form, setForm] = useState<LeaveFormValue>(initialForm);

  function update<K extends keyof LeaveFormValue>(key: K, value: LeaveFormValue[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.(form);
    setForm(initialForm);
  }

  return (
    <section className="leave-tab">
      <div className="leave-form">
        <h2 className="er-sectionTitle">{formTitle}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Leave Type</label>
              <select required value={form.leaveType} onChange={(e) => update("leaveType", e.target.value as any)}>
                <option value="">Select type...</option>
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="personal">Personal Leave</option>
                <option value="emergency">Emergency Leave</option>
              </select>
            </div>

            <div className="form-group">
              <label>Duration</label>
              <select required value={form.duration} onChange={(e) => update("duration", e.target.value as any)}>
                <option value="">Select duration...</option>
                <option value="full">Full Day(s)</option>
                <option value="morning">Morning Only</option>
                <option value="afternoon">Afternoon Only</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" required value={form.startDate} onChange={(e) => update("startDate", e.target.value)} />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input type="date" required value={form.endDate} onChange={(e) => update("endDate", e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Reason</label>
            <textarea
              rows={4}
              required
              value={form.reason}
              onChange={(e) => update("reason", e.target.value)}
              placeholder="Reason for leave..."
            />
          </div>

          <button type="submit" className="er-btn er-btn--primary">
            Submit Request
          </button>
        </form>
      </div>

      <h2 className="er-sectionTitle">{historyTitle}</h2>

      <div className="leave-requests">
        {history.map((l) => (
          <div key={l.id} className={`leave-card ${l.status}`}>
            <div className="leave-info">
              <h3>{l.title}</h3>
              <div className="leave-dates">{l.datesText}</div>
              <div className="leave-meta">{l.metaText}</div>
            </div>

            <div className="leave-status">
              <StatusBadge status={l.status} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
