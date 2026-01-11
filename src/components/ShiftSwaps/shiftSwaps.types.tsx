import type { Colleague, SwapRequest } from "../../pages/Rota/Types/exmployeeRota.model";

export type ShiftSwapsProps = {
  introTitle: string;
  introText: string;
  colleagues: Colleague[];
  pendingTitle: string;
  incomingTitle: string;
  requests: SwapRequest[];
  onSelectColleague?: (id: string) => void;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
};
