// src/features/employee-rota/components/ShiftsList/ShiftsList.types.ts

export type ShiftItem = {
  id: string;
  dateISO: string; // e.g. "2024-12-02"
  title: string; // e.g. "Morning Shift"
  timeText: string; // e.g. "07:00 - 15:00"
  childrenAssignedText: string; // e.g. "8 Children"
  locationText: string; // e.g. "Sunshine Home"
};

export type ShiftsListProps = {
  title: string;
  shifts: ShiftItem[];

  onViewDetails?: (shiftId: string) => void;
  onRequestSwap?: (shiftId: string) => void;
};
