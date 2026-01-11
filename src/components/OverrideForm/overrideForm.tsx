import React, { useState } from "react";
import "./OverrideForm.scss";
import type { OverrideFormValue } from "../../pages/Rota/Types/managerRota.models";
import type { OverrideFormProps } from "./overrideForm.types";


const initial: OverrideFormValue = {
  employee: "",
  homeLocation: "",
  date: "",
  shiftType: "",
  overrideType: "",
  priority: "Normal",
  assignedChildren: [],
  notes: "",
  notify: false,
};

export const OverrideForm: React.FC<OverrideFormProps> = ({
  title,
  employeeOptions,
  homeOptions,
  shiftOptions,
  overrideTypeOptions,
  priorityOptions,
  childrenOptions,
  onSubmit,
  onReset,
}) => {
  const [form, setForm] = useState<OverrideFormValue>(initial);

  function update<K extends keyof OverrideFormValue>(k: K, v: OverrideFormValue[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.(form);
    setForm(initial);
  }

  function reset() {
    onReset?.();
    setForm(initial);
  }

  return (
    <section className="mr-override">
      <h2 className="mr-sectionTitle">{title}</h2>

      <form className="mr-override__form" onSubmit={submit}>
        <div className="mr-override__row">
          <div className="mr-override__field">
            <label>Employee *</label>
            <select required value={form.employee} onChange={(e) => update("employee", e.target.value)}>
              {employeeOptions.map((o) => (
                <option key={o.value || o.label} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mr-override__field">
            <label>Home Location *</label>
            <select required value={form.homeLocation} onChange={(e) => update("homeLocation", e.target.value)}>
              {homeOptions.map((o) => (
                <option key={o.value || o.label} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mr-override__row">
          <div className="mr-override__field">
            <label>Date *</label>
            <input type="date" required value={form.date} onChange={(e) => update("date", e.target.value)} />
          </div>

          <div className="mr-override__field">
            <label>Shift Type *</label>
            <select required value={form.shiftType} onChange={(e) => update("shiftType", e.target.value)}>
              {shiftOptions.map((o) => (
                <option key={o.value || o.label} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mr-override__row">
          <div className="mr-override__field">
            <label>Override Type *</label>
            <select required value={form.overrideType} onChange={(e) => update("overrideType", e.target.value)}>
              {overrideTypeOptions.map((o) => (
                <option key={o.value || o.label} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mr-override__field">
            <label>Priority Level</label>
            <select value={form.priority} onChange={(e) => update("priority", e.target.value)}>
              {priorityOptions.map((o) => (
                <option key={o.value || o.label} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mr-override__field">
          <label>Assigned Children (Optional)</label>
          <select
            multiple
            value={form.assignedChildren}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map((x) => x.value);
              update("assignedChildren", selected);
            }}
          >
            {childrenOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <small>Hold Ctrl/Cmd to select multiple</small>
        </div>

        <div className="mr-override__field">
          <label>Notes/Reason for Override *</label>
          <textarea
            rows={4}
            required
            placeholder="Provide detailed reason for this override..."
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>

        <label className="mr-override__check">
          <input type="checkbox" checked={form.notify} onChange={(e) => update("notify", e.target.checked)} />
          Notify employee immediately via email/SMS
        </label>

        <div className="mr-override__actions">
          <button type="submit" className="mr-btn mr-btn--primary">
            ✓ Create Override
          </button>
          <button type="button" className="mr-btn mr-btn--muted" onClick={reset}>
            ↺ Reset
          </button>
        </div>
      </form>
    </section>
  );
};
