"use client";

import { useMemo, useState } from "react";
import { entrySchema } from "@/lib/domain/parse";

export default function CellEditor(props: {
  open: boolean;
  title: string;
  initial: { dayHours: number; nightHours: number };
  onClose: () => void;
  onSave: (val: { dayHours: number; nightHours: number }) => void;
}) {
  const [day, setDay] = useState(String(props.initial.dayHours ?? 0));
  const [night, setNight] = useState(String(props.initial.nightHours ?? 0));
  const [err, setErr] = useState<string | null>(null);

  const parsed = useMemo(() => {
    const d = Number(day);
    const n = Number(night);
    return { d, n };
  }, [day, night]);

  function save() {
    try {
      const v = entrySchema.parse({ dayHours: parsed.d, nightHours: parsed.n });
      setErr(null);
      props.onSave(v);
    } catch (e: any) {
      setErr(e?.errors?.[0]?.message ?? e?.message ?? "Invalid values");
    }
  }

  if (!props.open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onMouseDown={props.onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-sm p-4 space-y-3"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="font-semibold">{props.title}</div>

        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1">
            <div className="text-xs text-neutral-500">Day</div>
            <input
              className="w-full border rounded px-2 py-1"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              inputMode="decimal"
            />
          </label>

          <label className="space-y-1">
            <div className="text-xs text-neutral-500">Night</div>
            <input
              className="w-full border rounded px-2 py-1"
              value={night}
              onChange={(e) => setNight(e.target.value)}
              inputMode="decimal"
            />
          </label>
        </div>

        {err && <div className="text-sm text-red-600">{err}</div>}

        <div className="flex justify-end gap-2 pt-2">
          <button className="px-3 py-1 rounded border" onClick={props.onClose}>
            Cancel
          </button>
          <button className="px-3 py-1 rounded bg-black text-white" onClick={save}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
