import type { QuickAction } from "../../pages/Rota/Types/managerRota.models";

export type QuickActionsProps = {
  title: string;
  actions: QuickAction[];
  onAction?: (id: string) => void;
};
