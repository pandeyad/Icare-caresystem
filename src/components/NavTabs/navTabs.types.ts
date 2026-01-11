import React from "react";

export type NavTabItem<TKey extends string> = {
  key: TKey;
  label: React.ReactNode;
};

export type NavTabsVariant = "employee" | "manager";

export type NavTabsProps<TKey extends string> = {
  tabs: Array<NavTabItem<TKey>>;
  active: TKey;
  onChange: (k: TKey) => void;

  /** Optional customization */
  variant?: NavTabsVariant;
  className?: string;

  /** Overrides the default base class (er-tabs / mr-tabs) */
  classPrefix?: "er" | "mr";

  /** Optional a11y label */
  ariaLabel?: string;
};
