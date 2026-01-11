import type { TeamScheduleRow, WeeklyScheduleRow } from "../../pages/Rota/Types/managerRota.models";

export type ScheduleTableProps =
  | {
      mode: "daily";
      columns: string[];
      rows: TeamScheduleRow[];
    }
  | {
      mode: "weekly";
      columns: string[];
      weeklyRows: WeeklyScheduleRow[];
    };
