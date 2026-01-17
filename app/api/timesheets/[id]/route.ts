import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const id = ctx.params.id;

  const timesheet = await prisma.timesheet.findUnique({
    where: { id },
    select: { id: true, year: true, month: true },
  });
  if (!timesheet) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const employees = await prisma.employee.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const entries = await prisma.entry.findMany({
    where: { timesheetId: id },
    select: {
      id: true,
      timesheetId: true,
      employeeId: true,
      date: true,
      dayHours: true,
      nightHours: true,
    },
  });

  return NextResponse.json({ timesheet, employees, entries });
}
