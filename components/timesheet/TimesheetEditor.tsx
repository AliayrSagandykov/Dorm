"use client";

import { useMemo, useRef, useState } from "react";
import type { TimesheetBundleDTO, EntryDTO } from "@/lib/types";
import { getMonthDays } from "@/lib/domain/calendar";
import { calcTotals } from "@/lib/domain/calc";
import TimesheetGrid from "./TimesheetGrid";

type Key = string; // employeeId|date

function k(employeeId: string, date: string): Key {
  return `${employeeId}|${date}`;
}

export default function TimesheetEditor({ initial }: { initial: TimesheetBundleDTO }) {
  const { timesheet, employees } = initial;
  const days = useMemo(
    () => getMonthDays(timesheet.year, timesheet.month),
    [timesheet.year, timesheet.month]
  );

  const [entriesMap, setEntriesMap] = useState<
    Map<Key, { dayHours: number; nightHours: number }>
  >(() => {
    const m = new Map<Key, { dayHours: number; nightHours: number }>();
    for (const e of initial.entries) {
      m.set(k(e.employeeId, e.date), {
        dayHours: e.dayHours,
        nightHours: e.nightHours,
      });
    }
    return m;
  });

  const [saving, setSaving] = useState(false);
  const pendingRef = useRef<
    Map<Key, { employeeId: string; date: string; dayHours: number; nightHours: number }>
  >(new Map());
  const timerRef = useRef<number | null>(null);

  function scheduleFlush() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(async () => {
      const updates = Array.from(pendingRef.current.values());
      if (updates.length === 0) return;

      setSaving(true);
      try {
        const res = await fetch("/api/entries/bulk", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ timesheetId: timesheet.id, updates }),
        });
        if (!res.ok) throw new Error("Save failed");
        pendingRef.current.clear();
      } finally {
        setSaving(false);
      }
    }, 400);
  }

  function onCellChange(employeeId: string, date: string, dayHours: number, nightHours: number) {
    const key = k(employeeId, date);

    setEntriesMap((prev) => {
      const next = new Map(prev);
      next.set(key, { dayHours, nightHours });
      return next;
    });

    pendingRef.current.set(key, { employeeId, date, dayHours, nightHours });
    scheduleFlush();
  }

  const totalsByEmployee = useMemo(() => {
    const t = new Map<string, { day: number; night: number; total: number }>();
    for (const emp of employees) {
      const list: EntryDTO[] = [];
      for (const d of days) {
        const v = entriesMap.get(k(emp.id, d.date)) ?? { dayHours: 0, nightHours: 0 };
        list.push({
          id: "",
          employeeId: emp.id,
          timesheetId: timesheet.id,
          date: d.date,
          dayHours: v.dayHours,
          nightHours: v.nightHours,
        });
      }
      t.set(emp.id, calcTotals(list));
    }
    return t;
  }, [employees, days, entriesMap, timesheet.id]);

  const exportHref = `/api/timesheets/${timesheet.id}/export`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">
            Timesheet {timesheet.year}-{String(timesheet.month).padStart(2, "0")}
          </div>
          <div className="text-sm text-neutral-500">{saving ? "Saving..." : "Saved"}</div>
        </div>

        <a className="px-3 py-2 rounded bg-black text-white text-sm" href={exportHref}>
          Export .xlsx
        </a>
      </div>

      <TimesheetGrid
        employees={employees}
        days={days}
        entriesMap={entriesMap}
        totalsByEmployee={totalsByEmployee}
        onCellChange={onCellChange}
      />
    </div>
  );
}
