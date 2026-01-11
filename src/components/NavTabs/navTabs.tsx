import "./navTabs.scss";
import type { NavTabsProps } from "./navTabs.types";

export function NavTabs<TKey extends string>({
  tabs,
  active,
  onChange,
  variant = "employee",
  className,
  classPrefix,
  ariaLabel,
}: NavTabsProps<TKey>) {
  const prefix = classPrefix ?? (variant === "manager" ? "mr" : "er");

  return (
    <div
      className={`${prefix}-tabs ${className ?? ""}`.trim()}
      role="tablist"
      aria-label={ariaLabel ?? "Navigation tabs"}
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          className={`${prefix}-tabs__tab ${active === t.key ? "is-active" : ""}`}
          role="tab"
          aria-selected={active === t.key}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
