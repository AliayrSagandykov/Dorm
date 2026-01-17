import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { entrySchema } from "@/lib/domain/parse";

const updateSchema = z.object({
  employeeId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dayHours: z.number(),
  nightHours: z.number(),
});

export async function PATCH(req: Request) {
  const schema = z.object({
    timesheetId: z.string().min(1),
    updates: z.array(updateSchema).min(1).max(5000),
  });

  const body = schema.parse(await req.json());

  for (const u of body.updates) {
    entrySchema.parse({ dayHours: u.dayHours, nightHours: u.nightHours });
  }

  const ops = body.updates.map((u) =>
    prisma.entry.upsert({
      where: {
        timesheetId_employeeId_date: {
          timesheetId: body.timesheetId,
          employeeId: u.employeeId,
          date: u.date,
        },
      },
      create: {
        timesheetId: body.timesheetId,
        employeeId: u.employeeId,
        date: u.date,
        dayHours: u.dayHours,
        nightHours: u.nightHours,
      },
      update: {
        dayHours: u.dayHours,
        nightHours: u.nightHours,
      },
      select: {
        id: true,
        timesheetId: true,
        employeeId: true,
        date: true,
        dayHours: true,
        nightHours: true,
      },
    })
  );

  const saved = await prisma.$transaction(ops);

  return NextResponse.json({ entries: saved });
}
