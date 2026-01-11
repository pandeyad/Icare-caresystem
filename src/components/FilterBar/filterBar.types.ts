import type { FilterOption, FilterBarState } from "../../pages/Rota/Types/managerRota.models";

export type FilterBarProps = {
  homes: FilterOption[];
  staffGroups: FilterOption[];
  value: FilterBarState;
  onChange: (next: FilterBarState) => void;
  onApply: () => void;
  onExport: () => void;
};
