import type { LeaveRequest, LeaveFormValue } from "../../pages/Rota/Types/exmployeeRota.model";

export type LeaveRequestsProps = {
  formTitle: string;
  historyTitle: string;
  history: LeaveRequest[];
  onSubmit?: (value: LeaveFormValue) => void;
};
