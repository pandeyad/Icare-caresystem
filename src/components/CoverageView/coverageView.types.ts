import type { HomeCoverageCard } from "../../pages/Rota/Types/managerRota.models";

export type CoverageViewProps = {
  homes: HomeCoverageCard[];
  onFillVacancy?: (homeId: string) => void;
};
