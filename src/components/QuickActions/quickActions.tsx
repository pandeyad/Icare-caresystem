import React from "react";
import "./QuickActions.scss";
import type { QuickActionsProps } from "./quickActions.types";

export const QuickActions: React.FC<QuickActionsProps> = ({ title, actions, onAction }) => (
  <aside className="mr-quick">
    <h3 className="mr-quick__title">{title}</h3>
    {actions.map((a) => (
      <button
        key={a.id}
        type="button"
        className="mr-quick__btn"
        onClick={() => onAction?.(a.id)}
      >
        {a.label}
      </button>
    ))}
  </aside>
);
