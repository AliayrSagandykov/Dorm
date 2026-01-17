import type { EntryDTO } from "@/lib/types";

export function calcTotals(entries: EntryDTO[]) {
  let day = 0;
  let night = 0;
  for (const e of entries) {
    day += e.dayHours ?? 0;
    night += e.nightHours ?? 0;
  }
  return { day, night, total: day + night };
}
