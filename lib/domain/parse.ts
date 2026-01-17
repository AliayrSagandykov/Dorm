import { z } from "zod";

export const hoursSchema = z
  .number()
  .finite()
  .min(0, "Hours must be >= 0")
  .max(24, "Hours must be <= 24");

export const entrySchema = z
  .object({
    dayHours: hoursSchema,
    nightHours: hoursSchema,
  })
  .refine((v) => v.dayHours + v.nightHours <= 24, {
    message: "Day + Night must be <= 24",
    path: ["dayHours"],
  });

export function parseSlashInput(input: string): { dayHours: number; nightHours: number } {
  const raw = input.trim();
  if (!raw) return { dayHours: 0, nightHours: 0 };

  const m = raw.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
  if (!m) throw new Error("Invalid format. Use D/N like 6/8");

  const day = Number(m[1]);
  const night = Number(m[2]);

  const parsed = entrySchema.parse({ dayHours: day, nightHours: night });
  return parsed;
}
