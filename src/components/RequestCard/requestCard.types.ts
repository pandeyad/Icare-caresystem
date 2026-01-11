import type { RequestActionKey, RequestCardModel } from "../../pages/Rota/Types/managerRota.models";

export type RequestCardProps = {
  card: RequestCardModel;
  rightPillText?: string;
  onAction?: (action: RequestActionKey) => void;
};
