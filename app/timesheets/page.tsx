import Link from "next/link";
import CreateTimesheetButton from "@/components/CreateTimesheetButton";
import { prisma } from "@/lib/db/prisma";

export default async function TimesheetsPage() {
  const year = new Date().getFullYear();

  const timesheets = await prisma.timesheet.findMany({
    where: { year },
    orderBy: { month: "asc" },
    select: { id: true, year: true, month: true },
  });

  const byMonth = new Map(timesheets.map((t) => [t.month, t]));

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Timesheets {year}</h1>

      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
          const t = byMonth.get(m);
          return (
            <div
              key={m}
              className="border rounded-lg p-3 flex items-center justify-between"
            >
              <div className="font-medium">Month {m}</div>

              {t ? (
                <Link
                  className="text-blue-600 underline"
                  href={`/timesheets/${t.id}`}
                >
                  Open
                </Link>
              ) : (
                <CreateTimesheetButton year={year} month={m} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
