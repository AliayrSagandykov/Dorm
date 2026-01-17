import TimesheetEditor from "@/components/timesheet/TimesheetEditor";
import { prisma } from "@/lib/db/prisma";

export default async function TimesheetPage({
  params,
}: {
  params: { id: string };
}) {
  const timesheet = await prisma.timesheet.findUnique({
    where: { id: params.id },
    select: { id: true, year: true, month: true },
  });

  if (!timesheet) {
    return <div className="p-6">Not found</div>;
  }

  const employees = await prisma.employee.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const entries = await prisma.entry.findMany({
    where: { timesheetId: params.id },
    select: {
      id: true,
      timesheetId: true,
      employeeId: true,
      date: true,
      dayHours: true,
      nightHours: true,
    },
  });

  return (
    <div className="p-6">
      <TimesheetEditor initial={{ timesheet, employees, entries }} />
    </div>
  );
}
