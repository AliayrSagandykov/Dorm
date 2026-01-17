"use client";

export default function CreateTimesheetButton({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  return (
    <button
      className="px-3 py-1 rounded bg-black text-white text-sm"
      onClick={async (e) => {
        e.preventDefault();
        const res = await fetch("/api/timesheets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ year, month }),
        });
        const data = await res.json();
        if (data?.timesheet?.id)
          window.location.href = `/timesheets/${data.timesheet.id}`;
      }}
    >
      Create
    </button>
  );
}
