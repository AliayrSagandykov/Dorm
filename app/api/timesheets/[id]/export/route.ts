export const runtime = "nodejs";

import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/db/prisma";
import { getMonthDays } from "@/lib/domain/calendar";

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
    select: { employeeId: true, date: true, dayHours: true, nightHours: true },
  });

  const monthDays = getMonthDays(timesheet.year, timesheet.month);

  const map = new Map<string, { day: number; night: number }>();
  for (const e of entries) {
    map.set(`${e.employeeId}|${e.date}`, {
      day: Number(e.dayHours),
      night: Number(e.nightHours),
    });
  }

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Timesheet");

  const headers: string[] = ["Employee"]; 
  for (const d of monthDays) {
    headers.push(`${d.dayLabel} ${d.weekdayLabel} (Day)`);
    headers.push(`${d.dayLabel} ${d.weekdayLabel} (Night)`);
  }
  headers.push("Sum Day", "Sum Night", "Total");

  ws.addRow(headers);

  for (const emp of employees) {
    const row: (string | number)[] = [emp.name];

    let sumDay = 0;
    let sumNight = 0;

    for (const d of monthDays) {
      const key = `${emp.id}|${d.date}`;
      const v = map.get(key) ?? { day: 0, night: 0 };
      row.push(v.day, v.night);
      sumDay += v.day;
      sumNight += v.night;
    }

    row.push(sumDay, sumNight, sumDay + sumNight);
    ws.addRow(row);
  }

  ws.getRow(1).font = { bold: true };
  ws.views = [{ state: "frozen", xSplit: 1, ySplit: 1 }];

  ws.getColumn(1).width = 28;
  for (let c = 2; c <= headers.length; c++) ws.getColumn(c).width = 14;

  const buf = await wb.xlsx.writeBuffer();
  const filename = `timesheet_${timesheet.year}-${String(timesheet.month).padStart(2, "0")}.xlsx`;

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
