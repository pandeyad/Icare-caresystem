import type { SwapRequest } from "../../pages/Rota/Types/exmployeeRota.model";

export type SwapCardProps = {
  request: SwapRequest;
  onAccept?: (swapId: string) => void;
  onDecline?: (swapId: string) => void;
};
