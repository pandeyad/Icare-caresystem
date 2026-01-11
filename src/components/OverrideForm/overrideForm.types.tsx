import type { FilterOption, OverrideFormValue } from "../../pages/Rota/Types/managerRota.models";

export type OverrideFormProps = {
  title: string;

  employeeOptions: FilterOption[];
  homeOptions: FilterOption[];
  shiftOptions: FilterOption[];
  overrideTypeOptions: FilterOption[];
  priorityOptions: FilterOption[];
  childrenOptions: FilterOption[];

  onSubmit?: (value: OverrideFormValue) => void;
  onReset?: () => void;
};
