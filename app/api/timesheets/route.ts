import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get("year"));
  if (!Number.isFinite(year)) {
    return NextResponse.json({ error: "year is required" }, { status: 400 });
  }

  const timesheets = await prisma.timesheet.findMany({
    where: { year },
    orderBy: [{ month: "asc" }],
    select: { id: true, year: true, month: true },
  });

  return NextResponse.json({ timesheets });
}

export async function POST(req: Request) {
  const schema = z.object({
    year: z.number().int().min(2000).max(2100),
    month: z.number().int().min(1).max(12),
  });
  const body = schema.parse(await req.json());

  const existing = await prisma.timesheet.findFirst({
    where: { year: body.year, month: body.month },
    select: { id: true, year: true, month: true },
  });
  if (existing) return NextResponse.json({ timesheet: existing });

  const created = await prisma.timesheet.create({
    data: { year: body.year, month: body.month },
    select: { id: true, year: true, month: true },
  });

  return NextResponse.json({ timesheet: created }, { status: 201 });
}
