export type AttendanceStatusValue = "present" | "short_leave" | "leave" | "not_set";

export interface AttendanceRecord {
  id?: string;
  employeeId: string;
  employeeName: string;
  date: string;
  status: AttendanceStatusValue;
}

export const ATTENDANCE_STATUS_OPTIONS: Array<{ value: AttendanceStatusValue; label: string }> = [
  { value: "not_set", label: "Not Set" },
  { value: "present", label: "Present (Full Day)" },
  { value: "short_leave", label: "Short Leave (Half Day)" },
  { value: "leave", label: "Leave (Absent)" },
];