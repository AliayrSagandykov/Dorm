import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const employees = await prisma.employee.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  return NextResponse.json({ employees });
}

export async function POST(req: Request) {
  const schema = z.object({ name: z.string().trim().min(1).max(120) });
  const body = schema.parse(await req.json());

  const created = await prisma.employee.create({
    data: { name: body.name },
    select: { id: true, name: true },
  });

  return NextResponse.json({ employee: created }, { status: 201 });
}
