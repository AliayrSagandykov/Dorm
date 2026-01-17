export type TimesheetDTO = {
  id: string;
  year: number;
  month: number; // 1-12
};

export type EmployeeDTO = {
  id: string;
  name: string;
};

export type EntryDTO = {
  id: string;
  employeeId: string;
  timesheetId: string;
  date: string; // YYYY-MM-DD
  dayHours: number;
  nightHours: number;
};

export type TimesheetBundleDTO = {
  timesheet: TimesheetDTO;
  employees: EmployeeDTO[];
  entries: EntryDTO[];
};
