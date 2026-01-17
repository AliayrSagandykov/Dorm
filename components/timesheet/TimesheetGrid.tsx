"use client";

import { useMemo, useState } from "react";
import type { EmployeeDTO } from "@/lib/types";
import type { MonthDay } from "@/lib/domain/calendar";
import CellEditor from "./CellEditor";

type Key = string;

export default function TimesheetGrid(props: {
  employees: EmployeeDTO[];
  days: MonthDay[];
  entriesMap: Map<Key, { dayHours: number; nightHours: number }>;
  totalsByEmployee: Map<string, { day: number; night: number; total: number }>;
  onCellChange: (employeeId: string, date: string, dayHours: number, nightHours: number) => void;
}) {
  const { employees, days, entriesMap, totalsByEmployee, onCellChange } = props;

  const [editing, setEditing] = useState<null | {
    employeeId: string;
    employeeName: string;
    date: string;
    value: { dayHours: number; nightHours: number };
  }>(null);

  const keyOf = (employeeId: string, date: string) => `${employeeId}|${date}`;

  const header = useMemo(() => days.map((d) => `${d.dayLabel} ${d.weekdayLabel}`), [days]);

  return (
    <div className="border rounded-lg overflow-auto">
      <table className="min-w-max w-full text-sm">
        <thead className="sticky top-0 bg-white z-10">
          <tr className="border-b">
            <th className="sticky left-0 bg-white z-20 text-left p-2 min-w-[240px]">Employee</th>
            {header.map((h) => (
              <th key={h} className="p-2 text-center min-w-[90px] whitespace-nowrap">
                {h}
              </th>
            ))}
            <th className="p-2 text-right min-w-[90px]">Day</th>
            <th className="p-2 text-right min-w-[90px]">Night</th>
            <th className="p-2 text-right min-w-[90px]">Total</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => {
            const totals = totalsByEmployee.get(emp.id) ?? { day: 0, night: 0, total: 0 };

            return (
              <tr key={emp.id} className="border-b hover:bg-neutral-50">
                <td className="sticky left-0 bg-white z-10 p-2 font-medium min-w-[240px]">
                  {emp.name}
                </td>

                {days.map((d) => {
                  const v = entriesMap.get(keyOf(emp.id, d.date)) ?? { dayHours: 0, nightHours: 0 };
                  const text = `${v.dayHours}/${v.nightHours}`;

                  return (
                    <td key={d.date} className="p-1">
                      <button
                        className="w-full rounded px-2 py-1 hover:bg-neutral-100 text-center"
                        onClick={() =>
                          setEditing({
                            employeeId: emp.id,
                            employeeName: emp.name,
                            date: d.date,
                            value: v,
                          })
                        }
                      >
                        {text}
                      </button>
                    </td>
                  );
                })}

                <td className="p-2 text-right">{totals.day}</td>
                <td className="p-2 text-right">{totals.night}</td>
                <td className="p-2 text-right font-semibold">{totals.total}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {editing && (
        <CellEditor
          open={true}
          title={`${editing.employeeName} · ${editing.date}`}
          initial={editing.value}
          onClose={() => setEditing(null)}
          onSave={(val) => {
            onCellChange(editing.employeeId, editing.date, val.dayHours, val.nightHours);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
